# 物件（Objects）

物件是藉由字串類型的 `key`（property name）來儲存對應的資料，可以建立更複雜、更彈性的實體，所以每種型別之所以能自由使用其擁有的方法，就是透過物件進行包裝來達成的。由物件實字（literal）的 `{}` 或 `new Object()` 建立。

因此會在討論 JavaScript 時聽到：

> Everything is an object.

實際上的意思是：

> Values can behave like objects in JavaScript.

也就是說值的表現（behave）類似物件，但是不代表值的原始型別就是物件（object）。

## 自動裝箱（Autoboxing）

實際上 JavaScript 會隱性將原始值自動裝箱（[autoboxing](https://developer.mozilla.org/en-US/docs/Glossary/Primitive#autoboxing_primitive_wrapper_objects_in_javascript)）成物件，讓我們能使用其物件的方法

```js
var greeting = 'Hello JS';
console.log('型別：', typeof greeting);
console.log('是否為字串物件？', greeting instanceof String);
console.log('卻可以用 String 的方法！', greeting.split(''));
```

執行結果：

```bash
> 型別： string
> 是否為字串物件？ false
> 卻可以用 String 的方法！ (8) ['H', 'e', 'l', 'l', 'o', ' ', 'J', 'S']
```

換成以 String Object 的方式宣告：

```js
var greeting = new String('Hello JS');
console.log('型別：', typeof greeting);
console.log('是否為字串物件？', greeting instanceof String);
console.log('自然可使用 String 的方法->', greeting.split(''));
```

執行結果：

```bash
> 型別： object
> 是否為字串物件？ true
> 自然可使用 String 的方法-> (8) ['H', 'e', 'l', 'l', 'o', ' ', 'J', 'S']
```

小測驗 - 如何改動讓 `type.isString` 印出 `true`？：

```js
var str = 'abc';
var type = typeof str; // 'string'

// 自動裝箱（autoboxing）：type.length => new String(type).length === 6
if (type.length === 6) {
  /**
   * 隱性自動裝箱： new String(type).isString = true;
   * 但實例沒地方儲存，所以 type 還是保持一樣
   */
  type.isString = true;
}

console.log(type.isString); // undefined
```

.

.

.

.

.

答案 - 顯性讓 `type` 變為 String 物件就可以儲存屬性 `isString`

```js
var str = 'abc';
var type = new String(typeof str); // String { [[PrimitiveValue]]: 'string', length: 6 }

if (type.length === 6) {
  type.isString = true; // String { [[PrimitiveValue]]: 'string', length: 6, isString: true }
}

console.log(type.isString); // true
```

## 建構器（Constructor）和 `new` 運算子（Operator）

物件實字（literal）`{}` 可以創建一個物件，但是當要創建多個相似的物件時，為求方便就需要一個像是工廠般的存在 - 建構器（Constructor）。

一般的函式除了可以被執行外，還能當作建構器使用（Arrow function 除外），稱為建構函式。為了區別一般函式和建構函式，通常會將函式名的開頭用大寫來表示，不過它的本質仍是函式，所以還需要搭配 `new` 來使用。

當函式前面搭配 `new` 執行時，會自動完成幾個步驟：

1. 創建一個新物件，新物件內部的 `[[Prototype]]`（setter `__proto__`）預設指向這個建構器的原型（prototype），並將新物件賦值給 `this`

2. 函式體內部可以對 `this` 進行操作，比如新增物件的屬性（property）

3. 預設回傳 `this` 的值

看起來像是：

```js
function Car(color, brand) {
  // this = {};  (implicitly)

  this.color = color;
  this.brand = brand;

  // return this;  (implicitly)
}

var car = new Car('black', 'Benz');

console.log(car); // Car {color: 'black', brand: 'Benz'}
```

有無 `new` 的差異：

```js
const a = [String, Number, Boolean, Object, Function, Array].map(
  (constructor) => constructor() // 作為 regular function
);

console.log(a); // ['', 0, false, {…}, ƒ, Array(0)]
```

```js
const b = [String, Number, Boolean, Object, Function, Array].map(
  (constructor) => new constructor() // 作為 constructor function
);
console.log(b); // [String, Number, Boolean, {…}, ƒ, Array(0)]
```

ES6 新增的特殊屬性 - `new.target`：

可以在函式裡面判斷函式的執行是否使用了 `new`，如果當成一般函式使用時，它為 `undefined`；反之為自己本身。

```js
function Test() {
  console.log(new.target); // undefined
}

Test();
```

```js
function Test() {
  console.log(new.target === Test); // true
}

new Test();
```

自製 `new`：

```js
function myNew(Constructor) {
  // var myThis = Object.create(Constructor.prototype); // ES6
  var myThis = {
    __proto__: Constructor.prototype,
  };

  var args = Array.from(arguments);
  args.shift(); // 移出用不到的第一個引數 `Constructor`

  var result = Constructor.apply(myThis, args);

  // 排除當 result 為 null，而 typeof result 為 'object' 的情況
  return result instanceof Object ? result : myThis;
}

function Car(color, brand) {
  this.color = color;
  this.brand = brand;
}
Car.prototype.license = 'ABC-123';

var myInstance = myNew(Car, 'black', 'Benz');
console.log(myInstance.license);
```

### 建構器（Constructor）的 `return`

通常函式作為建構器不會用到 `return`，因為系統會自動回傳生成的 `this` 物件，但如果用了 `return` 會有以下情況：

- 若 `return` 的值是 Primitive 型別（Number、String、Boolean......），則會被忽略

- 若 `return` 的值是 Reference 型別（Object、Array、Function......），則會取代 `this` 物件

## 物件的方法

### `Object.assign`

React.js 開發可用的 immutable array：

```js
var array = [
  {
    name: 'A',
  },
  {
    name: 'B',
  },
];

var index = 1;
var newArray = Object.assign(
  [...array],

  // ES6 - Computed property names
  { [index]: { name: 'C' } }
);

console.log(array); // [{ name: 'A' }, { name: 'B' }]
console.log(newArray); // [{ name: 'A' }, { name: 'C' }]
```

### `Object.create`

利用 `null` 沒有 `[[Prototype]]`（`__proto__`）的特性，可以用 `Object.create(null)` 來自訂特殊需求的原型物件。

範例：

```js
var obj1 = Object.create(null);
obj1.num = 1;
console.log(obj1); // { num: 1 }

var obj2 = Object.create(obj1);
console.log(obj2); // { [[Prototype]]: { num: 1 } }
```

### 物件轉型之 `valueOf` 與 `toString`

當物件沒有定義 [`Symbol.toPrimitive`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive) 又需要轉型（Coercion）為 Primitive 型別時，會經過以下步驟：

Number：

1. 物件若**有**定義 `valueOf` 則會優先使用，除非 `valueOf` 返回的值不能轉變為目標類型，才會再執行 `toString`

2. 物件若**沒有**定義 `valueOf` 則會以 `toString` 為優先使用

3. 若都沒有 `valueOf` 和 `toString` 兩方法，可能導致錯誤的發生

String：

1. 物件若**有**定義 `toString` 則會優先使用，除非 `toString` 返回的值不能轉變為目標類型，才會再執行 `valueOf`

2. 物件若**沒有**定義 `toString` 則會以 `valueOf` 為優先使用

3. 若都沒有 `valueOf` 和 `toString` 兩方法，可能導致錯誤的發生

兩者的主要區別在於使用 `toString` 和 `valueOf` 的先後順序。

另外的情況：

- 如果物件為 `Date`，則以 String 的流程轉換

- 其他預設以 Number 的流程轉換

由 [Object.create](#objectcreate) 範例可得知 `Object.create(null)` 創建的物件是沒有 `[[Prototype]]` 的，所以自然沒有 Object 的原型方法。

觸發隱含轉型為字串，但是沒有 `valueOf` 或 `toString` 可使用：

```js
console.log(Object.create(null) + ''); // Uncaught TypeError: Cannot convert object to primitive value
```

如何讓這個判斷時成功執行，印出 success：

```js
if (a == 1 && a == 2 && a == 3) {
  console.log('success!');
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
    console.log('nothing happens');
  },
};
// ====================================

if (a == 1 && a == 2 && a == 3) {
  console.log('success!');
}
```

假如是 `===` 的情況：

```js
if (a === 1 && a === 2 && a === 3) {
  console.log('success!');
}
```

因為物件 `a` 已經不會觸發隱含轉型了，所以改用 getter 的概念來實現，那麼重點是：如何用物件 `a` 的同時發動 getter，直接在物件 `a` 裡面直接寫入 getter 無法達到題目想要的效果。

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

// 但這樣顯然不符合題意
if (a.a === 1 && a.a === 2 && a.a === 3) {
  console.log('success!');
}
```

於是想到在瀏覽器的全域（global）部分就是 window 物件，在全域裡宣告的 `var` 變數都會存入 `window` 其中，由此可對 `window` 寫入 getter 以達成目標，但是 `window` 不能用一般物件撰寫 getter 的方式。

以下 `get a()` 會失效，`window` 物件無法直接改寫：

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
  console.log('success!');
}
```

解決方式是利用 `Object.defineProperty()`：

```js
// ==============修改此處===============
var _current = 0;

Object.defineProperty(window, 'a', {
  get: function () {
    return ++this._current;
  },
});
// ====================================

if (a === 1 && a === 2 && a === 3) {
  console.log('success!');
}
```

## 淺拷貝（Shallow copy） vs 深拷貝（Deep copy）

### 淺拷貝

`for...in` 模擬：

```js
function cloneShallow(origin) {
  var target = {};

  for (var prop in origin) {
    if (origin.hasOwnProperty(prop)) {
      target[prop] = origin[prop];
    }
  }
  return target;
}

var car1 = {
  brand: 'Benz',
  color: 'black',
  info: {
    owner: 'A',
    license: 'ABC-123',
  },
};

var car2 = cloneShallow(car1);
car2.brand = 'BMW';
car2.info.license = 'XYZ-456'; // 會改變原本物件的值
console.log('Car2:', car2);
console.log('Car1:', car1);
```

`Object.assign` 模擬：

```js
var car1 = {
  brand: 'Benz',
  color: 'black',
  info: {
    owner: 'A',
    license: 'ABC-123',
  },
};

var car2 = Object.assign({}, car1);
car2.brand = 'BMW';
car2.info.license = 'XYZ-456'; // 會改變原本物件的值
console.log('Car2:', car2);
console.log('Car1:', car1);
```

ES6 - Spread syntax (`...`) 模擬：

```js
var car1 = {
  brand: 'Benz',
  color: 'black',
  info: {
    owner: 'A',
    license: 'ABC-123',
  },
};

var car2 = { ...car1 };
car2.brand = 'BMW';
car2.info.license = 'XYZ-456'; // 會改變原本物件的值
console.log('Car2:', car2);
console.log('Car1:', car1);
```

### 深拷貝

`for...in` 模擬：

```js
function cloneDeep(origin) {
  var target = {};
  var objectToString = Object.prototype.toString;
  var ARRAY_TYPE = '[object Array]';

  for (var prop in origin) {
    if (origin.hasOwnProperty(prop)) {
      if (typeof origin[prop] === 'object' && origin[prop]) {
        target[prop] =
          objectToString.call(origin[prop]) === ARRAY_TYPE ? [] : {};
        cloneDeep(origin[prop], target[prop]);
      } else {
        target[prop] = origin[prop];
      }
    }
  }
  return target;
}

var car1 = {
  brand: 'Benz',
  color: 'black',
  info: {
    owner: 'A',
    license: 'ABC-123',
  },
};

var car2 = cloneDeep(car1);
car2.brand = 'BMW';
car2.info.license = 'XYZ-456';

console.log('Car2:', car2);
console.log('Car1:', car1);
```

存在的問題：

- 當兩個 Reference 型別中都有指向另一方的屬性，會造成無限遞迴，產生錯誤：

  ```js
  /* 省略 cloneDeep 函式 */

  var obj1 = {
    name: 'obj1',
  };
  var obj2 = {
    name: 'obj2',
  };
  obj1.obj2 = obj2;
  obj2.obj1 = obj1;

  console.log(cloneDeep(obj1)); // Uncaught RangeError: Maximum call stack size exceeded
  ```

- 當要被深拷貝的 Reference 型別是 `Date`、`RegExp` 或函式等等時，無法順利拷貝：

  ```js
  /* 省略 cloneDeep 函式 */

  var date1 = new Date();
  var date2 = cloneDeep(date1);

  console.log(date2); // {}
  ```

ES6 優化版 `for...in` 模擬：

```js
function cloneDeep(origin, hashMap = new WeakMap()) {
  // null == undefined 為 true，所以可包括 origin 為 null 或 undefined的狀態
  if (origin == undefined || !(origin instanceof Object)) {
    return origin;
  }

  const constructor = origin.constructor;

  // Date、RegExp、Function 實例的拷貝（函式拷貝部分有爭議，練習為主）
  if (/(Date|RegExp)/.test(constructor.name)) {
    return new constructor(origin);
  } else if (/Function/.test(constructor.name)) {
    return origin.bind();
  }

  // 檢查是否拷貝過此來源物件
  const clonedTarget = hashMap.get(origin);
  if (clonedTarget) {
    return clonedTarget;
  }

  // 取得來源物件對應的建構函式並重新建立實例
  const target = new constructor();

  // 標記並保存已拷貝過的物件
  hashMap.set(origin, target);

  for (let prop in origin) {
    if (origin.hasOwnProperty(prop)) {
      target[prop] = cloneDeep(origin[prop], hashMap);
    }
  }
  return target;
}

var car1 = {
  brand: 'Benz',
  color: 'black',
  info: {
    owner: 'A',
    license: 'ABC-123',
  },
};

var car2 = cloneDeep(car1);
car2.brand = 'BMW';
car2.info.license = 'XYZ-456';

console.log('Car2:', car2);
console.log('Car1:', car1);

var obj1 = {
  name: 'obj1',
};
var obj2 = {
  name: 'obj2',
};
obj1.obj2 = obj2;
obj2.obj1 = obj1;

console.log(cloneDeep(obj1));
```

`JSON.stringify` & `JSON.parse` 模擬：

```js

```

<!-- Move to the prototypes' chapter -->

## JavaScript 的「物件」導向

由 [Object 章節 - 自動裝箱（Autoboxing）](../03-objects/article.md#自動裝箱autoboxing) 的範例可以得知，JavaScript 確實是以「物件」為核心來設計，不過此「物件」並非像 Java、C++ 等透過類別（class）建構出的物件實例（object instance），JavaScript 是原型架構（prototype-based）的語言，所以沒有真正意義上的 class（只是語法糖），而是在每個物件中，利用名為原型（prototype）的物件作為模板來繼承，而原型本身可能也有它的原型，像一條條鏈子相互鏈結，稱之為原型鏈（prototype chain）。

JavaScript 的物件中（除了 `null`、`undefined`）都隱藏一種特殊屬性 `[[Prototype]]`，它可以指向此物件建構函式的原型物件。

雖然 `[[Prototype]]` 是隱藏的，但仍然有些方式可以存取它，像是 `__proto__`（同時作為 getter 和 setter） 或較正規的 `Object.getPrototypeOf` 和 `Object.setPrototypeOf`；而建構函式（function constructor）的原型可由該建構函式的 `prototype` 來存取，例如 `String.prototype`。

JavaScript 原型的圖解：

![Prototype layout](../../assets/images/prototypes/01.jpg)

```js
// Function constructor
function Person(name) {
  this.name = name;
}

// 可以為 Person 的原型增添方法，讓所有實例共用（一般會把方法寫在 prototype 中，避免重複建立）
Person.prototype.sayHi = function () {
  console.log(`Hi, i am ${this.name}.`);
};

// 建構 Person 的實例
var person = new Person('Jerry');

person.sayHi(); // Hi, i am Jerry.

// `A instanceof B` 檢查 A 的原型鏈中是否存在 B 的 prototype（含上層）
console.log(person instanceof Person); // true
console.log(person instanceof Object); // true

// person.__proto__ 指向 Person 的原型，也就是 Person.prototype
console.log(person.__proto__ === Person.prototype); // true

// 可以透過 hasOwnProperty 回傳物件本身是否有該屬性
console.log(person.hasOwnProperty('sayHi')); // false

// prop in obj 則檢查整個原型鏈，無論屬性是否可列舉（enumerable）
console.log('sayHi' in person); // true

// 也能使用 for...in 來印出原型鏈中所有可列舉的屬性
for (let prop in person) console.log(prop); // name sayHi

// 所以當 person 找不到 sayHi 時，就會沿著 __proto__ 到 Person 的原型查看
console.log(person.sayHi === person.__proto__.sayHi); // true
```

---

參考資料：

- [MDN - Object initializer](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/Object_initializer)

- [MDN - Autoboxing: primitive wrapper objects in JavaScript](https://developer.mozilla.org/en-US/docs/Glossary/Primitive#autoboxing_primitive_wrapper_objects_in_javascript)

- [JavaScript Garden](https://bonsaiden.github.io/JavaScript-Garden/#object)

- [[day04] YDKJS (Type) : Value 才有型別，變數沒有](https://ithelp.ithome.com.tw/articles/10217877)

- [MDN - getter](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Functions/get)
