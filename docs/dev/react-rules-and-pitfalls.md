# React / React Native 开发规则与常见陷阱

本文档整理了 React 和 React Native 开发中**必须遵守的规则**和**容易犯错的陷阱**，所有内容均基于官方文档。

---

## 一、组件命名规则

### 1.1 组件名称必须以大写字母开头 ⚠️

> **官方文档**: [createElement Caveats](https://react.dev/reference/react/createElement#caveats)

当使用 JSX 时，**必须以大写字母开头**才能渲染自定义组件。

- `<Something />` 等价于 `createElement(Something)` — 作为组件引用
- `<something />` 等价于 `createElement('something')` — 作为字符串，被视为内置 HTML 标签

```tsx
// ✅ 正确: 大写字母开头
const MessageView = (props) => { ... };
<MessageView />

// 🔴 错误: 下划线开头 — 不是大写字母！
const _MessageView = propsMessageView ?? MessageView;
<_MessageView />  // ReferenceError: Property '_MessageView' doesn't exist

// ✅ 修正方案: 使用大写字母开头
const MessageViewWrapper = propsMessageView ?? MessageView;
<MessageViewWrapper />
```

> **实际案例**: 本项目 `MessageListItem.tsx` 中使用 `<_MessageView />` 导致 `ReferenceError: Property '_MessageView' doesn't exist` 错误。

### 1.2 小写字母开头的标签被视为内置组件

> **官方文档**: [User-Defined Components Must Be Capitalized](https://legacy.reactjs.org/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized)

```tsx
// 🔴 错误: React 认为 <hello /> 是一个 HTML 标签
function hello(props) {
  return <div>Hello {props.toWhat}</div>;
}
function HelloWorld() {
  return <hello toWhat="World" />; // 不会渲染自定义组件!
}

// ✅ 正确: 大写字母开头
function Hello(props) {
  return <div>Hello {props.toWhat}</div>;
}
function HelloWorld() {
  return <Hello toWhat="World" />; // 正确渲染
}
```

**如果你的组件恰好以小写字母开头**，需要先赋值给大写字母开头的变量：

```tsx
const myComponent = (props) => <div>{props.text}</div>;

// 🔴 错误
<myComponent text="hello" />;

// ✅ 正确: 先赋值给大写字母开头的变量
const MyComponent = myComponent;
<MyComponent text="hello" />;
```

---

## 二、组件定义规则

### 2.1 不要在组件内部嵌套定义组件 ⚠️

> **官方文档**: [Your First Component - Pitfall](https://react.dev/learn/your-first-component#nesting-and-organizing-components)

在另一个组件的**渲染函数内部**定义组件会导致严重问题：

```tsx
// 🔴 错误: 在组件内部嵌套定义组件
function ParentComponent() {
  // 每次 ParentComponent 渲染时，ChildComponent 都会被重新创建！
  function ChildComponent() {
    const [count, setCount] = useState(0);
    return <Text>{count}</Text>;
  }

  return <ChildComponent />;
}
```

```tsx
// 🔴 错误: 在组件内部嵌套定义组件
function ParentComponent() {
  // 每次 ParentComponent 渲染时，ChildComponent 都会被重新创建！
  const ChildComponent = (props) => {
    const [count, setCount] = useState(0);
    return <Text>{count}</Text>;
  };

  return <ChildComponent />;
}
```

**后果**：

- 每次父组件重新渲染时，子组件都会被**卸载并重新挂载**（而不是更新）
- 子组件的所有**内部状态丢失**
- **性能严重下降**
- Hooks 行为异常

```tsx
// ✅ 正确: 在顶层定义组件
function ChildComponent() {
  const [count, setCount] = useState(0);
  return <Text>{count}</Text>;
}

function ParentComponent() {
  return <ChildComponent />;
}
```

### 2.2 不要直接调用组件函数

> **官方文档**: [Never call component functions directly](https://react.dev/reference/rules/react-calls-components-and-hooks#never-call-component-functions-directly)

组件只能在 JSX 中使用，不要像普通函数一样调用它们。

```tsx
// ✅ 正确: 在 JSX 中使用组件
function Article() {
  return <Text>Article</Text>;
}
function BlogPost() {
  return (
    <Layout>
      <Article />
    </Layout>
  );
}

// 🔴 错误: 直接调用组件函数
function BlogPost() {
  return <Layout>{Article()}</Layout>;
}
```

**直接调用组件函数的问题**：

- React 无法为组件添加 state 等特性
- 无法参与 reconciliation（协调）
- 如果组件内有 Hooks，容易违反 Hooks 规则

---

## 三、Hooks 规则

### 3.1 只在顶层调用 Hooks ⚠️

> **官方文档**: [Only call Hooks at the top level](https://react.dev/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level)

不要在循环、条件、嵌套函数或 try/catch/finally 块中调用 Hooks。

```tsx
// ✅ 正确: 在函数组件的顶层调用
function Counter() {
  const [count, setCount] = useState(0); // ✅
  // ...
}

// ✅ 正确: 在自定义 Hook 的顶层调用
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth); // ✅
  // ...
}
```

**以下所有用法都是错误的** 🔴：

```tsx
// 🔴 在条件语句中调用
function Bad({ cond }) {
  if (cond) {
    const theme = useContext(ThemeContext);
  }
}

// 🔴 在循环中调用
function Bad() {
  for (let i = 0; i < 10; i++) {
    const theme = useContext(ThemeContext);
  }
}

// 🔴 在条件 return 之后调用
function Bad({ cond }) {
  if (cond) {
    return;
  }
  const theme = useContext(ThemeContext); // 可能不会被执行
}

// 🔴 在事件处理函数中调用
function Bad() {
  function handleClick() {
    const theme = useContext(ThemeContext);
  }
}

// 🔴 在 useMemo/useReducer/useEffect 的回调中调用
function Bad() {
  const style = useMemo(() => {
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
}

// 🔴 在 class 组件中调用
class Bad extends React.Component {
  render() {
    useEffect(() => {});
  }
}

// 🔴 在 try/catch/finally 中调用
function Bad() {
  try {
    const [x, setX] = useState(0);
  } catch {
    const [x, setX] = useState(1);
  }
}
```

### 3.2 只从 React 函数中调用 Hooks

> **官方文档**: [Only call Hooks from React functions](https://react.dev/reference/rules/rules-of-hooks#only-call-hooks-from-react-functions)

```tsx
// ✅ 正确: 从函数组件中调用
function FriendList() {
  const [onlineStatus, setOnlineStatus] = useOnlineStatus();
}

// 🔴 错误: 从普通 JavaScript 函数调用
function setOnlineStatus() {
  const [onlineStatus, setOnlineStatus] = useOnlineStatus(); // ❌
}
```

### 3.3 不要将 Hooks 作为值传递

> **官方文档**: [Never pass around Hooks as regular values](https://react.dev/reference/rules/react-calls-components-and-hooks#never-pass-around-hooks-as-regular-values)

```tsx
// 🔴 错误: 将 Hook 作为 props 传递
function ChatInput() {
  return <Button useData={useDataWithLogging} />;
}

// ✅ 正确: 在组件内直接使用 Hook
function Button() {
  const data = useDataWithLogging();
}
```

### 3.4 不要动态构造 Hooks

> **官方文档**: [Don't dynamically mutate a Hook](https://react.dev/reference/rules/react-calls-components-and-hooks#dont-dynamically-mutate-a-hook)

```tsx
// 🔴 错误: 动态构造高阶 Hook
function ChatInput() {
  const useDataWithLogging = withLogging(useData);
  const data = useDataWithLogging();
}

// ✅ 正确: 创建独立的 Hook
function useDataWithLogging() {
  // 直接在 Hook 内部实现逻辑
}
function ChatInput() {
  const data = useDataWithLogging();
}
```

### 3.5 自定义 Hooks 必须以 `use` 开头

> **官方文档**: [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)

函数名以 `use` 开头的函数在 React 中被视为 Hooks，会受到 Hooks 规则的约束。

```tsx
// ✅ 正确: 以 use 开头命名自定义 Hook
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  // ...
  return isOnline;
}

// ⚠️ 注意: 如果函数名不以 use 开头，
// React 不会将其视为 Hook，ESLint 也不会检查 Hooks 规则
function getOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true); // 可能不被正确检查
  return isOnline;
}
```

---

## 四、纯函数规则

### 4.1 组件和 Hooks 必须是纯函数

> **官方文档**: [Components and Hooks must be pure](https://react.dev/reference/rules/components-and-hooks-must-be-pure)

组件必须是**幂等的**：相同的输入（props、state、context）必须返回相同的输出。

```tsx
// 🔴 错误: 在渲染期间产生副作用
function Clock() {
  const time = new Date(); // 每次渲染结果不同!
  return <span>{time.toLocaleString()}</span>;
}

// ✅ 正确: 使用 Effect 处理非幂等操作
function Clock() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span>{time.toLocaleString()}</span>;
}
```

### 4.2 不要直接修改 Props

> **官方文档**: [Don't mutate Props](https://react.dev/reference/rules/components-and-hooks-must-be-pure#props)

```tsx
// 🔴 错误: 直接修改 props
function Post({ item }) {
  item.url = new Url(item.url, base); // 直接修改了传入的对象!
  return <Link url={item.url}>{item.title}</Link>;
}

// ✅ 正确: 创建副本
function Post({ item }) {
  const url = new Url(item.url, base);
  return <Link url={url}>{item.title}</Link>;
}
```

### 4.3 不要直接修改 State

> **官方文档**: [Don't mutate State](https://react.dev/reference/rules/components-and-hooks-must-be-pure#state)

```tsx
// 🔴 错误: 直接修改 state
function Counter() {
  const [count, setCount] = useState(0);
  function handleClick() {
    count = count + 1; // ❌ 不会触发重新渲染!
  }
}

// ✅ 正确: 使用 setter 函数
function Counter() {
  const [count, setCount] = useState(0);
  function handleClick() {
    setCount(count + 1); // ✅ 正确更新
  }
}
```

### 4.4 不要修改传递给 Hooks 的参数

> **官方文档**: [Return values and arguments to Hooks are immutable](https://react.dev/reference/rules/components-and-hooks-must-be-pure#return-values-and-arguments-to-hooks-are-immutable)

```tsx
// 🔴 错误: 修改传递给 Hook 的参数
style = useIconStyle(icon);
icon.enabled = false; // 修改了传给 Hook 的对象!
style = useIconStyle(icon); // 返回了缓存的旧结果!

// ✅ 正确: 创建新对象
style = useIconStyle(icon);
icon = { ...icon, enabled: false }; // 创建新对象
style = useIconStyle(icon); // 正确重新计算
```

### 4.5 不要在传递给 JSX 后修改值

> **官方文档**: [Values are immutable after being passed to JSX](https://react.dev/reference/rules/components-and-hooks-must-be-pure#values-are-immutable-after-being-passed-to-jsx)

```tsx
// 🔴 错误: JSX 使用后修改值
function Page({ colour }) {
  const styles = { colour, size: 'large' };
  const header = <Header styles={styles} />;
  styles.size = 'small'; // ❌ 修改了已传给 JSX 的值!
  const footer = <Footer styles={styles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}

// ✅ 正确: 创建新对象
function Page({ colour }) {
  const headerStyles = { colour, size: 'large' };
  const header = <Header styles={headerStyles} />;
  const footerStyles = { colour, size: 'small' }; // ✅ 新对象
  const footer = <Footer styles={footerStyles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}
```

---

## 五、Key 属性规则 (列表渲染)

### 5.1 列表中的每个元素必须有唯一的 key

```tsx
// 🔴 错误: 使用数组索引作为 key（列表可能重排时）
{
  items.map((item, index) => (
    <ListItem key={index} data={item} /> // 重排时会导致状态错乱
  ));
}

// ✅ 正确: 使用稳定的唯一 ID
{
  items.map((item) => <ListItem key={item.id} data={item} />);
}
```

**Key 的规则**：

- 必须在**兄弟元素**之间唯一
- 必须**稳定**，不能使用 `Math.random()` 等动态值
- 如果列表项会重新排序、添加、删除，**不要使用数组索引**作为 key

---

## 六、React Native 特有注意事项

### 6.1 使用 `StyleSheet.create()` 而非内联样式

```tsx
// 🔴 不推荐: 每次渲染都创建新的样式对象
function MyComponent() {
  return <View style={{ flex: 1, padding: 10 }} />;
}

// ✅ 推荐: 使用 StyleSheet.create 缓存样式
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
});
function MyComponent() {
  return <View style={styles.container} />;
}
```

### 6.2 大列表使用 FlatList/SectionList

```tsx
// 🔴 不推荐: 使用 ScrollView + map 渲染大量数据
<ScrollView>
  {data.map(item => <ItemView key={item.id} item={item} />)}
</ScrollView>

// ✅ 推荐: 使用 FlatList 进行虚拟化渲染
<FlatList
  data={data}
  keyExtractor={item => item.id}
  renderItem={({ item }) => <ItemView item={item} />}
/>
```

### 6.3 注意平台差异

使用 `Platform.OS` 处理 iOS/Android 之间的差异。

```tsx
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  shadow: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 } },
    android: { elevation: 5 },
  }),
});
```

### 6.4 使用 React.memo 避免不必要的重新渲染

```tsx
// 对于纯展示组件，使用 React.memo 包裹
const MessageItem = React.memo(function MessageItem({ message }) {
  return <Text>{message.text}</Text>;
});
```

### 6.5 Hermes 引擎注意事项

React Native 默认使用 Hermes 引擎，以下是一些注意事项：

- Hermes 编译时进行**字节码优化**，可能导致某些极端情况下变量作用域行为与 V8/JSC 不同
- Hermes 可能进行**参数名称混淆（mangling）**，避免依赖函数参数名进行反射
- 如果怀疑是 Hermes 特有问题，可以临时切换到 JavaScriptCore 进行对比诊断

---

## 七、快速对照表

| 规则          | ✅ 正确                    | 🔴 错误                                 |
| ------------- | -------------------------- | --------------------------------------- |
| 组件名        | `<MyComponent />`          | `<_MyComponent />` 或 `<myComponent />` |
| 组件定义位置  | 文件顶层或独立文件         | 另一个组件函数内部                      |
| 组件调用      | `<Article />` (JSX)        | `{Article()}` (函数调用)                |
| Hook 调用位置 | 函数组件顶层               | 条件/循环/事件处理器/try-catch 内       |
| Hook 来源     | 函数组件或自定义 Hook      | 普通 JavaScript 函数                    |
| Hook 传递     | 在组件内直接使用           | 作为 props 传递                         |
| Hook 命名     | `useMyHook`                | `myHook`                                |
| Props 修改    | 创建副本                   | 直接修改                                |
| State 更新    | `setState(newValue)`       | `state = newValue`                      |
| 列表 Key      | `key={item.id}` (稳定唯一) | `key={index}` (列表可变时)              |
| RN 样式       | `StyleSheet.create({})`    | 内联 `style={{}}`                       |
| RN 大列表     | `FlatList`                 | `ScrollView` + `map`                    |

---

## 参考文档

- [React Rules](https://react.dev/reference/rules)
- [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [Components and Hooks must be pure](https://react.dev/reference/rules/components-and-hooks-must-be-pure)
- [React calls Components and Hooks](https://react.dev/reference/rules/react-calls-components-and-hooks)
- [createElement Caveats](https://react.dev/reference/react/createElement#caveats)
- [JSX In Depth - User-Defined Components Must Be Capitalized](https://legacy.reactjs.org/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized)
- [Your First Component](https://react.dev/learn/your-first-component)
- [React Native - Using Hermes](https://reactnative.dev/docs/hermes)
