# Expo 示例应用设备选择与定向运行（Android / iOS）

本文总结在本仓库中使用 Yarn + Expo CLI 运行示例应用时，如何查看可用设备并通过 `--device` 指定目标设备。

## 适用范围

- Monorepo：`react-native-chat-library-4.0`
- 示例应用（以 `examples/product-uikit-demo` 为例）
- 脚本：
  - Android: `expo run:android`
  - iOS: `expo run:ios`

示例目录：

```bash
cd examples/product-uikit-demo
```

## Android

### 1) 查看已连接设备（ADB）

```bash
adb devices -l
```

输出示例字段：

- 序列号：`AJTLVB4C19001899`
- `model:`：`PTP_AN00`
- `device:`：`HNPLP`

### 2) 启动 Android 模拟器

先查看本机可用 AVD：

```bash
emulator -list-avds
```

启动指定模拟器（示例）：

```bash
emulator -avd Pixel_2_XL_API_31
```

启动后可用以下命令确认是否在线：

```bash
adb devices -l
```

也可以在 Android Studio 的 Device Manager 中手动启动模拟器。

补充：如果 AVD 已存在但未启动，`yarn android -d <AVD_NAME>` 在很多情况下会自动拉起该模拟器。

### 3) `expo run:android -d` 识别规则（关键）

`expo run:android --device` 在 Android 端按 **Expo 内部设备名 `name` 精确匹配**，不是按 ADB 序列号匹配。

- 常见真机 `name` 来源于 ADB `model:` 字段
- 因此应优先使用 `PTP_AN00` 这种值，而不是 `AJTLVB4C19001899`
- 对模拟器，不要用 `adb devices -l` 里的 `model`（例如 `sdk_gphone64_arm64`），应使用 **AVD 名称**

模拟器 AVD 名称可通过以下命令获取：

```bash
adb -s emulator-5554 emu avd name
```

例如输出 `Pixel_2_XL_API_31`，则应使用：

```bash
yarn android -d Pixel_2_XL_API_31
```

### 4) 查看 Expo 实际识别到的 Android name

```bash
node -e "const { getDevicesAsync } = require('@expo/cli/build/src/start/platforms/android/getDevices'); getDevicesAsync().then(ds => console.table(ds.map(({name,pid,type,isBooted}) => ({name,pid,type,isBooted}))))"
```

### 5) 指定真机运行

```bash
yarn android -d PTP_AN00
```

也可交互选择：

```bash
yarn android -d
```

## iOS

### 1) 查看设备与模拟器列表

```bash
xcrun xctrace list devices
```

可选补充（仅模拟器）：

```bash
xcrun simctl list devices available
```

### 2) `expo run:ios -d` 识别规则

`expo run:ios --device` 支持：

- 设备名（name）
- UDID（推荐，唯一且稳定）

### 3) 指定 iOS 真机运行（推荐 UDID）

```bash
yarn ios -d 00008110-000E2C660A12801E
```

也可以使用名称（有空格需加引号）：

```bash
yarn ios -d "AsteriskiPhone13mini"
```

交互选择：

```bash
yarn ios -d
```

## 在仓库根目录运行的等价命令

```bash
cd /Users/asterisk/Codes/rn/react-native-chat-library-4.0

# Android
yarn workspace product-uikit-demo android -d PTP_AN00

# iOS
yarn workspace product-uikit-demo ios -d 00008110-000E2C660A12801E
```

## 常见问题

1. Android 提示 `Could not find device with name`

原因通常是把 ADB 序列号或其它字段传给了 `-d`。请改用 Expo 识别的 `name`：

- 真机通常用 `model:` 对应值（如 `PTP_AN00`）
- 模拟器用 AVD 名称（如 `Pixel_2_XL_API_31`），不要用 `sdk_gphone64_arm64`

2. iOS 设备在 `Devices Offline`

离线设备无法用于构建安装。请先连接线缆、解锁设备、信任电脑，并确认开发者模式可用。
