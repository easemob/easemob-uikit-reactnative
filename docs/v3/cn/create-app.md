[返回父文档](./index.md)

# 创建项目介绍

```sh
# 官方创建方法
npx react-native@latest init AwesomeProject

# expo创建方法
npx create-expo-app AwesomeProject

# expo创建方法2
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

## 常见问题

1. 如何创建指定版本的项目
   1. `npx react-native@latest init --version 0.73.2 AwesomeProject`
2. 如果创建 expo 指定 `react-native` 版本的项目
   1. 无法直接指定版本。
3. 如何创建指定版本的库项目
   1. 无法直接指定 `react-native` 版本。
4.
