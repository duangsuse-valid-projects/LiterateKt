package org.duangsuse.literatekt

import org.duangsuse.literatekt.cmdline.LiterateKtCommandParser

object Main {
  @JvmStatic
  fun main(vararg args: String) {
    val cfg = LiterateKtCommandParser(*args).run()
    println(cfg)
  }
}