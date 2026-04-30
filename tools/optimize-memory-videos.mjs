#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { spawn } from "node:child_process";

const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".m4v", ".webm"]);
const TEXT_EXTENSIONS = new Set([".md", ".json"]);
const DEFAULT_ROOT = "memory";
const DEFAULT_MAX_EDGE = 1600;
const DEFAULT_LIMIT = 20;
const DEFAULT_CRF = 27;
const DEFAULT_PRESET = "veryslow";
const DEFAULT_AUDIO_BITRATE = "96k";

const args = process.argv.slice(2);
const command = args.find((value) => !value.startsWith("--")) || "audit";

const options = {
  root: DEFAULT_ROOT,
  maxEdge: DEFAULT_MAX_EDGE,
  limit: DEFAULT_LIMIT,
  crf: DEFAULT_CRF,
  preset: DEFAULT_PRESET,
  audioBitrate: DEFAULT_AUDIO_BITRATE
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
  } else if (key === "max-edge") {
    options.maxEdge = Math.max(480, Number.parseInt(parsedValue, 10) || DEFAULT_MAX_EDGE);
  } else if (key === "limit") {
    options.limit = Math.max(1, Number.parseInt(parsedValue, 10) || DEFAULT_LIMIT);
  } else if (key === "crf") {
    options.crf = clamp(Number.parseInt(parsedValue, 10) || DEFAULT_CRF, 16, 34);
  } else if (key === "preset") {
    options.preset = parsedValue || DEFAULT_PRESET;
  } else if (key === "audio-bitrate") {
    options.audioBitrate = parsedValue || DEFAULT_AUDIO_BITRATE;
  }
}

const rootDir = path.resolve(process.cwd(), options.root);

main().catch((error) => {
  console.error("");
  console.error(`[videos] ${error?.message || error}`);
  process.exitCode = 1;
});

async function main() {
  const files = await collectVideoFiles(rootDir);
  if (!files.length) {
    console.log(`[videos] No mp4/mov/m4v/webm files found in ${rootDir}`);
    return;
  }

  if (command === "audit") {
    await printAudit(files, options.limit);
    return;
  }

  if (command !== "mp4" && command !== "mp4-replace") {
    throw new Error('Unknown command. Use "audit", "mp4", or "mp4-replace".');
  }

  await ensureFfmpeg();

  if (command === "mp4") {
    await convertVideos(files, { replaceOriginals: false });
    return;
  }

  await replaceAllWithMp4(files);
}

async function collectVideoFiles(dir) {
  const result = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await collectVideoFiles(fullPath);
      result.push(...nested);
      continue;
    }
    if (!entry.isFile()) {
      continue;
    }
    const extension = path.extname(entry.name).toLowerCase();
    if (!VIDEO_EXTENSIONS.has(extension)) {
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

  console.log(`[videos] Root: ${path.relative(process.cwd(), rootDir) || "."}`);
  console.log(`[videos] Files: ${files.length}`);
  console.log(`[videos] Total size: ${formatBytes(totalBytes)}`);
  console.log("");
  console.log("[videos] By extension:");
  for (const [extension, count] of [...byExtension.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`  ${extension}: ${count}`);
  }
  console.log("");
  console.log(`[videos] Largest ${limit}:`);
  for (const file of [...files].sort((a, b) => b.size - a.size).slice(0, limit)) {
    console.log(`  ${formatBytes(file.size).padStart(8)}  ${file.relativePath}`);
  }
  console.log("");
  console.log("[videos] Suggested next step:");
  console.log("  brew install ffmpeg");
  console.log("  npm run videos:mp4          # create web mp4 copies, keep originals");
  console.log("  npm run videos:mp4-replace  # convert all, rewrite refs, delete old files");
}

async function ensureFfmpeg() {
  await new Promise((resolve, reject) => {
    const child = spawn("ffmpeg", ["-version"], {
      cwd: process.cwd(),
      stdio: "ignore"
    });
    child.on("error", () => {
      reject(new Error('Missing dependency "ffmpeg". Install it with: brew install ffmpeg'));
    });
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error('Missing dependency "ffmpeg". Install it with: brew install ffmpeg'));
    });
  });
}

async function convertVideos(files, { replaceOriginals }) {
  const summary = {
    converted: 0,
    skipped: 0,
    failed: 0,
    bytesBefore: 0,
    bytesAfter: 0
  };

  console.log(
    `[videos] Converting ${files.length} files to web mp4 ` +
      `(crf=${options.crf}, preset=${options.preset}, maxEdge=${options.maxEdge}px)`
  );

  for (const file of files) {
    summary.bytesBefore += file.size;
    try {
      const result = await convertSingleVideo(file, { replaceOriginals });
      if (!result) {
        summary.skipped += 1;
        summary.bytesAfter += file.size;
        continue;
      }
      summary.converted += 1;
      summary.bytesAfter += result.size;
      console.log(
        `  mp4  ${formatBytes(file.size).padStart(8)} -> ${formatBytes(result.size).padStart(8)}  ${file.relativePath}`
      );
    } catch (error) {
      summary.failed += 1;
      summary.bytesAfter += file.size;
      console.log(`  failed          ${file.relativePath}`);
      console.log(`    ${error?.message || error}`);
    }
  }

  console.log("");
  console.log(`[videos] Converted: ${summary.converted}`);
  console.log(`[videos] Skipped:   ${summary.skipped}`);
  console.log(`[videos] Failed:    ${summary.failed}`);
  console.log(`[videos] Before:    ${formatBytes(summary.bytesBefore)}`);
  console.log(`[videos] After:     ${formatBytes(summary.bytesAfter)}`);
  console.log(`[videos] Saved:     ${formatBytes(Math.max(0, summary.bytesBefore - summary.bytesAfter))}`);
  if (!replaceOriginals) {
    console.log("");
    console.log("[videos] Originals were kept. Use videos:mp4-replace when you want only the new .mp4 files.");
  }
}

async function replaceAllWithMp4(files) {
  const plan = [];
  let bytesBefore = 0;
  let bytesAfter = 0;
  let failed = 0;

  console.log(
    `[videos] Converting ${files.length} files to .mp4, rewriting references, and removing originals`
  );

  for (const file of files) {
    bytesBefore += file.size;
    try {
      const result = await convertSingleVideo(file, { replaceOriginals: false, forceWrite: true });
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
        `  mp4  ${formatBytes(file.size).padStart(8)} -> ${formatBytes(result.size).padStart(8)}  ${file.relativePath}`
      );
    } catch (error) {
      failed += 1;
      console.log(`  failed          ${file.relativePath}`);
      console.log(`    ${error?.message || error}`);
    }
  }

  if (!plan.length) {
    throw new Error("No videos were converted to mp4.");
  }

  const rewriteSummary = await rewriteReferences(plan, rootDir);
  for (const item of plan) {
    if (path.resolve(item.oldPath) === path.resolve(item.newPath)) {
      continue;
    }
    await fs.unlink(item.oldPath);
  }
  await runMemorySyncIfPresent();

  console.log("");
  console.log(`[videos] Converted: ${plan.length}`);
  console.log(`[videos] Failed:    ${failed}`);
  console.log(`[videos] Before:    ${formatBytes(bytesBefore)}`);
  console.log(`[videos] After:     ${formatBytes(bytesAfter)}`);
  console.log(`[videos] Saved:     ${formatBytes(Math.max(0, bytesBefore - bytesAfter))}`);
  console.log(`[videos] Refs updated in ${rewriteSummary.changedFiles} file(s)`);
  console.log(`[videos] Replacements: ${rewriteSummary.totalReplacements}`);
  console.log("[videos] Old source video files removed.");
}

async function convertSingleVideo(file, localOptions = {}) {
  const outputPath =
    file.extension === ".mp4" ? file.path : replaceExtension(file.path, ".mp4");

  const tempOutputPath =
    outputPath === file.path
      ? path.join(os.tmpdir(), `golova-video-${Date.now()}-${Math.random().toString(36).slice(2)}.mp4`)
      : `${outputPath}.tmp.mp4`;

  await runFfmpeg(file.path, tempOutputPath);

  const stat = await fs.stat(tempOutputPath);
  const originalSize = file.size;
  const samePath = outputPath === file.path;
  const forceWrite = localOptions.forceWrite === true;
  const allowGrowth = localOptions.allowGrowth === true;
  const shouldWrite = forceWrite
    ? allowGrowth || stat.size < originalSize || !samePath
    : stat.size < originalSize || !samePath;

  if (!shouldWrite) {
    await safeUnlink(tempOutputPath);
    return null;
  }

  if (samePath) {
    await fs.rename(tempOutputPath, outputPath);
  } else {
    await fs.rename(tempOutputPath, outputPath);
  }

  if (localOptions.replaceOriginals && outputPath !== file.path) {
    await fs.unlink(file.path);
  }

  return {
    outputPath,
    size: stat.size
  };
}

async function runFfmpeg(inputPath, outputPath) {
  const scaleFilter =
    `scale='if(gte(iw,ih),min(iw,${options.maxEdge}),-2)':` +
    `'if(gte(ih,iw),min(ih,${options.maxEdge}),-2)'`;

  const args = [
    "-y",
    "-i",
    inputPath,
    "-map",
    "0:v:0",
    "-map",
    "0:a?",
    "-vf",
    scaleFilter,
    "-c:v",
    "libx264",
    "-preset",
    options.preset,
    "-crf",
    String(options.crf),
    "-profile:v",
    "high",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-c:a",
    "aac",
    "-b:a",
    options.audioBitrate,
    outputPath
  ];

  await new Promise((resolve, reject) => {
    const child = spawn("ffmpeg", args, {
      cwd: process.cwd(),
      stdio: ["ignore", "ignore", "pipe"]
    });

    let errorOutput = "";
    child.stderr.on("data", (chunk) => {
      errorOutput += String(chunk);
    });

    child.on("error", (error) => {
      reject(error);
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      const message = errorOutput.trim().split("\n").slice(-8).join("\n") || `ffmpeg exited with ${code}`;
      reject(new Error(message));
    });
  });
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

function replaceExtension(filePath, extension) {
  return filePath.slice(0, filePath.length - path.extname(filePath).length) + extension;
}

function toPosix(value) {
  return String(value || "").split(path.sep).join("/");
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

async function safeUnlink(filePath) {
  try {
    await fs.unlink(filePath);
  } catch {
    // ignore temp cleanup errors
  }
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
