package org.duangsuse.literatekt.cmdline

typealias Path = String
typealias Property = Pair<String, String>
typealias Properties = Map<String, String>

/**
 * kotlinlit arg*
 * where arg:
 * + (-T_target) default "gradle"
 * + (-t name(=value)?) many
 * + (-d dir) default "build"
 * + (-s dir) default "."
 */
data class Command(val target: String, val properties: Properties, val source: Path, val destination: Path)


