# Golova

Interactive portfolio map for Golova.

## Run Locally

```bash
python3 -m http.server 4173
```

Open:

```text
http://localhost:4173
```

Direct project links use the query format:

```text
/?project=safer
```

## Project Data

Working content lives in `memory`.

- Simple projects: `memory/*.md`
- Projects with an inner graph: `memory/<project>/<project>.md`
- Project media and captions: `memory/<project>/media.md`

After editing anything in `memory`, run:

```bash
node tools/sync-projects-from-memory.mjs
```

This regenerates:

- `src/projects-memory.js`
- `src/media-manifest.js`
- `src/media-proxy-manifest.js`

## Media Notes

`media.md` sections look like this:

```md
## ![[file.avif]]
Label: Object name
Root: 1
Physical: 1
Size: s

Description text.
```

- `Label:` sets the visible media label.
- `Root: 1` shows media in the main graph around the project.
- `Physical: 1` adds the object to the Physical section.
- `Size: xs` / `Size: s` can reduce oversized media inside project graphs.

## Important Files

- `index.html` page shell, favicon, startup route state.
- `src/main.js` graph, camera, filters, deep project mode, 3D head.
- `src/styles.css` visual system.
- `src/projects.js` runtime merge of memory data and legacy per-project settings.
- `src/projects-legacy.js` legacy manual settings still used by the site.
- `assets/head/golova_model.glb` current 3D head model.
- `fonts/variable/` local JetBrains Mono variable font used by CSS.

Graph media proxies are disabled by default. If we ever need to rebuild that experiment, run:

```bash
node tools/sync-projects-from-memory.mjs --graph-proxies
```

## Backups

Local backups and moved legacy files live in `backups/` and are ignored by Git.
