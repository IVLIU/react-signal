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
  const [count, setCount] = useSignal(externalSignal);
  const [value, setValue] = React.useState(0);
  // ? citation stable
  const getCount = useCallback2(() => {
    console.log("useCallback", count());
  });

  const doubleCount = useMemo2(() => {
    return count() * 2;
  });

  // ? untrack count();
  useEffect2(() => {
    const handle = setInterval(() => {
      setValue((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(handle);
  });
  // ? auto track count();
  useEffect2(() => {
    console.log("effect", value);
    return () => console.log("destroy", value);
  }, [value]);

  // // ? untrack count();
  // useEffect2(() => {
  //   const handle = setInterval(() => {
  //     setCount(untrack(() => count()) - 1);
  //   }, 1000);
  //   return () => clearInterval(handle);
  // });
  // // ? auto track count();
  // useEffect2(() => {
  //   console.log("effect", count());
  //   return () => console.log("destroy", count());
  // });
  // // ? auto track doubleCount();
  // useEffect2(() => {
  //   console.log("effect", doubleCount());
  //   return () => console.log("destroy", doubleCount());
  // });

  return (
    <>
      <div onClick={() => getCount()}>count is {count()}</div>
      <div>double count is {doubleCount()}</div>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
