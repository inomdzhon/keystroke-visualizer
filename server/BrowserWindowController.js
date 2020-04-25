const { screen, BrowserWindow } = require('electron');
const ioHook = require('iohook');

/**
 * @namespace BrowserWindowController
 */
class BrowserWindowController {
  constructor(viewUrl) {
    this.viewUrl = viewUrl;
    this.handleKeyEvent = this.handleKeyEvent.bind(this);
  }

  create() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    this.instance = new BrowserWindow({
      width,
      height,
      frame: false,
      transparent: true,
      // backgroundColor: 'rgba(0, 0, 0, 0)',
      // skipTaskbar: true,
      hasShadow: false,
      webPreferences: {
        nodeIntegration: true
      }
    });

    // 'screen-saver' move our window to the higher level.
    this.instance.setAlwaysOnTop(true, 'screen-saver');

    this.instance.setIgnoreMouseEvents(true);

    this.instance.loadFile(this.viewUrl);

    this.bindKeyEventsListeners();
  }

  destroy() {
    if (this.instance) {
      if (!this.instance.isDestroyed()) {
        this.instance.destroy();
      }

      this.instance = null;
    }

    this.unbindKeyEventsListeners();
  }

  /**
   * @type {(Electron.BrowserWindow | null)}
   * @private
   */
  instance = null;

  /**
   * @type {string}
   * @private
   */
  viewUrl = '';

  /** @private */
  bindKeyEventsListeners() {
    ioHook.start();
    ioHook.on('keydown', this.handleKeyEvent);
    ioHook.on('keyup', this.handleKeyEvent);
  }

  /** @private */
  unbindKeyEventsListeners() {
    ioHook.stop();
    ioHook.off('keydown', this.handleKeyEvent);
    ioHook.off('keyup', this.handleKeyEvent);
  }

  /** @private */
  handleKeyEvent(event) {
    if (!this.instance || this.instance.isDestroyed()) {
      return;
    }

    try {
      this.instance.webContents.send(event.type, event);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports.BrowserWindowController = BrowserWindowController;
