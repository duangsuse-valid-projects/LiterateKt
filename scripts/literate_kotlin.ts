import { nextSiblings, treeInsert, schedule, has } from './lib/dom'
import { element, configured, withDefaults, withClasses, withAttributes, withText, withInnerHTML } from './lib/dom'

import { iterator, preetyShowList, showIfSomeLength, deepDependencies } from './lib/util'
import { Predicate, negate, or } from './lib/util'
import { Peek, peekWhile } from './lib/read'
import is from './lib/is_test'

export function enable() {
  document.querySelectorAll('.literateBegin').forEach(enableCodeFilter);
}
export const literateKtConfig = {
  literateBegin: has.cssClass("literateBegin"),
  literateEnd: has.cssClass("literateEnd"),
  literateCodeFilter: has.cssClass("language-kotlin"),
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
    adjNounDesc: (adj:string, noun:string, desc:string) => `${adj} ${noun}${desc}`
  }
};

////
const literateKtMagics = {
  dependAttribute: "depend",
  hiddenDependencyClass: "hidden-dependency",
  playgroundClass: "playground",
  dependSeprator: " ",
  KotlinPlaygroundGlobalId: "KotlinPlayground"
};

/** Returns [codes, endDiv], note that nested literate CANNOT be recursive */
export function filterCode(begin_e: Element): [string, Element] {
  const { literateBegin, literateEnd, literateCodeFilter } = literateKtConfig;

  let nestedTags: Array<Element> = [];
  let neighbors = new Peek(iterator(nextSiblings(begin_e)));

  const literatePart = negate(or(literateEnd, literateBegin));
  const scanContent = () => nestedTags.push(...peekWhile(literatePart, neighbors))
  , scanIgnoreInnerLiterate = () => [...peekWhile(negate(literateEnd), neighbors)];

  read(literateBegin, neighbors);
  do { // CodePart = literateBegin (Content (IgnoreInnerLiterate)?)*? literateEnd
    scanContent();
    if (literateBegin(neighbors.peek)) {
      scanIgnoreInnerLiterate();
      read(literateEnd, neighbors);
    }
  } while (!literateEnd(neighbors.peek));
  let endDiv = neighbors.peek;
  read(literateEnd, neighbors);

  let codes = nestedTags.filter(literateCodeFilter).map(e => e.textContent).join("");
  return [codes, endDiv];
}
function read<T>(p: Predicate<T>, s: Peek<T>) {
  const { expectingFor } = literateKtConfig.texts;
  if (p(s.peek)) s.next();
  else throw Error(expectingFor(p, s));
}

export function enableCodeFilter(begin_e: Element) {
  const { playgroundDefaults } = literateKtConfig;
  const { adjNounDesc } = literateKtConfig.texts;
  const { playgroundClass: playground, hiddenDependencyClass: hiddenDependency,
    KotlinPlaygroundGlobalId: KotlinPlayground } = literateKtMagics;

  let [codeText, endDiv] = filterCode(begin_e); //ok:filter-code
  let [dependencies, describe] = dependenciesAndDescribe(begin_e); //ok:filter-dependency-literate

  let showCodeBtn: Element,
  codeDiv = element("div", withClasses(playground),
    showCodeBtn = element("button", withInnerHTML(adjNounDesc("Kotlin", "code", describe)))
  );
  treeInsert.before(endDiv, codeDiv); //ok:show-div-button

  const showKotlinSource = () => { //[codeText, dependencies, codeDiv]
    let code: Element,
    preCode = element("pre", withDefaults,
      code = element("code",
        configured(withText(codeText), withAttributes(playgroundDefaults))
      )
    );
    if (is.notEmpty(dependencies)) {
      let dependTa = element("textarea",
        configured(withText(dependencies.join("")), withClasses(hiddenDependency))
      );
      code.appendChild(dependTa); //do:add-hidden-dependencies
    }
    codeDiv.appendChild(preCode); //ok:show-code
    showCodeBtn.remove();
    schedule(KotlinPlayground, code);
  };
  showCodeBtn.addEventListener("click", showKotlinSource);
}
function dependenciesAndDescribe(e: Element): [Array<string>, string] {
  const { _for, dependsOn } = literateKtConfig.texts;

  let dependencyDivs = solveDependencies(e);
  let describe = showIfSomeLength(_for, e.id) + showIfSomeLength(dependsOn, dependencyDivs.map(eDep => eDep.id));
  let dependencyCodes = dependencyDivs.map(eDep => filterCode(eDep)[0]); //ok:resolve-dependencies

  return [dependencyCodes, describe];
}
function solveDependencies(e_root: Element): Array<Element> {
  const { dependAttribute: depend, dependSeprator} = literateKtMagics;

  const linkIds = (e:Element) => e.getAttribute(depend)?.split(dependSeprator) ?? [];
  const links = (e:Element) => linkIds(e).map(id => document.getElementById(id));
  return deepDependencies(e_root, links);
}
