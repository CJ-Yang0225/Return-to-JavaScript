const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(executor) {
    this.state = PENDING;
    this.result = undefined;
    this._onFulfilledCallbacks = [];
    this._onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state === PENDING) {
        this.state = FULFILLED;
        this.result = value;
        this._onFulfilledCallbacks.forEach((fn) => fn());
      }
    };
    const reject = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.result = reason;
        this._onRejectedCallbacks.forEach((fn) => fn());
      }
    };

    // 處理執行 executor 時的例外狀況
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then(onFulfilled, onRejected) {
    // onFulfilled 是可選的，如果沒有正確定義也要確保 value 能傳遞到下一個 onFulfilled
    onFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : (value) => value;

    // onRejected 是可選的，如果沒有正確定義也要確保 reason 能傳遞到下一個 onRejected
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
            // 注意：若直接回傳 reason 會到下一個 onFulfilled，所以直接拋出例外
            throw reason;
          };

    /**
     * Promise/A+ 提到：
     * then 的 chaining 實作需要回傳新的 Promise 實例，稱為 promise2，
     * 下一個 then 會根據 promise2 的 state 來決定執行它的 onFulfilled 或 onRejected，
     * 而下一個 then 的 onFulfilled 或 onRejected 的引數來自 promise2 的 result，
     * promise2 的 result 就是上一個 then 的 onFulfilled 或 onRejected 的回傳值，稱為 x，
     * 所以要將 x、promise2 交給一函式做檢查和處理，這個函式稱為 resolvePromise。
     */
    const promise2 = new MyPromise((resolve, reject) => {
      /**
       * 要對 promise2 做檢查和處理，但是 promise 未完成初始化，
       * 會報錯 ReferenceError: Cannot access 'promise2' before initialization，
       * 而且 Promise/A+ 規定 onFulfilled 和 onRejected 是非同步的，
       * 可以透過 "marco-task" 機制的 `setTimeout` 或 `setImmediate`，
       * 或是 “micro-task” 機制的 `MutationObserver` 或 `process.nextTick`
       * 來等到 promise2 完成初始化，這邊使用 "marco-task" 機制的 `setTimeout` 模擬原生。
       */
      switch (this.state) {
        case FULFILLED:
          setTimeout(() => {
            // 處理同步 fulfilled 時的例外狀況
            try {
              const x = onFulfilled(this.result);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
          break;

        case REJECTED:
          setTimeout(() => {
            // 處理同步 rejected 時的例外狀況
            try {
              const x = onRejected(this.result);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
          break;

        case PENDING:
          /**
           * executor 函式裡處理非同步的事件時，
           * then 函式會先被執行，這時 state 還沒被 resolve 或 reject，
           * 所以 state 保持 pending，可以使用發布／訂閱模式來解決。
           */
          this._onFulfilledCallbacks.push(() => {
            setTimeout(() => {
              // 處理非同步 fulfilled 時的例外狀況
              try {
                const x = onFulfilled(this.result);
                resolvePromise(promise2, x, resolve, reject);
              } catch (e) {
                reject(e);
              }
            }, 0);
          });
          this._onRejectedCallbacks.push(() => {
            setTimeout(() => {
              // 處理非同步 rejected 時的例外狀況
              try {
                const x = onRejected(this.result);
                resolvePromise(promise2, x, resolve, reject);
              } catch (e) {
                reject(e);
              }
            }, 0);
          });
          break;
      }
    });

    return promise2;
  }
}

/**
 * @param  {MyPromise} promise2 promise1.then 方法返回的新 MyPromise 實例
 * @param  {any}       x        promise1 中 onFulfilled 或 onRejected的返回值
 * @param  {function}  resolve  promise2 的 resolve
 * @param  {function}  reject   promise2 的 reject
 */
function resolvePromise(promise2, x, resolve, reject) {
  // 2.3.1
  if (promise2 === x) {
    reject(new TypeError('Chaining cycle detected for promise #<MyPromise>'));
  }

  // 2.3.3
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    /**
     * 處理例外狀況，像是：
     * Object.defineProperty(x, 'then', {
     *   get() {
     *     throw new Error('error!')
     *   }
     * })
     */
    try {
      // 2.3.3.1，因為 x.then 可能是 getter，所以賦值給 then 變數，防止多次 get 產生副作用
      var then = x.then; // var 才能穿透 block scope
    } catch (e) {
      reject(e);
    }

    // 如果取得的 then 是函式，則 x 是 thenable 的
    if (typeof then === 'function') {
      // 2.3.3.3.3 如果 resolvePromise 和 rejectPromise 均被呼叫，或者被同一引數呼叫了多次，則只取第一次的呼叫，之後的忽略
      let called = false;

      try {
        // 2.3.3.3 this 重新指向到 x，放入兩個 callback 作為引數，分別稱為 resolvePromise 和 rejectPromise
        then.call(
          x,
          // 2.3.3.3.1 如果 resolvePromise 以值 y 為引數被呼叫，則執行 [[Resolve]](promise, y)
          (y) => {
            if (called) return;
            called = true;

            // 處理 new Promise((resolve, reject) => { resolve(new Promise(...); )})
            resolvePromise(promise2, y, resolve, reject);
          },
          // 2.3.3.3.2 如果 rejectPromise 以 r 作為 reject 的 reason
          (r) => {
            if (called) return;
            called = true;

            reject(r);
          }
        );
      } catch (e) {
        /**
         * 2.3.3.3.4 如果 then 方法執行時拋出例外狀況 e
         * 2.3.3.3.4.1 如果 resolvePromise 或 rejectPromise 已經被呼叫，則忽略之
         */
        if (called) return;

        /**
         * 2.3.3.3.4.2 否則以 e 作為 reject 的 reason
         */
        reject(e);
      }
    } else {
      resolve(x);
    }
  } else {
    resolve(x);
  }
}

module.exports = MyPromise;
