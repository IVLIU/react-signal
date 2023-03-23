import "react-app-polyfill/ie11";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { useSignal, useEffect as useEffect2, untrack } from "../.";

const App = () => {
  // ? [getter, setter]
  const [count, setCount] = useSignal(0);

  // auto track count();
  useEffect2(() => {
    console.log("count is", count());
  });

  return (
    <>
      <div onClick={() => setCount(count() + 1)}>count is {count()}</div>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
