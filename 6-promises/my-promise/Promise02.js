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

    executor(resolve, reject);
  }

  then(onFulfilled, onRejected) {
    switch (this.state) {
      case FULFILLED:
        onFulfilled(this.result);
        break;

      case REJECTED:
        onRejected(this.result);
        break;

      case PENDING:
        /**
         * executor 函式裡處理非同步的事件時，
         * then 函式會先被執行，這時 state 還沒被 resolve 或 reject，
         * 所以 state 保持 pending，可以使用發布／訂閱模式來解決。
         */
        this._onFulfilledCallbacks.push(() => {
          onFulfilled(this.result);
        });
        this._onRejectedCallbacks.push(() => {
          onRejected(this.result);
        });
        break;
    }
  }
}

module.exports = MyPromise;
