"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var maths_1 = require("./maths");
//Fisher-Yates shuffle algorithm for javascript
function shuffle(arr) {
    var c = arr.length;
    while (0 !== c) { // while there remain elements to shuffle...
        var r = maths_1.randBetween(0, c); // pick a remaining element...
        c--;
        arr = swap(arr, r, c);
    }
    return clean(arr);
}
exports.shuffle = shuffle;
//swaps two elements in an array
function swap(arr, i, j) {
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
    return arr;
}
exports.swap = swap;
//removes null or undefined values from an array
function clean(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === null || arr[i] === undefined) {
            arr.splice(i, 1);
            i--;
        }
    }
    return arr;
}
exports.clean = clean;
function randomElement(arr) {
    var index = maths_1.randBetween(0, arr.length - 1);
    return arr[index];
}
exports.randomElement = randomElement;
