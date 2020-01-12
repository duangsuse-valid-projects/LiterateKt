package org.duangsuse.literatekt

typealias PositiveParser<T, R> = (Feed<T>) -> R
typealias Parser<T, R> = PositiveParser<T, R?>
val notParsed: Nothing? = null

infix fun <T, R, R1> Parser<T, R>.then(op: (R) -> R1): Parser<T, R1> = read@ { s ->
  return@read this(s)?.let(op)
}
infix fun <T, R, R1> Parser<T, R>.contextual(op: (R) -> Parser<T, R1>): Parser<T, R1> = read@ { s ->
  return@read this(s)?.let(op)?.invoke(s)
}
fun <T, R> Parser<T, R>.toDefault(defaultValue: R): PositiveParser<T, R> = read@ { s ->
  return@read this(s) ?: defaultValue
}
fun <T> satisfy(predicate: Predicate<T>): Parser<T, T> = read@ { s ->
  return@read s.peek.takeIf(predicate)?.also { s.consume() }
}
fun <T> item(x: T): Parser<T, T> = satisfy { it == x }
fun regexMatch(regex: Regex): Parser<String, List<String>> = read@ { s ->
  return@read if (s.peek.matches(regex))
    regex.matchEntire(s.consume())?.groupValues
  else notParsed
}
fun stringMatch(str: CharSequence): Parser<Char, String> = read@ { s ->
  val chars = str.iterator()
  for (char in chars) {
    if (char != s.peek) return@read notParsed
    else s.consume()
  }
  return@read str.toString()
}

fun <T, R> seq(vararg items: Parser<T, R>): Parser<T, List<R>> = read@ { s ->
  val reads: MutableList<R> = mutableListOf()
  for (item in items) {
    val parse = item(s)
    parse?.let(reads::add) ?: return@read notParsed
  }
  return@read reads
}
fun <T, R> br(vararg cases: Parser<T, R>): Parser<T, R> = read@ { s ->
  for (case in cases) case(s)?.let { return@read it }
  return@read notParsed
}
fun <T, R> repeat(item: Parser<T, R>): Parser<T, List<R>> = read@ { s ->
  val reads: MutableList<R> = mutableListOf()
  var parse: R? = item(s)
  while (parse != notParsed) {
    parse.let(reads::add)
    parse = item(s)
  }
  return@read reads.takeIf { it.isNotEmpty() }
}
