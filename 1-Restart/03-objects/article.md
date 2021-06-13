# 物件（Objects）

物件是藉由字串類型的 `key`（property name）來儲存對應的資料，可以建立更複雜、更彈性的實體，所以每種型別之所以能自由使用其擁有的方法，就是透過物件進行包裝來達成的。由物件實字（literal）的 `{}` 或 `new Object()` 建立。

```js
var bot = {
  words: "Hello!",
  greet() {
    console.log(`${this.words}, i am ${this.name}`);
  },
};

bot.name = "ABC-01"; // bot["name"] = "ABC-1"

bot.greet();
```

```bash
> Hello!, i am ABC-01
```

## 因此大家很常會認為

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
