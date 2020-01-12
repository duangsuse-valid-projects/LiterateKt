package org.duangsuse.literatekt

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNull

class PrefixMapTests {
  @Test fun findWorks() {
    val map = PrefixMap<Int>(mapOf(
      "a.b" to 1
    ))
    assertEquals(1, map["a.b"])
    assertNull(map["unk"])
  }
  @Test fun findOrdered() {
    val map = PrefixMap<Int>(mapOf(
      "a.b" to 1,
      "a.b.c" to 2
    ))
    assertEquals(1, map["a.b.k"])
    assertEquals(2, map["a.b.c.k"])
  }
}