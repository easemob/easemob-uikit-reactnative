[返回父文档](./index.md)

- [CallKit 介绍](#callkit-介绍)
  - [初始化](#初始化)
  - [信令部分](#信令部分)
  - [界面部分](#界面部分)

# CallKit 介绍

支持单群聊音视频通话。

## 初始化

必须填写参数 `appKey`。其它注册回调参数也非常重要，需要和音视频库有交互。详见 `GlobalContainerProps`属性介绍。

详见 `example/src/demo/App.tsx` 示例[源码](../../../example/src/demo/App.tsx)。

## 信令部分

信令是单群聊中音视频的控制指令。需要通过 `chat`提供的收发消息实现。 当前没有单独暴露，需要结合 UI 组件一起使用。后续考虑暴露，增加自定义 UI 组件的灵活性。

## 界面部分

UI 组件主要提供了单聊和群聊 UI 组件，支持音频和视频的通话。

详见 `example/src/demo/common/AVView.tsx` 示例[源码](../../../example/src/demo/common/AVView.tsx)。
