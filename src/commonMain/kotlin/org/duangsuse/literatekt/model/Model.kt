package org.duangsuse.literatekt.model

import org.duangsuse.literatekt.Feed
import org.duangsuse.literatekt.cmdline.Path
import org.duangsuse.literatekt.cmdline.Properties

typealias Line = String
typealias Code = String
typealias LineFeed = Feed<Line>

data class CompileUnit(val scope: String, val sourceSet: String, val namespace: String)
const val README: Path = "README.md"

/**
 * Intrinsic things used to do markdown - project structure generation
 */
interface GenerateIntrinsic {
  /** Resolve base dir for [compileUnit], results like `src/main/kotlin/package/` */
  fun solvePath(compileUnit: CompileUnit): Path
  /** Post-generate project config files like `build.gradle` */
  fun generateProject(base: Path)
  /** Read markdown dependency links in [README] */
  fun readLinks(file: LineFeed): Iterable<Path>
  /** Read package declaration, also filter code in markdown file */
  fun readCompileUnit(file: LineFeed): Pair<CompileUnit, Code>
}
interface Named { val name: String }
interface LiterateKtPlugin<CFG>: Named {
  /** Read configuration part in root [README] */
  fun readConfig(entry: LineFeed): CFG
  fun create(config: CFG, properties: Properties): GenerateIntrinsic
}
