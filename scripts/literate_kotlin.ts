import { nextSiblings, treeInsert, schedule } from './lib/dom'
import { has } from './lib/dom'
import { element, configured, withDefaults, withClasses, withAttributes, withText, withInnerHTML } from './lib/dom'

import { Predicate, negate, or } from './lib/util'
import { iterator, /*Graph*/Links } from './lib/util'
import { Peek, peekWhile } from './lib/read'

import { preetyShowList, showIfSomeLength } from './lib/util'
import { deepDependencies, flatDependencies } from './lib/util'

import is from './lib/is_test'

export function enable() {
  document.querySelectorAll("."+"literateBegin").forEach(enableCodeFilter);
}
export const literateKtConfig = {
  literateBegin: has.cssClass("literateBegin"),
  literateEnd: has.cssClass("literateEnd"),
  literateLanguage: 'kotlin',
  literateCodeFilter: (lang:string) => has.cssClass(`language-${lang}`),
  language: {
    kotlin: [withAttributes,
      (e:Element) => schedule(literateKtMagics.KotlinPlaygroundGlobalId, e)]
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
    _for: (id:string) => ` for ${id.bold()}`,
    dependsOn: (deps: Array<string>) => ` depends on ${preetyShowList(deps.map(t => t.bold().italics()))}`,
    expectingFor: (what:any, that:any) => `Expecting ${what} for ${that}`,
    nounNounDesc: (noun0:string, noun1:string, desc:string) => `${noun0} ${noun1}${desc}`
  }
};

////
const literateKtMagics = {
  dependAttribute: "depend",
  langAttribute: "lang",
  hiddenDependencyClass: "hidden-dependency",
  playgroundClass: "playground",
  dependSeprator: " ",
  KotlinPlaygroundGlobalId: "KotlinPlayground"
};

/** Returns [codes, endDiv], note that nested literate CANNOT be recursive */
export function filterCode(begin_e: Element): [string, string, Element] {
  const { literateCodeFilter, dependencyTextJoin, literateLanguage } = literateKtConfig;
  const langDefault = literateLanguage;

  let neighbors = new Peek(iterator(nextSiblings(begin_e)));
  let [endDiv, nestedTags] = readCodeTags(neighbors);
  let lang = begin_e.getAttribute(literateKtMagics.langAttribute) ?? langDefault;

  let codes = nestedTags.filter(literateCodeFilter(lang)).map(e => e.textContent).join(dependencyTextJoin);
  return [lang, codes, endDiv];
}
function readCodeTags(es: Peek<Element>): [Element, Array<Element>] {
  const { literateBegin, literateEnd } = literateKtConfig;
  const isLiteratePart = negate(or(literateEnd, literateBegin));

  let nestedTags: Array<Element> = [];
  const
    readContent = () => peekWhile(isLiteratePart, es);

  // Content = anyelement!(literateBegin|literateEnd)
  // CodeTags = literateBegin (Content (ignore:literateBegin Content literateEnd)?)*? literateEnd
  read(literateBegin, es, "literate begin");
  do {
    nestedTags.push(...readContent());
    if (literateBegin(es.peek)) {
      read(literateBegin, es, "inner literate begin");
      [...readContent()];
      read(literateEnd, es, "inner literate end");
    }
  } while (!literateEnd(es.peek));
  let endDiv = es.peek;
  read(literateEnd, es, "literate end");

  return [endDiv, nestedTags];
}
function read<T>(p: Predicate<T>, s: Peek<T>, msg: string) {
  const { expectingFor } = literateKtConfig.texts;
  if (p(s.peek)) s.next();
  else throw Error(expectingFor(`${p.name}: ${msg}`, s));
}

export function enableCodeFilter(begin_e: Element) {
  const { playgroundDefaults, language, dependencyTextJoin } = literateKtConfig;
  const { playgroundClass: playground, hiddenDependencyClass: hiddenDependency } = literateKtMagics;
  const { nounNounDesc: adjNounDesc } = literateKtConfig.texts;

  let [lang, codeText, endDiv] = filterCode(begin_e); //ok:filter-code
  let [operateInitElement, operateShow] = (language as any)[lang];
  let [dependencies, describe] = dependenciesAndDescribe(begin_e); //ok:filter-dependency-literate

  let showCodeBtn: Element,
  codeDiv = element("div", withClasses(playground),
    showCodeBtn = element("button", withInnerHTML(adjNounDesc(lang.capitalize(), "code", describe)))
  );
  treeInsert.before(endDiv, codeDiv); //ok:show-div-button

  const showKotlinSource = () => { //[codeText, dependencies, codeDiv]
    let code: Element,
    preCode = element("pre", withDefaults,
      code = element("code",
        configured(withText(codeText), operateInitElement(playgroundDefaults))
      )
    );
    if (is.notEmpty(dependencies)) {
      let dependTa = element("textarea",
        configured(withText(dependencies.join(dependencyTextJoin)), withClasses(hiddenDependency))
      );
      code.appendChild(dependTa); //do:add-hidden-dependencies
    }
    codeDiv.appendChild(preCode); //ok:show-code
    showCodeBtn.remove();
    operateShow(codeDiv);
  };
  showCodeBtn.addEventListener("click", showKotlinSource);
}
function dependenciesAndDescribe(e: Element): [Array<string>, string] {
  const { _for, dependsOn } = literateKtConfig.texts;

  let dependencyDivs = solveDependencies(e);
  let describe = showIfSomeLength(_for, e.id) + showIfSomeLength(dependsOn, dependencyDivs.map(eDep => eDep.id));
  let dependencyCodes = dependencyDivs.map(eDep => { let [_0, cs, _1] = filterCode(eDep); return cs }); //ok:resolve-dependencies

  return [dependencyCodes, describe];
}
function solveDependencies(e_root: Element): Array<Element> {
  const { dependAttribute: depend, dependSeprator} = literateKtMagics;

  const linkIds = (e:Element) => e.getAttribute(depend)?.split(dependSeprator) ?? [];
  const links = (e:Element) => linkIds(e).map(id => document.getElementById(id));
  return dependencySolver<Element>()(e_root, links);
}
function dependencySolver<T>(): (root:T, link:Links<T>) => Array<T> {
  const { dependencyOrdered } = literateKtConfig;
  const uniq = (xs:Array<T>) => [...new Set(xs)];
  const deepDependenciesUniq = (root:T, link:Links<T>) => uniq(deepDependencies(root, link));

  return dependencyOrdered? deepDependenciesUniq : flatDependencies;
}
