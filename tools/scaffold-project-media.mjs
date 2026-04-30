#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const rootDir = path.resolve(process.cwd(), "memory");
const MEDIA_FILE_NAME = "media.md";
const MEDIA_EXTENSIONS = new Set([
  ".avif",
  ".svg",
  ".gif",
  ".mp4",
  ".mov",
  ".m4v",
  ".webm"
]);

const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

main().catch((error) => {
  console.error(`[media-scaffold] ${error?.message || error}`);
  process.exitCode = 1;
});

async function main() {
  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) {
      continue;
    }

    const projectDir = path.join(rootDir, entry.name);
    const files = await collectProjectMediaFiles(projectDir);
    if (!files.length) {
      skipped += 1;
      continue;
    }

    const mediaPath = path.join(projectDir, MEDIA_FILE_NAME);
    const existing = await readIfExists(mediaPath);

    if (!existing) {
      const content = buildMediaMarkdown(files);
      await fs.writeFile(mediaPath, content, "utf8");
      created += 1;
      console.log(`[media-scaffold] created  ${path.relative(process.cwd(), mediaPath)}`);
      continue;
    }

    const missingFiles = files.filter((file) => !hasSectionForFile(existing, file));
    if (!missingFiles.length) {
      skipped += 1;
      continue;
    }

    const suffix = buildMediaSections(missingFiles);
    const next = `${existing.replace(/\s*$/, "")}\n\n${suffix}`;
    await fs.writeFile(mediaPath, next, "utf8");
    updated += 1;
    console.log(
      `[media-scaffold] updated  ${path.relative(process.cwd(), mediaPath)} (+${missingFiles.length} entries)`
    );
  }

  console.log("");
  console.log(`[media-scaffold] Created: ${created}`);
  console.log(`[media-scaffold] Updated: ${updated}`);
  console.log(`[media-scaffold] Skipped: ${skipped}`);
}

async function collectProjectMediaFiles(projectDir) {
  const entries = await fs.readdir(projectDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => {
      if (name.startsWith(".")) {
        return false;
      }
      if (name.toLowerCase() === MEDIA_FILE_NAME) {
        return false;
      }
      return MEDIA_EXTENSIONS.has(path.extname(name).toLowerCase());
    })
    .sort((a, b) => collator.compare(a, b));
}

function buildMediaMarkdown(files) {
  return `${buildMediaSections(files)}\n`;
}

function buildMediaSections(files) {
  return files
    .map((file) => `## ![[${file}]]\nLabel:`)
    .join("\n\n");
}

function hasSectionForFile(markdown, fileName) {
  const escaped = escapeRegExp(fileName);
  const patterns = [
    new RegExp(`^##\\s+!\\[\\[${escaped}(?:\\|[^\\]]+)?\\]\\]\\s*$`, "m"),
    new RegExp(`^##\\s+${escaped}\\s*$`, "m")
  ];
  return patterns.some((pattern) => pattern.test(markdown));
}

async function readIfExists(filePath) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return "";
    }
    throw error;
  }
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
