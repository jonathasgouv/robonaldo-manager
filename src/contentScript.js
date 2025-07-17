// Create script tag for ./pageScript.js and appends to head
const s = document.createElement('script');
s.type = 'text/javascript';
s.src = chrome.runtime.getURL('src/pageScript.js');
s.onload = function () {
  this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(s);
