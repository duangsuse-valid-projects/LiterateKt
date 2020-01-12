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
define(["require", "exports", "./lib/dom", "./lib/dom", "./lib/dom", "./lib/util", "./lib/util", "./lib/read", "./lib/util", "./lib/util", "./lib/is_test"], function (require, exports, dom_1, dom_2, dom_3, util_1, util_2, read_1, util_3, util_4, is_test_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function enable() {
        document.querySelectorAll("." + "literateBegin").forEach(enableCodeFilter);
    }
    exports.enable = enable;
    exports.literateKtConfig = {
        literateBegin: dom_2.has.cssClass("literateBegin"),
        literateEnd: dom_2.has.cssClass("literateEnd"),
        literateLanguage: 'kotlin',
        literateCodeFilter: function (lang) { return dom_2.has.cssClass("language-" + lang); },
        language: {
            kotlin: [dom_3.withAttributes,
                function (e) { return dom_1.schedule(literateKtMagics.KotlinPlaygroundGlobalId, e); }]
        },
        dependencyOrdered: false,
        dependencyTextJoin: "",
        playgroundDefaults: {
            "indent": 2,
            "auto-indent": true,
            "data-autocomplete": true,
            "highlight-on-fly": true,
            "match-brackets": true
        },
        texts: {
            _for: function (id) { return " for " + id.bold(); },
            dependsOn: function (deps) { return " depends on " + util_3.preetyShowList(deps.map(function (t) { return t.bold().italics(); })); },
            expectingFor: function (what, that) { return "Expecting " + what + " for " + that; },
            nounNounDesc: function (noun0, noun1, desc) { return noun0 + " " + noun1 + desc; }
        }
    };
    ////
    var literateKtMagics = {
        dependAttribute: "depend",
        langAttribute: "lang",
        hiddenDependencyClass: "hidden-dependency",
        playgroundClass: "playground",
        dependSeprator: " ",
        KotlinPlaygroundGlobalId: "KotlinPlayground"
    };
    /** Returns [codes, endDiv], note that nested literate CANNOT be recursive */
    function filterCode(begin_e) {
        var _a;
        var literateCodeFilter = exports.literateKtConfig.literateCodeFilter, dependencyTextJoin = exports.literateKtConfig.dependencyTextJoin, literateLanguage = exports.literateKtConfig.literateLanguage;
        var langDefault = literateLanguage;
        var neighbors = new read_1.Peek(util_2.iterator(dom_1.nextSiblings(begin_e)));
        var _b = __read(readCodeTags(neighbors), 2), endDiv = _b[0], nestedTags = _b[1];
        var lang = (_a = begin_e.getAttribute(literateKtMagics.langAttribute), (_a !== null && _a !== void 0 ? _a : langDefault));
        var codes = nestedTags.filter(literateCodeFilter(lang)).map(function (e) { return e.textContent; }).join(dependencyTextJoin);
        return [lang, codes, endDiv];
    }
    exports.filterCode = filterCode;
    function readCodeTags(es) {
        var literateBegin = exports.literateKtConfig.literateBegin, literateEnd = exports.literateKtConfig.literateEnd;
        var isLiteratePart = util_1.negate(util_1.or(literateEnd, literateBegin));
        var nestedTags = [];
        var readContent = function () { return read_1.peekWhile(isLiteratePart, es); };
        // Content = anyelement!(literateBegin|literateEnd)
        // CodeTags = literateBegin (Content (ignore:literateBegin Content literateEnd)?)*? literateEnd
        read(literateBegin, es, "literate begin");
        do {
            nestedTags.push.apply(nestedTags, __spread(readContent()));
            if (literateBegin(es.peek)) {
                read(literateBegin, es, "inner literate begin");
                __spread(readContent());
                read(literateEnd, es, "inner literate end");
            }
        } while (!literateEnd(es.peek));
        var endDiv = es.peek;
        read(literateEnd, es, "literate end");
        return [endDiv, nestedTags];
    }
    function read(p, s, msg) {
        var expectingFor = exports.literateKtConfig.texts.expectingFor;
        if (p(s.peek))
            s.next();
        else
            throw Error(expectingFor(p.name + ": " + msg, s));
    }
    function enableCodeFilter(begin_e) {
        var playgroundDefaults = exports.literateKtConfig.playgroundDefaults, language = exports.literateKtConfig.language, dependencyTextJoin = exports.literateKtConfig.dependencyTextJoin;
        var playground = literateKtMagics.playgroundClass, hiddenDependency = literateKtMagics.hiddenDependencyClass;
        var adjNounDesc = exports.literateKtConfig.texts.nounNounDesc;
        var _a = __read(filterCode(begin_e), 3), lang = _a[0], codeText = _a[1], endDiv = _a[2]; //ok:filter-code
        var _b = __read(language[lang], 2), operateInitElement = _b[0], operateShow = _b[1];
        var _c = __read(dependenciesAndDescribe(begin_e), 2), dependencies = _c[0], describe = _c[1]; //ok:filter-dependency-literate
        var showCodeBtn, codeDiv = dom_3.element("div", dom_3.withClasses(playground), showCodeBtn = dom_3.element("button", dom_3.withInnerHTML(adjNounDesc(lang.capitalize(), "code", describe))));
        dom_1.treeInsert.before(endDiv, codeDiv); //ok:show-div-button
        var showKotlinSource = function () {
            var code, preCode = dom_3.element("pre", dom_3.withDefaults, code = dom_3.element("code", dom_3.configured(dom_3.withText(codeText), operateInitElement(playgroundDefaults))));
            if (is_test_1.default.notEmpty(dependencies)) {
                var dependTa = dom_3.element("textarea", dom_3.configured(dom_3.withText(dependencies.join(dependencyTextJoin)), dom_3.withClasses(hiddenDependency)));
                code.appendChild(dependTa); //do:add-hidden-dependencies
            }
            codeDiv.appendChild(preCode); //ok:show-code
            showCodeBtn.remove();
            operateShow(codeDiv);
        };
        showCodeBtn.addEventListener("click", showKotlinSource);
    }
    exports.enableCodeFilter = enableCodeFilter;
    function dependenciesAndDescribe(e) {
        var _a = exports.literateKtConfig.texts, _for = _a._for, dependsOn = _a.dependsOn;
        var dependencyDivs = solveDependencies(e);
        var describe = util_3.showIfSomeLength(_for, e.id) + util_3.showIfSomeLength(dependsOn, dependencyDivs.map(function (eDep) { return eDep.id; }));
        var dependencyCodes = dependencyDivs.map(function (eDep) { var _a = __read(filterCode(eDep), 3), _0 = _a[0], cs = _a[1], _1 = _a[2]; return cs; }); //ok:resolve-dependencies
        return [dependencyCodes, describe];
    }
    function solveDependencies(e_root) {
        var depend = literateKtMagics.dependAttribute, dependSeprator = literateKtMagics.dependSeprator;
        var linkIds = function (e) { var _a, _b; return _b = (_a = e.getAttribute(depend)) === null || _a === void 0 ? void 0 : _a.split(dependSeprator), (_b !== null && _b !== void 0 ? _b : []); };
        var links = function (e) { return linkIds(e).map(function (id) { return document.getElementById(id); }); };
        return dependencySolver()(e_root, links);
    }
    function dependencySolver() {
        var dependencyOrdered = exports.literateKtConfig.dependencyOrdered;
        var uniq = function (xs) { return __spread(new Set(xs)); };
        var deepDependenciesUniq = function (root, link) { return uniq(util_4.deepDependencies(root, link)); };
        return dependencyOrdered ? deepDependenciesUniq : util_4.flatDependencies;
    }
});
