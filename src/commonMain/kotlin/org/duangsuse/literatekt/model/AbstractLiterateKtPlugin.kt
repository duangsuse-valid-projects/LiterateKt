package org.duangsuse.literatekt.model

import org.duangsuse.literatekt.cmdline.Path
import org.duangsuse.literatekt.peekWhile

abstract class AbstractLiterateKtPlugin<V>: LiterateKtPlugin<AbstractLiterateKtPlugin.BaseConfig<V>> {
  data class BaseConfig<V>
  (val projectId: String, val language: String,
   val dependencies: Set<DependencyId>, val files: Map<Path, String>,
   val extra: Map<String, V>)
  data class DependencyId(val scope: String, val source: String, val coordinate: Coordinate, val version: String)
  data class Coordinate(val group: String, val name: String, val version: String)
  class ParseError(message: String): Error(message)
  protected fun parseError(message: String): Nothing = throw ParseError(message)

  override fun readConfig(entry: LineFeed): BaseConfig<V> {
    //## Literate Kotlin
    //`group:version:name` (lang)
    entry.peekWhile { !it.startsWith("## $LITERATE_KOTLIN") }
    entry.peekWhile { !it.startsWith('`') }
    val basicInfo = BASIC_INFO.matchEntire(entry.peek) ?: parseError("cannot match `group:version:name` (lang) part")
    val (g, v, n) = basicInfo.destructured
    val lang = basicInfo.groupValues.let { if (it.size.dec() == 4) it[4] else "kotlin" }
    //### Build Dependencies
    //+ `dep-kind something` (main, java)
    //### Build Script
    //> [...](settings.gradle)
    //```xxx
    //code here
    //```
    TODO()
  }
  abstract fun readExtraConfig(): Map<String, V>

  companion object {
    val BASIC_INFO = Regex("^`(.+):(.+):(.+)`( \\((.+)\\))?$")
  }
}