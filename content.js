// content.js - State-driven, robust version

if (typeof window.myShortsScrollerLoaded === 'undefined') {

  window.myShortsScrollerLoaded = true;
  console.log('%c Shorts Scroller: 啟動，版本：State-Driven', 'background: #8A2BE2; color: #fff; font-weight: bold;');

  // --- 常數定義 ---
  const ACTIVE_VIDEO_SELECTOR = 'ytd-reel-video-renderer[is-active] video';
  const PLAYER_CONTAINER_SELECTOR = 'ytd-reel-video-renderer[is-active] #player-container';
  const NEXT_BUTTON_SELECTOR = '#navigation-button-down button';
  const LOOP_BUTTON_SELECTOR = 'ytd-reel-video-renderer[is-active] button[aria-label*="循環播放"]';
  const LOOP_BUTTON_ON_TEXT = '已開啟';

  let isEnabled = false;
  let currentVideoSrc = null; // 用來追蹤當前正在處理的影片

  /**
   * 主循環，它的唯一任務是尋找新的、未被處理的影片。
   */
  function mainLoop() {
    if (!isEnabled) {
      return; // 如果功能被關閉，則停止循環。
    }

    const activeVideo = document.querySelector(ACTIVE_VIDEO_SELECTOR);

    // 如果找不到影片，或者這個影片我們已經在處理了，就什麼都不做。
    if (!activeVideo || activeVideo.src === currentVideoSrc) {
      requestAnimationFrame(mainLoop); // 繼續下一幀的尋找
      return;
    }

    // --- 發現了一個全新的影片！ ---
    console.log(`%c 發現新影片! src: ${activeVideo.src.substring(0, 50)}...`, 'color: green; font-weight: bold;');
    currentVideoSrc = activeVideo.src;
    processNewVideo(activeVideo); // 將影片交給處理程序

    requestAnimationFrame(mainLoop); // 繼續下一幀的尋找
  }

  /**
   * 專門負責處理單一影片的完整流程。
   */
  function processNewVideo(video) {
    console.log('處理程序: 開始處理新影片...');

    // 步驟 1: 模擬滑鼠移入，強制顯示控制項。
    const playerContainer = document.querySelector(PLAYER_CONTAINER_SELECTOR);
    if (playerContainer) {
      console.log('處理程序: [1/4] 模擬滑鼠移入...');
      playerContainer.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    } else {
      console.error('處理程序: 找不到 playerContainer！');
      return;
    }

    // 步驟 2: 等待 150 毫秒，讓控制項有時間被建立。
    setTimeout(() => {
      const loopButton = document.querySelector(LOOP_BUTTON_SELECTOR);
      if (loopButton && loopButton.ariaLabel.includes(LOOP_BUTTON_ON_TEXT)) {
        console.log('處理程序: [2/4] 點擊關閉循環播放。');
        loopButton.click();
      } else {
        console.log('處理程序: [2/4] 循環播放已是關閉狀態。');
      }

      // 步驟 3: 為這個影片啟動專屬的進度監視器。
      const progressMonitor = setInterval(() => {
        if (!isEnabled || !document.contains(video)) {
          clearInterval(progressMonitor);
          return;
        }
        if (isNaN(video.duration) || video.duration < 1) return;

        const timeLeft = video.duration - video.currentTime;
        console.log(`監控中: 剩餘 ${timeLeft.toFixed(2)} 秒`);

        if (timeLeft < 0.5) {
          console.log('%c 行動: [3/4] 時間到！準備滑動。', 'background: #28a745; color: white;');
          clearInterval(progressMonitor); // 任務完成，停止監視此影片。

          const nextButton = document.querySelector(NEXT_BUTTON_SELECTOR);
          if (nextButton) {
            console.log('行動: [4/4] 成功點擊「下一個」。');
            nextButton.click();
          }
        }
      }, 500);

    }, 150); // <--- 這 150 毫秒的「耐心等待」是成功的關鍵。
  }
  
  // --- 控制函數 ---
  function start() {
    if (isEnabled) return;
    isEnabled = true;
    currentVideoSrc = null; // 重設狀態
    console.log('%c 控制: 收到「啟動」指令。', 'color: blue; font-weight: bold;');
    requestAnimationFrame(mainLoop);
  }

  function stop() {
    isEnabled = false;
    console.log('%c 控制: 收到「停止」指令。', 'color: red; font-weight: bold;');
  }

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