import "react-app-polyfill/ie11";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  createSignal,
  useSignal,
  useReducer,
  useCallback as useCallback2,
  useMemo as useMemo2,
  useEffect as useEffect2,
  untrack,
} from "../.";

const store = createSignal({ theme: "light" });

const App = () => {
  // ? [getter, setter]
  const [count, setCount] = useSignal(0);
  // const [value, setValue] = React.useState(0);
  const [value, dispatch] = useReducer((prevValue: number) => {
    console.log("reducer");
    return prevValue + 1;
  }, 0);

  const { theme } = React.useSyncExternalStore(
    store.subscribe,
    useCallback2(() => store.value)
  );

  const doubleCount = useMemo2(() => {
    return count() * 2;
  });

  // untrack count();
  useEffect2(() => {
    const handle = setInterval(() => {
      setCount(untrack(() => count()) + 1);
    }, 1000);
    return () => clearInterval(handle);
  });
  // auto track count();
  useEffect2(() => {
    console.log("count is", count(), "value is", value());
  });
  // auto track doubleCount();
  useEffect2(() => {
    console.log("double count is", doubleCount());
  });

  return (
    <>
      <div onClick={() => (store.value = { theme: "dark" })}>{theme}</div>
      <div onClick={() => setCount(count() + 1)}>count is {count()}</div>
      <div onClick={() => dispatch()}>value is {value()}</div>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
