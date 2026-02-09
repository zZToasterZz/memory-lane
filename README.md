# Memory Lane — single-file romantic site

This project is a small, self-contained romantic single-page website built with only HTML, CSS and vanilla JavaScript. It is intentionally offline-friendly and easy to edit; add your photos, icons and audio inside the `assets/` folder.

Quick summary
- Greeting card with 3D open animation.
- Memories screen showing folder icons (driven by `assets/folders.json`).
- Photo gallery modal with polaroid-style frames.
- Clickable photos that open a full-size framed overlay.
- Secret puzzle: drag-and-drop pieces (snap/magnetic behavior) that reveal a final message on completion.
- Folder-specific audio playback (mapped via `assets/folders.json`).

Project layout (important files)
- `index.html` — main page markup and embedded UI container.
- `styles.css` — all styles, responsive layout and animations.
- `script.js` — all interaction logic: card, folders, gallery, puzzle, audio.
- `assets/` — media and manifest:
	- `assets/folders.json` — canonical manifest listing folders, images, captions and optional `audio` and `basePath` fields. The site reads this file (external-only). Example entry:

```json
{
	"key": "firstdate",
	"label": "First Date",
	"basePath": "assets/photos/firstdate/",
	"files": [
		{ "file": "1.jpeg", "caption": "The day we met." },
		{ "file": "2.jpeg", "caption": "And I knew we were meant to be." }
	],
	"audio": "assets/ost/GehraHua.mp3"
}
```

	- `assets/photos/<folder>/` — subfolders for your photos (filenames listed in `files`).
	- `assets/ost/` — optional mp3 files. Map a file to a folder using `audio` in `folders.json`.
	- `assets/icons/` — optional custom icons named to match folder keys (`firstdate.png`, etc.). Supported extensions: png/jpg/svg/jpeg/webp.

How to add photos and captions
- Add image files into `assets/photos/<folder>/`.
- Edit `assets/folders.json` and add filenames (or objects with `file` + `caption`) to the `files` array for that folder. Example:

```json
"files": ["1.jpg", { "file": "2.jpg", "caption": "Sunset walk" }]
```

Audio mapping
- Drop mp3 files into `assets/ost/` and add an `audio` field in the corresponding folder entry in `assets/folders.json` (path is relative to the project root).

Icons
- Place icons in `assets/icons/` named exactly as the folder `key` (e.g. `firstdate.png`). The UI tries multiple extensions and falls back to a default emoji if none found.

Puzzle image
- Place the puzzle image at `assets/photos/puzzle.jpg` (manifest maps `secret-message` to `puzzle.jpg` by default). The puzzle grid and behavior are defined in `script.js`.

Run locally (recommended)
The app requires serving via HTTP so the browser can fetch `assets/folders.json`. You can use a simple static server from the project root:

Python 3:
```powershell
python -m http.server 8000
# then open http://localhost:8000
```

npx http-server (requires Node/npm):
```powershell
npx http-server -p 8000
# then open http://localhost:8000
```

Notes about development and usage
- The app intentionally uses `assets/folders.json` as the single source of truth. Do not duplicate folder data inside `index.html`.
- If you open `index.html` directly via `file://`, fetching `assets/folders.json` will be blocked by the browser security model — use a local server as described above.
- VS Code integrated terminal may need a restart to pick up newly installed `nvm`/Node on Windows.

If you want any additional conveniences (small server script, a sync command that embeds the manifest into `index.html` for file:// workflows, or a simple UI to edit captions), tell me which and I can add it.

Enjoy — open `http://localhost:8000` and click the card to begin.

