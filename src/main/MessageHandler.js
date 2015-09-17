'use strict';

const debug = require('debug')('chrome-app');

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
        switch (type) {
            case 'admin':
                debug('admin message');
                break;
            case 'test':
                data.status = 'warn';
                this.postMessage(data);
                data.message *= 100;
                this.postMessage(data);
                setTimeout(() => {
                    data.status = 'success';
                    data.message = 'hello';
                    this.postMessage(data);
                }, 300);
                break;
            default:
                if (registeredHandlers.has(type)) {
                    registeredHandlers.get(type).call(this, data, types);
                } else {
                    let message = 'no handler registered for type ' + type;
                    debug(message);
                    data.status = 'error';
                    data.message = message;
                    this.postMessage(data);
                }
                break;
        }
    }
}

MessageHandler.registerHandler = function (type, callback) {
    registeredHandlers.set(type, callback);
};

module.exports = MessageHandler;
