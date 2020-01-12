var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
define(["require", "exports", "./is_test"], function (require, exports, is_test_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function negate(p) { return function (x) { return !p(x); }; }
    exports.negate = negate;
    function or(p, q) { return function (x) { return p(x) || q(x); }; }
    exports.or = or;
    function and(p, q) { return function (x) { return p(x) && q(x); }; }
    exports.and = and;
    function iterableBy(succ) {
        return function (init) {
            var cur;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cur = init;
                        _a.label = 1;
                    case 1:
                        if (!is_test_1.default.someValue(succ(cur))) return [3 /*break*/, 4];
                        return [4 /*yield*/, cur];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        cur = succ(cur);
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        };
    }
    exports.iterableBy = iterableBy;
    function iterator(xs) {
        return xs[Symbol.iterator]();
    }
    exports.iterator = iterator;
    function entries(obj) {
        if (is_test_1.default.someValue(Object.entries))
            return Object.entries(obj);
        else
            return Object.keys(obj).map(function (key) { return [key, obj[key]]; });
    }
    exports.entries = entries;
    function preetyShowList(xs, sep, last_sep) {
        if (sep === void 0) { sep = ", "; }
        if (last_sep === void 0) { last_sep = " and "; }
        var last = xs.length - 1;
        if (xs.length == 0 || xs.length == 1)
            return xs.join(sep);
        else
            return xs.slice(0, last).join(sep) + last_sep + xs[last];
    }
    exports.preetyShowList = preetyShowList;
    function showIfSome(show, item) {
        return is_test_1.default.someValue(item) ? show(item) : "";
    }
    exports.showIfSome = showIfSome;
    String.prototype.capitalize = function () {
        return showIfSomeLength(function (s) { return s[0].toUpperCase() + s.slice(1, s.length); }, this);
    };
    Object.prototype.getOrPut = function (key, init) {
        if (!is_test_1.default.someValue(this[key]))
            this[key] = init();
        return this[key];
    };
    function showIfSomeLength(show, item) {
        if (typeof item === "string")
            return is_test_1.default.someText(item) ? show(item) : "";
        else
            return is_test_1.default.notEmpty(item) ? show(item) : "";
    }
    exports.showIfSomeLength = showIfSomeLength;
    function makeScheduler(schedulePlace) {
        var scheduleQueues = {};
        return function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var scheduleQueue = scheduleQueues.getOrPut(name, Array);
            var found = schedulePlace[name];
            if (is_test_1.default.someValue(found)) {
                while (is_test_1.default.notEmpty(scheduleQueue))
                    found.apply(void 0, __spread(scheduleQueue.shift()));
                /*and then call*/ found.apply(void 0, __spread(args));
            }
            else
                scheduleQueue.push(args);
        }; //end
    }
    exports.makeScheduler = makeScheduler;
    function flatten(xss) {
        var e_1, _a;
        var flat = [];
        try {
            for (var xss_1 = __values(xss), xss_1_1 = xss_1.next(); !xss_1_1.done; xss_1_1 = xss_1.next()) {
                var xs = xss_1_1.value;
                flat.push.apply(flat, __spread(xs));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (xss_1_1 && !xss_1_1.done && (_a = xss_1.return)) _a.call(xss_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return flat;
    }
    exports.flatten = flatten;
    /** Preorder walk of dependency tree, circular dependencies is not allowed. */
    function deepDependencies(node, links) {
        var dependencies = __spread(links(node));
        if (is_test_1.default.empty(dependencies))
            return []; //base:no-dependency
        else
            return flatten(dependencies.map(function (eDep) { return deepDependencies(eDep, links).concat(eDep); }));
    }
    exports.deepDependencies = deepDependencies;
    function flatDependencies(root, links) {
        var addWithDepTodo = __spread(links(root)); //data:bfs-queue
        var dependencySet = new Set();
        while (is_test_1.default.notEmpty(addWithDepTodo)) {
            var someNode = addWithDepTodo.shift();
            if (dependencySet.has(someNode)) {
                continue; // skip circular deps like a-b
            }
            else {
                dependencySet.add(someNode);
                var itsDepencencies = links(someNode);
                addWithDepTodo.push.apply(addWithDepTodo, __spread(itsDepencencies));
            }
        }
        return __spread(dependencySet.values());
    }
    exports.flatDependencies = flatDependencies;
});
