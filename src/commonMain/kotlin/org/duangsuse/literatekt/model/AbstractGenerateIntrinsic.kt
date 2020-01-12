package org.duangsuse.literatekt.model

import org.duangsuse.literatekt.cmdline.Path

abstract class AbstractGenerateIntrinsic: GenerateIntrinsic {
  override fun readLinks(file: LineFeed): Iterable<Path> {
    //## Literate Kotlin
    //+ [...](path-reference-1)
    //+ [...](path-reference-2)
    //+ ...
    TODO()
  }
  override fun readCompileUnit(file: LineFeed): Pair<CompileUnit, Code> {
    ////# ...
    //```kotlin
    //package apples // (main, java)
    //```
    TODO()
  }
}