package org.duangsuse.literatekt

/**
 * A data object maps string object by their [prefixes], longer first.
 */
class PrefixMap<out V>(private val prefixes: Map<CharSequence, V>) {
  operator fun get(key: CharSequence): V? = prefixes[find(key)]
  private fun find(key: CharSequence): CharSequence? = prefixes.keys
    .sortedByDescending(CharSequence::length)
    .firstOrNull { key.startsWith(it) }
}