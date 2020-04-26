const { Tray, Menu, nativeImage, nativeTheme } = require('electron');
const path = require('path');

/**
 * @namespace AppController
 * @typedef {('dark' | 'light')} Theme
 */
class AppController {
  /** @return {Theme} */
  static getCurrentThemeName() {
    return nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
  }

  /**
   * @param {Theme} theme
   * @return {Theme}
   */
  static invertThemeByName(theme) {
    switch (theme) {
      case 'dark':
        return 'light';
      case 'light':
        return 'dark';
    }
  }

  /** @param {(BrowserWindowController)} browserWindowController */
  constructor(browserWindowController) {
    this.isActive = true;
    this.theme = AppController.getCurrentThemeName();
    this.tray = new Tray(nativeImage.createEmpty());

    this.handleActivateMenuItemClick = this.handleActivateMenuItemClick.bind(this);
    this.handleQuitClick = this.handleQuitClick.bind(this);
    this.handleThemeChange = this.handleThemeChange.bind(this);

    this.tray.setContextMenu(Menu.buildFromTemplate([
      {
        type: 'checkbox',
        label: 'Activate',
        click: this.handleActivateMenuItemClick,
        checked: this.isActive,
      },
      {
        label: 'Quit',
        click: this.handleQuitClick,
      },
    ]));

    this.browserWindowController = browserWindowController;

    this.updateState();
  }

  start() {
    this.bindEventListeners();
  }

  stop() {
    this.unbindEventListeners();

    if (!this.tray.isDestroyed()) {
      this.tray.destroy();
    }

    this.browserWindowController.destroy();
  }

  /**
   * @param {function} callback
   * @return {function}
   */
  onQuit(callback) {
    this.quitHandler = callback;

    return () => {
      this.quitHandler = () => {};
    };
  }

  /**
   * @type {boolean}
   * @private
   */
  isActive;
  /**
   * @type {Theme}
   * @private
   */
  theme;
  /**
   * @type {(Electron.Tray)}
   * @private
   */
  tray;
  /**
   * @type {(BrowserWindowController)}
   * @private
   */
  browserWindowController;
  /**
   * @type {function}
   * @private
   */
  quitHandler = () => {};

  /** @private */
  bindEventListeners() {
    nativeTheme.on('updated', this.handleThemeChange);
  }

  /** @private */
  unbindEventListeners() {
    nativeTheme.off('updated', this.handleThemeChange);
  }

  /** @private */
  setTrayImage() {
    this.tray.setImage(this.getImagePath(AppController.invertThemeByName(this.theme)));
    this.tray.setPressedImage(this.getImagePath(this.theme));
  }

  /** @private */
  setTrayTooltip() {
    if (this.isActive) {
      this.tray.setToolTip('Keypress shower is turned on');
    } else {
      this.tray.setToolTip('Keypress shower is turned off');
    }
  }

  /**
   * @param {Theme} theme
   * @return string
   * @private
   */
  getImagePath(theme) {
    const pathToImage = this.isActive ? `assets/${theme}/icon-active.png` : `assets/${theme}/icon.png`;
    return nativeImage.createFromPath(path.join(__dirname, `../${pathToImage}`));
  }

  updateState() {
    this.setTrayImage();
    this.setTrayTooltip();

    if (this.isActive) {
      this.browserWindowController.create();
    } else {
      this.browserWindowController.destroy();
    }
  }

  /**
   * @param {Electron.MenuItem} menuItem
   * @private
   */
  handleActivateMenuItemClick(menuItem) {
    this.isActive = menuItem.checked;
    this.updateState();
  }

  /** @private */
  handleQuitClick() {
    this.quitHandler();
  }

  /** @private */
  handleThemeChange() {
    this.theme = AppController.getCurrentThemeName();
    this.setTrayImage();
  }
}

module.exports.AppController = AppController;
