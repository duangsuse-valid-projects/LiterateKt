define(["require", "exports", "./lib/dom", "./literate_kotlin"], function (require, exports, dom_1, literate_kotlin_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    dom_1.waitsElement(document.body, function () {
        dom_1.schedule("configureLiterateKt", literate_kotlin_1.literateKtConfig);
        literate_kotlin_1.enable();
    });
});
