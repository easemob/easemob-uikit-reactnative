package com.chatroom

import android.graphics.Color
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.ChatRoomViewManagerInterface
import com.facebook.react.viewmanagers.ChatRoomViewManagerDelegate

@ReactModule(name = ChatRoomViewManager.NAME)
class ChatRoomViewManager : SimpleViewManager<ChatRoomView>(),
  ChatRoomViewManagerInterface<ChatRoomView> {
  private val mDelegate: ViewManagerDelegate<ChatRoomView>

  init {
    mDelegate = ChatRoomViewManagerDelegate(this)
  }

  override fun getDelegate(): ViewManagerDelegate<ChatRoomView>? {
    return mDelegate
  }

  override fun getName(): String {
    return NAME
  }

  public override fun createViewInstance(context: ThemedReactContext): ChatRoomView {
    return ChatRoomView(context)
  }

  @ReactProp(name = "color")
  override fun setColor(view: ChatRoomView?, color: Int?) {
    view?.setBackgroundColor(color ?: Color.TRANSPARENT)
  }

  companion object {
    const val NAME = "ChatRoomView"
  }
}
