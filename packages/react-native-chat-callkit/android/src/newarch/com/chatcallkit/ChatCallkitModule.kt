package com.chatcallkit

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = ChatCallkitModule.NAME)
class ChatCallkitModule(reactContext: ReactApplicationContext) :
  NativeChatCallkitSpec(reactContext) {
    private var implementation: ChatCallkitModuleImpl = ChatCallkitModuleImpl(reactContext)

  override fun getName(): String {
    return NAME
  }

  // For new architecture - needed for TurboModule
  override fun multiply(a: Double, b: Double): Double = implementation.multiply(a, b)

  override fun addListener(eventName: String) {
    // Keep: Required for RN built in Event Emitter Calls
  }

  override fun removeListeners(count: Double) {
    // Keep: Required for RN built in Event Emitter Calls
  }

  companion object {
    const val NAME = "ChatCallkit"
  }
}

