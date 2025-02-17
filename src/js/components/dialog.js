import BaseComponent from './BaseComponent';
import { createOverlay } from '../utils/utils';

const dialogSelector = '[data-dialog]';

class Dialog extends BaseComponent {
  stateClasses = {
    isVisible: 'is-visible',
    isClosing: 'close-dialog-animation',
  };

  stateAttributes = {
    dataModal: 'data-modal',
    dataDialogStack: 'data-dialog-stack',
  };

  static openModals = [];
  static stackable = true;
  static overlay = null;
  static immediateClose = false;

  constructor(rootElement) {
    super();
    this.rootElement = rootElement;
    this.dialogName = this.rootElement.dataset.dialog;
    this.isModal = this.rootElement.hasAttribute(this.stateAttributes.dataModal);
    this.openButtons = document.querySelectorAll(`[data-dialog-open="${this.dialogName}"]`);
    this.closeButtons = document.querySelectorAll(`[data-dialog-close="${this.dialogName}"]`);
    this.state = this.getProxyState({ isOpen: false });

    this.isModal && !Dialog.stackable && this.createOverlay();
    this.bindEvents();
  }

  updateUI() {
    const { isOpen } = this.state;
    const { isVisible } = this.stateClasses;

    if (isOpen) {
      if (!this.isModal) return this.rootElement.show();

      this.rootElement.showModal();
      !Dialog.openModals.includes(this) && Dialog.openModals.push(this);

      if (Dialog.stackable) {
        this.rootElement.setAttribute(this.stateAttributes.dataDialogStack, Dialog.openModals.length);
      } else {
        Dialog.overlay.classList.add(isVisible);
        Dialog.openModals.length === 2 && Dialog.openModals[0].close();
      }

      // Remove initial focus from the first interactive element inside the dialog
      this.rootElement.focus();
    } else {
      if (!this.isModal) return this.rootElement.close();

      !Dialog.immediateClose && this.rootElement.close();
      Dialog.stackable && this.rootElement.removeAttribute(this.stateAttributes.dataDialogStack);
      Dialog.openModals = Dialog.openModals.filter((dialog) => dialog !== this);
    }
  }

  open() {
    this.state.isOpen = true;
  }

  close() {
    this.startClosingAnimation();
  }

  startClosingAnimation() {
    this.rootElement.classList.add(this.stateClasses.isClosing);
    Dialog.hideOverlay();
    this.rootElement.addEventListener('animationend', this.animationEndHandler, { once: true });
  }

  animationEndHandler = () => {
    this.completeClosingAnimation();
  };

  completeClosingAnimation() {
    this.state.isOpen = false;
    this.rootElement.classList.remove(this.stateClasses.isClosing);
  }

  handleImmediateClose() {
    if (!this.isModal) return;
    Dialog.immediateClose = true;
    if (Dialog.stackable) {
      Dialog.openModals[Dialog.openModals.length - 1].close();
    } else {
      this.rootElement.close();
      Dialog.hideOverlay();
    }
    this.state.isOpen = false;
    this.rootElement.classList.remove(this.stateClasses.isClosing);
    this.rootElement.removeEventListener('animationend', this.animationEndHandler);
    Dialog.immediateClose = false;
  }

  createOverlay() {
    if (!Dialog.overlay) {
      Dialog.overlay = createOverlay('dialog-overlay');
    }
  }

  onOpenButtonClick = () => {
    this.open();
  };

  onCloseButtonClick = () => {
    this.close();
  };

  static closeAll() {
    Dialog.openModals.forEach((dialog) => dialog.close());
  }

  static hideOverlay() {
    if (!Dialog.stackable && Dialog.openModals.length === 1) {
      Dialog.overlay.classList.remove('is-visible');
    }
  }

  static handleEscapeKey(e) {
    if (e.key === 'Escape' && Dialog.openModals.length > 0) {
      if (Dialog.stackable) {
        return Dialog.openModals[Dialog.openModals.length - 1].handleImmediateClose();
      }
      // Force close all dialogs despite current animation state
      while (Dialog.openModals.length > 0) {
        Dialog.openModals[Dialog.openModals.length - 1].handleImmediateClose();
      }
    }
  }

  bindEvents() {
    this.openButtons.forEach((openButton) => {
      openButton.addEventListener('click', this.onOpenButtonClick);
    });
    this.closeButtons.forEach((closeButton) => {
      closeButton.addEventListener('click', this.onCloseButtonClick);
    });

    // Overlay lays beneath transparent .dialog-container::backdrop
    this.rootElement.addEventListener('click', (e) => {
      e.target === this.rootElement && this.close();
    });
  }
}

export default class initDialog {
  constructor() {
    this.init();
  }

  init() {
    const dialogs = document.querySelectorAll(dialogSelector);
    dialogs.forEach((dialog) => new Dialog(dialog));

    document.addEventListener('keydown', Dialog.handleEscapeKey);
  }
}
