const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(executor) {
    this.state = PENDING;
    this.result = undefined;

    const resolve = (value) => {
      if (this.state === PENDING) {
        this.state = FULFILLED;
        this.result = value;
      }
    };
    const reject = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.result = reason;
      }
    };

    executor(resolve, reject);
  }

  then(onFulfilled, onRejected) {
    if (this.state === FULFILLED) {
      onFulfilled(this.result);
    } else if (this.state === REJECTED) {
      onRejected(this.result);
    }
  }
}

module.exports = MyPromise;
