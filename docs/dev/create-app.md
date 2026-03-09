# 创建原始项目

<!-- create_time: 2026-02-28 -->

## expo

```bash
npx create-expo-app@latest expo-example
cd expo-example/
yarn set version 4.11.0
yarn config set nodeLinker node-modules
```

## react-native

```bash
npx @react-native-community/cli@latest init rn-example
cd rn-example
yarn set version 4.11.0
yarn config set nodeLinker node-modules
```

## library

```bash
npx create-react-native-library@latest rn-library
cd rn-library
yarn set version 4.11.0
yarn config set nodeLinker node-modules
```
