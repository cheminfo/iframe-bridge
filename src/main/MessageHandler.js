'use strict';

const debug = require('debug')('iframe-bridge:MessageHandler');
const bridgeHandler = require('./bridgeHandler');

const registeredHandlers = new Map();

class MessageHandler {
    constructor(theWindow) {
        debug('creating message handler');
        this.window = theWindow;
    }

    postMessage(message) {
        this.window.postMessage(message, '*');
    }

    handleMessage(data) {
        debug('receive message', data);
        let types = data.type.split('.');
        let type = types.shift();
        if (registeredHandlers.has(type)) {
            registeredHandlers.get(type).call(this, data, types);
        } else {
            let message = 'no handler registered for type ' + type;
            debug(message);
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
