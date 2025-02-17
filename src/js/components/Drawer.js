import BaseComponent from './BaseComponent';
import { createOverlay, lockScrolling } from '../utils/utils';

const drawerSelector = '[data-drawer]';

class Drawer extends BaseComponent {
  stateClasses = {
    isActive: 'is-active',
    isVisible: 'is-visible',
  };

  stateAttributes = {
    ariaExpanded: 'aria-expanded',
  };

  static openDrawers = [];
  static resizeListener = false;
  static overlay = null;

  constructor(rootElement) {
    super();
    this.rootElement = rootElement;
    this.drawerName = this.rootElement.dataset.drawer;
    this.toggleButtons = document.querySelectorAll(`[data-drawer-toggle="${this.drawerName}"]`);
    this.closeButtons = document.querySelectorAll(`[data-drawer-close="${this.drawerName}"]`);
    this.state = this.getProxyState({ isOpen: false });

    this.createOverlay();
    this.bindEvents();
  }

  updateUI() {
    const { isOpen } = this.state;
    const { isActive, isVisible } = this.stateClasses;
    const { ariaExpanded } = this.stateAttributes;

    this.toggleButtons.forEach((toggleButton) => {
      toggleButton.setAttribute(ariaExpanded, isOpen);
    });

    if (isOpen) {
      this.rootElement.classList.add(isActive);
      !Drawer.openDrawers.includes(this) && Drawer.openDrawers.push(this);
    } else {
      this.rootElement.classList.remove(isActive);
      Drawer.openDrawers = Drawer.openDrawers.filter((drawer) => drawer !== this);
    }

    lockScrolling(Drawer.openDrawers.length === 1);

    if (Drawer.openDrawers.length === 0) {
      Drawer.overlay.classList.remove(isVisible);
      this.removeResizeListener();
    } else {
      Drawer.overlay.classList.add(isVisible);
      this.addResizeListener();
    }
  }

  toggle() {
    this.state.isOpen = !this.state.isOpen;
  }

  close() {
    this.state.isOpen = false;
  }

  createOverlay() {
    if (!Drawer.overlay) {
      Drawer.overlay = createOverlay('drawer-overlay');
    }
  }

  addResizeListener() {
    if (!Drawer.resizeListener) {
      window.addEventListener('resize', Drawer.closeAll);
      Drawer.resizeListener = true;
    }
  }

  removeResizeListener() {
    if (Drawer.resizeListener) {
      window.removeEventListener('resize', Drawer.closeAll);
      Drawer.resizeListener = false;
    }
  }

  onToggleButtonClick = () => {
    this.toggle();
  };

  onCloseButtonClick = () => {
    this.close();
  };

  static closeAll() {
    Drawer.openDrawers.forEach((drawer) => drawer.close());
  }

  bindEvents() {
    this.toggleButtons.forEach((toggleButton) => {
      toggleButton.addEventListener('click', this.onToggleButtonClick);
    });
    this.closeButtons.forEach((closeButton) => {
      closeButton.addEventListener('click', this.onCloseButtonClick);
    });
    Drawer.overlay.addEventListener('click', Drawer.closeAll);
  }
}

export default class initDrawer {
  constructor() {
    this.init();
  }

  init() {
    const drawers = document.querySelectorAll(drawerSelector);
    drawers.forEach((drawer) => new Drawer(drawer));

    // Close all drawers when clicking on an anchor link
    document.addEventListener('click', (e) => {
      if (e.target.matches(`${drawerSelector} a[href*="#"]:not([href="#!"]`)) {
        Drawer.closeAll();
      }
    });
  }
}
