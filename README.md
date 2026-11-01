# Grand Line — Classroom Adventure PWA

A pirate-adventure classroom toolkit built with plain HTML, CSS, and JavaScript. No build step or external libraries are required.

## What's new in this version

- Bundled looping background theme (`grand-line-theme.wav`), with a play/pause control. Start playback with one tap; it continues while switching app sections.
- Fullscreen presentation mode for classroom projection.
- Classroom countdown timer with 1-, 3-, 5-, and 10-minute presets, custom time, pause, and reset.
- Multiple saved class lists. Create, switch, rename, and delete classes; each class keeps its own roster, draw history, and scores.
- Crew scoreboard with +1, +5, and -1 point controls.
- Enhanced Grand Line ocean theme, gold details, animated wanted-poster reveal, and responsive layout.
- Wanted-poster random name picker, no-repeat draw, recent picks, and reset.
- Group generator by number of groups or students per group, with balanced distribution.
- Add/remove students, CSV import/export, and local browser storage.
- PWA manifest and service worker for offline use. The service worker attempts to cache the bundled theme; whether a large audio file can be stored offline depends on device/browser storage limits.

## Deploy to GitHub Pages

1. Create a GitHub repository.
2. Upload **all files in this ZIP directly to the repository root** (not inside another folder).
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then Save.
6. Open the published HTTPS URL after deployment completes.

## Install on Android

1. Open the published GitHub Pages URL in Chrome.
2. Tap the browser menu (⋮).
3. Choose **Install app** or **Add to Home screen**.
4. Launch Grand Line from your home screen.

## Music playback

Browsers block autoplay until the user interacts with the page. Tap **Play theme** once to start the bundled theme. It loops continuously while navigating between app tabs. Tap **Music on** to pause it. The audio file is included in this package; no separate upload is needed after deployment.

## Local data and privacy

Class lists, rosters, picked-name history, and crew scores are stored in this browser on this device. They are not synchronized to other devices or sent to a server. Use **Export CSV** to back up a roster. Importing a CSV replaces the selected class's roster.

## ZIP structure

All app files are placed directly in the ZIP root, including `index.html`, `styles.css`, `app.js`, `sw.js`, the PWA assets, and `grand-line-theme.wav`.
