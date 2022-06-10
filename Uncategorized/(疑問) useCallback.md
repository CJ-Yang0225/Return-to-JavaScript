# 疑問：為何 useCallback 讓父元件 counter.current 少加一次？

```js
import React, { useState, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';

function MeasureExample() {
  const [height, setHeight] = useState(0);
  const counter = useRef(0);
  counter.current++;
  console.log('Parent ', counter.current);

  const measureRef = (node) => {
    if (!node) return;
    setHeight(node.getBoundingClientRect().height);
  };

  // Because our ref is a callback, it still works
  // even if the ref only gets attached after button
  // click inside the child component.
  const measureRef2 = useCallback((node) => {
    if (!node) return;
    setHeight(node.getBoundingClientRect().height);
  }, []);

  return (
    <>
      <p>Parent render {counter.current} times</p>
      <Child measureRef={measureRef} counter={counter} func={measureRef2} />
      {height > 0 && <h2>The above header is {Math.round(height)}px tall</h2>}
    </>
  );
}

function Child({ measureRef, counter, func }) {
  counter.current++;
  console.log('Child ', counter.current);
  const oldFunc = useRef(func);
  console.log(oldFunc.current === func);
  oldFunc.current = func;
  const [show, setShow] = useState(false);
  if (!show) {
    return <button onClick={() => setShow(true)}>Show child</button>;
  }
  return <h1 ref={measureRef}>Hello, world</h1>;
}

const rootElement = document.getElementById('root');
ReactDOM.render(<MeasureExample />, rootElement);
```
