# iOS 模拟器运行时常见消息说明

## 问题概述

通过 `yarn run ios` 启动应用后，模拟器运行时日志中会出现若干系统级或 Firebase 相关的消息。本文档对这些常见消息逐一说明其含义、严重程度和处理建议。

## 环境信息

| 项目                             | 版本          |
| -------------------------------- | ------------- |
| react-native                     | 0.83.2        |
| Expo SDK                         | 55            |
| @react-native-firebase/app       | ^23.8.6       |
| @react-native-firebase/messaging | ^23.8.6       |
| Xcode                            | 26            |
| 模拟器                           | iPhone 16 Pro |

## 消息列表

### 1. CFMessagePort 错误

```
[UIKitCore] Error creating the CFMessagePort needed to communicate with PPT.
```

| 属性         | 说明               |
| ------------ | ------------------ |
| 严重程度     | 可忽略             |
| 来源         | UIKitCore 系统框架 |
| 是否需要处理 | 否                 |

PPT 是 "Pasteboard Proxy Tool"（剪贴板代理工具）的缩写。这是 iOS 模拟器的一个已知系统级消息，与应用代码无关。在真机上不会出现，对应用功能没有任何影响。

### 2. FirebaseMessaging 自动代理通知

```
[FirebaseMessaging][I-FCM001000] FIRMessaging Remote Notifications proxy enabled,
will swizzle remote notification receiver handlers. If you'd prefer to manually
integrate Firebase Messaging, add "FirebaseAppDelegateProxyEnabled" to your
Info.plist, and set it to NO.
```

| 属性         | 说明                   |
| ------------ | ---------------------- |
| 严重程度     | 信息性提示，非错误     |
| 来源         | Firebase Messaging SDK |
| 是否需要处理 | 一般无需处理           |

Firebase Messaging 默认启用 method swizzling（方法混写），自动代理 `AppDelegate` 中的远程推送通知回调（如 `didReceiveRemoteNotification`、`didRegisterForRemoteNotificationsWithDeviceToken` 等）。

- **保持默认**（推荐）：无需任何操作，Firebase 自动处理推送注册和 token 管理。
- **手动集成**：如需完全控制推送处理流程，可在 `Info.plist` 中设置 `FirebaseAppDelegateProxyEnabled = NO`，然后按照 [Firebase 官方文档](https://firebase.google.com/docs/cloud-messaging/ios/client#method_swizzling_in_firebase_messaging) 手动实现相关回调。

> 注意：本项目使用 Expo prebuild，`Info.plist` 由 Expo 生成。如需禁用 swizzling，应在 `app.json` 的 `expo.ios.infoPlist` 中配置：
>
> ```json
> {
>   "expo": {
>     "ios": {
>       "infoPlist": {
>         "FirebaseAppDelegateProxyEnabled": false
>       }
>     }
>   }
> }
> ```

### 3. Firebase Installations 注册失败（API key 无效）

```
[FirebaseInstallations][I-FIS002003] Firebase Installation registration failed
for app with name: __FIRAPP_DEFAULT, error:
The server responded with an error:
- URL: https://firebaseinstallations.googleapis.com/v1/projects/test-push-6b4b6/installations/
- HTTP status code: 400
- Response body: {
  "error": {
    "code": 400,
    "message": "API key not valid. Please pass a valid API key.",
    "status": "INVALID_ARGUMENT"
  }
}

Please make sure you use valid GoogleService-Info.plist
```

| 属性         | 说明                       |
| ------------ | -------------------------- |
| 严重程度     | 重要错误                   |
| 来源         | Firebase Installations SDK |
| 是否需要处理 | 是                         |

Firebase Installations 是 Firebase 的基础服务，用于为每个 app 实例生成唯一标识（FID）。注册失败意味着 Firebase 的核心功能（包括 FCM 推送、Analytics 等）都无法正常工作。

#### 原因

`GoogleService-Info.plist` 中的 `API_KEY` 无效。可能的情况：

1. **使用了占位模板** — `templates/GoogleService-Info.plist.template` 中的 API key 为开发占位值，可能已过期或被撤销。
2. **API key 被 Google Cloud Console 限制** — key 可能设置了 bundle ID 或 IP 限制，与当前环境不匹配。
3. **Firebase 项目配置变更** — Firebase 项目 `test-push-6b4b6` 的 API key 已被重新生成。

#### 解决方法

1. 前往 [Firebase Console](https://console.firebase.google.com/) -> 选择项目 `test-push-6b4b6` -> 项目设置（齿轮图标）-> 常规 -> 下载最新的 `GoogleService-Info.plist`。

2. 替换以下文件：

   ```sh
   # 模板文件
   cp ~/Downloads/GoogleService-Info.plist templates/GoogleService-Info.plist.template

   # 项目根目录（Expo config plugin 读取此文件）
   cp ~/Downloads/GoogleService-Info.plist examples/product-uikit-demo/GoogleService-Info.plist

   # iOS 原生目录（prebuild 后的产物，也可由 expo prebuild 自动生成）
   cp ~/Downloads/GoogleService-Info.plist examples/product-uikit-demo/ios/productuikitdemo/GoogleService-Info.plist
   ```

3. 重新构建：`yarn run ios`

> 如果仅做本地开发调试且不需要推送功能，此错误不会阻止 app 运行，但与 Firebase 相关的功能将不可用。

### 4. 缺少 firebase.json 配置文件

```
[CP-User] [RNFB] Core Configuration
A firebase.json file was not found, whilst this file is optional it is recommended
to include it to configure firebase services in React Native Firebase.
```

| 属性         | 说明                           |
| ------------ | ------------------------------ |
| 严重程度     | 低（建议修复）                 |
| 来源         | React Native Firebase 构建脚本 |
| 是否需要处理 | 建议补充                       |

React Native Firebase 在构建阶段检查项目根目录是否存在 `firebase.json`，用于配置 Firebase 服务的行为（如 Crashlytics 自动收集、Messaging 自动初始化等）。

#### 解决方法

在 `examples/product-uikit-demo/` 目录下创建一个最小的 `firebase.json`：

```json
{
  "react-native": {
    "messaging_auto_init_enabled": true,
    "messaging_android_notification_channel_id": "default"
  }
}
```

详见 [React Native Firebase - firebase.json 配置](https://rnfirebase.io/#configure-firebase-services-optional)。

### 5. 链接器警告：重复库

```
⚠️ ld: ignoring duplicate libraries: '-lc++'
```

| 属性         | 说明               |
| ------------ | ------------------ |
| 严重程度     | 可忽略             |
| 来源         | Xcode 链接器（ld） |
| 是否需要处理 | 否                 |

多个 Pod 依赖同时链接了 `libc++`，链接器自动去重并给出提示。不影响编译结果和运行。

### 6. Watchman recrawl 警告

```
Recrawled this watch 1 time, most recently because:
MustScanSubDirs UserDroppedTo resolve, please review the information on
https://facebook.github.io/watchman/docs/troubleshooting.html#recrawl
```

| 属性         | 说明                       |
| ------------ | -------------------------- |
| 严重程度     | 低                         |
| 来源         | Watchman（Metro 文件监听） |
| 是否需要处理 | 可选                       |

Watchman 检测到文件系统变化需要重新扫描。常见于大型 monorepo 或 `expo prebuild` 后目录结构大幅变化的场景。

#### 清除方法

```sh
watchman watch-del '/Users/asterisk/tmp2026/2026-02-28'
watchman watch-project '/Users/asterisk/tmp2026/2026-02-28'
```

## 消息严重程度汇总

| 消息                                | 严重程度 | 影响                       | 处理建议                      |
| ----------------------------------- | -------- | -------------------------- | ----------------------------- |
| CFMessagePort 错误                  | 可忽略   | 无                         | 无需处理                      |
| FirebaseMessaging swizzling 通知    | 信息     | 无                         | 保持默认                      |
| Firebase Installations API key 无效 | **重要** | 推送等 Firebase 功能不可用 | 更新 GoogleService-Info.plist |
| 缺少 firebase.json                  | 低       | 无法自定义 Firebase 行为   | 建议补充                      |
| 重复库链接警告                      | 可忽略   | 无                         | 无需处理                      |
| Watchman recrawl                    | 低       | 可能导致 Metro 短暂卡顿    | 可选清除                      |

## 相关文件

- `examples/product-uikit-demo/GoogleService-Info.plist` — iOS Firebase 配置文件
- `examples/product-uikit-demo/google-services.json` — Android Firebase 配置文件
- `examples/product-uikit-demo/app.json` — Expo 配置（含 Firebase plugin）
- `templates/GoogleService-Info.plist.template` — iOS 配置文件占位模板
- `templates/google-services.json.template` — Android 配置文件占位模板

## 参考

- [Firebase Cloud Messaging iOS 客户端 - Method Swizzling](https://firebase.google.com/docs/cloud-messaging/ios/client#method_swizzling_in_firebase_messaging)
- [React Native Firebase - firebase.json 配置](https://rnfirebase.io/#configure-firebase-services-optional)
- [Watchman 故障排查 - Recrawl](https://facebook.github.io/watchman/docs/troubleshooting.html#recrawl)
- [Firebase 配置文件下载说明](https://support.google.com/firebase/answer/7015592)
