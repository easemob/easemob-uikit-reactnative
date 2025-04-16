package com.chatroom

import android.util.Log
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.TurboReactPackage;
import java.util.HashMap

class ChatRoomPackage : TurboReactPackage() {
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return if (name == ChatRoomModule.NAME) {
      ChatRoomModule(reactContext)
    } else {
      null
    }
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      val moduleInfos: MutableMap<String, ReactModuleInfo> = HashMap()
      val isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
      Log.d("ChatRoomPackage", "isTurboModule: $isTurboModule")

      // 使用辅助类创建ReactModuleInfo
      moduleInfos[ChatRoomModule.NAME] = ReactModuleInfoHelper.createModuleInfo(
        ChatRoomModule.NAME,
        false,  // canOverrideExistingModule
        false,  // needsEagerInit
        false,  // isCxxModule
        isTurboModule // isTurboModule
      )

      moduleInfos
    }
  }
}
