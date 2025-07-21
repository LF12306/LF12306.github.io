document.addEventListener('DOMContentLoaded', function() {
  // 确保 iframe 加载完成后调整高度
  const currencyIframe = document.querySelector('#currency-converter iframe');
  
  if (currencyIframe) {
    // 监听 iframe 加载完成事件
    currencyIframe.addEventListener('load', function() {
      try {
        // 尝试调整高度以适应内容
        const contentHeight = currencyIframe.contentWindow.document.body.scrollHeight;
        if (contentHeight > 0) {
          currencyIframe.style.height = `${contentHeight}px`;
        }
      } catch (e) {
        // 忽略跨域错误
        console.log('无法访问 iframe 内容，使用默认高度');
      }
    });
    
    // 解决 iOS 上 iframe 滚动问题
    if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
      currencyIframe.style.overflow = 'auto';
      currencyIframe.style.webkitOverflowScrolling = 'touch';
    }
  }
});