"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function setToZero(input, param) {
    var output = {};
    for (var _i = 0, _a = Object.keys(input); _i < _a.length; _i++) {
        var k = _a[_i];
        if (!input[k])
            continue;
        output[k] = param;
    }
    return output;
}
exports.setToZero = setToZero;
function filterKeys(input, func) {
    var output = [];
    for (var _i = 0, _a = Object.entries(input); _i < _a.length; _i++) {
        var _b = _a[_i], k = _b[0], v = _b[1];
        if (!func(v))
            continue;
        output.push(k);
    }
    return output;
}
exports.filterKeys = filterKeys;
function mapToLengths(input) {
    var output = {};
    for (var _i = 0, _a = Object.keys(input); _i < _a.length; _i++) {
        var k = _a[_i];
        output[k] = input[k].length;
    }
    return output;
}
exports.mapToLengths = mapToLengths;
// this method implemented https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
function flatten(arr, depth) {
    if (depth === void 0) { depth = 1; }
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat((Array.isArray(toFlatten) && (depth - 1)) ? flatten(toFlatten, depth - 1) : toFlatten);
    }, []);
}
exports.flatten = flatten;
