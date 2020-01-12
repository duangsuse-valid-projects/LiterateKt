package org.duangsuse.literatekt

import org.duangsuse.literatekt.cmdline.Command
import org.duangsuse.literatekt.cmdline.LiterateKtCommandParser
import kotlin.test.Test
import kotlin.test.assertEquals

class CommandKtTests {
  @Test fun commandParser() {
    val args = arrayOf("-Test", "-t", "gradleVersion=1.0", "-d", "build")
    val res = LiterateKtCommandParser(*args).run()
    assertEquals(Command("est", mapOf("gradleVersion" to "1.0"), ".", "build"), res)
  }
}