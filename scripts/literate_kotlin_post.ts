import { waitsElement, schedule } from './lib/dom'
import { enable, literateKtConfig } from './literate_kotlin'

waitsElement(document.body, () => {
  schedule("configureLiterateKt", literateKtConfig);
  enable();
});
