define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var someValue = function (x) { return x !== undefined && x !== null; };
    var someText = function (x) { return someValue(x) && x != ""; };
    var empty = function (xs) { return xs.length == 0; };
    var notEmpty = function (xs) { return xs.length != 0; };
    exports.default = {
        someValue: someValue,
        null: function (x) { return x === null; }, notNull: function (x) { return x !== null; },
        someText: someText,
        empty: empty, notEmpty: notEmpty
    };
});
