[Return to Parent Document](./index.en.md)

# Introduction

## Specify the version of yarn in the project.

```sh
yarn set version 1.22.19
# 2025-04-06
yarn set version 4.9.1
```

## Specify the yarn version in the project configuration

```json
{
  "name": "xxx",
  "packageManager": "yarn@4.9.1"
}
```

## FAQ

1. After using yarn@4.x.x, dependencies in the local node_modules directory cannot be found, causing many command-line tools to malfunction.
   Solution: Execute `yarn config set nodeLinker node-modules`
