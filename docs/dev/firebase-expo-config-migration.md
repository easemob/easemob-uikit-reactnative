# Firebase 配置方式迁移：从手动复制到 Expo Config Plugin

## 问题概述

项目从 React Native 0.76 迁移到 0.83（Expo SDK 55）后，Firebase 配置文件（`GoogleService-Info.plist` 和 `google-services.json`）的放置方式和集成方式发生了根本变化。旧版本采用手动复制到原生目录的方式，新版本通过 Expo config plugin 自动处理。

## 环境信息

| 项目                             | 旧版本 | 新版本  |
| -------------------------------- | ------ | ------- |
| react-native                     | 0.76   | 0.83.2  |
| Expo SDK                         | —      | 55      |
| @react-native-firebase/app       | —      | ^23.8.6 |
| @react-native-firebase/messaging | —      | ^23.8.6 |

## 旧版本做法（手动复制）

旧版本中，Firebase 配置文件需要手动复制到原生项目目录中：

```sh
cp templates/google-services.json.template examples/product-uikit-demo/android/app/google-services.json
cp templates/GoogleService-Info.plist.template examples/product-uikit-demo/ios/ChatUikitFullExample/GoogleService-Info.plist
```

这个做法与 [Firebase 官方文档](https://support.google.com/firebase/answer/7015592) 一致：

- iOS：将 `GoogleService-Info.plist` 放入 Xcode 项目根目录，并**添加到项目目标（target）**中
- Android：将 `google-services.json` 放入 module (app-level) 目录 `android/app/`

### 旧做法存在的问题

在当前 Expo prebuild 项目中，上述手动复制方式不再可行：

1. **`expo prebuild --clean` 会清除原生目录** — `prepare` 脚本每次执行 `expo prebuild --clean --no-install`，`ios/` 和 `android/` 目录会被重新生成，手动复制的文件会丢失。

2. **iOS target 名称已变更** — 旧路径 `ios/ChatUikitFullExample/` 在 expo prebuild 后变为 `ios/productuikitdemo/`（基于 `app.json` 的 `slug` 字段）。

3. **未添加到 Xcode 项目目标** — 即使手动复制文件到 `ios/` 目录，如果未将其添加到 Xcode 的 build target 中，文件不会被打包进 app bundle，运行时 Firebase SDK 找不到配置文件会崩溃。

4. **Android Gradle 插件未配置** — 手动复制 `google-services.json` 后，仍需在 `build.gradle` 中添加 `com.google.gms:google-services` 依赖和 `apply plugin`，否则 Firebase 无法在 Android 上初始化。

## 新版本做法（Expo Config Plugin）

### 配置文件放置位置

将配置文件放在**项目根目录**（`examples/product-uikit-demo/`），而非原生项目子目录：

```
examples/product-uikit-demo/
├── GoogleService-Info.plist    ← iOS 配置文件
├── google-services.json        ← Android 配置文件
├── app.json
├── package.json
└── ...
```

如果没有真实配置文件，可使用占位模板：

```sh
cp templates/google-services.json.template examples/product-uikit-demo/google-services.json
cp templates/GoogleService-Info.plist.template examples/product-uikit-demo/GoogleService-Info.plist
```

### app.json 配置

在 `app.json` 中添加以下配置：

```json
{
  "expo": {
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist",
      "entitlements": {
        "aps-environment": "production"
      },
      "infoPlist": {
        "UIBackgroundModes": ["remote-notification"]
      }
    },
    "android": {
      "googleServicesFile": "./google-services.json"
    },
    "plugins": [
      "@react-native-firebase/app",
      "@react-native-firebase/messaging"
    ]
  }
}
```

各字段说明：

| 字段                               | 平台          | 作用                                                  |
| ---------------------------------- | ------------- | ----------------------------------------------------- |
| `googleServicesFile`               | iOS / Android | 指定配置文件路径，config plugin 据此定位文件          |
| `entitlements.aps-environment`     | iOS           | 添加 APNs 推送权限，Expo SDK 51+ 不再自动添加         |
| `infoPlist.UIBackgroundModes`      | iOS           | 启用后台推送，允许 `setBackgroundMessageHandler` 工作 |
| `@react-native-firebase/app`       | 两端          | 自动执行所有原生配置步骤                              |
| `@react-native-firebase/messaging` | 两端          | Messaging 模块的原生配置                              |

### Config Plugin 自动执行的操作

`@react-native-firebase/app` 的 Expo config plugin（源码位于 `node_modules/@react-native-firebase/app/plugin/src/`）在 `expo prebuild` 时自动完成：

#### iOS 端

1. **复制配置文件** — 将 `GoogleService-Info.plist` 复制到 iOS 源码目录（如 `ios/productuikitdemo/GoogleService-Info.plist`）

2. **添加到 Xcode 项目目标** — 通过 `addResourceFileToGroup` 并设置 `isBuildFile: true`，确保文件被加入 build target，会被打包进 app bundle

   ```typescript
   // plugin/src/ios/googleServicesPlist.ts
   project = IOSConfig.XcodeUtils.addResourceFileToGroup({
     filepath: plistFilePath,
     groupName: projectName,
     project,
     isBuildFile: true, // 关键：添加到 build target
   });
   ```

3. **修改 AppDelegate** — 自动添加 Firebase 初始化代码：
   - Swift 项目：`import FirebaseCore` + `FirebaseApp.configure()`
   - ObjC 项目：`#import <Firebase/Firebase.h>` + `[FIRApp configure]`

#### Android 端

1. **复制配置文件** — 将 `google-services.json` 复制到 `android/app/`

2. **添加 buildscript 依赖** — 在根 `android/build.gradle` 添加 `com.google.gms:google-services`

3. **应用 Gradle 插件** — 在 `android/app/build.gradle` 添加 `apply plugin: 'com.google.gms.google-services'`

### 与 Firebase 官方文档的对应关系

| Firebase 官方文档的步骤       | 原生项目（手动操作）          | Expo 项目（config plugin 自动）                |
| ----------------------------- | ----------------------------- | ---------------------------------------------- |
| iOS：放入 Xcode 项目根目录    | 手动拖入 Xcode                | plugin 自动复制                                |
| iOS：添加到项目目标（target） | Xcode 中勾选 "Add to targets" | `addResourceFileToGroup` + `isBuildFile: true` |
| iOS：初始化 Firebase          | 手动修改 AppDelegate          | plugin 自动注入 `FirebaseApp.configure()`      |
| Android：放入 `android/app/`  | 手动复制                      | plugin 自动复制                                |
| Android：配置 Gradle 插件     | 手动编辑 build.gradle         | plugin 自动添加依赖和 apply                    |

## Firebase v23 迁移注意事项

根据 [React Native Firebase v23 迁移指南](https://rnfirebase.io/migrating-to-v23)：

| 变更                          | 说明                                                                     |
| ----------------------------- | ------------------------------------------------------------------------ |
| Android `minSdk` 提升到 23    | 从 21 提升到 23                                                          |
| iOS 最低部署目标提升到 15     | 从 13 提升到 15，当前 Podfile 已设为 15.1                                |
| 最低 Xcode 16.2               | Expo SDK 55 要求 Xcode 26，满足此要求                                    |
| Firebase Dynamic Links 已移除 | 本项目未使用，不受影响                                                   |
| Compat API 仍可用             | `fcm.ts` 中使用的 v8 风格 API 在 v23 中继续工作，但会有 deprecation 警告 |

## FCM 推送相关的 iOS 配置说明

根据 [Firebase Cloud Messaging 官方文档](https://rnfirebase.io/messaging/usage)：

- `aps-environment` entitlement：自 Expo SDK 51 起不再自动添加，需手动在 `app.json` 中声明
- `UIBackgroundModes: ["remote-notification"]`：允许 app 在后台接收推送消息，使 `setBackgroundMessageHandler` 能正常触发
- iOS 在后台收到消息时会静默启动 app，可通过 `messaging().getIsHeadless()` 判断启动状态

## 相关文件

- `examples/product-uikit-demo/app.json` — Expo 配置，包含 Firebase plugin 和 googleServicesFile
- `examples/product-uikit-demo/GoogleService-Info.plist` — iOS Firebase 配置（占位或真实文件）
- `examples/product-uikit-demo/google-services.json` — Android Firebase 配置（占位或真实文件）
- `examples/product-uikit-demo/src/demo/common/fcm.ts` — FCM 推送相关代码
- `templates/GoogleService-Info.plist.template` — iOS 配置文件占位模板
- `templates/google-services.json.template` — Android 配置文件占位模板

## 参考

- [React Native Firebase 官方文档 - Expo 集成](https://rnfirebase.io/)
- [React Native Firebase v23 迁移指南](https://rnfirebase.io/migrating-to-v23)
- [Firebase Cloud Messaging 使用指南](https://rnfirebase.io/messaging/usage)
- [Firebase 配置文件下载说明](https://support.google.com/firebase/answer/7015592)
- [Expo SDK 55 Changelog](https://expo.dev/changelog/sdk-55)
- [Expo SDK 55 升级指南](https://expo.dev/blog/upgrading-to-sdk-55)
- [GitHub Issue #8840 - messaging plugin 配置化](https://github.com/invertase/react-native-firebase/issues/8840) — SDK 55 移除 `notification` 字段后，Firebase messaging plugin 的 Android 通知图标/颜色配置问题（尚未解决）
