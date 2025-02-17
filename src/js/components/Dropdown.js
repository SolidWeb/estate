import BaseComponent from './BaseComponent';
import { debounce } from '../utils/utils';

const dropdownSelector = '[data-dropdown]';

class Dropdown extends BaseComponent {
  selectors = {
    button: '[data-dropdown-button]',
    container: '[data-dropdown-container]',
  };

  stateClasses = {
    isVisible: 'is-visible',
  };

  stateAttributes = {
    ariaExpanded: 'aria-expanded',
    dropdownHover: 'data-dropdown-hover',
  };

  static globalClickListener = false;
  static openDropdown = null;
  static hoverableMQ = window.matchMedia('(min-width: 960px)');
  static hoverSupport = Dropdown.evaluateHoverSupport();

  constructor(rootElement) {
    super();
    this.rootElement = rootElement;
    this.rootElement.dropdown = this;
    this.button = this.rootElement.querySelector(this.selectors.button);
    this.container = this.rootElement.querySelector(this.selectors.container);
    this.isHoverable = this.rootElement.hasAttribute(this.stateAttributes.dropdownHover);
    this.hoverListeners = null;
    this.state = this.getProxyState({ isOpen: false });

    this.bindEvents();
  }

  updateUI() {
    const { isOpen } = this.state;
    const { isVisible } = this.stateClasses;
    const { ariaExpanded } = this.stateAttributes;

    if (Dropdown.openDropdown && Dropdown.openDropdown !== this) {
      Dropdown.openDropdown.close();
    }

    this.button.setAttribute(ariaExpanded, isOpen);

    if (isOpen) {
      this.container.classList.add(isVisible);
      this.container.style.height = this.container.scrollHeight + 'px';
      Dropdown.openDropdown = this;
    } else {
      this.container.classList.remove(isVisible);
      this.container.style.height = null;
      Dropdown.openDropdown = null;
    }
  }

  toggle() {
    this.state.isOpen = !this.state.isOpen;
  }

  open() {
    this.state.isOpen = true;
  }

  close() {
    this.state.isOpen = false;
  }

  addHoverListeners() {
    this.rootElement.addEventListener('mouseenter', () => {
      Dropdown.hoverSupport && this.open();
    });
    this.rootElement.addEventListener('mouseleave', () => {
      Dropdown.hoverSupport && this.close();
    });
    this.hoverListeners = true;
  }

  static evaluateHoverSupport() {
    return (
      Dropdown.hoverableMQ.matches &&
      (window.matchMedia('(any-hover: hover)').matches || !('ontouchstart' in window || navigator.maxTouchPoints > 0))
    );
  }

  bindEvents() {
    if (this.isHoverable) {
      Dropdown.hoverSupport && this.addHoverListeners();

      this.button.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });

      return;
    }

    if (Dropdown.globalClickListener) return;

    document.addEventListener('click', (e) => {
      if (e.target.closest(this.selectors.button)) {
        const parent = e.target.closest(dropdownSelector);
        e.preventDefault();
        !parent.hasAttribute(this.stateAttributes.dropdownHover) && parent.dropdown.toggle();
        return;
      }
      if (Dropdown.openDropdown && !e.target.closest(this.selectors.container)) {
        Dropdown.openDropdown.close();
        Dropdown.openDropdown = null;
      }
    });

    Dropdown.globalClickListener = true;
  }
}

export default class initDropdown {
  constructor() {
    this.init();
  }

  init() {
    const dropdowns = document.querySelectorAll(dropdownSelector);
    dropdowns.forEach((dropdown) => new Dropdown(dropdown));

    const handleResize = debounce(() => {
      const currentHoverSupport = Dropdown.evaluateHoverSupport();

      if (Dropdown.hoverSupport !== currentHoverSupport) {
        Dropdown.hoverSupport = currentHoverSupport;

        dropdowns.forEach((dropdown) => {
          const instance = dropdown.dropdown;
          if (instance.isHoverable && !instance.hoverListeners) {
            Dropdown.hoverSupport && instance.addHoverListeners();
          }
        });
      }
    }, 300);

    window.addEventListener('resize', handleResize);
  }
}
