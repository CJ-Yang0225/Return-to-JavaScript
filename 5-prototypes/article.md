# 原型（Prototype）與繼承（inheritance）

由 [Object 章節 - 自動裝箱（Autoboxing）](../3-objects/article.md#自動裝箱autoboxing) 的範例可以得知，JavaScript 確實是以「物件」為核心來設計，不過此「物件」並非像 Java、C++ 等透過類別（class）建構出的物件實例（object instance），JavaScript 是原型架構（prototype-based）的語言，所以沒有真正意義上的 class（只是語法糖），而是在每個物件中，利用名為原型（prototype）的物件作為模板來繼承，而原型本身可能也有它的原型，像一條條鏈子相互鏈結，稱之為原型鏈（prototype chain）。

JavaScript 的物件中（除了 `null`、`undefined`）都隱藏一種特殊屬性 `[[Prototype]]`，它可以指向此物件建構函式的原型物件。

雖然 `[[Prototype]]` 是隱藏的，但仍然有些方式可以存取它，像是 `__proto__`（同時作為 getter 和 setter） 或較正規的 `Object.getPrototypeOf` 和 `Object.setPrototypeOf`；而建構函式（function constructor）的原型可由該建構函式的 `prototype` 來存取，例如 `String.prototype`。

JavaScript 原型的圖解：

![Prototype layout](../assets/images/prototypes/01.jpg)

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

`Car` 建構產生 `car1` 實例，這時再重新賦值 `Car` 的原型物件一個新物件，不會影響已實例化之 `car1` 上的 `[[Prototype]]`（`__proto__`），因為實際上改的是 `Car.prototype`，而已實例化之 `car1` 的 `[[Prototype]]` 指向的仍是舊物件之位址。

繼承的例子：

```js
function Car() {}

Car.prototype.brand = 'Benz';

var car1 = new Car();

Car.prototype = {
  constructor: Car, // 補上建構函式原型中預設會有的屬性
  brand: 'Mazda',
};

var car2 = new Car();

console.log(car1.brand); // Benz
console.log(car2.brand); // Mazda
```

![prototypes](../assets/images/prototypes/02.png)

```js
Object.__proto__ === Function.prototype;

String.__proto__ === Function.prototype;

Number.__proto__ === Function.prototype;

Function.__proto__ === Function.prototype;

Function.prototype.__proto__ === Object.prototype;
```

利用 `[[Prototype]]` 模擬繼承：

例子：

```js
function Animal({ classis }) {
  this.classis = classis;
  this.stomach = [];
}

Animal.prototype.eat = function (...foods) {
  console.log(`${this.name}吃了： ${foods.join('、')}`);
  this.stomach.push(foods);
};

function Dog({ breed, name }) {
  this.breed = breed;
  this.name = name;
}

Dog.prototype = new Animal({ classis: '哺乳綱' });
Dog.prototype.constructor = Dog;

var dog1 = new Dog({ breed: 'Chihuahua', name: '小吉' });
dog1.eat('花椰菜', '草莓');
console.log('小吉：', dog1.stomach);

var dog2 = new Dog({ breed: 'Husky', name: '月月' });
console.log('月月：', dog2.stomach);
```

Wow! 小吉吃了花椰菜跟草莓，月月的胃裡竟然也多了這兩樣，產生異空間連接嗎！？

此例子 `eat` 方法裡的 `this` 指向小吉，但不存在 `stomach` 屬性，所以沿著 `__proto__` 向上層找，最後指向 `Animal` 的實例中，而這個實例被所有子類繼承了，所以如果繼承者沒有 `stomach` 屬性，就會通通共用 `Animal` 實例裡面的。

存在的問題：

- 原型物件中 Reference 型別的屬性值會被所有實例共享，改動時要注意

- 在建構子類的實例時，不能給父類的建構函式傳入引數（arguments）

結合 `call`/`apply` 模擬繼承：

```js
function Animal({ classis }) {
  this.classis = classis;
  this.stomach = [];
}

Animal.prototype.eat = function (...foods) {
  console.log(`${this.name}吃了： ${foods.join('、')}`);
  this.stomach.push(foods);
};

function Dog({ breed, name }) {
  Animal.call(this, { classis: '哺乳綱' });
  this.breed = breed;
  this.name = name;
}

Dog.prototype = Animal.prototype;

var dog1 = new Dog({ breed: 'Chihuahua', name: '小吉' });
dog1.eat('花椰菜', '草莓');
console.log('小吉：', dog1.stomach);

var dog2 = new Dog({ breed: 'Husky', name: '月月' });
console.log('月月：', dog2.stomach);
```

利用建構函式每次使用都會創建一個新實例物件的特性，對父類用 `call/apply` 指定到這個新實例，同時也能加上需要的引數，如此一來就可以解決了 Reference 型別的共享和父類傳引數的問題了。

但還是有個問題：

```js
Dog.prototype = Animal.prototype;
```

原本函式的 `prototype` 中的預設屬性 `constructor` 會指向自己，但 `Dog.prototype` 已經重新指向 `Animal.prototype`，所以原本的 prototype 物件就被覆蓋掉了，而且強行更改裡面的屬性又會影響到父類 `Animal`。

F.prototype（類 `Object.create`）繼承：

```js
function Animal({ classis }) {
  this.classis = classis;
  this.stomach = [];
}

Animal.prototype.eat = function (...foods) {
  console.log(`${this.name}吃了： ${foods.join('、')}`);
  this.stomach.push(foods);
};

function createObj(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}

function Dog({ breed, name }) {
  Animal.call(this, { classis: '哺乳綱' });
  this.breed = breed;
  this.name = name;
}

/**
 * 最終 Dog.prototype 的樣子：
 *
 * {
 *   constructor: ƒ Dog({ breed, name }),
 *   [[Prototype]]: {
 *     eat: ƒ (...foods),
 *     constructor: ƒ Animal({ classis })
 *   }
 * }
 */
Dog.prototype = createObj(Animal.prototype);
Dog.prototype.constructor = Dog;

var dog1 = new Dog({ breed: 'Chihuahua', name: '小吉' });
dog1.eat('花椰菜', '草莓');
console.log('小吉：', dog1.stomach);

var dog2 = new Dog({ breed: 'Husky', name: '月月' });
console.log('月月：', dog2.stomach);
```

---

參考資料：

- [MDN - Object.prototype.\_\_proto\_\_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto)

- [Shubo 的程式開發筆記 - JavaScript Prototype (原型) 是什麼？](https://shubo.io/javascript-prototype/#javascript-prototype-%E5%8E%9F%E5%9E%8B)

- [理解 JavaScript 的原型链和继承](https://blog.oyanglul.us/javascript/understand-prototype.html)

- [深入探討 JavaScript 中的參數傳遞：call by value 還是 reference？](https://blog.huli.tw/2018/06/23/javascript-call-by-value-or-reference/)
