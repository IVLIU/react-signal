# @ivliu/react-signal

Signal（信号）是一种存储应用状态的形式，类似于 React 中的 useState()。但是，有一些关键性差异使 Signal 更具优势。Vue、Preact、Solid 和 Qwik 等流行 JavaScript 框架都支持 Signal。

那么react结合signal能产生什么样的火花，能解决什么问题呢？

## Signal 是什么？

Signal 和 State 之间的主要区别在于 Signal 返回一个 getter 和一个 setter，而非响应式系统返回一个值和一个 setter。

```typescript
useState() = value + setter
useSignal() = getter + setter
```

> 注意：有些响应式系统同时返回一个 getter/setter，有些则返回两个单独的引用，但思想是一样的。

我们拿solidjs举个例子，因为react-signal的api设计和solidjs保持一致
```typescript react
const Counter = () => {
  const [count, setCount] = createSignal(0);

  return (
    <button onClick={() => setCount(count() + 1)}>{count}</button>
  )
}
```


## 安装

using pnpm

```bash
pnpm add @ivliu/react-signal
```
using yarn

```bash
yarn add @ivliu/react-signal
```
using npm

```bash
npm install @ivliu/react-signal --save
```
## 用法

```typescript react
import { useSignal, useEffect, untrack } from '@ivliu/react-signal';

const App = () => {
  // ? [getter, setter]
  const [count, setCount] = useSignal(60);
  // ? untrack count();
  useEffect(() => {
    setInterval(() => {
      setCount(untrack(() => count()) - 1);
    }, 1000);
  });
  // ? auto track count();
  useEffect(() => {
    console.log('effect', count());
    return () => console.log('destroy', count());
  });
  // ? useEffect with undefined deps
  useEffect(() => {
    console.log('update');
  }, null);

  return <div>{count()}</div>;
};
```

## 调试

```bash
# 安装依赖
pnpm install
# 运行
npm start
# 进入example
cd example
# 安装依赖
pnpm install # or yarn
# 运行
npm start
```
打开http://localhost:1234，即可查看，也可更改example/index.tsx来体验

## react hooks的问题

提起react hooks，我们作为开发者可以说是又爱又恨，爱的是它可以让函数组件拥有类组件的功能，从而更方便地管理组件状态，同时在逻辑复用上相较于HOC或者render props更简单更轻量。恨的是它带来了一些心智负担，尤其是闭包和显式依赖问题。

react-signal在一定程度上可以解决这些问题

### API

react-signal使用useSignal代替useState，返回了getter和setter。

为了实现依赖自动追踪，我们重写了useEffect、useLayoutEffect、useInsertionEffect、useMemo、useCallback，且命名与react保持一致。

另外我们还提供了一些高级api，createSignal、untrack、destroy。

下面将会详细介绍每一个api。

#### useSignal

useSignal用于替换useState，它返回一个getter和setter。
```typescript
import { useSignal, useEffect } from '@ivliu/react-signal';

function App() {
  const [count, setCount] = useSignal(0);

  useEffect(() => {
    const handle = setTimeout(() => { 
      // 输出最新值10，而非初次访问的闭包值
      console.log(count()) 
    }, 1000);
    return () => clearTimeout(handle);
  })
  // useEffect都不需要写依赖了
  useEffect(() => {
    setCount(10);
  })

  // 取值改为getter方式
  return <div>{count()}</div>
}
```

如果signal初值初始化成本较高，那么你可以通过函数指定。
```typescript
// new person仅会初始化一次
useSignal(() => new Person())
```

另外还可以用createSignal创建初始值，但是注意createSignal需要声明在组件外部。

```typescript
import { createSignal, useSignal, useEffect } from '@ivliu/react-signal';

const externalSignal = createSignal(0);

function App() {
  const [count, setCount] = useSignal(externalSignal);

  useEffect(() => {
    const handle = setTimeout(() => { 
      // 输出最新值10，而非初次访问的闭包值
      console.log(count()) 
    }, 1000);
    return () => clearTimeout(handle);
  })
  // useEffect都不需要写依赖了
  useEffect(() => {
    setCount(10);
  })

  // 取值改为getter方式
  return <div>{count()}</div>
}
```

#### useEffect

useEffect用于替换native useEffect，默认不需要填写依赖。执行时机和react effect一致
```typescript
useEffect(() => {
  /** count()会自动跟踪，count()发生变化时，effect函数会重新执行 */
  console.log(count())
})
```
如果想实现等效native Effect不传依赖，即useEffect回调每次渲染都重新执行的效果的话，则依赖项需要显式传入null。
```typescript
useEffect(() => {
  console.log(count())
}, null)
```
useLayoutEffect、useInsertionEffect同理。

#### useCallback

```typescript
const onClick = useCallback(() => {
  console.log(count());
})
```

如果函数仅仅依赖signal的话，那么想实现一个引用稳定的函数将轻而易举，这是个附加的feature。

#### useMemo

```typescript
function App() {
  const [count, setCount] = useSignal(0);

  const doubleCount = useMemo(() => {
    return count() * 2;
  });

  return <div onClick={() => setCount(count() + 1)}>{doubleCount()}</div>
}

```

#### createSignal

createSignal是脱离react组件创建signal的方式，本意是为了和useSyncExternalStore更好的结合使用。
```typescript react
import { createSignal, useSignal, useEffect } from '@ivliu/react-signal';

const externalSignal = createSignal(0);

externalSignal.subscribe((value) => console.log(value));

function App() {
  const [count, setCount] = useSignal(externalSignal);

  useEffect(() => {
    const handle = setTimeout(() => { 
      // 输出最新值10，而非初次访问的闭包值
      console.log(count()) 
    }, 1000);
    return () => clearTimeout(handle);
  })
  // useEffect都不需要写依赖了
  useEffect(() => {
    setCount(10);
  })

  // 取值改为getter方式
  return <div>{count()}</div>
}
```

同时我们可以用它做一些状态保持，比如最常见的页码保持。
我们有一个列表页，然后在某页进入详情，然后返回，我们肯定希望保持在对应页，利用createSignal就可以轻松实现，因为组件销毁的时候，状态仍然保持在内存里，组件再次挂载时访问的是缓存状态。

> 注意不要一个external signal供多个useSignal使用。

#### untrack
我们实现了effect依赖的自动追踪，那么我们不想追踪某些变量的话，我们可以用untrack包裹
```typescript
useEffect(() => {
  // 此时count()不会追踪，setInterval仅会设置一次
  const handle = setInterval(() => {
    setCount(untrack(() => count()) - 1);
  }, 1000);
  return () => clearInterval(handle);
});
```
#### destroy
先看个问题
```typescript react
function App() {
  const [count, setCount] = useState(0);
  const [person, setPerson] = useState({ name: '' });

  const countRef = useRef(count);

  countRef.current = count;

  useEffect(() => {
    // ? person.name每次更新，两次输出的值是否一致
    console.log(countRef.current);
    return () => console.log(countRef.current);
  }, [person.name]);

  return <input value={person.name} onChange={(e) => {
    setPerson({ name: e.target.name });
  }} />
}
```
揭晓答案，不一致。因为effect destroy函数是在下一次渲染执行的。

因为我们提供了destroy api，它用在native useEffect内部访问signal的情况。
```typescript
// ! native useEffect
useEffect(() => {
  // ? person.name每次更新，两次输出的值保持一致
  console.log(count());
  return destroy(() => console.log(count()))
}, [person.name]);
```

## 渐进接入
react-signal并非脱离react创造新概念，且和细粒度更新没什么关系，它仅仅提供了signal形式的api。
因为我们可以非常低成本的接入，且支持和native api混用。
```typescript react
import { useState, useEffect } from 'react';
import { useSignal, useEffect as useEffect2 } from '@ivliu/react-signal';

function App(props: { count3: number }) {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useSignal(0);

  useEffect(() => {
    console.log(count1, count2(), props.count3);
  }, [count1, count2, props.count3]);

  useEffect2(() => {
    console.log(count1, count2(), props.count3);
    // state和props值无法自动追踪，需要显式声明依赖
  }, [count1, props.count3]);

  return <div onClick={() => {
    setCount1(count1 + 1);
    setCount2(count2() + 1);
  }}>{count1 + count2() + props.count3}</div>
}
```
## todo
在native effect中我们可以自由控制监听的粒度，比如
```typescript
// native effect
useEffect(() => { console.log(person) }, [person.name]);
```
但目前react-signal只能做到signal粒度的自动追踪，我们正在努力实现该feature。
如果你想实现类似效果，你可以暂时这样做。
```typescript
useEffect(() => { console.log(untrack(() => person())) }, [person().name]);
```

## 贡献

请随时提交任何问题或请求请求。我将在最快的时间回复你。


## License

MIT
