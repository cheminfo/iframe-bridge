'use strict';

const Debug = require('debug');
if (window.DebugNS) {
    Debug.enable(window.DebugNS);
}

const MessageHandler = require('./MessageHandler');
const messageHandlers = new Map();

window.addEventListener('message', function (event) {
    let data = event.data;
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
    } else {
        messageHandlers.get(data.windowID).handleMessage(data);
    }
});

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

exports.registerHandler = function (type, callback) {
    MessageHandler.registerHandler(type, callback);
};
