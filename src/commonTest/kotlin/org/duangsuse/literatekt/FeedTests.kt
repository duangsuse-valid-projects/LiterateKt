package org.duangsuse.literatekt

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith

class FeedKtTests {
  @Test fun iteratorFeed() {
    val feed = IteratorFeed(listOf(1, 2, 3).listIterator())
    repeat2 { assertEquals(1, feed.peek) }
    assertEquals(1, feed.consume())
    assertEquals(2, feed.consume())
    assertEquals(3, feed.consume())
    assertFailsWith<Feed.End> { feed.consume() }
  }
  @Test fun peekWhile() {
    val feed = IteratorFeed((1..9).iterator())
    assertEquals(listOf(1,2,3), feed.peekWhile { it <= 3 })
    assertEquals(4, feed.peek)
  }
  private fun repeat2(op: (Int) -> Unit) = repeat(2, op)
}