package com.chatuikit

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = ChatUikitModule.NAME)
class ChatUikitModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {
  private var implementation: ChatUikitModuleImpl = ChatUikitModuleImpl(reactContext)

  override fun getName(): String {
    return NAME
  }

  // Example method - synchronous version
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod(isBlockingSynchronousMethod = true)
  fun multiply(a: Double, b: Double): Double {
    return implementation.multiply(a, b)
  }

  @ReactMethod
  fun addListener(eventName: String) {
    // Keep: Required for RN built in Event Emitter Calls
  }

  @ReactMethod
  fun removeListeners(count: Int) {
    // Keep: Required for RN built in Event Emitter Calls
  }

  companion object {
    const val NAME = "ChatUikit"
  }
}
