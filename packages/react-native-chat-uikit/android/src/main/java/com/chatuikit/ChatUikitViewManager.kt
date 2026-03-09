package com.chatuikit

import android.graphics.Color
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.ChatUikitViewManagerInterface
import com.facebook.react.viewmanagers.ChatUikitViewManagerDelegate

@ReactModule(name = ChatUikitViewManager.NAME)
class ChatUikitViewManager : SimpleViewManager<ChatUikitView>(),
  ChatUikitViewManagerInterface<ChatUikitView> {
  private val mDelegate: ViewManagerDelegate<ChatUikitView>

  init {
    mDelegate = ChatUikitViewManagerDelegate(this)
  }

  override fun getDelegate(): ViewManagerDelegate<ChatUikitView>? {
    return mDelegate
  }

  override fun getName(): String {
    return NAME
  }

  public override fun createViewInstance(context: ThemedReactContext): ChatUikitView {
    return ChatUikitView(context)
  }

  @ReactProp(name = "color")
  override fun setColor(view: ChatUikitView?, color: Int?) {
    view?.setBackgroundColor(color ?: Color.TRANSPARENT)
  }

  companion object {
    const val NAME = "ChatUikitView"
  }
}
