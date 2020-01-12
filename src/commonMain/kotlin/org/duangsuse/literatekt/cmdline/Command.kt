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

class LiterateKtCommandParser(vararg args: String): CommandParser<Command>(*args) {
  private var target: String? = null
  private var source: Path? = null
  private var destination: Path? = null
  private val properties: MutableMap<String, String> = mutableMapOf()
  override fun onHandle(arg: String) = when (arg) {
    "T" -> { target = next("target") }
    "t" -> {
      val kv = next("property").split('=')
      when (kv.size) {
        1 -> properties[kv[0]] = "true"
        2 -> { val (k, v) = kv; properties[k] = v }
        else -> parseError("property $kv should be pair (k=v)")
      }
    }
    "d" -> { destination = next("destination") }
    "s" -> { source = next("source") }
    else -> if (arg.startsWith('T')) {
      target = arg.slice(1..arg.lastIndex)
    } else parseError("unknown")
  }
  override fun result(): Command = Command(target ?: "gradle", properties, source ?: ".", destination ?: "build")
}
