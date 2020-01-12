# LiterateKt ![kotlin] ![typescript]
[kotlin]: https://img.shields.io/badge/Kotlin-1.3_Mostly_JVM-orange?logo=Kotlin&style=flat-square
[typescript]: https://img.shields.io/badge/TypeScript-3.7-blue?logo=TypeScript&style=flat-square

Write/run Kotlin code in blog posts, translate them into structured projects.

## Literate Kotlin Usage [📘sample](https://duangsuse-valid-projects.github.io/LiterateKt/example-kotlin-parser)

+ Any web page can contain many _literates_
+ _Literate_ is a piece of text and code ~~in language `lang`, default~~ `"kotlin"`
+ Started by `class="literateBegin"`, terminated by `class="literateEnd"`
+ It can have one `id`, to make reference from another
+ It can have many `depend="a b c"` literate-id dependencies
+ It can be encapsulated by top-level literates (max-depth=1),
inner literate's `<code>` is ignored processing

Every literate will have a code area with "show code" button,
filtering its inner `<code>` tags, joined together ~~with `dependencyTextJoin` config~~,
then final concatenated code is passed to something like `KotlinPlayground` to render code editor

```markdown
<div class="literateBegin" id="VirtualFileSystemImpl" depend="FileInterface"></div>

<div class="literateBegin" id="FileInterface"></div> <!-- inner literate -->

# Abstraction for interacting with lower-level FS primitives

> Every `literateBegin .. literateEnd` section will create an "Kotlin code" area

> Code of inner literate is ignored, specify dependencies explicitly to create reference between every literate blocks

<div class="literateEnd"></div> <!-- inner literate end -->

# Implementing a VFS

<div class="literateEnd"></div> <!-- VFS literate end -->

<!-- Another top-level literate -->
<div class="literateBegin" depend="VirtualFileSystemImpl"></div>

# My Application using the VFS module

<div class="literateEnd"></div>
```

## Multi-file structure

```groovy
sourceSets {
    commonMain {
      dependencies { implementation kotlin('stdlib-common') } }
  /**/
}
```

> `README.md` in project root

~~~markdown
## Literate Kotlin

`group:version:name` (lang)

+ [...](path-reference-1)
+ [...](path-reference-2)
+ ...

### Build Dependencies

```kotlin
package apples // (main, java)
package somepkg // (scope, sourceSet)
//...
```

+ `depkind something` (main, java)
+ ...

### Build Script 

> [settings.gradle](settings.gradle)

```xxx
//code here
```
~~~

And for path references here, they can be either dir or single file

> `README.md` of dir

```markdown
## Literate Kotlin

+ [...](path-reference-1)
+ [...](path-reference-2)
+ ...
```

> any source markdown file

~~~markdown
# ...

```xxx
package ...
```

## ...
~~~

make sure `package` declaration is appeared after `<h1>` and before any header tag not `<h1>`

`// (scope, sourceSet)` is supported for single file `package` header

## CLI Tool Usage

```bash
kotlinlit args
  where args:
  (-T_target) default "gradle"
  (-t_name(=value)?) many
  (-d dir) default "build"
  (-s dir) default "."
```

```bash
kotlinlit -Tgradle -t gradleVersion=4.1 -d build -s .
```

## Script Usage

```html
<script src="https://unpkg.com/kotlin-playground@1"></script>

<script async src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.js" data-main="https://duangsuse-valid-projects.github.io/LiterateKt/lkt.bundle.js"></script>

<script>
function configureLiterateKt(cfg) {
  cfg.dependencyOrdered = true; // configure literate kotlin here
}
</script>
```

where _cfg_ is structured like:

> [scripts/literate_kotlin.ts](scripts/literate_kotlin.ts#L12)

```typescript
export const literateKtConfig = {
  dependencyOrdered: false, // make true to let far dependency first
  dependencyTextJoin: "",
  language: {
    kotlin: [withAttributes,
      (e:Element) => schedule(literateKtMagics.KotlinPlaygroundGlobalId, e)]
  },
  playgroundDefaults: { // Kotlin Playground settings
    "indent": 2,
    "auto-indent": true,
    "data-autocomplete": true,
    "highlight-on-fly": true,
    "match-brackets": true
  },
  texts: { // translations
    _for: (id:string) => ` for ${id.bold()}`,
    dependsOn: (deps: Array<string>) => ` depends on ${/**/}`,
    expectingFor: (what:any, that:any) => `Expecting ${what} for ${that}`,
    nounNounDesc: (noun0:string, noun1:string, desc:string) => `${noun0} ${noun1}${desc}`
  }
  /**/
};
```

> __NOTE__: `dependencyOrdered` should be `false` when there are circular dependencies in project

> Extension: exported modules `dom`, `util`, `read`, `is_test` in RequireJS/AMD form,
> use them like `require("dom").withAttributes({ style: "color: red" })(e)`

## About CLI project structure generation

```kotlin
data class CompileUnit(val scope: String, val sourceSet: String, val name: String) 

interface GenerateIntrinsic {
  fun solvePath(src: CompileUnit): Path
  fun generateProject(base: File)
}
interface LiterateKtPlugin<CFG> {
  val name: String
  fun readConfig(entry: Feed<Line>): CFG
  fun create(cfg: CFG, properties: Map<String, String>): GenerateIntrinsic
}
```

## Project Structure

+ CI: Travis
+ WebFrontend: TypeScript/RequireJS-AMD/WebPack
+ [WebPack config](scripts/webpack.config.js), entry-file: `dist/literate_kotlin_post.js` output: `dist/lkt.bundle.js`
+ [build script](scripts/make.sh), entry: `deploy`
