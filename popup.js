document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('toggleSwitch');

  // 1. Popup 開啟時，讀取已儲存的狀態並更新開關
  chrome.storage.sync.get(['isEnabled'], (result) => {
    toggleSwitch.checked = !!result.isEnabled;
  });

  // 2. 當使用者點擊開關時
  toggleSwitch.addEventListener('change', () => {
    const isEnabled = toggleSwitch.checked;
    
    // 2a. 儲存新的狀態
    chrome.storage.sync.set({ isEnabled: isEnabled });

    // 2b. 通知當前的 YouTube 分頁狀態已改變
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // 確保我們在一個有效的頁面上
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'TOGGLE_STATE',
          isEnabled: isEnabled
        });
      }
    });
  });
});