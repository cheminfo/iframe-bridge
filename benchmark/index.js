'use strict';

console.log('main js');

var iframe = document.createElement('iframe');
document.body.appendChild(iframe);
iframe.src = 'iframe.html';

var array = getBigArray();

setTimeout(function () {
    iframe.contentWindow.postMessage({
        time: Date.now(),
        type: 'object',
        data: array
    }, '*');

    // iframe.contentWindow.postMessage({
    //     time: Date.now(),
    //     type: 'string',
    //     data: JSON.stringify(array)
    // }, '*');
}, 1000);

function getBigArray() {
    var SIZE = 5000;
    var bigarray = new Array(SIZE);
    for (var i = 0; i < SIZE; i++) {
        bigarray[i] = getBigObject();
    }
    return bigarray;
}

function getBigObject() {
    return {
        x: getRandomObject(),
        y: getRandomObject(),
        z: getRandomObject(),
        t: {
            a: [getRandomObject(), getRandomObject(), getRandomObject()],
            b: [getRandomObject(), getRandomObject(), getRandomObject(), getRandomObject(), getRandomObject()]
        }
    }
}

function getRandomObject() {
    var obj = {};
    obj.a = Math.random();
    obj.b = Math.random();
    obj.c = Math.random();
    obj.d = Math.random();
    obj.e = Math.random();
    return obj;
}
