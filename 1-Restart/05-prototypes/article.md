<!-- Function.prototype questions -->

https://stackoverflow.com/questions/32928810/function-prototype-is-a-function

https://stackoverflow.com/questions/4859308/in-javascript-why-typeof-function-prototype-is-function-not-object-like-ot

https://github.com/creeperyang/blog/issues/9

https://github.com/jawil/blog/issues/13

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

![prototypes](../../assets/images/prototypes.png)

```js
Object.__proto__ === Function.prototype;

String.__proto__ === Function.prototype;

Number.__proto__ === Function.prototype;

Function.__proto__ === Function.prototype;

Function.prototype.__proto__ === Object.prototype;
```

利用 `[[Prototype]]` 模擬繼承：

```js
function Professor(name) {
  this.pSkill = 'C/C++';
  this.name = name;
  this.age = 55;
  this.info = {
    email: 'lee_professor@gmail.com',
  };
}
Professor.prototype.greeting = function () {
  console.log(`Hello, I'm ${this.name}.`);
};

function Teacher(name) {
  this.tSkill = 'JavaScript';
  this.name = name;
  this.age = 42;
  this.info = {
    email: 'chen_teacher@gmail.com',
  };
}
Teacher.prototype = new Professor('Mr. Lee');

function Student(name) {
  this.name = name;
  this.sSkill = 'Python';
  this.age = 23;
}
Student.prototype = new Teacher('Mr. Chen');
Student.prototype.constructor = Student;

var student1 = new Student('Johnny');

// 當原型物件的屬性值為 Primitive 型別時，透過實例物件修改屬性值「不會引起」原型物件的屬性值發生變化
student1.age = student1.age - 18;

// 當原型物件的屬性值為 Reference 型別時，透過實例物件修改屬性值就「可能引起」原型物件的屬性值發生變化
student1.info.email = 'wang_teacher@gmail.com';

var student2 = new Student('Depp');

console.log(student1, student2);
```

可能存在的問題：

- 原型物件中 Reference 型別的屬性值會被所有實例共享，修改時要注意

- 在建構子類的實例時，不能給父類的建構函式傳入引數（arguments）

嘗試自製 `new`：

```js
function myNew(Constructor) {
  // var myThis = Object.create(Constructor.prototype); // ES6
  var myThis = {
    __proto__: Constructor.prototype,
  };

  var args = Array.from(arguments);
  args.shift(); // 移出用不到的第一個引數 `Constructor`

  var result = Constructor.apply(myThis, args);

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

參考

- [Shubo 的程式開發筆記 - JavaScript Prototype (原型) 是什麼？](https://shubo.io/javascript-prototype/#javascript-prototype-%E5%8E%9F%E5%9E%8B)
