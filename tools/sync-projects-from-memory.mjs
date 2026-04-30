import { promises as fs } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const memoryDir = path.join(rootDir, "memory");
const outputFile = path.join(rootDir, "src", "projects-memory.js");
const outputMediaManifestFile = path.join(rootDir, "src", "media-manifest.js");
const outputMediaProxyManifestFile = path.join(rootDir, "src", "media-proxy-manifest.js");
const graphProxyDir = path.join(rootDir, "assets", "placeholders", "graph");
const shouldBuildGraphProxies =
  process.argv.includes("--graph-proxies") || process.env.GOLOVA_GRAPH_MEDIA_PROXIES === "1";

const IGNORED_TOP_LEVEL_FILES = new Set(["_project-template.md", "_content-item-template.md"]);
const CONTENT_MANIFEST_FILE = "content.json";
const CONTENT_ITEMS_DIR = "items";
const CONTENT_MEDIA_FILE = "media.md";
const GRAPH_PROXY_IMAGE_LONG_EDGE = 480;
const GRAPH_PROXY_IMAGE_LONG_EDGE_MOBILE = 200;
const GRAPH_PROXY_VIDEO_LONG_EDGE = 224;

const PROJECT_FILE_PRIORITY = Object.freeze({
  top: 1,
  nested: 2
});

const META_KEY_ALIASES = new Map([
  ["id", "id"],
  ["slug", "id"],
  ["title", "title"],
  ["type", "type"],
  ["types", "type"],
  ["client", "client"],
  ["location", "location"],
  ["date", "date"],
  ["data", "date"],
  ["year", "date"],
  ["madewith", "madeWith"],
  ["more", "more"],
  ["intro", "intro"],
  ["details", "details"],
  ["description", "details"],
  ["focuszoom", "focusZoom"]
]);

const CONTENT_ITEM_META_KEY_ALIASES = new Map([
  ["id", "id"],
  ["file", "file"],
  ["src", "file"],
  ["title", "label"],
  ["label", "label"],
  ["description", "description"],
  ["details", "description"],
  ["role", "role"],
  ["size", "size"],
  ["root", "root"],
  ["rootorder", "root"],
  ["rootindex", "root"],
  ["rootx", "rootX"],
  ["rooty", "rootY"],
  ["rootw", "rootW"],
  ["rooth", "rootH"],
  ["rootr", "rootR"],
  ["rootrole", "rootRole"],
  ["rootsize", "rootSize"],
  ["x", "x"],
  ["y", "y"],
  ["w", "w"],
  ["h", "h"],
  ["r", "r"],
  ["tags", "tags"],
  ["types", "types"],
  ["physical", "physical"],
  ["sourcemediaindex", "sourceMediaIndex"],
  ["mediax", "mediaX"],
  ["mediay", "mediaY"]
]);

const IMAGE_EXT_RE = /\.(png|jpe?g|webp|svg|avif|gif)$/i;
const ALLOWED_FILTER_TYPES = new Set(["naming", "identity", "physical", "strategy"]);

function slugify(input) {
  return String(input || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’'`]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function stripMarkdownExtension(filename) {
  return String(filename || "").replace(/\.md$/i, "");
}

function isMarkdownFile(filename) {
  return /\.md$/i.test(String(filename || ""));
}

function isImageFilename(filename) {
  return IMAGE_EXT_RE.test(String(filename || ""));
}

function isObsidianUtilityLine(line) {
  const raw = String(line || "").trim();
  if (!raw) {
    return false;
  }
  return /^\[\[[^\]]+\/media(?:\|[^\]]+)?\]\]$/i.test(raw);
}

function normalizeBodyText(text) {
  return String(text || "")
    .split(/\r?\n{2,}/)
    .map((paragraph) =>
      paragraph
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !isObsidianUtilityLine(line))
        .join(" ")
        .trim()
    )
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

function parseMarkdownMetaAndBody(markdown, aliases) {
  const lines = String(markdown || "").split(/\r?\n/);
  const meta = {};
  const bodyLines = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const match = trimmed.match(/^([A-Za-z][A-Za-z _-]*):\s*(.*)$/);
    if (match) {
      const rawKey = match[1].toLowerCase().replace(/\s+/g, "");
      const canonicalKey = aliases.get(rawKey);
      if (canonicalKey && !(canonicalKey in meta)) {
        meta[canonicalKey] = match[2].trim();
        continue;
      }
    }
    bodyLines.push(line.replace(/\s+$/, ""));
  }

  return {
    meta,
    body: normalizeBodyText(bodyLines.join("\n"))
  };
}

function parseTypes(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item && ALLOWED_FILTER_TYPES.has(item));
}

function parseMore(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return {};
  }

  const mdLinkMatch = raw.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if (mdLinkMatch) {
    const labelRaw = mdLinkMatch[1].trim();
    const url = mdLinkMatch[2].trim();
    if (!url) {
      return {};
    }
    const label = labelRaw || "LINK";
    return { moreLabel: label, moreUrl: url };
  }

  if (/^https?:\/\//i.test(raw)) {
    return { moreLabel: "LINK", moreUrl: raw };
  }

  return { moreLabel: "LINK", moreUrl: raw };
}

function parseYear(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return undefined;
  }
  if (/^\d{4}$/.test(raw)) {
    return Number(raw);
  }
  return raw;
}

function parseFloatSafe(value) {
  const n = Number.parseFloat(String(value ?? "").trim());
  return Number.isFinite(n) ? n : undefined;
}

function parseDelimitedTextList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseBooleanOrOrder(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) {
    return { enabled: false, order: undefined };
  }
  if (["true", "yes", "on"].includes(raw)) {
    return { enabled: true, order: undefined };
  }
  if (["false", "no", "off"].includes(raw)) {
    return { enabled: false, order: undefined };
  }
  const numeric = Number.parseFloat(raw);
  if (Number.isFinite(numeric)) {
    return { enabled: numeric !== 0, order: numeric !== 0 ? numeric : undefined };
  }
  return { enabled: true, order: undefined };
}

function toPosixRelativeFromMemory(absPath) {
  const relative = path.relative(memoryDir, absPath).split(path.sep).join("/");
  return relative.replace(/^\.?\//, "");
}

function projectMediaSrc(projectFolderRelative, fileName) {
  const cleanFile = String(fileName || "").trim().replace(/^\.?\//, "");
  const encoded = cleanFile
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `./memory/${projectFolderRelative}/${encoded}`;
}

function getPreferredContentMediaFileNames(folderName = "") {
  const normalized = String(folderName || "").trim();
  const names = [CONTENT_MEDIA_FILE];
  if (normalized) {
    names.push(`${normalized} media.md`);
    names.push(`${normalized}-media.md`);
  }
  return [...new Set(names)];
}

function extractObsidianMediaRef(rawValue) {
  const raw = String(rawValue || "").trim();
  const match = raw.match(/^!?\[\[([^\]|]+)(?:\|[^\]]+)?\]\]$/);
  if (!match) {
    return "";
  }
  return match[1].trim();
}

function getMediaEntryFileKey(entry) {
  if (!entry || typeof entry !== "object") {
    return "";
  }
  if (typeof entry.file === "string" && entry.file.trim()) {
    return path.basename(entry.file.trim()).toLowerCase();
  }
  if (typeof entry.src === "string" && entry.src.trim()) {
    const raw = entry.src.trim();
    const fileName = decodeURIComponent(raw.split("/").pop() || raw);
    return path.basename(fileName).toLowerCase();
  }
  return "";
}

function getMediaSrcKey(src) {
  if (typeof src !== "string" || !src.trim()) {
    return "";
  }
  const raw = src.trim();
  const lastSegment = (() => {
    try {
      const pathname = new URL(raw, "file:///").pathname || raw;
      return pathname.split("/").pop() || pathname;
    } catch (_error) {
      return raw.split("/").pop() || raw;
    }
  })();
  return decodeURIComponent(lastSegment).toLowerCase();
}

function collectMediaSourcesFromContentItems(items, sourceSet) {
  if (!Array.isArray(items) || !items.length) {
    return;
  }
  for (const item of items) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const src =
      (typeof item?.media?.src === "string" && item.media.src.trim()) ||
      (typeof item?.src === "string" && item.src.trim()) ||
      "";
    if (src) {
      sourceSet.add(src);
    }
    if (Array.isArray(item.contentItems) && item.contentItems.length) {
      collectMediaSourcesFromContentItems(item.contentItems, sourceSet);
    }
    if (Array.isArray(item.children) && item.children.length) {
      collectMediaSourcesFromContentItems(item.children, sourceSet);
    }
  }
}

function collectMediaSourcesFromProjects(projects) {
  const sourceSet = new Set();
  for (const project of Array.isArray(projects) ? projects : []) {
    if (!project || typeof project !== "object") {
      continue;
    }
    for (const media of Array.isArray(project.media) ? project.media : []) {
      const src = typeof media?.src === "string" ? media.src.trim() : "";
      if (src) {
        sourceSet.add(src);
      }
    }
    collectMediaSourcesFromContentItems(project.contentItems, sourceSet);
  }
  return [...sourceSet];
}

function decodeLocalProjectMediaSrc(src) {
  const raw = typeof src === "string" ? src.trim() : "";
  if (!raw || /^https?:\/\//i.test(raw) || raw.startsWith("data:")) {
    return null;
  }

  const normalized = raw.replace(/^\.?\//, "");
  const decoded = normalized
    .split("/")
    .map((part) => decodeURIComponent(part))
    .join(path.sep);
  return path.join(rootDir, decoded);
}

function probeMediaDimensions(filePath) {
  try {
    const output = execFileSync(
      "ffprobe",
      ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0:s=x", filePath],
      { encoding: "utf8" }
    ).trim();
    const match = output.match(/(\d+)\s*x\s*(\d+)/);
    if (!match) {
      return null;
    }
    const w = Number.parseInt(match[1], 10);
    const h = Number.parseInt(match[2], 10);
    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
      return null;
    }
    return { w, h };
  } catch (_error) {
    return null;
  }
}

async function readExistingMediaManifest() {
  try {
    const moduleUrl = `${pathToFileURL(outputMediaManifestFile).href}?t=${Date.now()}`;
    const imported = await import(moduleUrl);
    return imported?.mediaManifestByName && typeof imported.mediaManifestByName === "object"
      ? { ...imported.mediaManifestByName }
      : {};
  } catch (_error) {
    return {};
  }
}

function isVideoFilename(filename) {
  return /\.(mp4|m4v|mov|webm)$/i.test(String(filename || ""));
}

function isGifFilename(filename) {
  return /\.gif$/i.test(String(filename || ""));
}

function isProxyableImageFilename(filename) {
  return /\.(png|jpe?g|webp|avif|svg)$/i.test(String(filename || ""));
}

function getGraphProxyRelativeParts(src) {
  const raw = typeof src === "string" ? src.trim() : "";
  if (!raw) {
    return null;
  }
  const normalized = raw.replace(/^\.?\//, "");
  const decoded = normalized
    .split("/")
    .map((part) => decodeURIComponent(part))
    .join(path.sep);
  const withoutMemoryRoot = decoded.replace(/^memory[\\/]/i, "");
  if (!withoutMemoryRoot) {
    return null;
  }
  return withoutMemoryRoot.split(path.sep).filter(Boolean);
}

function getGraphProxyInfo(src) {
  const parts = getGraphProxyRelativeParts(src);
  if (!parts || !parts.length) {
    return null;
  }

  const originalExt = path.extname(parts[parts.length - 1]).toLowerCase();
  const baseName = path.basename(parts[parts.length - 1], originalExt);
  const outputExt =
    isVideoFilename(originalExt) || isGifFilename(originalExt)
      ? ".mp4"
      : isProxyableImageFilename(originalExt)
        ? ".png"
        : "";
  if (!outputExt) {
    return null;
  }

  const relativeParts = [...parts.slice(0, -1), `${baseName}${outputExt}`];
  const posterRelativeParts =
    outputExt === ".mp4" ? [...parts.slice(0, -1), `${baseName}--poster.png`] : null;
  const mobileRelativeParts =
    outputExt === ".png" ? [...parts.slice(0, -1), `${baseName}--mobile${outputExt}`] : null;
  const absPath = path.join(graphProxyDir, ...relativeParts);
  const relSrc = `./assets/placeholders/graph/${relativeParts.map((part) => encodeURIComponent(part)).join("/")}`;
  return {
    absPath,
    relSrc,
    posterAbsPath: posterRelativeParts ? path.join(graphProxyDir, ...posterRelativeParts) : "",
    posterRelSrc: posterRelativeParts
      ? `./assets/placeholders/graph/${posterRelativeParts.map((part) => encodeURIComponent(part)).join("/")}`
      : "",
    mobileAbsPath: mobileRelativeParts ? path.join(graphProxyDir, ...mobileRelativeParts) : "",
    mobileRelSrc: mobileRelativeParts
      ? `./assets/placeholders/graph/${mobileRelativeParts.map((part) => encodeURIComponent(part)).join("/")}`
      : "",
    kind: outputExt === ".mp4" ? "video" : "image",
    sourceKind: isVideoFilename(originalExt) || isGifFilename(originalExt) ? "video" : "image"
  };
}

async function readExistingMediaProxyManifest() {
  try {
    const moduleUrl = `${pathToFileURL(outputMediaProxyManifestFile).href}?t=${Date.now()}`;
    const imported = await import(moduleUrl);
    return imported?.mediaProxyManifestBySrc && typeof imported.mediaProxyManifestBySrc === "object"
      ? { ...imported.mediaProxyManifestBySrc }
      : {};
  } catch (_error) {
    return {};
  }
}

function shouldRebuildGraphProxy(sourceStat, proxyStat) {
  if (!sourceStat || !proxyStat) {
    return true;
  }
  return Number(sourceStat.mtimeMs || 0) > Number(proxyStat.mtimeMs || 0);
}

function sampleProxyImageGrid(filePath, width = 5, height = 5) {
  try {
    const buffer = execFileSync(
      "ffmpeg",
      [
        "-v",
        "error",
        "-i",
        filePath,
        "-vf",
        `scale=${width}:${height}:flags=area,format=rgba`,
        "-frames:v",
        "1",
        "-f",
        "rawvideo",
        "-"
      ],
      { encoding: null, stdio: ["ignore", "pipe", "ignore"] }
    );
    if (!buffer || buffer.length < width * height * 4) {
      return null;
    }

    const pixels = [];
    for (let offset = 0; offset <= buffer.length - 4; offset += 4) {
      pixels.push({
        r: buffer[offset],
        g: buffer[offset + 1],
        b: buffer[offset + 2],
        a: buffer[offset + 3]
      });
    }
    return pixels;
  } catch (_error) {
    return null;
  }
}

function getPixelLuma(pixel) {
  if (!pixel) {
    return 0;
  }
  return pixel.r * 0.2126 + pixel.g * 0.7152 + pixel.b * 0.0722;
}

function isLikelyBlackMattedImageProxy(filePath) {
  const width = 32;
  const height = 32;
  const pixels = sampleProxyImageGrid(filePath, width, height);
  if (!pixels || pixels.length < width * height) {
    return false;
  }

  const visited = new Uint8Array(width * height);
  const queue = [];
  const isBlackMattePixel = (pixel) =>
    pixel && pixel.a >= 220 && getPixelLuma(pixel) <= 18 && Math.max(pixel.r, pixel.g, pixel.b) <= 42;
  const enqueue = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) {
      return;
    }
    const index = y * width + x;
    if (visited[index] || !isBlackMattePixel(pixels[index])) {
      return;
    }
    visited[index] = 1;
    queue.push(index);
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  let darkOpaqueBorderPixels = 0;
  for (let x = 0; x < width; x += 1) {
    if (isBlackMattePixel(pixels[x])) {
      darkOpaqueBorderPixels += 1;
    }
    if (isBlackMattePixel(pixels[(height - 1) * width + x])) {
      darkOpaqueBorderPixels += 1;
    }
  }
  for (let y = 1; y < height - 1; y += 1) {
    if (isBlackMattePixel(pixels[y * width])) {
      darkOpaqueBorderPixels += 1;
    }
    if (isBlackMattePixel(pixels[y * width + (width - 1)])) {
      darkOpaqueBorderPixels += 1;
    }
  }

  let connectedBlackEdgePixels = 0;
  while (queue.length) {
    const index = queue.pop();
    connectedBlackEdgePixels += 1;
    const x = index % width;
    const y = Math.floor(index / width);
    enqueue(x - 1, y);
    enqueue(x + 1, y);
    enqueue(x, y - 1);
    enqueue(x, y + 1);
  }

  if (darkOpaqueBorderPixels < 4 || connectedBlackEdgePixels < 8) {
    return false;
  }

  const informativePixels = pixels.filter((pixel) => pixel.a >= 40 && !isBlackMattePixel(pixel)).length;
  return informativePixels >= 6;
}

async function buildGraphProxyForSource(src) {
  const sourcePath = decodeLocalProjectMediaSrc(src);
  const proxyInfo = getGraphProxyInfo(src);
  if (!sourcePath || !proxyInfo) {
    return null;
  }

  let sourceStat;
  try {
    sourceStat = await fs.stat(sourcePath);
    if (!sourceStat.isFile()) {
      return null;
    }
  } catch (_error) {
    return null;
  }

  let proxyStat = null;
  try {
    proxyStat = await fs.stat(proxyInfo.absPath);
  } catch (_error) {
    proxyStat = null;
  }

  let posterStat = null;
  if (proxyInfo.posterAbsPath) {
    try {
      posterStat = await fs.stat(proxyInfo.posterAbsPath);
    } catch (_error) {
      posterStat = null;
    }
  }
  let mobileProxyStat = null;
  if (proxyInfo.mobileAbsPath) {
    try {
      mobileProxyStat = await fs.stat(proxyInfo.mobileAbsPath);
    } catch (_error) {
      mobileProxyStat = null;
    }
  }

  const needsProxyBuild = shouldRebuildGraphProxy(sourceStat, proxyStat);
  const needsPosterBuild = proxyInfo.kind === "video" && shouldRebuildGraphProxy(sourceStat, posterStat);
  const needsMobileImageBuild = proxyInfo.kind === "image" && proxyInfo.mobileAbsPath
    ? shouldRebuildGraphProxy(sourceStat, mobileProxyStat)
    : false;

  if (needsProxyBuild || needsPosterBuild || needsMobileImageBuild) {
    await fs.mkdir(path.dirname(proxyInfo.absPath), { recursive: true });
    if (proxyInfo.posterAbsPath) {
      await fs.mkdir(path.dirname(proxyInfo.posterAbsPath), { recursive: true });
    }
    if (proxyInfo.mobileAbsPath) {
      await fs.mkdir(path.dirname(proxyInfo.mobileAbsPath), { recursive: true });
    }

    const isVideoSource = proxyInfo.kind === "video";
    const maxLongEdge = isVideoSource ? GRAPH_PROXY_VIDEO_LONG_EDGE : GRAPH_PROXY_IMAGE_LONG_EDGE;
    const scaleFilter = `scale='if(gt(iw,ih),${maxLongEdge},-2)':'if(gt(iw,ih),-2,${maxLongEdge})'`;
    const mobileScaleFilter = `scale='if(gt(iw,ih),${GRAPH_PROXY_IMAGE_LONG_EDGE_MOBILE},-2)':'if(gt(iw,ih),-2,${GRAPH_PROXY_IMAGE_LONG_EDGE_MOBILE})'`;

    try {
      if (isVideoSource) {
        if (needsProxyBuild) {
          execFileSync(
            "ffmpeg",
            [
              "-hide_banner",
              "-loglevel",
              "error",
              "-y",
              "-i",
              sourcePath,
              "-vf",
              `fps=12,${scaleFilter}`,
              "-an",
              "-c:v",
              "libx264",
              "-preset",
              "veryfast",
              "-crf",
              "35",
              "-pix_fmt",
              "yuv420p",
              "-movflags",
              "+faststart",
              proxyInfo.absPath
            ],
            { stdio: "ignore" }
          );
        }
        if (needsPosterBuild && proxyInfo.posterAbsPath) {
          execFileSync(
            "ffmpeg",
            [
              "-hide_banner",
              "-loglevel",
              "error",
              "-y",
              "-i",
              sourcePath,
              "-vf",
              `${scaleFilter},format=rgba`,
              "-frames:v",
              "1",
              proxyInfo.posterAbsPath
            ],
            { stdio: "ignore" }
          );
        }
      } else {
        if (needsProxyBuild) {
          execFileSync(
            "ffmpeg",
            [
              "-hide_banner",
              "-loglevel",
              "error",
              "-y",
              "-i",
              sourcePath,
              "-vf",
              `${scaleFilter},format=rgba`,
              "-frames:v",
              "1",
              proxyInfo.absPath
            ],
            { stdio: "ignore" }
          );
        }
        if (needsMobileImageBuild && proxyInfo.mobileAbsPath) {
          execFileSync(
            "ffmpeg",
            [
              "-hide_banner",
              "-loglevel",
              "error",
              "-y",
              "-i",
              sourcePath,
              "-vf",
              `${mobileScaleFilter},format=rgba`,
              "-frames:v",
              "1",
              proxyInfo.mobileAbsPath
            ],
            { stdio: "ignore" }
          );
        }
      }
    } catch (_error) {
      return null;
    }
  }

  if (proxyInfo.kind === "image" && isLikelyBlackMattedImageProxy(proxyInfo.absPath)) {
    return null;
  }

  let mobileDims = null;
  if (proxyInfo.kind === "image" && proxyInfo.mobileAbsPath) {
    if (!isLikelyBlackMattedImageProxy(proxyInfo.mobileAbsPath)) {
      mobileDims = probeMediaDimensions(proxyInfo.mobileAbsPath);
    }
  }

  const dims = probeMediaDimensions(proxyInfo.kind === "video" && proxyInfo.posterAbsPath ? proxyInfo.posterAbsPath : proxyInfo.absPath)
    || probeMediaDimensions(proxyInfo.absPath);
  if (!dims) {
    return null;
  }

  return {
    src: proxyInfo.relSrc,
    posterSrc: proxyInfo.kind === "video" ? proxyInfo.posterRelSrc || "" : "",
    mobileSrc: mobileDims ? proxyInfo.mobileRelSrc || "" : "",
    mobileW: mobileDims?.w || 0,
    mobileH: mobileDims?.h || 0,
    w: dims.w,
    h: dims.h,
    kind: proxyInfo.kind
  };
}

async function writeMediaManifest(projects) {
  const existing = await readExistingMediaManifest();
  const nextManifest = { ...existing };
  const sources = collectMediaSourcesFromProjects(projects);
  let updatedCount = 0;

  for (const src of sources) {
    const key = getMediaSrcKey(src);
    const filePath = decodeLocalProjectMediaSrc(src);
    if (!key || !filePath) {
      continue;
    }

    const dims = probeMediaDimensions(filePath);
    if (!dims) {
      continue;
    }

    const prev = nextManifest[key];
    if (!prev || prev.w !== dims.w || prev.h !== dims.h) {
      nextManifest[key] = Object.freeze({ w: dims.w, h: dims.h });
      updatedCount += 1;
    }
  }

  const sortedEntries = Object.entries(nextManifest).sort((a, b) => a[0].localeCompare(b[0], "en"));
  const lines = [
    "// Auto-generated by tools/sync-projects-from-memory.mjs",
    "",
    "export const mediaManifestByName = Object.freeze({",
    ...sortedEntries.map(([key, dims]) => `  ${JSON.stringify(key)}: Object.freeze({ w: ${dims.w}, h: ${dims.h} }),`),
    "});",
    ""
  ];

  await fs.writeFile(outputMediaManifestFile, lines.join("\n"), "utf8");
  return {
    totalEntries: sortedEntries.length,
    updatedCount
  };
}

async function writeMediaProxyManifest(projects, { buildProxies = false } = {}) {
  if (!buildProxies) {
    const lines = [
      "// Auto-generated by tools/sync-projects-from-memory.mjs",
      "// Graph media proxies are disabled by default. Run with --graph-proxies to rebuild them.",
      "",
      "export const mediaProxyManifestBySrc = Object.freeze({});",
      ""
    ];
    await fs.writeFile(outputMediaProxyManifestFile, lines.join("\n"), "utf8");
    return {
      totalEntries: 0,
      updatedCount: 0,
      skipped: true
    };
  }

  const existing = await readExistingMediaProxyManifest();
  const nextManifest = {};
  const sources = collectMediaSourcesFromProjects(projects);
  let updatedCount = 0;

  for (const src of sources) {
    const proxyEntry = await buildGraphProxyForSource(src);
    if (!proxyEntry) {
      continue;
    }
    nextManifest[src] = Object.freeze(proxyEntry);
    const prev = existing[src];
    if (
      !prev ||
      prev.src !== proxyEntry.src ||
      prev.posterSrc !== proxyEntry.posterSrc ||
      prev.mobileSrc !== proxyEntry.mobileSrc ||
      prev.mobileW !== proxyEntry.mobileW ||
      prev.mobileH !== proxyEntry.mobileH ||
      prev.w !== proxyEntry.w ||
      prev.h !== proxyEntry.h ||
      prev.kind !== proxyEntry.kind ||
      prev.matte !== proxyEntry.matte
    ) {
      updatedCount += 1;
    }
  }

  const sortedEntries = Object.entries(nextManifest).sort((a, b) => a[0].localeCompare(b[0], "en"));
  const lines = [
    "// Auto-generated by tools/sync-projects-from-memory.mjs",
    "",
    "export const mediaProxyManifestBySrc = Object.freeze({",
    ...sortedEntries.map(
      ([src, entry]) =>
        `  ${JSON.stringify(src)}: Object.freeze({ src: ${JSON.stringify(entry.src)}${
          entry.posterSrc ? `, posterSrc: ${JSON.stringify(entry.posterSrc)}` : ""
        }${
          entry.mobileSrc ? `, mobileSrc: ${JSON.stringify(entry.mobileSrc)}, mobileW: ${entry.mobileW}, mobileH: ${entry.mobileH}` : ""
        }, w: ${entry.w}, h: ${entry.h}, kind: ${JSON.stringify(entry.kind)}${
          entry.matte ? `, matte: ${JSON.stringify(entry.matte)}` : ""
        } }),`
    ),
    "});",
    ""
  ];

  await fs.writeFile(outputMediaProxyManifestFile, lines.join("\n"), "utf8");
  return {
    totalEntries: sortedEntries.length,
    updatedCount
  };
}

function fileNameToLabel(fileName) {
  return stripMarkdownExtension(path.basename(String(fileName || "").trim()))
    .replace(/[_-]+/g, " ")
    .trim()
    .toUpperCase();
}

async function readOptionalJson(filePath) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error && (error.code === "ENOENT" || error.name === "SyntaxError")) {
      if (error.name === "SyntaxError") {
        console.warn(`Warning: invalid JSON in ${path.relative(rootDir, filePath)} (${error.message})`);
      }
      return null;
    }
    throw error;
  }
}

function normalizeManifestItem(rawItem, projectFolderRelative, index) {
  if (!rawItem || typeof rawItem !== "object") {
    return null;
  }
  const file =
    (typeof rawItem.file === "string" && rawItem.file.trim()) ||
    (typeof rawItem.src === "string" && rawItem.src.trim()) ||
    "";
  if (!file) {
    return null;
  }

  const media = {
    src: projectMediaSrc(projectFolderRelative, file)
  };
  if (typeof rawItem.role === "string" && rawItem.role.trim()) {
    media.role = rawItem.role.trim();
  }
  if (typeof rawItem.size === "string" && rawItem.size.trim()) {
    media.size = rawItem.size.trim();
  }
  if (Number.isFinite(Number(rawItem.w))) {
    media.w = Number(rawItem.w);
  }
  if (Number.isFinite(Number(rawItem.h))) {
    media.h = Number(rawItem.h);
  }
  if (typeof rawItem.r === "string" && rawItem.r.trim()) {
    media.r = rawItem.r.trim();
  }

  const normalized = {
    id:
      (typeof rawItem.id === "string" && rawItem.id.trim()) ||
      slugify(stripMarkdownExtension(path.basename(file))) ||
      `item-${index + 1}`,
    label:
      (typeof rawItem.label === "string" && rawItem.label.trim()) ||
      fileNameToLabel(path.basename(file)),
    description: typeof rawItem.description === "string" ? rawItem.description.trim() : "",
    media
  };

  for (const key of ["rootRole", "rootSize", "rootR"]) {
    if (typeof rawItem[key] === "string" && rawItem[key].trim()) {
      normalized[key] = rawItem[key].trim();
    }
  }

  if (Number.isFinite(Number(rawItem.mediaX))) {
    normalized.mediaX = Number(rawItem.mediaX);
  }
  if (Number.isFinite(Number(rawItem.mediaY))) {
    normalized.mediaY = Number(rawItem.mediaY);
  }
  if (Number.isFinite(Number(rawItem.sourceMediaIndex))) {
    normalized.sourceMediaIndex = Number(rawItem.sourceMediaIndex);
  }
  if (Array.isArray(rawItem.tags)) {
    normalized.tags = rawItem.tags.filter((tag) => typeof tag === "string" && tag.trim()).map((tag) => tag.trim());
  }
  if (Array.isArray(rawItem.types)) {
    normalized.types = rawItem.types
      .filter((type) => typeof type === "string" && type.trim())
      .map((type) => type.trim().toLowerCase());
  }
  if (rawItem.physical === true) {
    normalized.physical = true;
  }

  return normalized;
}

function normalizeRootMediaEntry(rawEntry, projectFolderRelative, contentItems) {
  const findByFile = (file) => {
    const normalizedFile = String(file || "").trim().replace(/^\.?\//, "").toLowerCase();
    return contentItems.find((item) => {
      const src = item?.media?.src || "";
      const fileFromSrc = decodeURIComponent(src.split("/").pop() || "").toLowerCase();
      return fileFromSrc === path.basename(normalizedFile);
    });
  };

  if (typeof rawEntry === "string" && rawEntry.trim()) {
    const matched = findByFile(rawEntry);
    if (matched?.media?.src) {
      return { ...matched.media };
    }
    return { src: projectMediaSrc(projectFolderRelative, rawEntry.trim()) };
  }

  if (!rawEntry || typeof rawEntry !== "object") {
    return null;
  }

  const file =
    (typeof rawEntry.file === "string" && rawEntry.file.trim()) ||
    (typeof rawEntry.src === "string" && rawEntry.src.trim()) ||
    "";
  if (!file) {
    return null;
  }

  const matched = findByFile(file);
  const media = matched ? { ...matched.media } : { src: projectMediaSrc(projectFolderRelative, file) };

  for (const key of ["role", "size", "r"]) {
    if (typeof rawEntry[key] === "string" && rawEntry[key].trim()) {
      media[key] = rawEntry[key].trim();
    }
  }
  for (const key of ["x", "y", "w", "h"]) {
    if (Number.isFinite(Number(rawEntry[key]))) {
      media[key] = Number(rawEntry[key]);
    }
  }

  return media;
}

function parseContentItemMarkdown(markdown, noteFileName) {
  const { meta, body } = parseMarkdownMetaAndBody(markdown, CONTENT_ITEM_META_KEY_ALIASES);
  const file = String(meta.file || "").trim();
  if (!file) {
    return null;
  }

  const root = parseBooleanOrOrder(meta.root);
  const physical = parseBooleanOrOrder(meta.physical);
  const item = {
    id: String(meta.id || "").trim() || slugify(stripMarkdownExtension(path.basename(noteFileName))),
    file,
    label: String(meta.label || "").trim() || fileNameToLabel(path.basename(file)),
    description: String(meta.description || "").trim() || body
  };

  for (const key of ["role", "size", "r", "rootRole", "rootSize", "rootR"]) {
    if (typeof meta[key] === "string" && meta[key].trim()) {
      item[key] = meta[key].trim();
    }
  }

  for (const key of ["x", "y", "w", "h", "rootX", "rootY", "rootW", "rootH", "mediaX", "mediaY", "sourceMediaIndex"]) {
    const parsed = parseFloatSafe(meta[key]);
    if (parsed !== undefined) {
      item[key] = parsed;
    }
  }

  const tags = parseDelimitedTextList(meta.tags);
  if (tags.length) {
    item.tags = tags;
  }

  const types = parseDelimitedTextList(meta.types).map((type) => type.toLowerCase());
  if (types.length) {
    item.types = types;
  }

  if (root.enabled) {
    item.__root = true;
    if (root.order !== undefined) {
      item.__rootOrder = root.order;
    }
  }
  if (physical.enabled) {
    item.physical = true;
  }

  return item;
}

function splitMediaMarkdownSections(markdown) {
  const lines = String(markdown || "").split(/\r?\n/);
  const headerLines = [];
  const sections = [];
  let current = null;

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+?)\s*$/);
    if (headingMatch) {
      current = {
        heading: headingMatch[1].trim(),
        lines: []
      };
      sections.push(current);
      continue;
    }

    if (current) {
      current.lines.push(line);
    } else {
      headerLines.push(line);
    }
  }

  return {
    header: headerLines.join("\n"),
    sections
  };
}

function parseMediaSectionMarkdown(section, fallbackNoteName) {
  if (!section || typeof section !== "object") {
    return null;
  }

  const { meta, body } = parseMarkdownMetaAndBody(section.lines.join("\n"), CONTENT_ITEM_META_KEY_ALIASES);
  const headingRaw = String(section.heading || "").trim();
  const headingFile = extractObsidianMediaRef(headingRaw) || headingRaw;
  const explicitFile = String(meta.file || "").trim();
  const file = explicitFile || headingFile;
  if (!file) {
    return null;
  }

  const root = parseBooleanOrOrder(meta.root);
  const physical = parseBooleanOrOrder(meta.physical);
  const item = {
    id: String(meta.id || "").trim() || slugify(stripMarkdownExtension(path.basename(file || fallbackNoteName))),
    file,
    label: String(meta.label || "").trim() || fileNameToLabel(path.basename(file)),
    description: String(meta.description || "").trim() || body
  };

  for (const key of ["role", "size", "r", "rootRole", "rootSize", "rootR"]) {
    if (typeof meta[key] === "string" && meta[key].trim()) {
      item[key] = meta[key].trim();
    }
  }

  for (const key of ["x", "y", "w", "h", "rootX", "rootY", "rootW", "rootH", "mediaX", "mediaY", "sourceMediaIndex"]) {
    const parsed = parseFloatSafe(meta[key]);
    if (parsed !== undefined) {
      item[key] = parsed;
    }
  }

  const tags = parseDelimitedTextList(meta.tags);
  if (tags.length) {
    item.tags = tags;
  }

  const types = parseDelimitedTextList(meta.types).map((type) => type.toLowerCase());
  if (types.length) {
    item.types = types;
  }

  if (root.enabled) {
    item.__root = true;
    if (root.order !== undefined) {
      item.__rootOrder = root.order;
    }
  }
  if (physical.enabled) {
    item.physical = true;
  }

  return item;
}

function normalizeMarkdownRootMediaEntry(rawItem) {
  if (!rawItem || typeof rawItem !== "object" || !rawItem.file) {
    return null;
  }
  const entry = { file: rawItem.file };

  const role = rawItem.rootRole || rawItem.role;
  const size = rawItem.rootSize || rawItem.size;
  const rotation = rawItem.rootR || rawItem.r;
  if (role) {
    entry.role = role;
  }
  if (size) {
    entry.size = size;
  }
  if (rotation) {
    entry.r = rotation;
  }

  for (const [targetKey, sourceKeys] of [
    ["x", ["rootX", "x"]],
    ["y", ["rootY", "y"]],
    ["w", ["rootW", "w"]],
    ["h", ["rootH", "h"]]
  ]) {
    for (const sourceKey of sourceKeys) {
      if (Number.isFinite(Number(rawItem[sourceKey]))) {
        entry[targetKey] = Number(rawItem[sourceKey]);
        break;
      }
    }
  }

  return entry;
}

async function parseContentItemsDirectory(projectFolderAbs, projectFolderRelative) {
  const itemsDir = path.join(projectFolderAbs, CONTENT_ITEMS_DIR);
  let entries;
  try {
    entries = await fs.readdir(itemsDir, { withFileTypes: true });
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }

  const noteFiles = entries
    .filter((entry) => entry.isFile() && isMarkdownFile(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  if (!noteFiles.length) {
    return null;
  }

  const rawItems = [];
  for (const noteFile of noteFiles) {
    const notePath = path.join(itemsDir, noteFile);
    const markdown = await fs.readFile(notePath, "utf8");
    const parsed = parseContentItemMarkdown(markdown, noteFile);
    if (parsed) {
      rawItems.push(parsed);
    }
  }

  const contentItems = rawItems
    .map((item, index) => normalizeManifestItem(item, projectFolderRelative, index))
    .filter(Boolean);

  const rootMedia = rawItems
    .map((item, index) => ({ ...item, __index: index }))
    .filter((item) => item.__root)
    .sort((a, b) => {
      const orderA = Number.isFinite(a.__rootOrder) ? a.__rootOrder : Number.POSITIVE_INFINITY;
      const orderB = Number.isFinite(b.__rootOrder) ? b.__rootOrder : Number.POSITIVE_INFINITY;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return a.__index - b.__index;
    })
    .map((item) => normalizeMarkdownRootMediaEntry(item))
    .map((entry) => normalizeRootMediaEntry(entry, projectFolderRelative, contentItems))
    .filter(Boolean);

  const out = {};
  if (contentItems.length) {
    out.contentItems = contentItems;
  }
  if (rootMedia.length) {
    out.media = rootMedia;
  } else if (contentItems.length) {
    out.media = contentItems.slice(0, 2).map((item) => ({ ...item.media }));
  }

  return Object.keys(out).length ? out : null;
}

async function parseJsonContentManifest(projectFolderAbs, projectFolderRelative) {
  const manifestPath = path.join(projectFolderAbs, CONTENT_MANIFEST_FILE);
  const manifest = await readOptionalJson(manifestPath);
  if (!manifest || typeof manifest !== "object") {
    return null;
  }

  const rawItems = Array.isArray(manifest.items) ? manifest.items : [];
  const contentItems = rawItems
    .map((item, index) => normalizeManifestItem(item, projectFolderRelative, index))
    .filter(Boolean);

  let rootMedia = [];
  if (Array.isArray(manifest.rootMedia) && manifest.rootMedia.length) {
    rootMedia = manifest.rootMedia
      .map((entry) => normalizeRootMediaEntry(entry, projectFolderRelative, contentItems))
      .filter(Boolean);
  } else if (contentItems.length) {
    rootMedia = contentItems.slice(0, 2).map((item) => ({ ...item.media }));
  }

  const out = {};
  if (contentItems.length) {
    out.contentItems = contentItems;
  }
  if (rootMedia.length) {
    out.media = rootMedia;
  }
  const focusZoom = parseFloatSafe(manifest.focusZoom);
  if (focusZoom !== undefined) {
    out.focusZoom = focusZoom;
  }
  if (typeof manifest.moreLabel === "string" && manifest.moreLabel.trim()) {
    out.moreLabel = manifest.moreLabel.trim();
  }
  if (typeof manifest.moreUrl === "string" && manifest.moreUrl.trim()) {
    out.moreUrl = manifest.moreUrl.trim();
  }

  return Object.keys(out).length ? out : null;
}

function mergeRootMediaWithLegacy(manifestRootMedia, legacyRootMedia) {
  const preferred = Array.isArray(manifestRootMedia) ? manifestRootMedia : [];
  const legacy = Array.isArray(legacyRootMedia) ? legacyRootMedia : [];
  if (!preferred.length || !legacy.length) {
    return preferred;
  }

  const legacyByFile = new Map(
    legacy
      .map((entry) => [getMediaEntryFileKey(entry), entry])
      .filter(([key]) => Boolean(key))
  );

  return preferred.map((entry) => {
    const fileKey = getMediaEntryFileKey(entry);
    const legacyEntry = legacyByFile.get(fileKey);
    if (!legacyEntry) {
      return entry;
    }

    const merged = { ...entry };
    for (const key of ["x", "y", "w", "h"]) {
      if (!Number.isFinite(Number(merged[key])) && Number.isFinite(Number(legacyEntry[key]))) {
        merged[key] = Number(legacyEntry[key]);
      }
    }
    for (const key of ["r", "role", "size"]) {
      if (!(typeof merged[key] === "string" && merged[key].trim()) && typeof legacyEntry[key] === "string" && legacyEntry[key].trim()) {
        merged[key] = legacyEntry[key].trim();
      }
    }
    return merged;
  });
}

async function parseContentMediaFile(projectFolderAbs, projectFolderRelative) {
  const folderName = path.basename(projectFolderAbs);
  const candidateNames = getPreferredContentMediaFileNames(folderName);
  let mediaFilePath = "";
  let markdown = "";

  for (const candidateName of candidateNames) {
    const candidatePath = path.join(projectFolderAbs, candidateName);
    try {
      markdown = await fs.readFile(candidatePath, "utf8");
      mediaFilePath = candidatePath;
      break;
    } catch (error) {
      if (error && error.code === "ENOENT") {
        continue;
      }
      throw error;
    }
  }

  if (!mediaFilePath) {
    return null;
  }

  const { header, sections } = splitMediaMarkdownSections(markdown);
  const { meta: headerMeta } = parseMarkdownMetaAndBody(header, META_KEY_ALIASES);
  const rawItems = sections
    .map((section, index) => parseMediaSectionMarkdown(section, `${index + 1}.md`))
    .filter(Boolean);

  if (!rawItems.length && !headerMeta.focusZoom) {
    return null;
  }

  const contentItems = rawItems
    .map((item, index) => normalizeManifestItem(item, projectFolderRelative, index))
    .filter(Boolean);

  const rootMedia = rawItems
    .map((item, index) => ({ ...item, __index: index }))
    .filter((item) => item.__root)
    .sort((a, b) => {
      const orderA = Number.isFinite(a.__rootOrder) ? a.__rootOrder : Number.POSITIVE_INFINITY;
      const orderB = Number.isFinite(b.__rootOrder) ? b.__rootOrder : Number.POSITIVE_INFINITY;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return a.__index - b.__index;
    })
    .map((item) => normalizeMarkdownRootMediaEntry(item))
    .map((entry) => normalizeRootMediaEntry(entry, projectFolderRelative, contentItems))
    .filter(Boolean);

  const out = {};
  if (contentItems.length) {
    out.contentItems = contentItems;
  }
  if (rootMedia.length) {
    out.media = rootMedia;
  } else if (contentItems.length) {
    out.media = contentItems.slice(0, 2).map((item) => ({ ...item.media }));
  }

  const focusZoom = parseFloatSafe(headerMeta.focusZoom);
  if (focusZoom !== undefined) {
    out.focusZoom = focusZoom;
  }

  return Object.keys(out).length ? out : null;
}

async function parseContentManifest(projectFolderAbs, projectFolderRelative) {
  const markdownMedia = await parseContentMediaFile(projectFolderAbs, projectFolderRelative);
  const markdownItems = markdownMedia ? null : await parseContentItemsDirectory(projectFolderAbs, projectFolderRelative);
  const legacyJson = await parseJsonContentManifest(projectFolderAbs, projectFolderRelative);

  if (markdownMedia) {
    const merged = { ...markdownMedia };
    if (!Number.isFinite(Number(merged.focusZoom)) && Number.isFinite(Number(legacyJson?.focusZoom))) {
      merged.focusZoom = Number(legacyJson.focusZoom);
    }
    if (Array.isArray(merged.media) && merged.media.length && Array.isArray(legacyJson?.media) && legacyJson.media.length) {
      merged.media = mergeRootMediaWithLegacy(merged.media, legacyJson.media);
    }
    return merged;
  }

  if (markdownItems) {
    const merged = { ...markdownItems };
    if (!Array.isArray(merged.media) || !merged.media.length) {
      if (Array.isArray(legacyJson?.media) && legacyJson.media.length) {
        merged.media = legacyJson.media.map((entry) => ({ ...entry }));
      }
    }
    if (!Number.isFinite(Number(merged.focusZoom)) && Number.isFinite(Number(legacyJson?.focusZoom))) {
      merged.focusZoom = Number(legacyJson.focusZoom);
    }
    return merged;
  }

  return legacyJson;
}

async function collectProjectCandidates() {
  const topEntries = await fs.readdir(memoryDir, { withFileTypes: true });
  const candidates = [];

  for (const entry of topEntries) {
    if (entry.name.startsWith(".")) {
      continue;
    }

    if (entry.isFile() && isMarkdownFile(entry.name) && !IGNORED_TOP_LEVEL_FILES.has(entry.name)) {
      candidates.push({
        mdPath: path.join(memoryDir, entry.name),
        fileName: entry.name,
        priority: PROJECT_FILE_PRIORITY.top,
        projectDirAbs: null,
        projectDirRelative: ""
      });
      continue;
    }

    if (!entry.isDirectory()) {
      continue;
    }

    const dirAbs = path.join(memoryDir, entry.name);
    const projectMd = path.join(dirAbs, "project.md");
    const sameNameMd = path.join(dirAbs, `${entry.name}.md`);

    let mdPath = null;
    try {
      const stat = await fs.stat(projectMd);
      if (stat.isFile()) {
        mdPath = projectMd;
      }
    } catch (_error) {
      // no-op
    }
    if (!mdPath) {
      try {
        const stat = await fs.stat(sameNameMd);
        if (stat.isFile()) {
          mdPath = sameNameMd;
        }
      } catch (_error) {
        // no-op
      }
    }
    if (!mdPath) {
      continue;
    }

    candidates.push({
      mdPath,
      fileName: path.basename(mdPath),
      priority: PROJECT_FILE_PRIORITY.nested,
      projectDirAbs: dirAbs,
      projectDirRelative: toPosixRelativeFromMemory(dirAbs)
    });
  }

  return candidates;
}

function parseProjectMarkdown(markdown, context) {
  const { meta, body } = parseMarkdownMetaAndBody(markdown, META_KEY_ALIASES);

  const fileTitle = stripMarkdownExtension(context.fileName);
  const title = String(meta.title || fileTitle || context.folderName || "").trim();
  const explicitId = String(meta.id || "").trim();
  const slug = explicitId ? slugify(explicitId) : slugify(context.folderName || title);

  const project = {
    slug,
    title,
    types: parseTypes(meta.type)
  };

  const client = String(meta.client || "").trim();
  if (client) {
    project.client = client;
  }

  const location = String(meta.location || "").trim();
  if (location) {
    project.location = location;
  }

  const madeWith = String(meta.madeWith || "").trim();
  if (madeWith) {
    project.madeWith = madeWith;
  }

  const year = parseYear(meta.date);
  if (year !== undefined) {
    project.year = year;
  }

  const focusZoom = parseFloatSafe(meta.focusZoom);
  if (focusZoom !== undefined) {
    project.focusZoom = focusZoom;
  }

  const more = parseMore(meta.more);
  if (more.moreLabel && more.moreUrl) {
    project.moreLabel = more.moreLabel;
    project.moreUrl = more.moreUrl;
  }

  const introMeta = String(meta.intro || "").trim();
  const detailsMeta = String(meta.details || "").trim();
  if (introMeta) {
    project.introText = introMeta;
  }
  if (detailsMeta) {
    project.detailsText = detailsMeta;
  }

  if (body) {
    const hasContentContext = Boolean(context.projectDirAbs && context.folderHasMediaFiles);
    if (!project.introText && !project.detailsText) {
      // For projects with internal content folders, body text belongs to deep project info by default.
      if (hasContentContext) {
        project.introText = body;
      } else {
        project.detailsText = body;
      }
    } else if (!project.introText && hasContentContext) {
      project.introText = body;
    } else if (!project.detailsText) {
      project.detailsText = body;
    }
  }

  return project;
}

function ensureUniqueSlug(project, usedSlugs) {
  let base = project.slug || slugify(project.title || "project");
  if (!base) {
    base = "project";
  }
  let slug = base;
  let suffix = 2;
  while (usedSlugs.has(slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  if (slug !== project.slug) {
    project.slug = slug;
  }
  usedSlugs.add(slug);
}

async function folderHasMediaFiles(projectDirAbs) {
  if (!projectDirAbs) {
    return false;
  }
  try {
    const entries = await fs.readdir(projectDirAbs, { withFileTypes: true });
    return entries.some((entry) => entry.isFile() && isImageFilename(entry.name));
  } catch (_error) {
    return false;
  }
}

async function buildProjectFromCandidate(candidate) {
  const markdown = await fs.readFile(candidate.mdPath, "utf8");
  const folderName = candidate.projectDirAbs ? path.basename(candidate.projectDirAbs) : "";
  const hasMediaFiles = await folderHasMediaFiles(candidate.projectDirAbs);
  const parsed = parseProjectMarkdown(markdown, {
    fileName: candidate.fileName,
    folderName,
    projectDirAbs: candidate.projectDirAbs,
    folderHasMediaFiles: hasMediaFiles
  });

  if (candidate.projectDirAbs && candidate.projectDirRelative) {
    const contentConfig = await parseContentManifest(candidate.projectDirAbs, candidate.projectDirRelative);
    if (contentConfig) {
      Object.assign(parsed, contentConfig);
    }
  }

  return {
    project: parsed,
    priority: candidate.priority
  };
}

async function main() {
  const candidates = await collectProjectCandidates();
  const mergedBySlug = new Map();

  for (const candidate of candidates) {
    const built = await buildProjectFromCandidate(candidate);
    const slug = built.project.slug;
    if (!slug) {
      continue;
    }
    const prev = mergedBySlug.get(slug);
    if (!prev || built.priority >= prev.priority) {
      mergedBySlug.set(slug, built);
    }
  }

  const projects = [...mergedBySlug.values()]
    .map((entry) => entry.project)
    .sort((a, b) => String(a.title || "").localeCompare(String(b.title || ""), "en"));

  const usedSlugs = new Set();
  for (const project of projects) {
    ensureUniqueSlug(project, usedSlugs);
  }

  const output = `// Auto-generated by tools/sync-projects-from-memory.mjs\n// Source of truth: memory/*.md, memory/<slug>/media.md, memory/<slug>/items/*.md, and legacy memory/<slug>/content.json\n\nexport const projectsFromMemory = Object.freeze(${JSON.stringify(projects, null, 2)});\n`;

  await fs.writeFile(outputFile, output, "utf8");
  const manifestResult = await writeMediaManifest(projects);
  const proxyManifestResult = await writeMediaProxyManifest(projects, { buildProxies: shouldBuildGraphProxies });
  process.stdout.write(`Updated ${path.relative(rootDir, outputFile)} with ${projects.length} projects.\n`);
  process.stdout.write(
    `Updated ${path.relative(rootDir, outputMediaManifestFile)} with ${manifestResult.totalEntries} entries (${manifestResult.updatedCount} changed).\n`
  );
  if (proxyManifestResult.skipped) {
    process.stdout.write(
      `Updated ${path.relative(rootDir, outputMediaProxyManifestFile)} with empty proxy manifest (graph proxies disabled).\n`
    );
  } else {
    process.stdout.write(
      `Updated ${path.relative(rootDir, outputMediaProxyManifestFile)} with ${proxyManifestResult.totalEntries} entries (${proxyManifestResult.updatedCount} changed).\n`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
