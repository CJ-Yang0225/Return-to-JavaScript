# JavaScript 之 Prototype & Class

關於 Class 有一句話我覺得很貼切（[來源](https://medium.com/enjoy-life-enjoy-coding/typescript-%E5%BE%9E-ts-%E9%96%8B%E5%A7%8B%E5%AD%B8%E7%BF%92%E7%89%A9%E4%BB%B6%E5%B0%8E%E5%90%91-class-%E7%94%A8%E6%B3%95-20ade3ce26b8)）

> 「設計圖就是類別」，而根據設計圖生產的「零件就是物件」。

JavaScript 中的 Class 是透過 Function Constructor 包裝出來的，這個語法糖可以提升可讀性和簡化操作。

宣告一個父類別：

```js
class MyComponent {
  constructor(props) {
    this.props = props;
  }

  checkProps() {
    console.log('Color: ' + this.props.color);
  }
}
```

內部實際操作：

```js
function MyComponent(props) {
  this.props = props;
}

// 在 MyComponent 的原型物件中宣告一個 function 給實例使用
MyComponent.prototype.checkProps = function () {
  console.log('Color: ' + this.props.color);
};
```

若子類別繼承父類別：

```js
// 以上省略

class Counter extends MyComponent {
  _state = { count: 0 }; // 還沒辦法定義私有變數前，慣例上會用 _ 開頭來表示（ES2015之後可以用 # 定義）

  constructor(props) {
    super(props);
  }

  checkProps() {
    super.checkProps();
  }

  handleClick() {
    console.log('Counter Value: ' + this._state.count);
  }

  increase() {
    this._state.count += 1;
  }

  decrease() {
    this._state.count -= 1;
  }
}
```

其中 `extends` 繼承的背後原理：

```js
// 同 Counter.prototype.__proto__ = MyComponent.prototype;
Object.setPrototypeOf(Counter, MyComponent);
```

用 Function 實現：

```js
// 以上省略

function Counter(props) {
  this._state = { count: 0 };

  // 將 this 傳給 MyComponent ，根據 props 建立 properties
  MyComponent.prototype.constructor.call(this, props); // super(props)
}

// 讓 Counter 的實例使用 MyComponent 的 method
Counter.prototype.checkProps = function () {
  MyComponent.prototype.checkProps.call(this);
};

Counter.prototype.handleClick = function () {
  console.log('Counter Value: ' + this._state.count);
};

Counter.prototype.increase = function () {
  this._state.count += 1;
};

Counter.prototype.decrease = function () {
  this._state.count -= 1;
};
```

創建實例（instance）：

```js
const counter = new Counter({ color: 'red' });
counter.checkProps();
counter.increase(); // +1
counter.increase(); // +1
counter.decrease(); // -1
counter.handleClick();

const counter2 = new Counter({ color: 'blue' });
counter2.checkProps();
counter2.decrease(); // -1
counter2.decrease(); // -1
counter2.increase(); // +1
counter2.handleClick();
```

執行結果：

```bash
Color: red
Counter Value: 1
Color: blue
Counter Value: -1
```
