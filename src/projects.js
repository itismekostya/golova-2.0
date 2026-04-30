import { projects as legacyProjects } from "./projects-legacy.js";
import { projectsFromMemory } from "./projects-memory.js";

const SOURCE_KEYS = [
  "slug",
  "title",
  "types",
  "client",
  "location",
  "year",
  "madeWith",
  "focusZoom",
  "introText",
  "detailsText",
  "moreLabel",
  "moreUrl",
  "contentItems",
  "media"
];

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

function pickDefinedSourceFields(project) {
  const out = {};
  for (const key of SOURCE_KEYS) {
    if (hasOwn(project, key) && project[key] !== undefined) {
      if (key === "types" && Array.isArray(project[key])) {
        out[key] = [...project[key]];
      } else if ((key === "media" || key === "contentItems") && Array.isArray(project[key])) {
        out[key] = project[key].map((item) => structuredClone(item));
      } else {
        out[key] = project[key];
      }
    }
  }
  if (!Array.isArray(out.types)) {
    out.types = [];
  }
  return out;
}

const legacyBySlug = new Map(legacyProjects.map((project) => [project.slug, project]));
const usedSlugs = new Set();
const mergedProjects = [];

for (const sourceProject of projectsFromMemory) {
  const source = pickDefinedSourceFields(sourceProject);
  const legacy = legacyBySlug.get(source.slug);
  if (
    legacy &&
    typeof source.title === "string" &&
    typeof source.slug === "string" &&
    source.title.trim().toLowerCase() === source.slug.trim().toLowerCase()
  ) {
    delete source.title;
  }
  const merged = legacy ? { ...legacy, ...source } : source;
  if (!Array.isArray(merged.types)) {
    merged.types = [];
  }
  mergedProjects.push(merged);
  usedSlugs.add(merged.slug);
}

for (const legacyProject of legacyProjects) {
  if (usedSlugs.has(legacyProject.slug)) {
    continue;
  }
  mergedProjects.push(legacyProject);
}

export const projects = mergedProjects;
