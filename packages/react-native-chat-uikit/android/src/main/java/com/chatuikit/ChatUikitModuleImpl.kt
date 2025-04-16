package com.chatuikit

import com.facebook.react.bridge.ReactApplicationContext

class ChatUikitModuleImpl(reactContext: ReactApplicationContext) {

  fun multiply(a: Double, b: Double): Double {
    return a * b
  }

}
