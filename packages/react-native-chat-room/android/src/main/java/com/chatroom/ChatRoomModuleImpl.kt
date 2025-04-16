package com.chatroom

import com.facebook.react.bridge.ReactApplicationContext

class ChatRoomModuleImpl(reactContext: ReactApplicationContext) {

  fun multiply(a: Double, b: Double): Double {
    return a * b
  }

}
