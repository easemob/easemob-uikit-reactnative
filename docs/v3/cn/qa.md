[返回父文档](./index.md)

- [问题列表](#问题列表)
  - [常见问题](#常见问题)
      - [修改代码，没有动态更新](#修改代码没有动态更新)
      - [使用 xcode 15.3，编译报错](#使用-xcode-153编译报错)
      - [xcode 15 编译报错](#xcode-15-编译报错)
      - [React-Native 占用空间非常大](#react-native-占用空间非常大)
      - [不支持 github 远程引用](#不支持-github-远程引用)
  - [专业问题](#专业问题)
      - [MIUI 12 字符串显示不全问题。](#miui-12-字符串显示不全问题)
  - [三方库问题](#三方库问题)
      - [@react-native-clipboard/clipboard 依赖问题](#react-native-clipboardclipboard-依赖问题)
      - [react-native-gesture-handler 依赖问题](#react-native-gesture-handler-依赖问题)
      - [react-native-safe-area-context 依赖问题](#react-native-safe-area-context-依赖问题)

# 问题列表

## 常见问题

#### 修改代码，没有动态更新

参考 1: 可能没有 `watchman` 工具。

#### 使用 xcode 15.3，编译报错

详细描述: Build Error on Xcode 15.3: "Called object type 'facebook::flipper::SocketCertificateProvider' is not a function or function pointer"
参考 1: https://stackoverflow.com/questions/78121217/build-error-on-xcode-15-3-called-object-type-facebookflippersocketcertifi
参考 2: https://github.com/facebook/react-native/issues/43335

#### xcode 15 编译报错

详细描述:
Showing Recent Errors Only
ios/Pods/boost/boost/container_hash/hash.hpp:131:33: No template named 'unary_function' in namespace 'std'; did you mean '\_\_unary_function'?
参考 1: https://github.com/facebook/react-native/issues/37748
参考 2: https://developer.apple.com/documentation/xcode-release-notes/xcode-15-release-notes

#### React-Native 占用空间非常大

这个是 RN 当前客观存在的问题，建议，尽量使用一个主流版本。例如：0.71.11，因为越多版本占用磁盘空间就会成倍的增加。

#### 不支持 github 远程引用

由于仓库是多包管理，并且由于部分文件是动态生成的，所以无法支持 git 地址引用。但是，目前提供本地打包服务。通过在指定目录（`packages/react-native-chat-uikit`），执行 `npm pack` 生成独立的 npm 包，可以放在本地使用。

## 专业问题

#### MIUI 12 字符串显示不全问题。

消息描述: 其它 android 设备没有问题，ios 设备都可以正常显示的字符串，MIUI 12 无法正常显示。
参考 1: https://github.com/facebook/react-native/issues/29259

## 三方库问题

#### @react-native-clipboard/clipboard 依赖问题

消息描述：在 react-native@0.73.2的应用，使用 pod 版本 1.12.1 版本可能遇到错误

```sh
[!] Invalid `RNCClipboard.podspec` file: undefined method `visionos' for #<Pod::Specification name="RNCClipboard">.
```

参考：1. 去该三方库官网，参考#241 的解决办法。
参考：2. 升级 pod 到 1.14.2 版本。

#### react-native-gesture-handler 依赖问题

消息描述：kotlin 的语法问题。
修改后：

```kotlin
decorateRuntime(jsContext!!.get())
```

#### react-native-safe-area-context 依赖问题

消息描述：kotlin 语法问题

```kotlin
  public override fun getTypedExportedConstants(): MutableMap<String, Any>? {
    return getInitialWindowMetrics()?.let { MapBuilder.of<String, Any>("initialWindowMetrics", it) }
  }
```
