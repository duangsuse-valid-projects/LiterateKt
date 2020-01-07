# LiterateKt ![kotlin] ![typescript]
[kotlin]: https://img.shields.io/badge/Kotlin-1.3_Mostly_JVM-orange?logo=Kotlin&style=flat-square
[typescript]: https://img.shields.io/badge/TypeScript-3.7-blue?logo=TypeScript&style=flat-square

Write/run Kotlin code in blog posts, translate them into structured projects.

## Literate Kotlin Usage [📘sample](https://duangsuse-valid-projects.github.io/LiterateKt/example-kotlin-parser)

```markdown
<div class="literateBegin" id="VirtualFileSystemImpl" depend="FileInterface"></div>

<div class="literateBegin" id="FileInterface"></div>

# Abstraction for interacting with lower-level FS primitives

> NOTE: literate can be encapsulated by top-level literates (max-depth=1)

> Every `literateBegin .. literateEnd` section will create a "Kotlin code" area

> Inner literate is not filtered in "Kotlin code", explicitly specify dependencies can do the same
<div class="literateEnd"></div>

# Implementing a VFS

<div class="literateEnd"></div> <!-- VFS -->

<div class="literateBegin" depend="VirtualFileSystemImpl"></div>

# My Application using VFS module

<div class="literateEnd"></div>
```

## CLI Tool Usage

```kotlin
TODO("Implement CLI project generator")
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
  //...
  dependencyOrdered: false, // make true to let far dependency first
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
};
```

## Project Structure

+ CI: Travis
+ WebFrontend: TypeScript/RequireJS-AMD/WebPack
+ [WebPack config](scripts/webpack.config.js), entry-file: `dist/literate_kotlin_post.js` output: `dist/lkt.bundle.js`
+ [build script](scripts/make.sh), entry: `deploy`
