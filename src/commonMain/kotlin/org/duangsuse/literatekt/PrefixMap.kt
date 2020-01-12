package org.duangsuse.literatekt

typealias CharSequenceMap<V> = Map<CharSequence, V>
/**
 * A data object maps string object by their [prefixes], longer first.
 */
class PrefixMap<out V>(private val prefixes: CharSequenceMap<V>): CharSequenceMap<V> by prefixes {
  override fun get(key: CharSequence): V? = prefixes[longestPrefix(key)]
  private fun longestPrefix(key: CharSequence): CharSequence? = prefixes.keys
    .sortedByDescending(CharSequence::length)
    .firstOrNull { key.startsWith(it) }
}