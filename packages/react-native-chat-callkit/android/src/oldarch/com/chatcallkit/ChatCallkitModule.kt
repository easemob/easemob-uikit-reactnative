package com.chatcallkit

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = ChatCallkitModule.NAME)
class ChatCallkitModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {
  private var implementation: ChatCallkitModuleImpl = ChatCallkitModuleImpl(reactContext)

  override fun getName(): String {
    return NAME
  }

  // Example method - synchronous or asynchronous version
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod(isBlockingSynchronousMethod = false)
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
    const val NAME = "ChatCallkit"
  }
}
