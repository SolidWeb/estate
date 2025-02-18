/**
  Browser utilities
================= **/

/* Check if JavaScript is enabled */
function checkJS() {
  document.documentElement.classList.remove('no-js');
}

/* Detect the browser */
function detectBrowser() {
  const test = (regexp) => regexp.test(navigator.userAgent);
  const browser = (() => {
    switch (true) {
      case test(/edg/i):
        return 'edge';
      case test(/trident/i):
        return 'ie';
      case test(/firefox|fxios/i):
        return 'firefox';
      case test(/opr\//i):
        return 'opera';
      case test(/chrome|chromium|crios/i):
        return 'chrome';
      case test(/safari/i):
        return 'safari';
      default:
        return 'unknown';
    }
  })();

  document.documentElement.classList.add(`ua-${browser}`);
}

/* Check if the browser supports .webp-images */
function checkWebp() {
  const webp = new Image();
  webp.src =
    'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';

  webp.onload = webp.onerror = () => {
    const isWebpSupported = webp.height === 2;
    if (!isWebpSupported) document.documentElement.classList.remove('webp');
  };
}

export function initBrowserChecks() {
  checkJS();
  detectBrowser();
  checkWebp();
}

/**
  DOM utilities
============= **/

/* Disable a[href="#!"] links */
function disableEmptyLinks() {
  document.addEventListener('click', (e) => {
    if (e.target.matches('a[href="#!"]')) {
      e.preventDefault();
    }
  });
}

/* Disable CSS transitions during window resize */
function disableTransitionsOnResize(className = 'no-transitions', delay = 300) {
  const handleResize = debounce(() => {
    document.body.classList.remove(className);
  }, delay);

  window.addEventListener('resize', () => {
    document.body.classList.add(className);
    handleResize();
  });
}

export function applyInitialSettings() {
  disableEmptyLinks();
  disableTransitionsOnResize();
}

/**
  General utilities
================= **/

/* Debounce a function to limit its execution rate */
export function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
  UI utilities
============ **/

/* Create an overlay element */
export function createOverlay(className, parent = document.body) {
  const overlay = document.createElement('div');
  overlay.classList.add(className, 'overlay');
  parent.appendChild(overlay);
  return overlay;
}

/* Lock scrolling */
export function lockScrolling(boolean) {
  let scrollY = window.scrollY;

  document.body.classList.toggle('is-locked', boolean);
  document.documentElement.classList.toggle(
    'has-scrollbar',
    document.body.scrollHeight > window.innerHeight && boolean,
  );

  if (boolean) {
    document.body.style.top = `-${scrollY}px`;
  } else {
    scrollY = Math.abs(parseInt(document.body.style.top || '0', 10));
    document.body.style.top = '';
    window.scrollTo({ top: scrollY, left: 0, behavior: 'instant' });
  }
}
