package org.duangsuse.literatekt.model

import org.duangsuse.literatekt.Feed
import org.duangsuse.literatekt.cmdline.Path

typealias Line = String
typealias Code = String

data class CompileUnit(val scope: String, val sourceSet: String, val namespace: String)

interface GenerateIntrinsic {
  fun solvePath(src: CompileUnit): Path
  fun generateProject(base: Path)
  fun readLinks(file: Feed<Line>): Iterable<Path>?
  fun readCompileUnit(file: Feed<Line>): Pair<CompileUnit, Code>
}
interface LiterateKtPlugin<CFG> {
  val name: String
  fun readConfig(entry: Feed<Line>): CFG
  fun create(cfg: CFG, properties: Map<String, String>): GenerateIntrinsic
}
