/**
  Inintial checks & settings
========================== **/
import { initBrowserChecks, applyInitialSettings } from './utils/utils';

initBrowserChecks();
applyInitialSettings();

/**
  Components
========== **/
import initDrawer from './components/Drawer';
import initDropdown from './components/Dropdown';
import accordion from './components/accordion';

new initDrawer();
new initDropdown();

const mqMobileAccordion = window.matchMedia('(max-width: 959.98px)');
accordion();
mqMobileAccordion.addEventListener('change', accordion);
