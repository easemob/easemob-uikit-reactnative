package com.chatcallkit

import android.util.Log
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.TurboReactPackage;
import java.util.HashMap

class ChatCallkitPackage : TurboReactPackage() {
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return if (name == ChatCallkitModule.NAME) {
      ChatCallkitModule(reactContext)
    } else {
      null
    }
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      val moduleInfos: MutableMap<String, ReactModuleInfo> = HashMap()
      val isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
      Log.d("ChatCallkitPackage", "isTurboModule: $isTurboModule")

      // 使用辅助类创建ReactModuleInfo
      moduleInfos[ChatCallkitModule.NAME] = ReactModuleInfoHelper.createModuleInfo(
        ChatCallkitModule.NAME,
        false,  // canOverrideExistingModule
        false,  // needsEagerInit
        false,  // isCxxModule
        isTurboModule // isTurboModule
      )

      moduleInfos
    }
  }
}
