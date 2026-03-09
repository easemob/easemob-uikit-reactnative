# React Hooks 报错：Rendered fewer hooks than expected

## 问题背景

在 React Native 开发过程中，如果在界面切换、刷新或者特定操作时，突然遇到崩溃并报错：
`Error: Rendered fewer hooks than expected. This may be caused by an accidental early return statement.`
这通常意味着代码违反了 **React Hooks 的使用规则**：

1. 只能在函数最外层调用 Hook。不要在循环、条件判断或者子函数中调用。
2. 只能在 React 的函数组件中调用 Hook。

## 典型触发场景

在实际项目中，一种非常隐蔽的触发场景是：**将一个使用了 Hooks 的 React 函数组件，当成普通的普通 JS 函数直接调用。**

### 错误示例

```tsx
import { useI18nContext } from '../../i18n';

// 这是一个使用了 Hook 的 React 函数组件
export function CustomTitle({ text }: { text: string }) {
  const { tr } = useI18nContext(); // 这里使用了 Hook

  return <Text>{tr(text)}</Text>;
}

export function NavigationBar({ Title, contactType }: any) {
  // 复杂的条件渲染树
  if (contactType === 'contact-list') {
    return (
      <View>
        {/* ❌ 错误用法：直接像普通函数一样调用 React 组件 */}
        {Title={CustomTitle({ text: 'Contacts' })}}
      </View>
    );
  } else if (contactType === 'new-conversation') {
    return (
      <View>
         <Text>New Conversation</Text>
      </View>
    );
  }
  return null;
}
```

### 为什么会报错？

在上面的示例中，`CustomTitle` 虽然写得像一个 React 组件，但被调用时使用的是 `CustomTitle({...})`。这使得 React **不认为** `CustomTitle` 是一个独立的组件节点。

因此，`CustomTitle` 内部的 `useI18nContext()` 会被 React 视为是属于其**父组件**（也就是 `NavigationBar`）的 Hook。
当 `contactType` 从 `'contact-list'` 变成 `'new-conversation'` 时，`NavigationBar` 组件执行了另一个 `else if` 分支逻辑，导致 `CustomTitle` 没有被调用。这样一来，React 引擎发现 `NavigationBar` 在前一次渲染时执行了 N 个 Hook，但在后一次渲染时只执行了 N - 1 个 Hook，违反了 Hook 的调用数量必须在每次渲染完全一致的规则，从而抛出 `Rendered fewer hooks than expected` 的异常。

## 解决方案

**必须将使用了 Hook 的 React 函数组件，以 JSX 声明式的语法作为组件引入，而不是当作函数直接调用。**

改变调用方式之后，React 就能识别出这是一个独立的组件，并为其独立管理其内部的 Hooks 生命周期，不再与其父组件的条件渲染分支混淆。

### 正确示例

```tsx
// ✅ 正确用法：使用 JSX 组件语法标签形式
Title={<CustomTitle text={'Contacts'} />}
```

## 总结

在代码 Review 或者重构时，特别注意传递 Render Props 或者抽离复用的小型 UI 函数时：
如果该 UI 函数内部**没有使用任何 Hooks**，那么作为纯函数直接 `renderSomething({...})` 调用是安全的（虽然不推荐）。
如果该 UI 函数内部**使用了任何 Hooks（如 useState, useEffect, useContext 或其他自定义 hook）**，则绝对且必须强制当作标准 React 组件通过 `<Component />` 的方式写入到视图树中。
