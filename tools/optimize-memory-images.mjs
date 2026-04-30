#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const TEXT_EXTENSIONS = new Set([".md", ".json"]);
const DEFAULT_ROOT = "memory";
const DEFAULT_MAX_BYTES = 1_000_000;
const DEFAULT_MAX_EDGE = 2600;
const JPEG_QUALITIES = [82, 76, 70, 64, 58, 52, 46, 40, 34];
const AVIF_QUALITIES = [62, 56, 50, 44, 38, 32];
const PNG_QUALITIES = [92, 82, 72, 62, 52, 42, 32];
const WEBP_QUALITIES = [82, 76, 70, 64, 58, 52, 46, 40, 34];
const EDGE_SCALES = [1, 0.92, 0.84, 0.76, 0.68, 0.6, 0.52, 0.45];

const args = process.argv.slice(2);
const command = args.find((value) => !value.startsWith("--")) || "audit";

const options = {
  root: DEFAULT_ROOT,
  maxBytes: DEFAULT_MAX_BYTES,
  maxEdge: DEFAULT_MAX_EDGE,
  format: "preserve",
  replaceOriginals: false,
  limit: 20
};

for (const value of args) {
  if (!value.startsWith("--")) {
    continue;
  }
  const [rawKey, rawVal] = value.slice(2).split("=");
  const key = rawKey.trim();
  const parsedValue = rawVal == null ? "true" : rawVal.trim();
  if (key === "root") {
    options.root = parsedValue || DEFAULT_ROOT;
  } else if (key === "max-bytes") {
    options.maxBytes = Math.max(1, Number.parseInt(parsedValue, 10) || DEFAULT_MAX_BYTES);
  } else if (key === "max-edge") {
    options.maxEdge = Math.max(256, Number.parseInt(parsedValue, 10) || DEFAULT_MAX_EDGE);
  } else if (key === "format") {
    options.format = parsedValue === "avif" ? "avif" : "preserve";
  } else if (key === "replace") {
    options.replaceOriginals = parsedValue !== "false";
  } else if (key === "limit") {
    options.limit = Math.max(1, Number.parseInt(parsedValue, 10) || 20);
  }
}

const rootDir = path.resolve(process.cwd(), options.root);

main().catch((error) => {
  console.error("");
  console.error(`[images] ${error?.message || error}`);
  process.exitCode = 1;
});

async function main() {
  const files = await collectImageFiles(rootDir);
  if (!files.length) {
    console.log(`[images] No jpg/jpeg/png/webp files found in ${rootDir}`);
    return;
  }

  if (command === "audit") {
    await printAudit(files, options.limit);
    return;
  }

  if (command !== "write" && command !== "avif-replace") {
    throw new Error(`Unknown command "${command}". Use "audit", "write", or "avif-replace".`);
  }

  const sharp = await loadSharp();
  if (command === "avif-replace") {
    await replaceAllWithAvif(files, sharp);
    return;
  }

  await optimizeFiles(files, sharp);
}

async function collectImageFiles(dir) {
  const result = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await collectImageFiles(fullPath);
      result.push(...nested);
      continue;
    }
    if (!entry.isFile()) {
      continue;
    }
    const extension = path.extname(entry.name).toLowerCase();
    if (!IMAGE_EXTENSIONS.has(extension)) {
      continue;
    }
    const stat = await fs.stat(fullPath);
    result.push({
      path: fullPath,
      relativePath: path.relative(process.cwd(), fullPath),
      extension,
      size: stat.size
    });
  }
  return result;
}

async function printAudit(files, limit) {
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  const byExtension = new Map();
  for (const file of files) {
    byExtension.set(file.extension, (byExtension.get(file.extension) || 0) + 1);
  }

  console.log(`[images] Root: ${path.relative(process.cwd(), rootDir) || "."}`);
  console.log(`[images] Files: ${files.length}`);
  console.log(`[images] Total size: ${formatBytes(totalBytes)}`);
  console.log("");
  console.log("[images] By extension:");
  for (const [extension, count] of [...byExtension.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`  ${extension}: ${count}`);
  }
  console.log("");
  console.log(`[images] Largest ${limit}:`);
  for (const file of [...files].sort((a, b) => b.size - a.size).slice(0, limit)) {
    console.log(`  ${formatBytes(file.size).padStart(8)}  ${file.relativePath}`);
  }
  console.log("");
  console.log("[images] Suggested next step:");
  console.log("  npm install sharp");
  console.log("  npm run images:write");
  console.log("  npm run images:avif   # later, when you want .avif copies");
  console.log("  npm run images:avif-replace   # convert all, rewrite refs, delete old files");
}

async function loadSharp() {
  try {
    const module = await import("sharp");
    return module.default;
  } catch {
    throw new Error(
      'Missing dependency "sharp". Install it with: npm install sharp'
    );
  }
}

async function optimizeFiles(files, sharp) {
  const summary = {
    rewritten: 0,
    skipped: 0,
    bytesBefore: 0,
    bytesAfter: 0,
    failed: 0
  };

  console.log(
    `[images] Optimizing ${files.length} files from ${path.relative(process.cwd(), rootDir) || "."} ` +
      `(format=${options.format}, max=${formatBytes(options.maxBytes)}, maxEdge=${options.maxEdge}px)`
  );

  for (const file of files) {
    summary.bytesBefore += file.size;
    try {
      const result = await optimizeSingleFile(file, sharp);
      if (!result) {
        summary.skipped += 1;
        summary.bytesAfter += file.size;
        continue;
      }
      summary.rewritten += 1;
      summary.bytesAfter += result.size;
      const delta = file.size - result.size;
      console.log(
        `  ${delta >= 0 ? "saved" : "grew "} ${formatBytes(Math.abs(delta)).padStart(8)}  ${file.relativePath} -> ${path.relative(process.cwd(), result.outputPath)}`
      );
    } catch (error) {
      summary.failed += 1;
      summary.bytesAfter += file.size;
      console.log(`  failed          ${file.relativePath}`);
      console.log(`    ${error?.message || error}`);
    }
  }

  console.log("");
  console.log(`[images] Rewritten: ${summary.rewritten}`);
  console.log(`[images] Skipped:   ${summary.skipped}`);
  console.log(`[images] Failed:    ${summary.failed}`);
  console.log(`[images] Before:    ${formatBytes(summary.bytesBefore)}`);
  console.log(`[images] After:     ${formatBytes(summary.bytesAfter)}`);
  console.log(`[images] Saved:     ${formatBytes(Math.max(0, summary.bytesBefore - summary.bytesAfter))}`);
  if (options.format === "avif" && !options.replaceOriginals) {
    console.log("");
    console.log("[images] AVIF mode kept originals. When you are ready, I can also automate reference rewrites.");
  }
}

async function replaceAllWithAvif(files, sharp) {
  const plan = [];
  let bytesBefore = 0;
  let bytesAfter = 0;
  let failed = 0;

  console.log(
    `[images] Converting ${files.length} files to .avif, rewriting references, and removing originals`
  );

  for (const file of files) {
    bytesBefore += file.size;
    try {
      const result = await optimizeSingleFile(
        file,
        sharp,
        {
          format: "avif",
          replaceOriginals: false,
          forceWrite: true
        }
      );
      if (!result) {
        failed += 1;
        console.log(`  failed          ${file.relativePath}`);
        continue;
      }
      bytesAfter += result.size;
      plan.push({
        oldPath: file.path,
        newPath: result.outputPath,
        oldRelative: file.relativePath,
        newRelative: path.relative(process.cwd(), result.outputPath),
        oldBase: path.basename(file.path),
        newBase: path.basename(result.outputPath),
        sizeBefore: file.size,
        sizeAfter: result.size
      });
      console.log(
        `  avif ${formatBytes(file.size).padStart(8)} -> ${formatBytes(result.size).padStart(8)}  ${file.relativePath}`
      );
    } catch (error) {
      failed += 1;
      console.log(`  failed          ${file.relativePath}`);
      console.log(`    ${error?.message || error}`);
    }
  }

  if (!plan.length) {
    throw new Error("No files were converted to AVIF.");
  }

  const rewriteSummary = await rewriteReferences(plan, rootDir);
  for (const item of plan) {
    await fs.unlink(item.oldPath);
  }
  await runMemorySyncIfPresent();

  console.log("");
  console.log(`[images] Converted: ${plan.length}`);
  console.log(`[images] Failed:    ${failed}`);
  console.log(`[images] Before:    ${formatBytes(bytesBefore)}`);
  console.log(`[images] After:     ${formatBytes(bytesAfter)}`);
  console.log(`[images] Saved:     ${formatBytes(Math.max(0, bytesBefore - bytesAfter))}`);
  console.log(`[images] Refs updated in ${rewriteSummary.changedFiles} file(s)`);
  console.log(`[images] Replacements: ${rewriteSummary.totalReplacements}`);
  console.log("[images] Old jpg/png files removed.");
}

async function optimizeSingleFile(file, sharp, localOptions = {}) {
  const originalBuffer = await fs.readFile(file.path);
  const image = sharp(originalBuffer, { animated: false, failOn: "none" }).rotate();
  const metadata = await image.metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;
  const longSide = Math.max(width, height, 1);
  const hasAlpha = Boolean(metadata.hasAlpha);

  const targetFormat = localOptions.format || options.format;
  const outputExtension = targetFormat === "avif" ? ".avif" : file.extension;
  const outputPath =
    targetFormat === "avif" ? replaceExtension(file.path, outputExtension) : file.path;

  let best = null;
  for (const scale of EDGE_SCALES) {
    const targetEdge = Math.max(
      512,
      Math.min(longSide, Math.round(options.maxEdge * scale), longSide)
    );
    const shouldResize = longSide > targetEdge;
    const qualities = getQualities(file.extension, targetFormat, hasAlpha);

    for (const quality of qualities) {
      let pipeline = sharp(originalBuffer, { animated: false, failOn: "none" }).rotate();
      if (shouldResize) {
        pipeline = pipeline.resize({
          width: width >= height ? targetEdge : null,
          height: height > width ? targetEdge : null,
          fit: "inside",
          withoutEnlargement: true
        });
      }
      pipeline = pipeline.withMetadata({ icc: undefined, exif: undefined, xmp: undefined, iptc: undefined });
      pipeline = encodePipeline(pipeline, file.extension, targetFormat, quality, hasAlpha);
      const buffer = await pipeline.toBuffer();
      if (!best || buffer.length < best.size) {
        best = { buffer, size: buffer.length };
      }
      if (buffer.length <= options.maxBytes) {
        break;
      }
    }
    if (best && best.size <= options.maxBytes) {
      break;
    }
  }

  if (!best) {
    return null;
  }

  const originalSize = file.size;
  const samePath = outputPath === file.path;
  const forceWrite = localOptions.forceWrite === true;
  const shouldWrite =
    forceWrite
      ? true
      : targetFormat === "avif"
      ? !samePath || best.size < originalSize
      : best.size < originalSize;

  if (!shouldWrite) {
    return null;
  }

  const tempPath = `${outputPath}.tmp`;
  await fs.writeFile(tempPath, best.buffer);
  await fs.rename(tempPath, outputPath);

  const shouldReplaceOriginals =
    localOptions.replaceOriginals == null ? options.replaceOriginals : localOptions.replaceOriginals;

  if (targetFormat === "avif" && shouldReplaceOriginals && outputPath !== file.path) {
    await fs.unlink(file.path);
  }

  return {
    outputPath,
    size: best.size
  };
}

async function rewriteReferences(plan, root) {
  const textFiles = await collectTextFiles(root);
  let changedFiles = 0;
  let totalReplacements = 0;

  for (const filePath of textFiles) {
    const original = await fs.readFile(filePath, "utf8");
    let next = original;
    let replacements = 0;

    for (const item of plan) {
      const variants = buildReplacementVariants(filePath, item);
      for (const [from, to] of variants) {
        if (!from || from === to || !next.includes(from)) {
          continue;
        }
        const count = next.split(from).length - 1;
        if (count <= 0) {
          continue;
        }
        next = next.split(from).join(to);
        replacements += count;
      }
    }

    if (next !== original) {
      await fs.writeFile(filePath, next, "utf8");
      changedFiles += 1;
      totalReplacements += replacements;
      console.log(`  refs ${String(replacements).padStart(4)}  ${path.relative(process.cwd(), filePath)}`);
    }
  }

  return { changedFiles, totalReplacements };
}

async function collectTextFiles(dir) {
  const result = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await collectTextFiles(fullPath);
      result.push(...nested);
      continue;
    }
    if (!entry.isFile()) {
      continue;
    }
    if (TEXT_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      result.push(fullPath);
    }
  }
  return result;
}

function buildReplacementVariants(textFilePath, item) {
  const oldRelPosix = toPosix(item.oldRelative);
  const newRelPosix = toPosix(item.newRelative);
  const oldRelFromText = toPosix(path.relative(path.dirname(textFilePath), item.oldPath));
  const newRelFromText = toPosix(path.relative(path.dirname(textFilePath), item.newPath));
  const variants = new Map();

  const pairs = [
    [item.oldBase, item.newBase],
    [oldRelPosix, newRelPosix],
    [`./${oldRelPosix}`, `./${newRelPosix}`],
    [oldRelFromText, newRelFromText],
    [`./${oldRelFromText}`, `./${newRelFromText}`]
  ];

  for (const [from, to] of pairs) {
    if (!from || !to || from === to) {
      continue;
    }
    variants.set(from, to);
  }

  return [...variants.entries()];
}

async function runMemorySyncIfPresent() {
  const syncPath = path.resolve(process.cwd(), "tools/sync-projects-from-memory.mjs");
  try {
    await fs.access(syncPath);
  } catch {
    return;
  }

  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [syncPath], {
      cwd: process.cwd(),
      stdio: "inherit"
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`sync-projects-from-memory failed with exit code ${code}`));
    });
  });
}

function getQualities(extension, format, hasAlpha) {
  if (format === "avif") {
    return AVIF_QUALITIES;
  }
  if (extension === ".webp") {
    return hasAlpha ? PNG_QUALITIES : WEBP_QUALITIES;
  }
  if (extension === ".png") {
    return hasAlpha ? PNG_QUALITIES : JPEG_QUALITIES;
  }
  return JPEG_QUALITIES;
}

function encodePipeline(pipeline, extension, format, quality, hasAlpha) {
  if (format === "avif") {
    return pipeline.avif({
      quality,
      effort: 5,
      chromaSubsampling: hasAlpha ? "4:4:4" : "4:2:0"
    });
  }

  if (extension === ".png") {
    return pipeline.png({
      compressionLevel: 9,
      effort: 10,
      palette: true,
      colours: 256,
      quality
    });
  }

  if (extension === ".webp") {
    return pipeline.webp({
      quality,
      alphaQuality: hasAlpha ? quality : undefined,
      effort: 6
    });
  }

  return pipeline.jpeg({
    quality,
    mozjpeg: true,
    chromaSubsampling: "4:4:4"
  });
}

function replaceExtension(filePath, extension) {
  return filePath.slice(0, filePath.length - path.extname(filePath).length) + extension;
}

function toPosix(value) {
  return String(value || "").split(path.sep).join("/");
}

function formatBytes(value) {
  const bytes = Number(value) || 0;
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const units = ["KB", "MB", "GB"];
  let current = bytes / 1024;
  let unitIndex = 0;
  while (current >= 1024 && unitIndex < units.length - 1) {
    current /= 1024;
    unitIndex += 1;
  }
  return `${current.toFixed(current >= 100 ? 0 : current >= 10 ? 1 : 2)} ${units[unitIndex]}`;
}
