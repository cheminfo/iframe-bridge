import MessageHandler from './MessageHandler.js';

const messageHandler = new MessageHandler();

if (typeof window !== 'undefined' && window.parent !== window) {
  messageHandler.init(window.parent);
  window.addEventListener('message', function onMessage(event) {
    try {
      const data = JSON.parse(event.data);
      messageHandler.handleMessage(data);
    } catch {
      // ignore
    }
  });
}

export function postMessage(type, message) {
  return messageHandler.postMessage(type, message);
}

export function onMessage(cb) {
  messageHandler.on('message', cb);
}

export function ready() {
  messageHandler.handlePendingMessages();
}
