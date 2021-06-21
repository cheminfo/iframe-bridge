import EventEmitter from 'eventemitter3';

const kPromise = Symbol('message.promise');

export default class Message extends EventEmitter {
  constructor(id, data) {
    super();
    this.id = id;
    this.data = data;
    this[kPromise] = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  then(onResolve, onReject) {
    return this[kPromise].then(onResolve, onReject);
  }

  catch(onReject) {
    return this[kPromise].catch(onReject);
  }
}
