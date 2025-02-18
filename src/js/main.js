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

new initDrawer();
new initDropdown();
