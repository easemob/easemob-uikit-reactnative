# React Native Codegen：TurboModule 与 Fabric 组件的命名体系

## 背景

在 React Native 新架构（New Architecture）中，原生库可以包含两种类型的原生能力：

- **TurboModule**：命令式 API，通过函数调用与原生交互（对应 `type: "modules"`）
- **Fabric 原生组件**：声明式 UI，作为 `<MyView />` 渲染（对应 `type: "components"`）

一个库可以同时包含两者，只需将 `codegenConfig.type` 设为 `"all"`。

## 常见疑惑：三个"名字"的关系

初次接触时容易把以下三个名字混为一谈：

```json
// package.json
"codegenConfig": {
  "name": "MyLibSpec",
  "type": "all",
  "jsSrcsDir": "src"
}
```

```ts
// TurboModule spec
TurboModuleRegistry.getEnforcing<Spec>('MyModule');

// Fabric component spec
codegenNativeComponent<NativeProps>('MyView');
```

这三个字符串实际上属于**完全不同的层次**，互不影响。

---

## 三个名字的含义

### 1. `codegenConfig.name` — 生成代码的命名空间

- 作用：给 Codegen 工具生成的文件/目录命名
- 使用者：构建工具（Xcode、Gradle），不涉及运行时
- 示例生成产物：
  ```
  ios/build/.../ReactCodegen/
    MyLibSpec/
      MyLibSpec-generated.mm
    MyLibSpecJSI.h
  ```

### 2. `TurboModuleRegistry.getEnforcing('MyModule')` — 原生模块的运行时注册名

- 作用：RN JS 运行时通过此名字查找对应的原生 NativeModule
- 必须与原生侧的注册名一致：
  - iOS：`RCT_EXPORT_MODULE(MyModule)` 或 `@objc(MyModule)`
  - Android：`override fun getName() = "MyModule"`

### 3. `codegenNativeComponent('MyView')` — 原生组件的运行时注册名

- 作用：RN JS 运行时通过此名字查找对应的原生 ViewManager
- 必须与原生侧的注册名一致：
  - iOS：`RCT_EXPORT_MODULE(MyView)`
  - Android：`override fun getName() = "MyView"`

---

## 合并库的完整映射图

```
package.json
  codegenConfig.name = "MyLibSpec"      ← 只影响生成文件的名字（构建时）

src/
  NativeMyModule.ts
    TurboModuleRegistry.getEnforcing<Spec>('MyModule')
                                          ↑
                                    运行时查找原生模块 "MyModule"

  MyViewNativeComponent.ts
    codegenNativeComponent<NativeProps>('MyView')
                                        ↑
                                    运行时查找原生组件 "MyView"

ios/
  MyModule.mm     ← RCT_EXPORT_MODULE(MyModule)
  MyView.mm       ← RCT_EXPORT_MODULE(MyView)

android/
  MyModuleModule.kt   ← getName() = "MyModule"
  MyViewManager.kt    ← getName() = "MyView"
```

三个名字完全独立，可以各不相同。

---

## 关于"codegenConfig 是否应该支持数组"

这个想法很自然，但实际上不需要数组，原因如下：

`codegenConfig.name` 只是一个"包裹"名，Codegen 会自动扫描整个 `jsSrcsDir` 目录，识别其中所有的：

- 使用 `TurboModuleRegistry` 的文件 → 各自生成独立的 JSI 桥接代码
- 使用 `codegenNativeComponent` 的文件 → 各自生成独立的 ViewManager 桥接代码

每个组件/模块在生成代码中都有自己的独立文件，`codegenConfig.name` 只是给这一批生成物取一个统一的包名。

---

## 同时包含两种类型的最简配置

```json
"codegenConfig": {
  "name": "MyLibSpec",
  "type": "all",
  "jsSrcsDir": "src",
  "android": {
    "javaPackageName": "com.mylib"
  }
}
```

```
src/
  NativeMyModule.ts          ← TurboModule spec（使用 TurboModuleRegistry）
  MyViewNativeComponent.ts   ← Fabric component spec（使用 codegenNativeComponent）
  index.tsx                  ← 对外同时导出两者
```

---

## 参考项目

| 项目                      | type        | 说明                                         |
| ------------------------- | ----------- | -------------------------------------------- |
| `test_rn_turbo`           | `"modules"` | 纯 TurboModule 示例                          |
| `react-native-chat-uikit` | `"all"`     | 包含 Fabric 组件，可扩展为同时含 TurboModule |
| `react-native-screens`    | `"all"`     | 业界成熟的同时包含两种类型的库示例           |
