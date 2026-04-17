package com.chatroom

import android.os.Build
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = ChatRoomEnvironmentModule.NAME)
class ChatRoomEnvironmentModule(
  reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {
  override fun getName(): String {
    return NAME
  }

  override fun getConstants(): Map<String, Any?> {
    return mapOf(
      "sdkInt" to Build.VERSION.SDK_INT,
      "edgeToEdgeEnabled" to resolveEdgeToEdgeEnabled()
    )
  }

  private fun resolveEdgeToEdgeEnabled(): Boolean {
    val sdkInt = Build.VERSION.SDK_INT
    val defaultValue = sdkInt >= 35

    val activity = reactApplicationContext.currentActivity ?: return defaultValue
    return try {
      val buildConfigClass = Class.forName("${activity.packageName}.BuildConfig")
      val field = buildConfigClass.getField("IS_EDGE_TO_EDGE_ENABLED")
      field.getBoolean(false)
    } catch (_: NoSuchFieldException) {
      true
    } catch (_: Throwable) {
      true
    }
  }

  companion object {
    const val NAME = "ChatRoomEnvironment"
  }
}
