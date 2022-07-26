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

    // 處理初始化 MyPromise 時的例外狀況
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
            // 處理非同步 fulfilled 時的例外狀況
            try {
              const x = onFulfilled(this.result);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
          this._onRejectedCallbacks.push(() => {
            // 處理非同步 rejected 時的例外狀況
            try {
              const x = onRejected(this.result);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
          break;
      }
    });

    return promise2;
  }
}

/**
 * 簡易版：
 * 檢查 promise2 和 x 是否為同一 Promise 實例，防止 Chaining cycle，
 * 且因為回傳的 promise2 要可改變 state 和 result，才能讓下一個 then 使用，
 * 所以要一併傳入 promise2 的 resolve 跟 reject
 */
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    reject(new TypeError('Chaining cycle detected for promise #<MyPromise>'));
  }

  if (x instanceof MyPromise) {
    // 如果 x 為 MyPromise 的實例，透過 promise2 的 resolve 或 reject 函式改變 state 和 result
    x.then(
      resolve, // 由 (value) => resolve(value) 簡化
      reject // 由 (reason) => reject(reason) 簡化
    );
  } else {
    resolve(x);
  }
}

module.exports = MyPromise;
