[返回父文档](./index.md)

# 创建项目介绍

```sh
# 官方创建方法
npx react-native@latest init AwesomeProject
# 2025-01-15
npx @react-native-community/cli@latest init --skip-install sample-app

# expo创建方法
# 这种方式是react-native官网推荐的
npx create-expo-app AwesomeProject

# expo创建方法2
# 这种方式创建项目，可以选择不同类型的模板，在expo官网和github可以找打相关内容
npx create-react-native-app
```

**创建库的方法**

```sh
# 方法1
npx create-react-native-library@latest awesome-library

# 方法2
npx create-expo-module@latest --local
pod install --project-directory=ios
```

## 初始化项目

在项目设置管理工具是非常好的习惯，避免用户遇到不必要的问题。

```sh
yarn set version 4.9.1
```

`react-native` 官方推荐使用 `yarn` 。 `yarn` 的版本非常多 `1.x.x` 版本已经作废，但是还有大量现存项目在使用。

对于 `1.x.x` 项目:

对于依赖的管理还比较粗糙，经常出现问题，需要删除 `node_modules` ，然后重新安装依赖。

对于 `4.x.x` 项目:

提升了 安装速度，增加了 对依赖的有效管理，对于版本约束可以给出友好提示。

但是 `react-native` 项目，很多工具需要使用本地 `node_modules` ，所以需要需要设置 `config` 。

```sh
yarn config set nodeLinker node-modules
```

## 常见问题

1. 如何创建指定版本的项目
   1. `npx react-native@latest init --version 0.73.2 AwesomeProject`
2. 如果创建 expo 指定 `react-native` 版本的项目
   1. 无法直接指定版本。
3. 如何创建指定版本的库项目
   1. 无法直接指定 `react-native` 版本。
4. 在 expo 的框架中，如何使用 uikit
   1. 创建的 expo 项目没有 ios 和 android 文件夹，需要使用命令 `npx expo prebuild --clean` ，按照说明进行添加。 如果是老项目请到 expo 官网查看相关迁移说明。
