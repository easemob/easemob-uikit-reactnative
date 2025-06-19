package com.chatcallkit

import com.facebook.react.module.model.ReactModuleInfo

object ReactModuleInfoHelper {
  fun createModuleInfo(
    name: String,
    canOverride: Boolean,
    needsEagerInit: Boolean,
    isCxxModule: Boolean,
    isTurboModule: Boolean
  ): ReactModuleInfo {
    return ReactModuleInfo(
      name,
      name,
      canOverride,
      needsEagerInit,
      true, // hasConstants
      isCxxModule,
      isTurboModule
    )
  }
}

