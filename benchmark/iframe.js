'use strict';

console.log('iframe js');

window.addEventListener('message', function (event) {
    var data = event.data;
    var array = data.data;
    if (data.type === 'string') {
        array = JSON.parse(array);
    }
    console.log(array.length);
    var time = Date.now();
    console.log(data.type + ': ' + (time - data.time));
});
