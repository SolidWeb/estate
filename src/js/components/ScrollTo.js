const buttonSelector = '[data-scroll-to]';

class ScrollTo {
  constructor(button) {
    this.button = button;
    this.bindEvents();
  }

  onButtonClick = () => {
    const target = this.button.dataset.scrollTo || 'top';
    const offset = parseInt(this.button.dataset.scrollOffset) || 0;

    switch (target) {
      // Scroll to the top of the page
      case 'top':
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
        break;
      // Scroll to the bottom of the page
      case 'bottom':
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth',
        });
        break;
      // Scroll to the target element using the provided selector
      default:
        const targetElement = document.querySelector(target);
        if (!targetElement) {
          console.warn(`Element with selector "${target}" not found.`);
          return;
        }
        const top = targetElement.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
          top,
          behavior: 'smooth',
        });
    }
  };

  bindEvents() {
    this.button.addEventListener('click', this.onButtonClick);
  }
}

export default class initScrollTo {
  constructor() {
    this.init();
  }

  init() {
    const buttons = document.querySelectorAll(buttonSelector);
    buttons.forEach((button) => new ScrollTo(button));
  }
}
