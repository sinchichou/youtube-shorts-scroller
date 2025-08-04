# YouTube Shorts Scroller (English)
## [中文版](README_zh.md)


A Chrome extension that automates YouTube Shorts playback flow: disables loop per video and jumps to the next Short when the current one is about to finish.

## Features
- Detects the currently active Shorts video
- Disables the Loop button per video
- Automatically navigates to the next video near the end
- Remembers enable/disable state via chrome.storage
- State-driven and resilient logic to avoid duplicate actions

## Installation

1) Get the code
- Download as ZIP and extract, or `git clone` this repository.

2) Load into Chrome
1. Open `chrome://extensions/`
2. Toggle on "Developer mode"
3. Click "Load unpacked"
4. Select this project folder (the one containing `manifest.json`)

## Usage
1. After loading, you will see the extension icon in the toolbar.
2. Click the icon to open the popup and toggle the switch to enable/disable auto-scroll.
3. Go to a YouTube Shorts page (e.g. `https://www.youtube.com/shorts/...`).
4. When enabled, the extension will:
   - Simulate mouseenter to reveal controls
   - Turn off the Loop button
   - Click the Next button when the video is about to end

Note: If YouTube UI or aria labels change, you might need to update the selectors.

## Project Structure
```
.
├─ background.js        // Background script (message hub / state management)
├─ content.js           // Injected into Shorts: detection, control, auto-next
├─ manifest.json        // Chrome extension manifest (permissions, scripts, icons)
├─ popup.html           // Popup UI
├─ popup.css            // Popup styles
├─ popup.js             // Popup logic (toggle state)
└─ icons/
   ├─ icon16.png
   ├─ icon48.png
   └─ icon128.png
```

## How It Works
- `content.js`:
  - Uses `isEnabled` to control a `mainLoop`
  - Only processes a newly active video (`ACTIVE_VIDEO_SELECTOR` + `currentVideoSrc`)
  - Triggers mouseenter to reveal controls, finds and disables Loop
  - Starts a timer to monitor remaining time and clicks Next near the end
- `popup.js`:
  - Provides a toggle and communicates with the content script via `chrome.runtime.sendMessage`
  - Persists state in `chrome.storage.sync`
- `background.js`:
  - Message relay and permission bridge (extend as needed)

## Permissions
- `activeTab`: Access the current tab content to operate on YouTube
- `storage`: Save user preference (enabled/disabled)

Refer to `manifest.json` for the exact permissions.

## FAQ
- Q: It doesn’t move to the next Short.
  - A: Ensure you are on a Shorts page and the Next button exists. If YouTube UI changed, update the selectors.
- Q: Loop isn’t being disabled.
  - A: The aria-label text may have changed (currently checks for strings like "循環播放" and "已開啟"). Update `LOOP_BUTTON_SELECTOR` and `LOOP_BUTTON_ON_TEXT` accordingly.

## Development
- Adjust selectors in `content.js` to match YouTube UI updates
- Use the built-in colored `console.log` for tracing
- For publishing to the Chrome Web Store, follow Manifest V3 packaging guidelines

## License
For learning and personal use only. Use in accordance with YouTube and Chrome Extensions policies.
