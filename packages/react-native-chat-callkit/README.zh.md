_中文 | [English](./README.md)_

---

# react-native-chat-callkit

这是 agora callkit sdk 的说明文档。

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

在 agora chat sdk 基础上设计了 agora callkit sdk。通过 chat sdk 和 callkit sdk 可以实现单人或者多人音视频的实时通话。

该 sdk 主要提供 manager，listener，view 共同完成通话。

<table>
  <tr>
    <td>function</td>
    <td>description</td>
  </tr>
  <tr>
    <td>CallManager</td>
    <td style="font-size: 10px">提供添加和删除监听器等功能的管理器。</td>
  </tr>
  <tr>
    <td>CallListener</td>
    <td style="font-size: 10px">接收邀请、发送错误等通知的监听器</td>
  </tr>
  <tr>
    <td>SingleCall</td>
    <td style="font-size: 10px">
      提供单人聊天页面，提供邀请、接听、挂断等操作，支持音视频通话的页面。
    </td>
  </tr>
  <tr>
    <td>MultiCall</td>
    <td style="font-size: 10px">
      提供多人聊天页面，提供邀请、接听、挂断等操作的页面。
    </td>
  </tr>
</table>

### 管理器

`CallManager` 管理器主要进行通话管理。

提供的接口包括：

- addListener: 添加监听器
- removeListener: 移除监听器

### 监听器

`CallListener` 监听器可以接收通话邀请。

提供的接口包括：

- onCallReceived: 收到通话邀请通知。
- onCallOccurError: 收到错误通知。

### 页面

`SingleCall` 提供单人音视频页面组件，`MultiCall` 提供多人音视频页面组件。这两个组件有共同的功能，所以，还有基本的音视频组件 `BasicCall`。

通用组件提供的属性或者方法：

- inviterId: 邀请者 ID。
- inviterName: 邀请者昵称。
- inviterAvatar: 邀请者头像 url。
- currentId: 当前用户 ID。
- currentName: 当前用户昵称。
- currentAvatar: 当前用户头像 url。
- timeout: 超时时间。超时后自动挂断处理。
- bottomButtonType: 按钮组样式。对于需要设置初始样式的可以使用。
- muteVideo:是否禁用视频。
- callType: 音频类型还是视频类型。
- isInviter: 当前用户是否是邀请者。
- callState: 通话状态。
- isMinimize: 是否是最小化状态。
- isTest: 测试默认。默认不开启。
- onHangUp: 挂断通话通知。
- onCancel: 取消通话通知。只有邀请者收到。
- onRefuse: 拒绝通话通知。只有被邀请者收到。
- onClose: 关闭通话通知。需要用户关闭组件。
- onError: 通话错误通知。用户自行选择方式。
- onInitialized: 初始化完成通知。用户可以在该阶段进行相应处理。
- onSelfJoined: 自己加入通话通知。

单人组件提供的属性或者回调方法：

- inviteeId: 被邀请者 ID。
- onPeerJoined: 对方加入通话通知。

多人组件提供的属性或者回调方法：

- inviteeIds: 被邀请者列表 ID。
- inviteeList: 自定义被邀请者列表组件。

**说明** 多人音视频目前，最多支持 18 路视频，128 路音频。

## 示例演示

[参考](../../examples/callkit-example/README.zh.md)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
