_中文 | [English](./README.md)_

# 下载代码

方式1:

    通过代码库地址 `https://github.com/easemob/easemob-uikit-reactnative` 下载代码

方式2:

    从 `https://github.com/easemob/easemob-uikit-reactnative` 下载压缩包.

# 项目初始化

保证环境配置完成，如果没有配置请[参考](../../docs/v4/cn/env.md)

进入根目录，执行

```sh
yarn && yarn prepare
```

# 必要信息填写

进入 项目 `examples/room-example` 目录
找到 `env.ts` 文件，填写 `appKey` 等信息。

# 运行

进入 项目 `examples/room-example` 目录，执行

```sh
yarn run android
# 或者
yarn run ios
```

## iOS 集成模式

**SPM 模式（默认）**：本项目默认使用 `use_frameworks! :linkage => :dynamic` —— 根目录 `yarn prepare`（经由 `yarn patch:ios`）已在 `ios/Podfile.properties.json` 中设置 `ios.useFrameworks`，因此任何 `pod install` 都会得到动态集成。直接运行：

```sh
yarn run ios
```

**经典静态模式（手动切换）**：

1. 从 `ios/Podfile.properties.json` 中删除 `"ios.useFrameworks": "dynamic"` 条目。
2. 清理并重新安装 pods：

   ```sh
   cd ios
   rm -rf Pods Podfile.lock
   pod install
   cd ..
   ```

3. 运行 `yarn run ios`。

如需切回 SPM 模式，重新执行 `yarn patch:ios` 恢复该条目，然后重复第 2 步。
