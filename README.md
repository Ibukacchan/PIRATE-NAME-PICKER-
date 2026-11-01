# Grand Line — Classroom Name Picker

A pirate-adventure classroom name picker and random group generator. Built with plain HTML, CSS, and JavaScript; no build step, package manager, or external dependencies required.

## Deploy to GitHub Pages

1. Create a new GitHub repository.
2. Upload **all files in this ZIP directly to the repository root** (do not put them inside another folder).
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then Save.
6. Wait for GitHub Pages to publish the site. Open the published HTTPS URL on your phone.

## Install on Android

1. Open the published GitHub Pages URL in Chrome.
2. Tap the browser menu (⋮).
3. Choose **Install app** or **Add to Home screen**.
4. Launch Grand Line from your home screen.

The app caches its core files for offline use after the first successful visit. The install option is available in the app when the browser supports the install prompt.

## Features

- Sample class roster preloaded with the 16 names supplied.
- Add and remove names; changes save automatically in the current browser on the current device.
- Import a one-column CSV roster and export a CSV backup.
- Wanted-poster style random name reveal.
- No-repeat draw mode and reset.
- Random grouping by number of groups or students per group, with even distribution.
- Copy group assignments.
- Synthesized ambient background music and sound effects (no external audio files or copyrighted soundtrack).
- PWA manifest, service worker, and app icon.

## Student roster storage

Roster and drawn-name history are stored in browser `localStorage`. This means they remain on that device and in that browser, including after installation, but are not automatically synchronized to other devices. Use **Export CSV** to back up or transfer a class list. Importing a CSV replaces the current roster.

## Notes

- Background music is generated in-browser and starts only after you tap the Music control, due to browser autoplay restrictions.
- GitHub Pages serves the app over HTTPS, which is required for service workers and offline PWA functionality.
- To update the app, replace the root files in the repository with the newer versions.
