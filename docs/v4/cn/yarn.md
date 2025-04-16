[返回父文档](./index.md)

# 介绍

## 指定项目中 yarn 的 版本。

```sh
yarn set version 1.22.19
# 2025-04-06
yarn set version 4.7.0
```

## 在项目配置中指定 yarn 版本

```json
{
  "name": "xxx",
  "packageManager": "yarn@4.7.0"
}
```

## 常见问题

1. 使用 yarn@4.x.x 之后，找不到 本地 node_modules 目录中的依赖包，导致很多命令工具无法正常使用。
   解决方法：执行 `yarn config set nodeLinker node-modules`
