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
- Or download the packaged extension (.crx): [youtube-shorts-scroller.crx](./youtube-shorts-scroller.crx)

2) Load into Chrome
- Method A: Load unpacked (recommended for developers)
  1. Open `chrome://extensions/`
  2. Toggle on "Developer mode"
  3. Click "Load unpacked"
  4. Select this project folder (the one containing `manifest.json`)
- Method B: Install from .crx file
  1. Open `chrome://extensions/`
  2. Toggle on "Developer mode"
  3. Drag and drop `youtube-shorts-scroller.crx` from this folder into the `chrome://extensions/` page
  4. Confirm the installation prompt

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

---

# 中文安裝快速指引（節錄）

## 安裝

1) 取得程式
- 下載 ZIP 並解壓縮，或使用 `git clone`
- 或直接下載已打包的擴充檔 (.crx)：[youtube-shorts-scroller.crx](./youtube-shorts-scroller.crx)

2) 載入到 Chrome
- 方式 A：載入未封裝（開發者建議）
  1. 打開 `chrome://extensions/`
  2. 開啟右上角「開發人員模式」
  3. 點「載入未封裝項目」並選擇本資料夾（含 `manifest.json`）
- 方式 B：透過 .crx 安裝
  1. 打開 `chrome://extensions/`
  2. 開啟「開發人員模式」
  3. 將本目錄下的 `youtube-shorts-scroller.crx` 檔案拖曳到 `chrome://extensions/` 頁面
  4. 在跳出的提示中確認安裝
