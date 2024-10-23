[返回父文档](./index.md)

# 介绍

统计仓库 git 信息。

```sh
# 获取指定commitid之间的文件变化
git diff --stat cab95a5ca5bbf584d60628e1f32a80324c0de94e 8ac713c79318ca608f03752e15e1282170377e31  > stat.log

# 获取指定commitid之间的提交次数
git rev-list --count 1f93d639d4e38e88c1a5c0e1b7b70e96479d6d37..519cfa7ac99d4c3f237d92cd3dd13aad35c08494  > stat.log
```
