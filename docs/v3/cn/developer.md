[返回父文档](./index.md)

# 项目贡献者

[下载地址](https://github.com/AsteriskZuo/react-native-chat-library)

## 分支介绍

- 稳定分支 main, 长期维护
- 开发分支 dev, 长期维护
- 特性分支 dev-xx

## 提交代码注意事项

1. 对于修复问题，提交 pr
2. 对于开发新特性，创建新的分支
3. 提交代码，保证正常编译运行，没有语法错误，格式统一
4. 不上传敏感信息
5. 符合 提交约定 commitlint

_请遵守代码提交尊则。具体参考：`@commitlint/config-conventional/README.md`_

## 创建tag

```sh
git commit -m"tag: uikit@1.0.0 && callkit@1.0.0"
git tag -a uikit@1.0.0 -m"uikit@1.0.0"
git tag -a callkit@1.0.0 -m"callkit@1.0.0"
git tag -a room@1.0.0 -m"room@1.0.0"
git push --tags
```