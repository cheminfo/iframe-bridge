'use strict';

const debug = require('debug')('iframe-bridge:main');

const MessageHandler = require('./MessageHandler');
const messageHandlers = new Map();

// Support server-side-rendering
if (typeof window !== 'undefined') {
  window.addEventListener('message', function(event) {
    try {
      let data = JSON.parse(event.data);
      if (!data.windowID) {
        return debug('received a message without windowID', data);
      }
      if (!data.type) {
        return debug('received a message without type', data);
      }
      let handler;
      if (!messageHandlers.has(data.windowID)) {
        if (data.type === 'admin.connect') {
          handler = new MessageHandler(event.source);
          messageHandlers.set(data.windowID, handler);
        } else {
          return debug('received message before handler creation', data);
        }
      } else if (data.type === 'admin.disconnect') {
        messageHandlers.delete(data.windowID);
        return;
      }
      messageHandlers.get(data.windowID).handleMessage(data);
    } catch (e) {}
  });
}

exports.postAll = function(type, message) {
  messageHandlers.forEach(function(messageHandler, windowID) {
    var data = {
      windowID,
      message,
      type
    };
    messageHandler.postMessage(data);
  });
};

exports.postMessage = function(type, message, windowId) {
  let messageHandler = messageHandlers.get(windowId);
  if (messageHandler) {
    messageHandler.postMessage({
      windowId,
      message,
      type
    });
  }
};

exports.registerHandler = function(type, callback) {
  MessageHandler.registerHandler(type, callback);
};
