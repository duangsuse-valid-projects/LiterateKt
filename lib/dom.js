var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
define(["require", "exports", "./util"], function (require, exports, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.nextSiblings = util_1.iterableBy(function (e) { return e.nextElementSibling; });
    function assignElementAttribute(node, attributes) {
        var e_1, _a;
        try {
            for (var _b = __values(util_1.entries(attributes)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), name_1 = _d[0], value = _d[1];
                node.setAttribute(name_1, value.toString());
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    exports.assignElementAttribute = assignElementAttribute;
    /** Use document.body to refer whole DOM content */
    function waitsElement(e, op) {
        var isLoaded = function (rs) { return rs == "complete"; };
        if (e === document.body) {
            if (isLoaded(document.readyState))
                return op();
            else
                document.addEventListener("DOMContentLoaded", op);
        }
        else {
            e.addEventListener("load", op);
        }
    }
    exports.waitsElement = waitsElement;
    exports.schedule = util_1.makeScheduler(window);
    exports.treeInsert = {
        before: function (target, e) { return target.parentElement.insertBefore(e, target); }
    };
    exports.has = {
        cssClass: function (cssClass) {
            return function (e) { var _a, _b; return _b = (_a = e.classList) === null || _a === void 0 ? void 0 : _a.contains(cssClass), (_b !== null && _b !== void 0 ? _b : false); };
        },
        childByCSS: function (cssSelector) {
            return function (e) { return e.querySelector(cssSelector) != null; };
        },
        tagName: function (tagName) {
            return function (e) { return tagName.test(e.tagName); };
        },
        attribute: function (attributeName, attributePattern) {
            if (attributePattern === void 0) { attributePattern = /.*/; }
            return function (e) { return attributePattern.test(e.getAttribute(attributeName)); };
        }
    };
    function element(node_type, init) {
        var children = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            children[_i - 2] = arguments[_i];
        }
        var node = document.createElement(node_type);
        init(node);
        node.append.apply(node, __spread(children));
        return node;
    }
    exports.element = element;
    function configured() {
        var config = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            config[_i] = arguments[_i];
        }
        return function (e) {
            var e_2, _a;
            try {
                for (var config_1 = __values(config), config_1_1 = config_1.next(); !config_1_1.done; config_1_1 = config_1.next()) {
                    var cfg = config_1_1.value;
                    cfg(e);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (config_1_1 && !config_1_1.done && (_a = config_1.return)) _a.call(config_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        };
    }
    exports.configured = configured;
    var withDefaults = function (e) { };
    exports.withDefaults = withDefaults;
    var withClasses = function () {
        var cssClasses = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            cssClasses[_i] = arguments[_i];
        }
        return (function (e) {
            var _a;
            return (_a = e.classList).add.apply(_a, __spread(cssClasses));
        });
    };
    exports.withClasses = withClasses;
    var withAttributes = function (attribute) { return (function (e) { return assignElementAttribute(e, attribute); }); };
    exports.withAttributes = withAttributes;
    var withText = function (text) { return (function (e) { e.textContent = text; }); };
    exports.withText = withText;
    var withInnerHTML = function (htmlCode) { return (function (e) { e.innerHTML = htmlCode; }); };
    exports.withInnerHTML = withInnerHTML;
});
