// background.js - 更穩健的版本

// 擴充功能首次安裝時，預設為關閉狀態
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ isEnabled: false });
});

// 使用 webNavigation API 來更精準地偵測頁面變化。
// 這個事件在像 YouTube 這樣的單頁應用 (SPA) 中變更網址時觸發得更可靠。
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  // 條件：
  // 1. 確保事件來自頂層頁面 (frameId === 0)。
  // 2. 僅在網址符合 YouTube Shorts 的格式時才執行。
  if (details.frameId === 0 && details.url && details.url.includes('youtube.com/shorts/')) {
    
    // 為了安全起見，我們依然注入腳本，
    // 但現在注入的頻率會大幅降低，且 content.js 內部的守衛會處理重複問題。
    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      files: ['content.js']
    }).catch(err => {
      // 這裡的錯誤是正常的，因為當我們從一個 Short 切換到另一個時，
      // 腳本已經存在，Chrome 會阻止重複注入。
      // 我們主要依賴 content.js 內部的守衛來防止重複執行。
      // 所以可以安全地忽略這個錯誤。
    });
  }
}, { 
  // 過濾器：只監聽 youtube.com 網域下的 URL 變化
  url: [{ hostContains: 'www.youtube.com', pathContains: 'shorts'}] 
});