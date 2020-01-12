package org.duangsuse.literatekt

typealias Predicate<T> = (T) -> Boolean

/**
 * Data stream helper for sub-procedure structured parsers
 */
interface Feed<out T> {
  val peek: T
  fun consume(): T
  class End: NoSuchElementException("no more")
}

/**
 * Take first elements satisfying [predicate]
 */
fun <T> Feed<T>.peekWhile(predicate: Predicate<T>): List<T> {
  val took: MutableList<T> = mutableListOf()
  while (predicate(peek))
    try { took.add(consume()) }
    catch (_: Feed.End) {break}
  return took
}

class IteratorFeed<T>(private val iterator: Iterator<T>): Feed<T> {
  private var lastItem: T = iterator.next()
  private var tailConsumed = false
  override val peek: T get() = lastItem
  override fun consume(): T = peek.also {
    if (iterator.hasNext())
       lastItem = iterator.next()
    else if (!tailConsumed)
       tailConsumed = true
    else
      throw Feed.End()
  }
}
