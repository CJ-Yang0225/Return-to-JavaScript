# 原型（Prototype）與繼承（inheritance）

`Car` 建構產生 `car1` 實例，這時再重新賦值 `Car` 的原型物件一個新物件，不會影響已實例化之 `car1` 上的 `[[Prototype]]`（`__proto__`），因為實際上改的是 `Car.prototype`，而已實例化之 `car1` 的 `[[Prototype]]` 指向的仍是舊物件之位址。

例子：

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

![prototypes](../../assets/images/prototypes/02.png)

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
