_中文 | [English](./README.md)_

---

# react-native-chat-uikit

这是 agora uikit sdk 的说明文档。

## 环境需求

- react-native: 0.63.5 以上
- nodejs: 16.18.0 以上

## 下载地址

```sh
git clone git@github.com:AgoraIO-Usecase/AgoraChat-UIKit-rn.git
```

## 初始化

在终端命令工具中，切换到 项目根目录。

```sh
cd react-native-chat-library
yarn && yarn run generate-source-env
```

## 基本介绍

在 agora chat sdk 基础上设计了 agora uikit sdk。通过这些 UI 组件可以更加高效的实现应用开发。除了 UI 组件还提供了必要的 agora chat sdk 的封装以及一些基础工具，尽最大可能提供开发应用的便利性。

<table>
  <tr>
    <td>module</td>
    <td>function</td>
    <td>description</td>
  </tr>
  <tr>
    <td rowspan="5" style="font-weight: bold">Conversation List</td>
  </tr>
  <tr>
    <td>Conversation list</td>
    <td style="font-size: 10px">
      The session list displays the profile avatar, nickname, latest message
      content, unread message count, time and slide menu.
    </td>
  </tr>
  <tr>
    <td>Add conversation</td>
    <td style="font-size: 10px">
      Add the conversation from the conversation list
    </td>
  </tr>
  <tr>
    <td>Update conversation</td>
    <td style="font-size: 10px">
      Update the conversation from the conversation list
    </td>
  </tr>
  <tr>
    <td>Delete conversation</td>
    <td style="font-size: 10px">
      Deletes the conversation from the conversation list
    </td>
  </tr>
  <tr>
    <td rowspan="5" style="font-weight: bold">Chat</td>
  </tr>
  <tr>
    <td>Message Bubble</td>
    <td style="font-size: 10px">
      内置部分基础类型消息气泡样式，支持自定义消息气泡样式。
    </td>
  </tr>
  <tr>
    <td>Send Message</td>
    <td style="font-size: 10px">支持消息发送</td>
  </tr>
  <tr>
    <td>Message Bubble Event</td>
    <td style="font-size: 10px">支持消息气泡的点击、长按事件。</td>
  </tr>
  <tr>
    <td>emoji</td>
    <td style="font-size: 10px">支持unicode码的墨迹表情。</td>
  </tr>
  <tr>
    <td colspan="3">More features in development...</td>
  </tr>
</table>

## 功能列表

### 会话列表组件

- 提供的接口
  - update: 更新会话列表项
  - create: 创建会话列表项
  - remove: 移除会话列表项
  - updateRead: 设置会话已读
  - updateExtension: 设置会话自定义字段
- 提供的属性或者事件回调
  - propsRef: 设置会话列表控制器
  - onLongPress: 通知长按会话列表项
  - onPress: 通知点击会话列表项
  - onUpdateReadCount: 通知会话列表项更新
  - sortPolicy: 设置会话列表项排序规则
  - RenderItem: 自定义列表项的样式

### 聊天详情组件

- 提供的接口
  - sendTextMessage: 发送文本消息
  - sendImageMessage: 发送图片消息
  - sendVoiceMessage: 发送语音消息
  - sendCustomMessage: 发送自定义消息
  - sendFileMessage: 发送文件消息
  - sendVideoMessage: 发送视频消息
  - sendLocationMessage: 发送定位消息
  - loadHistoryMessage: 加载历史消息
  - deleteLocalMessage: 删除本地消息
  - resendMessage: 重新发送失败的消息
  - downloadAttachment: 下载消息附件
- 提供的属性或者事件回调
  - propsRef: 设置聊天组件控制器
  - screenParams: 设置聊天组件的参数
  - messageBubbleList: 自定义消息气泡组件
  - onUpdateReadCount: 通知更新消息未读数
  - onClickMessageBubble: 点击消息气泡通知
  - onLongPressMessageBubble: 长按消息气泡通知
  - onClickInputMoreButton: 点击更多按钮通知
  - onPressInInputVoiceButton: 按下语音按钮通知
  - onPressOutInputVoiceButton: 抬起语音按钮通知
  - onSendMessage: 发送消息前的通知
  - onSendMessageEnd: 发送消息结束的通知
  - onVoiceRecordEnd: 录制语音消息结束的通知

**聊天气泡组件**

- 提供的接口
  - scrollToEnd: 滚动到页面下方
  - scrollToTop: 滚动到页面上方
  - addMessage: 添加消息
  - updateMessageState: 更新消息状态
  - delMessage: 删除消息气泡项
  - resendMessage: 重新发送消息
- 提供的属性或者事件回调
  - onRequestHistoryMessage: 下拉刷新请求历史消息通知
  - TextMessageItem: 自定义文本消息的样式
  - ImageMessageItem: 自定义图片消息的样式
  - VoiceMessageItem: 自定义语音消息的样式
  - FileMessageItem: 自定义文件消息的样式
  - LocationMessageItem: 自定义定位消息的样式
  - VideoMessageItem: 自定义视频消息的样式
  - CustomMessageItem: 自定义自定义消息的样式

### 其它组件

其它组件处于实验性阶段，如果感兴趣可以尝试使用。

UI 基础组件：提供基本的样式和使用。[参考](./src/components)
国际化工具：提供界面语言的设置。[参考](./src/I18n2)
模态组件管理工具：提供统一的模态窗口显示和隐藏。[参考](./src/events/index.tsx)
工具类：提供必要的功能。[参考](./src/utils)
粘贴板服务：提供复制粘贴服务。
持久化存储服务：提供 key-value 服务。
媒体服务：提供打开媒体库，选择图片、视频、文件服务。
权限服务：提供 ios 或者 android 平台权限申请的服务。
文件服务：提供文件夹的管理服务。

## 示例演示

[参考](../../example/README.zh.md)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
