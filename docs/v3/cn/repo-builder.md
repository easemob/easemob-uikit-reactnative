[返回父文档](./index.md)

# 仓库构建介绍

该多包仓库构建和普通项目大部分是一样的。只是多了全局配置和多包管理，优化了依赖项的重复使用等。

构建该项目应该按照以下的大致流程进行操作。

在 MacOS 系统下，进行如下操作:

1. 下载仓库
2. 运行脚本执行初始化
3. 配置文件
4. 添加必要文件（可选）

#### 下载仓库

仓库地址为：`https://github.com/easemob/react-native-chat-library/`

如果通过 git 命令下载，还需要切换到对应分支。

```sh
git clone --branch dev git@github.com:easemob/react-native-chat-library.git
```

#### 运行脚本和命令

在仓库根目录执行命令

```sh
# 初始化项目
yarn

# 生成配置文件 env.ts / config.local.ts / version.ts 等
# 执行之后，会在对应目录中添加这些文件。如果没有添加请查看原因，或者手动添加。
yarn yarn-prepack
```

#### 添加必要文件（可选）

如果项目中使用 `react-native-firebase/messaging`, 那么需要添加文件。 `ios`添加 `GoogleService-Info.plist`文件。 `android` 添加 `google-services.json`文件。 详细内容参考他们的文档，链接在参考引用部分。

## 常见问题

1. MacOS 系统版本太老旧
   1. 需要升级系统。
2. MacOS 环境中的依赖工具太老旧
   1. 需要升级软件。
3. 编译报错，找不到文件 `GoogleService-Info.plist` 或者 `google-services.json`
   1. 需要添加必要的 `FCM` 文件。
