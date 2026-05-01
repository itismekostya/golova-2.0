#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import sharp from "sharp";
import { projects } from "../src/projects.js";

const execFileAsync = promisify(execFile);

const rootDir = process.cwd();
const memoryDir = path.join(rootDir, "memory");
const previewDir = path.join(rootDir, "assets", "previews");
const thumbDir = path.join(rootDir, "assets", "thumbs");
const mobileMediaDir = path.join(rootDir, "assets", "mobile-media");
const manifestPath = path.join(rootDir, "src", "media-preview-manifest.js");
const THUMB_LONG_EDGE = 420;
const PREVIEW_LONG_EDGE = 720;
const MOBILE_MEDIA_LONG_EDGE = 1600;

const IMAGE_EXTS = new Set([".avif", ".png", ".jpg", ".jpeg", ".webp", ".gif"]);
const VIDEO_EXTS = new Set([".mp4", ".m4v", ".mov", ".webm"]);
const PASSTHROUGH_EXTS = new Set([".svg"]);

function getItemMediaSrc(item) {
  if (typeof item?.src === "string" && item.src.trim()) {
    return item.src.trim();
  }
  if (typeof item?.media?.src === "string" && item.media.src.trim()) {
    return item.media.src.trim();
  }
  return "";
}

function collectReferencedMediaSources() {
  const sources = new Set();
  for (const project of projects) {
    for (const media of Array.isArray(project.media) ? project.media : []) {
      const src = getItemMediaSrc(media);
      if (src) {
        sources.add(src);
      }
    }
    for (const item of Array.isArray(project.contentItems) ? project.contentItems : []) {
      const src = getItemMediaSrc(item);
      if (src) {
        sources.add(src);
      }
    }
  }
  return [...sources].sort((a, b) => a.localeCompare(b));
}

function decodeMemorySource(src) {
  const clean = String(src || "").trim().replace(/^\.\/memory\//, "");
  return decodeURIComponent(clean);
}

function getDerivedRelativeParts(src, outputExt) {
  const decoded = decodeMemorySource(src);
  const parsed = path.posix.parse(decoded.split(path.sep).join("/"));
  const fileName = `${parsed.base}${outputExt}`;
  return parsed.dir ? [...parsed.dir.split("/"), fileName] : [fileName];
}

function getPreviewAbsPath(src, outputExt) {
  return path.join(previewDir, ...getDerivedRelativeParts(src, outputExt));
}

function getThumbAbsPath(src, outputExt) {
  return path.join(thumbDir, ...getDerivedRelativeParts(src, outputExt));
}

function getMobileMediaAbsPath(src, outputExt) {
  return path.join(mobileMediaDir, ...getDerivedRelativeParts(src, outputExt));
}

function getPreviewPublicSrc(src, outputExt) {
  const parts = getDerivedRelativeParts(src, outputExt);
  return `./assets/previews/${parts.map((part) => encodeURIComponent(part)).join("/")}`;
}

function getThumbPublicSrc(src, outputExt) {
  const parts = getDerivedRelativeParts(src, outputExt);
  return `./assets/thumbs/${parts.map((part) => encodeURIComponent(part)).join("/")}`;
}

function getMobileMediaPublicSrc(src, outputExt) {
  const parts = getDerivedRelativeParts(src, outputExt);
  return `./assets/mobile-media/${parts.map((part) => encodeURIComponent(part)).join("/")}`;
}

function getMemoryAbsPath(src) {
  return path.join(memoryDir, decodeMemorySource(src));
}

function isMissingFileError(error) {
  return error && (error.code === "ENOENT" || error.code === "ENOTDIR");
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (_error) {
    return false;
  }
}

async function ensureParentDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function createImageDerivative(sourcePath, outputPath, hasAlpha, { longEdge, quality, format = null }) {
  await ensureParentDir(outputPath);
  const pipeline = sharp(sourcePath, {
    animated: false,
    limitInputPixels: false
  })
    .rotate()
    .resize({
      width: longEdge,
      height: longEdge,
      fit: "inside",
      withoutEnlargement: true
    });

  const outputFormat = format || (hasAlpha ? "webp" : "avif");
  if (outputFormat === "webp") {
    await pipeline.webp({ quality: quality.webp, effort: 4 }).toFile(outputPath);
    return;
  }

  await pipeline.avif({ quality: quality.avif, effort: 4 }).toFile(outputPath);
}

async function createThumbImage(sourcePath, outputPath, hasAlpha) {
  await createImageDerivative(sourcePath, outputPath, hasAlpha, {
    longEdge: THUMB_LONG_EDGE,
    quality: { avif: 50, webp: 76 },
    format: "webp"
  });
}

async function createImagePreview(sourcePath, outputPath, hasAlpha) {
  await createImageDerivative(sourcePath, outputPath, hasAlpha, {
    longEdge: PREVIEW_LONG_EDGE,
    quality: { avif: 54, webp: 82 }
  });
}

async function createMobileImage(sourcePath, outputPath, hasAlpha) {
  await createImageDerivative(sourcePath, outputPath, hasAlpha, {
    longEdge: MOBILE_MEDIA_LONG_EDGE,
    quality: { avif: 66, webp: 88 }
  });
}

async function createVideoPoster(sourcePath, outputPath, { mobile = false, thumb = false } = {}) {
  const tempPath = `${outputPath}.tmp.png`;
  await ensureParentDir(outputPath);
  try {
    await execFileAsync("ffmpeg", [
      "-y",
      "-hide_banner",
      "-loglevel",
      "error",
      "-ss",
      "0.2",
      "-i",
      sourcePath,
      "-frames:v",
      "1",
      tempPath
    ]);
    if (thumb) {
      await createThumbImage(tempPath, outputPath, true);
    } else if (mobile) {
      await createMobileImage(tempPath, outputPath, true);
    } else {
      await createImagePreview(tempPath, outputPath, true);
    }
  } finally {
    await fs.rm(tempPath, { force: true }).catch(() => {});
  }
}

async function getOutputDimensions(outputPath) {
  const metadata = await sharp(outputPath, { limitInputPixels: false }).metadata();
  return {
    w: Math.round(Number(metadata.width) || 0),
    h: Math.round(Number(metadata.height) || 0)
  };
}

function serializeManifest(entries) {
  const lines = [
    "// Auto-generated by tools/build-media-previews.mjs",
    "",
    "export const mediaPreviewManifestBySrc = Object.freeze({"
  ];

  for (const [src, entry] of entries) {
    lines.push(
      `  ${JSON.stringify(src)}: Object.freeze(${JSON.stringify(entry)}),`
    );
  }

  lines.push("});", "");
  return lines.join("\n");
}

async function buildPreviewForSource(src) {
  const sourcePath = getMemoryAbsPath(src);
  const ext = path.extname(sourcePath).toLowerCase();

  if (PASSTHROUGH_EXTS.has(ext)) {
    return {
      src,
      entry: { src, thumbSrc: src, mobileSrc: src, kind: "passthrough" }
    };
  }

  if (!(await fileExists(sourcePath))) {
    return {
      src,
      warning: `missing source: ${sourcePath}`
    };
  }

  if (IMAGE_EXTS.has(ext)) {
    const metadata = await sharp(sourcePath, {
      animated: false,
      limitInputPixels: false
    }).metadata();
    const hasAlpha = Boolean(metadata.hasAlpha);
    const outputExt = hasAlpha || ext === ".gif" ? ".webp" : ".avif";
    const thumbOutputExt = ".webp";
    const thumbOutputPath = getThumbAbsPath(src, thumbOutputExt);
    const outputPath = getPreviewAbsPath(src, outputExt);
    const mobileOutputPath = getMobileMediaAbsPath(src, outputExt);
    await createThumbImage(sourcePath, thumbOutputPath, hasAlpha || ext === ".gif");
    await createImagePreview(sourcePath, outputPath, hasAlpha || ext === ".gif");
    await createMobileImage(sourcePath, mobileOutputPath, hasAlpha || ext === ".gif");
    const thumbDims = await getOutputDimensions(thumbOutputPath);
    const dims = await getOutputDimensions(outputPath);
    const mobileDims = await getOutputDimensions(mobileOutputPath);
    return {
      src,
      entry: {
        src: getPreviewPublicSrc(src, outputExt),
        w: dims.w,
        h: dims.h,
        thumbSrc: getThumbPublicSrc(src, thumbOutputExt),
        thumbW: thumbDims.w,
        thumbH: thumbDims.h,
        mobileSrc: getMobileMediaPublicSrc(src, outputExt),
        mobileW: mobileDims.w,
        mobileH: mobileDims.h,
        kind: "image-preview",
        preservesAlpha: hasAlpha || ext === ".gif"
      }
    };
  }

  if (VIDEO_EXTS.has(ext)) {
    const outputExt = ".webp";
    const thumbOutputPath = getThumbAbsPath(src, outputExt);
    const outputPath = getPreviewAbsPath(src, outputExt);
    const mobileOutputPath = getMobileMediaAbsPath(src, outputExt);
    await createVideoPoster(sourcePath, thumbOutputPath, { thumb: true });
    await createVideoPoster(sourcePath, outputPath);
    await createVideoPoster(sourcePath, mobileOutputPath, { mobile: true });
    const thumbDims = await getOutputDimensions(thumbOutputPath);
    const dims = await getOutputDimensions(outputPath);
    const mobileDims = await getOutputDimensions(mobileOutputPath);
    return {
      src,
      entry: {
        src: getPreviewPublicSrc(src, outputExt),
        w: dims.w,
        h: dims.h,
        thumbSrc: getThumbPublicSrc(src, outputExt),
        thumbW: thumbDims.w,
        thumbH: thumbDims.h,
        mobileSrc: getMobileMediaPublicSrc(src, outputExt),
        mobileW: mobileDims.w,
        mobileH: mobileDims.h,
        kind: "video-poster"
      }
    };
  }

  return {
    src,
    warning: `unsupported media type: ${src}`
  };
}

async function main() {
  const sources = collectReferencedMediaSources();
  const entries = [];
  const warnings = [];

  await fs.mkdir(thumbDir, { recursive: true });
  await fs.mkdir(previewDir, { recursive: true });
  await fs.mkdir(mobileMediaDir, { recursive: true });

  for (const src of sources) {
    try {
      const result = await buildPreviewForSource(src);
      if (result.entry) {
        entries.push([src, result.entry]);
      }
      if (result.warning) {
        warnings.push(result.warning);
      }
    } catch (error) {
      if (isMissingFileError(error)) {
        warnings.push(`missing source: ${getMemoryAbsPath(src)}`);
      } else {
        warnings.push(`${src}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  entries.sort(([a], [b]) => a.localeCompare(b));
  await fs.writeFile(manifestPath, serializeManifest(entries), "utf8");

  console.log(`media previews: ${entries.length}/${sources.length}`);
  if (warnings.length) {
    console.log("warnings:");
    for (const warning of warnings) {
      console.log(`- ${warning}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
