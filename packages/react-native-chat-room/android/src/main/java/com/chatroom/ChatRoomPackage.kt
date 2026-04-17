package com.chatroom

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager

class ChatRoomViewPackage : BaseReactPackage() {
  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return listOf(ChatRoomViewManager())
  }

  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return when (name) {
      ChatRoomEnvironmentModule.NAME -> ChatRoomEnvironmentModule(reactContext)
      else -> null
    }
  }

  override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
    mapOf(
      ChatRoomEnvironmentModule.NAME to ReactModuleInfo(
        ChatRoomEnvironmentModule.NAME,
        ChatRoomEnvironmentModule::class.java.name,
        false,
        false,
        true,
        false,
        false
      )
    )
  }
}
