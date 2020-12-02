'use strict';

const MessageHandler = require('./MessageHandler');

const messageHandler = new MessageHandler();

if (typeof window !== 'undefined') {
  messageHandler.init(window.parent);
  window.addEventListener('message', function (event) {
    try {
      const data = JSON.parse(event.data);
      messageHandler.handleMessage(data);
    } catch (e) {}
  });
}

exports.postMessage = function postMessage(type, message) {
  return messageHandler.postMessage(type, message);
};

exports.onMessage = function onMessage(cb) {
  messageHandler.on('message', cb);
};

exports.ready = function ready() {
  messageHandler.handlePendingMessages();
};
