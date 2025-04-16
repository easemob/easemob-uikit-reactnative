package com.chatcallkit

import com.facebook.react.bridge.ReactApplicationContext

class ChatCallkitModuleImpl(reactContext: ReactApplicationContext) {

  fun multiply(a: Double, b: Double): Double {
    return a * b
  }

}
