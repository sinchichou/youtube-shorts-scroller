// content.js - 整合了簡潔遞歸邏輯的版本

if (typeof window.myShortsScrollerLoaded === 'undefined') {
  window.myShortsScrollerLoaded = true;

  const getVideo = () => document.querySelector('ytd-reel-video-renderer[is-active] video');
  const getNextButton = () => document.querySelector('#navigation-button-down button');
  const wait = (ms) => new Promise((res) => setTimeout(res, ms));

  let isEnabled = false;

  const onVideoEnded = async () => {
    if (!isEnabled) return;
    console.log('Shorts Scroller: 影片結束，準備滑動...');
    const nextButton = getNextButton();
    if (nextButton) {
      nextButton.click();
      await wait(500); // 等待新影片載入
      setupForCurrentVideo();
    }
  };

  const setupForCurrentVideo = () => {
    if (!isEnabled) return;
    
    // 使用 setTimeout 來確保我們在影片完全初始化後再操作
    setTimeout(() => {
      const video = getVideo();
      if (video) {
        console.log('Shorts Scroller: 偵測到新影片，正在設定...');
        video.removeAttribute("loop");
        video.onended = onVideoEnded;
      }
    }, 100); // 短暫延遲以應對頁面渲染
  };

  const start = () => {
    if (isEnabled) return;
    isEnabled = true;
    console.log('Shorts Scroller: 已啟用。');
    setupForCurrentVideo();
    // 我們需要一個 MutationObserver 來應對使用者手動滑動的情況
    const observer = new MutationObserver(setupForCurrentVideo);
    observer.observe(document.querySelector('#shorts-container'), { childList: true, subtree: true });
  };

  const stop = () => {
    isEnabled = false;
    console.log('Shorts Scroller: 已停用。');
    // 注意：這裡無法停止 MutationObserver，但因為 isEnabled 為 false，所以不會有實際操作。
  };

  // --- 溝通與初始設定 ---
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'TOGGLE_STATE') {
      message.isEnabled ? start() : stop();
    }
  });

  chrome.storage.sync.get(['isEnabled'], (result) => {
    if (result.isEnabled) {
      start();
    }
  });
}