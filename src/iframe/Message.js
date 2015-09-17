'use strict';

const EventEmitter = require('events').EventEmitter;
const promise = Symbol();

class Message extends EventEmitter {
    constructor(id, data) {
        super();
        this.id = id;
        this.data = data;
        this[promise] = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    then(onResolve, onReject) {
        return this[promise].then(onResolve, onReject);
    }

    catch(onReject) {
        return this[promise].catch(onReject);
    }
}

module.exports = Message;
