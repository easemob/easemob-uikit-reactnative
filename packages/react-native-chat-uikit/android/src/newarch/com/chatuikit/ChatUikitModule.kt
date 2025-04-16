package com.chatuikit

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = ChatUikitModule.NAME)
class ChatUikitModule(reactContext: ReactApplicationContext) :
  NativeChatUikitSpec(reactContext) {
    private var implementation: ChatUikitModuleImpl = ChatUikitModuleImpl(reactContext)

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
    const val NAME = "ChatUikit"
  }
}
