# 物件（Objects）

物件是藉由字串類型的 `key`（property name）來儲存對應的資料，可以建立更複雜、更彈性的實體，所以每種型別之所以能自由使用其擁有的方法，就是透過物件進行包裝來達成的。由物件實字（literal）的 `{}` 或 `new Object()` 建立。

## 因此會在 JavaScript 的討論中聽到

> Everything is an object.

## 實際上的意義是

> Values can behave like objects in JavaScript.

也就是說值的表現（behave）類似物件，但是不代表值的原始型別就是物件（object）。

更明確來說 JavaScript 會將原始值自動裝箱（autoboxing）成物件，讓我們能使用其物件的方法：

```js
var greeting = "Hello JS";
console.log("型別：", typeof greeting);
console.log("是否為字串物件？", greeting instanceof String);
console.log("卻可以用 String 的方法！", greeting.split(""));
```

執行結果：

```bash
> 型別： string
> 是否為字串物件？ false
> 卻可以用 String 的方法！ (8) ["H", "e", "l", "l", "o", " ", "J", "S"]
```

換成以 String Object 的方式宣告：

```js
var greeting = new String("Hello JS");
console.log("型別：", typeof greeting);
console.log("是否為字串物件？", greeting instanceof String);
console.log("使用 String 的方法->", greeting.split(""));
```

執行結果：

```bash
> 型別： object
> 是否為字串物件？ true
> 使用 String 的方法-> (8) ["H", "e", "l", "l", "o", " ", "J", "S"]
```

### 小知識紀錄

有沒有 `new` 的差異：

```js
const a = [String, Number, Boolean, Object, Function, Array].map(
  (constructor) => constructor() // 做為一般 function
);

console.log(a);
```

```js
const b = [String, Number, Boolean, Object, Function, Array].map(
  (constructor) => new constructor() // 做為 function constructor
);
console.log(b);
```

## 物件的方法

React.js 開發可用的 immutable array：

```js
var array = [
  {
    name: "A",
  },
  {
    name: "B",
  },
];

var index = 1;
var newArray = Object.assign([...array], { [index]: { name: "C" } });

console.log(array); // [{ name: "A" }, { name: "B" }]
console.log(newArray); // [{ name: "A" }, { name: "C" }]
```

### 物件轉型之 `valueOf()` & `toString()`

如何讓這個判斷時成功執行，印出 success：

```js
if (a == 1 && a == 2 && a == 3) {
  console.log("success!");
}
```

關鍵在於思考如何讓 `a` 在隨著判斷推移改變其值，而 `==` 會觸發隱含轉型（Implicit Coercion），因此可以透過改寫隱含轉型所用到的函式來達成：

```js
// ==============修改此處===============
var a = {
  _current: 0,
  valueOf: function () {
    return ++this._current;
  },
  toString: function () {
    console.log("nothing happens");
  },
};
// ====================================

if (a == 1 && a == 2 && a == 3) {
  console.log("success!");
}
```

- object 若**有**定義 `valueOf()` 則會優先使用，除非 `valueOf()` 返回的值**非**原始（Primitive）型別，才會再執行 `toString()`
- object 若**沒有**定義 `valueOf()` 則會以 `toString()` 為優先使用

假如是 `===` 的情況：

```js
if (a === 1 && a === 2 && a === 3) {
  console.log("success!");
}
```

因為物件 `a` 已經不會觸發隱含轉型了，所以改用 `getter()` 的概念來實現，那麼重點是如何用物件 `a` 的同時發動 `getter()`，顯然在物件 `a` 裡面直接寫入 `getter()` 無法達到題目想要的效果。

除非更改題目的判斷：

```js
// ==============修改此處===============
var a = {
  _current: 0,
  get a() {
    return ++this._current;
  },
};
// ====================================

// 只能改變題目
if (a.a === 1 && a.a === 2 && a.a === 3) {
  console.log("success!");
}
```

於是想到在瀏覽器的全域（global）就是物件 Window，在全域裡宣告的 `var` 變數都會存入 `window` 其中，由此可對 `window` 寫入 `getter()` 以達成目標，但是 `window` 不能用一般方式寫入。

以下 `get a()` 會失效，`window` 無法直接改寫：

```js
// ==============修改此處===============
window = {
  ...window,
  _current: 0,
  get a() {
    return ++this._current;
  },
};
// ====================================

if (a === 1 && a === 2 && a === 3) {
  console.log("success!");
}
```

解決方式是利用 `Object.defineProperty()`：

```js
// ==============修改此處===============
var _current = 0;

Object.defineProperty(window, "a", {
  get: function () {
    return ++this._current;
  },
});
// ====================================

if (a === 1 && a === 2 && a === 3) {
  console.log("success!");
}
```

<!-- TODO -->

<!--

### Computed Property

### 深拷貝 vs 淺拷貝

### Object.defineProperty()

### instanceof

### isPrototypeOf

### Object.defineProperty() 舉例 in

### Object.create()

-->

<!-- Move to the prototypes' chapter -->

## JavaScript 的「物件」導向

由上面結果可以得知，JavaScript 確實是以「物件」為核心來設計，不過此「物件」並非像 Java、C++ 等透過類別（class）建構出的物件實例（object instance），JavaScript 是原型架構（prototype-based）的語言，所以沒有真正意義上的 class（只是語法糖），而是在每個物件中，利用名為原型（prototype）的物件作為模板來繼承，而原型本身可能也有它的原型，像一條條鏈子相互鏈結，稱之為原型鏈（prototype chain）。

## 原型 （Prototypes）

JavaScript 的物件中（除了 `null`、`undefined`）都隱藏一種特殊屬性 `[[Prototype]]`，它可以指向此物件的原型物件。

雖然 `[[Prototype]]` 是隱藏的，但仍然有些方式可以連結到它，像是 `__proto__`（getter & setter） 或較正式的 `Object.getPrototypeOf()`；而函式建構式（function constructor）的原型可由該建構式的 `prototype` 來存取。

![Prototype layout](../../assets/images/prototype-layout.jpg)

```js
// Function Constructor
function Person(name) {
  this.name = name;
}

// 可以為 Person 的原型增添方法，讓所有實例共用
Person.prototype.sayHi = function () {
  console.log(`Hi, i am ${this.name}.`);
};

// 建構 Person 的實例
var person = new Person("Jerry");

person.sayHi(); // Hi, i am Jerry.

// instanceof 檢查物件是否為指定的建構式所建立的實體
console.log(person instanceof Person); // true

// person.__proto__ 指向 Person 的原型，也就是 Person.prototype
console.log(person.__proto__ === Person.prototype); // true

// 可以透過 hasOwnProperty 回傳物件本身是否有該屬性
console.log(person.hasOwnProperty("sayHi")); // false

// prop in obj 則檢查整個原型鏈，無論屬性是否可列舉（enumerable）
console.log("sayHi" in person); // true

// 也能使用 for (prop in obj) 來遍歷原型鏈中所有可列舉的屬性
for (prop in person) console.log(prop); // name sayHi

// 所以當 person 找不到 sayHi 時，就會沿著 __proto__ 到 Person 的原型查看
console.log(person.sayHi === person.__proto__.sayHi); // true
```

### 參考

- [MDN - Object initializer](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/Object_initializer)

- [JavaScript Garden](https://bonsaiden.github.io/JavaScript-Garden/#object)

- [[day04] YDKJS (Type) : Value 才有型別，變數沒有](https://ithelp.ithome.com.tw/articles/10217877)

- [MDN - getter](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Functions/get)
