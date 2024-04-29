[返回父文档](./index.md)

# 介绍路由

React-Native 官方并没有提供内置的路由工具，目前主流路由三方库主要是 `react-navigation` 和 `react-native-navigation`。

在示例项目 `example`中，使用的是 `react-navigation`。

从名字感觉该库支持 `react` 相关网页路由，同时也支持 移动端路由。提供了 `native-stack` 子组件库。

该库在 `example` 中也进行了封装，主要是返回带有参数的情况下，需要特殊处理。同时减少 demo 开发的成本。详见 `example/src/demo/hooks/useNavigationRoute.tsx`

示例详见 `example/src/demo/screens` 文件夹中。
