package com.chatuikit

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager

class ChatUikitViewPackage : BaseReactPackage() {
  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return listOf(ChatUikitViewManager())
  }

  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return when (name) {
      ChatUikitEnvironmentModule.NAME -> ChatUikitEnvironmentModule(reactContext)
      else -> null
    }
  }

  override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
    mapOf(
      ChatUikitEnvironmentModule.NAME to ReactModuleInfo(
        ChatUikitEnvironmentModule.NAME,
        ChatUikitEnvironmentModule::class.java.name,
        false,
        false,
        true,
        false,
        false
      )
    )
  }
}
