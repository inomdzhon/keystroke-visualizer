/*
 * TODO
 *  - Hide App in Mission Control
 */

// libs
const { app } = require('electron');

// modules
const { AppController } = require('./server/AppController.js');
const { BrowserWindowController } = require('./server/BrowserWindowController.js');

let appController = null;

function handleAppReady() {
  appController = new AppController(new BrowserWindowController('./client/index.html'));

  appController.onQuit(() => {
    appController.stop();
    app.exit(0);
  });

  appController.start();
}

function handleAppWindowAllClosed(event) {
  // Hook for prevent app quit.
  event.preventDefault();
}

// app.dock.hide();
app.once('ready', handleAppReady);
app.on('window-all-closed', handleAppWindowAllClosed);
