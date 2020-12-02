'use strict';

const bridgeHandler = require('./bridgeHandler');

const registeredHandlers = new Map();

class MessageHandler {
  constructor(theWindow) {
    this.window = theWindow;
  }

  postMessage(message) {
    this.window.postMessage(JSON.stringify(message), '*');
  }

  handleMessage(data) {
    const types = data.type.split('.');
    const type = types.shift();
    if (registeredHandlers.has(type)) {
      registeredHandlers.get(type).call(this, data, types);
    } else {
      const message = 'no handler registered for type ' + type;
      data.status = 'error';
      data.message = message;
      this.postMessage(data);
    }
  }
}

MessageHandler.registerHandler = function (type, callback) {
  registeredHandlers.set(type, callback);
};

MessageHandler.registerHandler('bridge', bridgeHandler);

module.exports = MessageHandler;
