import EventEmitter from 'eventemitter3';

import Message from './Message.js';

let idCounter = 0;
let postedMessages = new Map();

export default class MessageHandler extends EventEmitter {
  constructor() {
    super();
    this.readyToPost = false;
    this.readyToHandle = false;
    this.windowID = null;
    this.messageSource = null;
    this.pendingMessages = [];
    this.unhandledMessages = [];
  }

  _postMessageToSource(message) {
    this.messageSource.postMessage(JSON.stringify(message), '*');
  }

  init(messageSource) {
    this.readyToPost = true;
    this.windowID = Date.now();
    this.messageSource = messageSource;
    this._postMessageToSource({
      type: 'admin.connect',
      windowID: this.windowID,
    });

    window.addEventListener('unload', () => {
      this._postMessageToSource({
        type: 'admin.disconnect',
        windowID: this.windowID,
      });
    });

    this.postPendingMessages();
  }

  postMessage(type, message) {
    let id = ++idCounter;
    let toPost = {
      type,
      message,
      messageID: id,
      windowID: this.windowID,
    };
    let theMessage = new Message(id, toPost);
    if (this.readyToPost) {
      this._postMessageToSource(toPost);
      postedMessages.set(id, theMessage);
    } else {
      this.pendingMessages.push(theMessage);
    }
    return theMessage;
  }

  postPendingMessages() {
    for (let message of this.pendingMessages) {
      message.data.windowID = this.windowID;
      this._postMessageToSource(message.data);
      postedMessages.set(message.id, message);
    }
  }

  handlePendingMessages() {
    this.readyToHandle = true;
    for (let i = 0; i < this.unhandledMessages.length; i++) {
      this.handleMessage(this.unhandledMessages[i]);
    }
    this.unhandledMessages = [];
  }

  handleMessage(data) {
    if (!this.readyToHandle) {
      this.unhandledMessages.push(data);
      return;
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
    } else {
      // no status is considered a success
      message._resolve(data);
      postedMessages.delete(data.messageID);
    }
  }
}
