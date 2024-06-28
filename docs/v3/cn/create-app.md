[返回父文档](./index.md)

# 创建项目介绍

```sh
# 官方创建方法
npx react-native@latest init AwesomeProject

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

## 常见问题

1. 如何创建指定版本的项目
   1. `npx react-native@latest init --version 0.73.2 AwesomeProject`
2. 如果创建 expo 指定 `react-native` 版本的项目
   1. 无法直接指定版本。
3. 如何创建指定版本的库项目
   1. 无法直接指定 `react-native` 版本。
4. 在expo的框架中，如何使用 uikit
   1. 创建的expo项目没有 ios和android文件夹，需要使用命令 `npx expo prebuild --clean` ，按照说明进行添加。 如果是老项目请到expo官网查看相关迁移说明。
