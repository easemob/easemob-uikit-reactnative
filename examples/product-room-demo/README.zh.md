_中文 | [English](./README.md)_

---

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

进入 项目 `examples/product-room-demo` 目录
找到 `env.ts` 文件，填写 `appKey` 等信息。

# 运行

进入 项目 `examples/product-room-demo` 目录，执行

```sh
yarn run android
# 或者
yarn run ios
```

默认 ios 可以自动运行 调试服务。如果没有运行调试服务，可以手动运行。

```sh
yarn run start
```

选择对应的设备：包括 ios设备、模拟器，android设备、模拟器。
