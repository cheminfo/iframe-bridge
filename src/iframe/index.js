'use strict';

const Debug = require('debug');
window.Debug = Debug;

const debug = Debug('iframe-bridge:iframe');
const MessageHandler = require('./MessageHandler');

let messageHandler = new MessageHandler();

let started = false;
exports.start = function () {
    if (started) {
        return debug('already started listening');
    }
    debug('start listening');
    started = true;
    messageHandler.init(window.parent);
    window.addEventListener('message', function (event) {
        let data = event.data;
        debug('message received', data);
        messageHandler.handleMessage(data);
    });
};

exports.postMessage = function (type, message) {
    return messageHandler.postMessage(type, message);
};

exports.onMessage = function (cb) {
    messageHandler.on('message', cb);
};
