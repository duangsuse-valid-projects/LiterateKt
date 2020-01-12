package org.duangsuse.literatekt.cmdline

/**
 * Build parser with [onHandle], [next], [parseError]; use it with [run]
 */
abstract class CommandParser<out R>(private vararg val args: String): Iterator<String> {
  class ParseError(message: String): Error(message)
  protected open fun parseError(message: String): Nothing = throw ParseError(message)
  private var position = 0.dec()
  override fun hasNext(): Boolean = position.inc() in args.indices
  override fun next(): String = args[++position]

  protected fun next(name: String): String {
    if (!hasNext()) parseError("expecting $name")
    else return next().also {
      if (extractArg(it) != null) parseError("ambiguous `$it' could refer to another command")
    }
  }
  protected abstract fun onHandle(arg: String)
  protected abstract fun result(): R

  protected open fun extractArg(rawArg: String): String?
    = ARG_REGEX.find(rawArg)?.groupValues?.get(1)
  fun run(): R {
    while (hasNext()) {
      val arg = next().let { extractArg(it) ?: parseError("bad arg form: `$it'") }
      try { onHandle(arg) }
      catch (e: ParseError) { parseError("Error parsing `$arg': ${e.message}") }
    }
    return result()
  }
  companion object {
    val ARG_REGEX = Regex("^--?(.*)$")
  }
}