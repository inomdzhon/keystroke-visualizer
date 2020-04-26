const { ipcRenderer } = require('electron');
const { humanizedKeyCodes } = require('./constants.js');

ipcRenderer.on('keydown', (event, message) => {
  computeKeyPressed(message.type, message.keycode);
});

ipcRenderer.on('keyup', (event, message) => {
  computeKeyPressed(message.type, message.keycode);
});

const pressedKeys = new Map();

function computeKeyPressed(type, keyCode) {
  switch (type) {
    case 'keydown':
      pressedKeys.set(keyCode, humanizedKeyCodes.get(keyCode));
      break;
    case 'keyup':
      pressedKeys.delete(keyCode);
      break;
  }

  renderKeysPressed();
}

const elemRoot = document.getElementById('root');
const elemContent = elemRoot.querySelector('.js-content');

function renderKeysPressed() {
  const result = [];

  pressedKeys.forEach((value) => {
    result.push(`<div class="keypress__item"><div class="keypress-item">${value}</div></div>`);
  });

  elemContent.innerHTML = result.join(`<div class="keypress__item keypress__item_type_plus"><div class="keypress-item-plus">+</div></div>`);
}
