import "react-app-polyfill/ie11";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  createSignal,
  useSignal,
  useCallback as useCallback2,
  useMemo as useMemo2,
  useEffect as useEffect2,
  untrack,
} from "../.";

const externalSignal = createSignal(() => 60);

const App = () => {
  // ? [getter, setter]
  const [count, setCount] = useSignal(0);
  const [value, setValue] = React.useState(0);
  // ? citation stable
  const getCount = useCallback2(() => {
    console.log("useCallback", count());
  });

  // const doubleCount = useMemo2(() => {
  //   return count() * 2;
  // });

  // ? untrack count();
  // useEffect2(() => {
  //   const handle = setInterval(() => {
  //     setValue((prev) => prev + 1);
  //     setCount(untrack(() => count()) + 1);
  //   }, 1000);
  //   return () => clearInterval(handle);
  // });
  // // ? auto track count();
  // useEffect2(() => {
  //   console.log("1 value", value);
  //   return () => console.log("2 value", value);
  // }, [value]);

  // // ? untrack count();
  useEffect2(() => {
    const handle = setInterval(() => {
      setCount(untrack(() => count()) + 1);
    }, 1000);
    return () => clearInterval(handle);
  });
  // ? auto track count();
  useEffect2(() => {
    console.log(count(), value);
    return () => console.log("2 count()", count());
  }, [value]);
  // // ? auto track doubleCount();
  // useEffect2(() => {
  //   console.log("effect", doubleCount());
  //   return () => console.log("destroy", doubleCount());
  // });

  return (
    <>
      <div onClick={() => setCount(count() + 1)}>count is {count()}</div>
      <div onClick={() => setValue(value + 1)}>value is {value}</div>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
