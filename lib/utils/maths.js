"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function randBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.randBetween = randBetween;
//Fisher-Yates shuffle algorithm for javascript
function shuffle(arr) {
    var c = arr.length;
    while (0 !== c) { // while there remain elements to shuffle...
        var r = randBetween(0, c); // pick a remaining element...
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
function combine(arr, r) {
    var results = [];
    var n = arr.length;
    function recursive(need, s, res) {
        if (need === 0) {
            var b = res.slice(0);
            results.push(b);
            return;
        }
        for (var i = s; i < n; i++) {
            var b = res.slice(0);
            b.push(arr[i]);
            recursive(need - 1, i + 1, b);
        }
    }
    recursive(r, 0, []);
    return results;
}
exports.combine = combine;
function randomPermutation(arr, count, exclude) {
    if (count === void 0) { count = 1; }
    if (exclude === void 0) { exclude = []; }
    var _loop_1 = function (v) {
        var index = arr.findIndex(function (element) { return element === v; });
        if (index === -1)
            return "continue";
        arr.splice(index, 1);
    };
    for (var _i = 0, exclude_1 = exclude; _i < exclude_1.length; _i++) {
        var v = exclude_1[_i];
        _loop_1(v);
    }
    var output = [];
    for (var i = 0; i < count; i++) {
        var index = randBetween(0, arr.length - 1);
        output.push(arr[index]);
        arr.splice(index, 1);
    }
    return output;
}
exports.randomPermutation = randomPermutation;
