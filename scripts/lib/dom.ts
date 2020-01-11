import { Predicate, Consumer, Action } from './util'
import { iterableBy, entries, makeScheduler } from './util'

export type ElementConfig = Consumer<Element>

export const nextSiblings = iterableBy<Element>(e => e.nextElementSibling);
export function assignElementAttribute(node: Element, attributes: any) {
  for (let [name, value] of entries(attributes))
    node.setAttribute(name, value.toString());
}
/** Use document.body to refer whole DOM content */
export function waitsElement(e: Element, op: Action) {
  const isLoaded = (rs:string) => rs == "complete";
  if (e === document.body) {
    if (isLoaded(document.readyState)) return op();
    else document.addEventListener("DOMContentLoaded", op);
  } else {
    e.addEventListener("load", op);
  }
}

export const schedule = makeScheduler(window);

export const treeInsert = {
  before: (target: Element, e: Element) => target.parentElement.insertBefore(e, target)
};

export const has = {
  cssClass: function(cssClass: string): Predicate<Element> {
    return e => e.classList?.contains(cssClass) ?? false;
  },
  childByCSS: function(cssSelector: string): Predicate<Element> {
    return e => e.querySelector(cssSelector) != null;
  },
  tagName: function(tagName: RegExp): Predicate<Element> {
    return e => tagName.test(e.tagName);
  },
  attribute: function(attributeName: string, attributePattern: RegExp=/.*/): Predicate<Element> {
    return e => attributePattern.test(e.getAttribute(attributeName));
  }
};

export function element<K extends keyof HTMLElementTagNameMap>(node_type: K,
    init: ElementConfig, ...children: Array<(string|Element)>): HTMLElementTagNameMap[K] {
  let node = document.createElement(node_type);
  init(node); node.append(...children);
  return node;
}
export function configured(...config: Array<ElementConfig>): ElementConfig {
  return e => { for (let cfg of config) cfg(e); };
}

export { withDefaults, withClasses, withAttributes, withText, withInnerHTML }
const withDefaults: ElementConfig = e => {};
const withClasses: (...cssClass:Array<string>) => ElementConfig
  = (...cssClasses) => (e => e.classList.add(...cssClasses));
const withAttributes: (attribute:Object) => ElementConfig
  = (attribute) => (e => assignElementAttribute(e, attribute));
const withText: (text:string) => ElementConfig
  = text => (e => { e.textContent = text; });
const withInnerHTML: (htmlCode:string) => ElementConfig
  = htmlCode => (e => { e.innerHTML = htmlCode; });
