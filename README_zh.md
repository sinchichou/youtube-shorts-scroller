# YouTube Shorts Scroller（中文版）

一個 Chrome 擴充功能，讓你在 YouTube Shorts 中自動播放、在結束時自動滑到下一支，並確保每支影片不進入循環播放模式。

[English Version](README.md)

## 功能特色
- 自動偵測目前正在播放的 Shorts 影片
- 自動關閉該影片的「循環播放」
- 影片將近播放完畢時，自動滑到下一支（按下下一個箭頭）
- 啟用/停用狀態會被記住（使用 chrome.storage）
- 設計成狀態驅動且具韌性，減少重複觸發與干擾

## 安裝

1) 取得程式
- 下載 ZIP 並解壓縮，或使用 `git clone`
- 或直接下載已打包的擴充檔 (.crx)：[youtube-shorts-scroller.crx](./youtube-shorts-scroller.crx)

2) 載入到 Chrome
- 方式 A：載入未封裝（開發者建議）
  1. 打開 `chrome://extensions/`
  2. 開啟右上角「開發人員模式」
  3. 點「載入未封裝項目」
  4. 選擇本資料夾（含 `manifest.json`）
- 方式 B：透過 .crx 安裝
  1. 打開 `chrome://extensions/`
  2. 開啟「開發人員模式」
  3. 將本目錄下的 `youtube-shorts-scroller.crx` 檔案拖曳到 `chrome://extensions/` 頁面
  4. 在跳出的提示中確認安裝

> 注意：某些 Chromium 瀏覽器或公司裝置政策可能限制 .crx 安裝，若無法安裝請改用「載入未封裝」。

## 使用方式
1. 安裝後，工具列會出現擴充功能圖示。
2. 點擊圖示開啟彈出視窗（popup），切換開關即可啟用/停用自動滑動。
3. 前往 YouTube 的 Shorts 頁面（網址通常為 `https://www.youtube.com/shorts/...`）。
4. 啟用後，擴充功能會：
   - 模擬滑鼠移入以顯示控制項
   - 關閉「循環播放」
   - 在影片將結束時自動點擊下一支

> 小提醒：若 YouTube UI 或 aria-label 有變更，選擇器可能需要更新。

## 專案結構
```
.
├─ background.js        // 背景腳本（與 popup/content 溝通、管理狀態）
├─ content.js           // 注入到 YouTube Shorts 頁面，負責偵測/控制播放與自動下一支
├─ manifest.json        // Chrome 擴充功能設定檔（權限/腳本/圖示等）
├─ popup.html           // 擴充功能彈出視窗的 HTML
├─ popup.css            // 彈出視窗樣式
├─ popup.js             // 彈出視窗行為（切換啟用狀態）
└─ icons/
   ├─ icon16.png
   ├─ icon48.png
   └─ icon128.png
```

## 工作原理（簡述）
- `content.js`：
  - 以狀態 `isEnabled` 控制主循環 `mainLoop`
  - 只處理「新」的 active 影片（透過 `ACTIVE_VIDEO_SELECTOR` 與 `currentVideoSrc` 判斷）
  - 進入影片時模擬 `mouseenter`，確保控制列出現，再尋找「循環播放」按鈕並關閉
  - 啟動計時器監視剩餘秒數，接近結束時點擊下一個按鈕
- `popup.js`：
  - 提供 UI 切換啟用/停用，並透過 `chrome.runtime.sendMessage` 通知 content script
  - 狀態存於 `chrome.storage.sync`，瀏覽器重開也能恢復
- `background.js`：
  - 作為訊息中繼與權限橋樑（若有需求可擴充）

## 權限說明
- `activeTab`：存取目前分頁內容，用於在 YouTube 上運作
- `storage`：保存使用者的啟用/停用偏好

實際權限以 `manifest.json` 為準。

## 常見問題（FAQ）
- 問：沒有自動跳到下一支？
  - 答：請確認位於 Shorts 頁面，且頁面上存在「下一個」按鈕；若 YouTube 介面有變更，需更新選擇器。
- 問：循環播放沒有被關閉？
  - 答：可能 aria-label 文案變更（目前以包含「循環播放」「已開啟」判斷），可調整 `LOOP_BUTTON_SELECTOR` 與 `LOOP_BUTTON_ON_TEXT`。

## 開發指南
- 修改 `content.js` 選擇器以對應 YouTube UI 更新
- 使用 `console.log` 追蹤流程（已內建彩色 log）
- 若要發佈到 Chrome 線上商店，請參考 Manifest V3 打包與上架流程

## 版權與授權
此專案僅供學習與個人使用，請依據 YouTube 與 Chrome 擴充平台規範使用。
