'use strict';

const Message = require('./Message');

const EventEmitter = require('events');

let idCounter = 0;
let postedMessages = new Map();

class MessageHandler extends EventEmitter {
    constructor() {
        super();
        this.readyToPost = false;
        this.readyToHandle = false;
        this.windowID = null;
        this.messageSource = null;
        this.pendingMessages = [];
        this.unhandledMessages = [];
    }

    init(messageSource) {
        this.readyToPost = true;
        this.windowID = Math.floor(window.performance.now());
        this.messageSource = messageSource;
        this.messageSource.postMessage({
            type: 'admin.connect',
            windowID: this.windowID
        }, '*');
        this.postPendingMessages();
    }

    postMessage(type, message) {
        let id = ++idCounter;
        let toPost = {
            type,
            message,
            messageID: id,
            windowID: this.windowID
        };
        let theMessage = new Message(id, toPost);
        if (this.readyToPost) {
            this.messageSource.postMessage(toPost, '*');
            postedMessages.set(id, theMessage);
        } else {
            this.pendingMessages.push(theMessage);
        }
        return theMessage;
    }

    postPendingMessages() {
        for (let message of this.pendingMessages) {
            message.data.windowID = this.windowID;
            this.messageSource.postMessage(message.data, '*');
            postedMessages.set(message.id, message);
        }
    }
    
    handlePendingMessages() {
        this.readyToHandle = true;
        for(let i=0; i<this.unhandledMessages.length; i++) {
            this.handleMessage(this.unhandledMessages[i]);
        }
        this.unhandledMessages = [];
    }

    handleMessage(data) {
        if(!this.readyToHandle) {
            this.unhandledMessages.push(data);
        }
        if (!postedMessages.has(data.messageID)) {
            return this.emit('message', data);
        }
        let message = postedMessages.get(data.messageID);
        if (data.status) {
            if (data.status === 'error') {
                message._reject(data);
                postedMessages.delete(data.messageID);
            } else if (data.status === 'success') {
                message._resolve(data);
                postedMessages.delete(data.messageID);
            } else {
                message.emit(data.status, data);
            }
        } else { // no status is considered a success
            message._resolve(data);
            postedMessages.delete(data.messageID);
        }
    }
}

module.exports = MessageHandler;
