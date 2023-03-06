# react-signal

Signal（信号）是一种存储应用状态的形式，类似于 React 中的 useState()。目前Vue、Preact、Solid 和 Qwik 等流行 JavaScript 框架都支持 Signal。

声明一下，react-signal和细粒度更新没半毛钱关系，它只是披着signal外衣的state

## Signal 是什么？

Signal 和 State 之间的主要区别在于 Signal 返回一个 getter 和一个 setter，而非响应式系统返回一个值和一个 setter。

```typescript
useState() = value + setter
useSignal() = getter + setter
```

我们拿solidjs举个例子，因为react-signal的api设计和solidjs保持一致
```typescript react
const Counter = () => {
  const [count, setCount] = createSignal(0);

  return (
    <button onClick={() => setCount(count() + 1)}>{count}</button>
  )
}
```
我们可以看到最大的区别就是取值方式，useState直接返回状态值，但是signal返回getter，需要开发者手动调用

## react hooks的问题

提起react hooks，reactor又爱又恨，vuer冷嘲热讽，闭包值和effect依赖问题就像我们的心病，写起来又累，又容易出问题。

诚然闭包问题可以拿ref解决，但是不知道大家注意过没有，ref在effect destroy函数中的取值是否正确。

effect依赖我们可以借助eslint插件，但是有多少次我们需要注释disable和enable。

还有如果我们想生成一个引用稳定的函数是多么困难。

好了，react-signal来了

## @ai-indeed/react-signal

talk is cheap, show you the code
```typescript react
import { useSignal, useEffect, untrack } from '@ai-indeed/react-signal';

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
我们看到他是怎么解决react hooks的顽疾的

- 闭包：通过getter函数随时获得最新的state值
- effect依赖：自动追踪依赖

### API

#### createSignal

createSignal是react无关的创建signal的方式，它支持订阅value的变化。
```typescript
const signal = createSignal(0 /** or () => 0 */);
signal.subscribe((value) => { console.log(value) });
```
我们可以利用useSignal把该signal和react组件桥接起来
```typescript
const signal = createSignal(0 /** or () => 0 */);
function App() {
  const [count, setCount] = useSignal(signal);
}
```
我们可以利用该特性来实现一些高级交互。
想象一下这个场景，我们有一个列表，我们在第七页跳转到详情，然后返回，此时我们希望仍然返回第七页，在vue里可以借助keep-alive，但是在react中可能需要借助浏览存储来做。但是如果我们借助createSignal的缓存能力来做就会更加简单，即使列表组件销毁了，signal的value值仍然为7，我们返回列表时，仍然可以读到跳出的值。

另外还可以很方便的和useSyncExternalStore集成。

#### useSignal

useSignal用于替换useState，它返回一个getter和setter，getter函数可以随时获取最新值，setter函数与useState无异。
```typescript
const [count /** getter */, setCount /** setter */] = useSignal(0 /** or () => 0 */);
```

#### useEffect

useEffect用于替换react useEffect，默认不需要填写依赖。执行时机和react effect一致
```typescript
useEffect(() => {
  /** count()会自动跟踪，count()发生变化时，effect函数会重新执行 */
  console.log(count())
})
```
但是这和react useEffect语义发生了不一致，react useEffect不传参数会每次都执行，那么如何实现这种行为呢?
```typescript
useEffect(() => {
  console.log(count())
}, null)
```
第二个参数传null即可。

如果我有一个老的组件想渐进式接入signal可行吗，自然是可行的，但useState等依赖是需要手动传入的，signal会自动跟踪的
```typescript
const [count, setCount] = useSignal(0);
const [isOpen, setIsOpen] = useState(false);
useEffect(() => {
  /** count()自动追踪，props.title和isOpen手动追踪 */
  console.log(count(), props.title, isOpen)
}, [props.title, isOpen])
```
useLayoutEffect，useMemo同理

#### untrack
因为effect实现了依赖默认追踪，但是业务千奇百怪，如果我们不想追踪某些变量，那么可以通过untrack包裹
```typescript
useEffect(() => {
  /** 此时count()不会追踪 */
  setInterval(() => {
    setCount(untrack(() => count()) - 1);
  }, 1000);
});
```
#### destroy
我们在用useRef解决闭包问题的时候，不知道有没有发现过，如果在effect destroy函数中访问current值，那么访问到的值将是下次渲染的值。

signal也同理，当然signal useEffect做了相应的处理，但是如果在react useEffect中使用了signal getter值怎么办呢？
```typescript
React.useEffect(() => {
  console.log(count());
  /** 这样就可以访问到本次渲染的值了 */
  return destroy(() => console.log(count()))
});
```