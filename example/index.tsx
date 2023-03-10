import "react-app-polyfill/ie11";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  useSignal,
  useMemo as useMemo2,
  useEffect as useEffect2,
  untrack,
} from "../.";

const App = () => {
  // ? [getter, setter]
  const [count, setCount] = useSignal(0);
  const [value, setValue] = React.useState(0);

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
    console.log("count is", count(), "value is", value);
  }, [value]);
  // auto track doubleCount();
  useEffect2(() => {
    console.log("double count is", doubleCount());
  });

  return (
    <>
      <div onClick={() => setCount(count() + 1)}>count is {count()}</div>
      <div onClick={() => setValue(value + 1)}>value is {value}</div>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
