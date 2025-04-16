package com.chatuikit

import android.util.Log
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.TurboReactPackage;
import java.util.HashMap

class ChatUikitPackage : TurboReactPackage() {
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    Log.d("ChatUikitPackage", "getModule: $name, ${ChatUikitModule.NAME}")
    return if (name == ChatUikitModule.NAME) {
      ChatUikitModule(reactContext)
    } else {
      null
    }
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      val moduleInfos: MutableMap<String, ReactModuleInfo> = HashMap()
      val isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
      Log.d("ChatUikitPackage", "isTurboModule: $isTurboModule")

      // 使用辅助类创建ReactModuleInfo
      moduleInfos[ChatUikitModule.NAME] = ReactModuleInfoHelper.createModuleInfo(
        ChatUikitModule.NAME,
        false,  // canOverrideExistingModule
        false,  // needsEagerInit
        false,  // isCxxModule
        isTurboModule // isTurboModule
      )

      moduleInfos
    }
  }
}
