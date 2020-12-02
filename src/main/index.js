'use strict';

const MessageHandler = require('./MessageHandler');
const messageHandlers = new Map();

// Support server-side-rendering
if (typeof window !== 'undefined') {
  window.addEventListener('message', function (event) {
    try {
      let data = JSON.parse(event.data);
      if (!data.windowID || !data.type) {
        return;
      }
      let handler;
      if (!messageHandlers.has(data.windowID)) {
        if (data.type === 'admin.connect') {
          handler = new MessageHandler(event.source);
          messageHandlers.set(data.windowID, handler);
        } else {
          return;
        }
      } else if (data.type === 'admin.disconnect') {
        messageHandlers.delete(data.windowID);
        return;
      }
      messageHandlers.get(data.windowID).handleMessage(data);
    } catch (e) {}
  });
}

exports.postAll = function (type, message) {
  messageHandlers.forEach(function (messageHandler, windowID) {
    const data = {
      windowID,
      message,
      type,
    };
    messageHandler.postMessage(data);
  });
};

exports.postMessage = function (type, message, windowId) {
  let messageHandler = messageHandlers.get(windowId);
  if (messageHandler) {
    messageHandler.postMessage({
      windowId,
      message,
      type,
    });
  }
};

exports.registerHandler = function (type, callback) {
  MessageHandler.registerHandler(type, callback);
};
