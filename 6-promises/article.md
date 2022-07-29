# Promises

## Generators

```js
function* gen() {
  const num1 = yield ((n) => n + 1)(0);
  console.log('num1:', num1); // num1: 122
  const num2 = yield ((n) => n + 1)(num1);
  console.log('num2:', num2); // num2: hello
  return 3;
}
const g = gen();
console.log(g.next('abc')); // {value: 1, done: false}，首次傳值無效
console.log(g.next(122)); // {value: 123, done: false}
console.log(g.next('hello')); // {value: 3, done: true}
```

## Iterators

## async/await

ES8 - async/await 函式是 Generator 函式的語法糖，目的在於簡化 Promise 實例的鏈接操作（`.then`），它提供了更簡單的方式來處理非同步的程式碼，讓非同步寫起來像是同步般。

等待的 Promise 物件 fulfilled：

```js
async function test() {
  var result = await new Promise((resolve, reject) => {
    resolve('fulfilled');
  });
  console.log('result:', result); // result: fulfilled
  return 123;
}

test(); // Promise {<fulfilled>: 123}
```

等待的 Promise 物件 rejected：

```js
async function test() {
  var result = await new Promise((resolve, reject) => {
    reject('rejected');
  });
  console.log('result:', result); // 不執行
  return 123; // 忽略，自動返回失敗的 Promise 物件
}

test(); // Promise {<rejected>: 'rejected'}
```

如果 `await` 後面的非同步操作發生錯誤，那麼等同於 `async` 函式返回的 Promise 物件被 reject。

可以用 `try...catch` 處理例外狀況，返回想要的值：

```js
async function test() {
  try {
    var result = await new Promise((resolve, reject) => {
      reject('rejected');
    });
    console.log('try:', result); // 不執行，await 出錯後跳到 catch
  } catch (err) {
    console.error('catch:', err); // catch: rejected
  }
  return 123;
}

test(); // Promise {<fulfilled>: 123}
```

`try...catch` 補充：

```js
// 無法捕獲非同步事件的例外狀況
try {
  setTimeout(() => {
    throw new Error('macro-task');
  }, 0);
} catch (e) {
  console.error('catch:', e);
}
```

```js
try {
  setTimeout(() => {
    // 需要在非同步事件的 callback 中才能捕獲例外狀況
    try {
      throw new Error('macro-task');
    } catch (e) {
      console.error('catch 1:', e);
    }
  }, 0);
} catch (e) {
  console.error('catch 2:', e);
}
```

## Callback hell

## Promise 的方法

---

參考資料：

- [MDN - Promise](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Promise)

- [MDN - async function](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Statements/async_function)
