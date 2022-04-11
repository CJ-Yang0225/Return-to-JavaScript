# 型別（Types）

JavaScript 是一門動態型別又是弱型別的語言，比其他語言較為寬鬆，所以起手快速、入門容易，但也隱藏了許多特性和陷阱。

## 如何區分**靜態**與**動態**？

> 區分靜態、動態的根本在於型別檢查（Type Checking）的時機。

### **靜態型別語言（Statically Typed Languages）**

- 型別檢查（Type Checking）發生於**編譯時期（Compile Time）**
- 宣告變數必須使用明確的型別 ex: `String name = "CJ-Yang";`
- 型別宣告完後，執行期間無法隨意更改變數的類型

### **動態型別語言（Dynamically Type Languages）**

- 型別檢查（Type Checking）發生於**執行時期（Runtime）**
- 不用明確宣告變數的型別 ex: `var name = "CJ-Yang";`
- 執行期間能任意更換變數的類型

### **強型別** vs **弱型別**

強型別以 Java 為例：

```java
int n = 123 + "456";
System.out.print(n);
```

執行結果：

```bash
error: incompatible types: String cannot be converted to int
```

需要透過顯性轉型（Explicitly Casting）：

```java
int n = 123 + Integer.parseInt("456");
System.out.print(n);
```

執行結果：

```bash
> 579
```

弱型別以 JavaScript 為例：

```js
var n = 123 + "456"; // 觸發 JS 隱含轉型（Implicit Coercion）
console.log(n);
```

執行結果：

```bash
> "123456"
```

## **原始（Primitive）** 型別

- Number — 包含整數、浮點數、Infinity、-Infinity 和 NaN（Not a Number）

- String — 字串類型，ex: `'hello'`, `"hello"`, `` `hello` ``

- Boolean — 邏輯類型：`true` 和 `false`。除了 `false` 、`0`、`-0`、`0n`（bigint）、`""`、`null`、`undefined`、`NaN` 為 falsy，其餘皆為 truthy

- Null — 特殊值，代表過去可能有值，但是現在沒有（無、空值、未知）

- Undefined — 特殊值，代表未賦予值，未宣告（undeclared）變數時也會 `undefined` ，但意義不同。

- Symbol — 用於表示獨一無二的值。實務上很少使用，因為不支援舊瀏覽器。宣告不需要 `new`，ex: `Symbol("id")`

- BigInt — 用於表示 Number 無法呈現的數字，像是大於 $2^{53}-1$，宣告不需要 `new`，ex: `10n`, `BigInt(10)`

## **複合（Composite）** 型別

### 物件（Object）：JS 萬物根源，最複雜的資料型態，擁有多個子型別（subtype）

- Array — 陣列，透過陣列實字（literal）的 `[]` 或 `new Array()` 建立
- Function — 函式，可以呼叫的物件（Callable Object）

- Date — 時間日期

- 等等......

## typeof 運算子（Operator）

可以回傳參數的型別，在處理個別型別或快速檢查資料等等，很有幫助。

```js
typeof undeclared; // "undefined"，變數未宣告
typeof 123; // "number"
typeof "123"; // "string"
typeof true; // "boolean"
typeof null; // "object"，bug，但為了兼容過去，沒有修復
typeof undefined; // "undefined"
typeof {}; // "object"
typeof []; // "object"
typeof function () {}; // "function"，ECMA-262 所定義
```

## 類型轉換 & `valueOf()` & `toString()`

如何讓這個判斷時成功執行，印出 success：

```js
if (a == 1 && a == 2 && a == 3) {
  console.log("success!");
}
```

關鍵在於思考如何讓 `a` 在隨著判斷推移改變其值，而 `==` 會觸發隱含轉型（Implicit Coercion），因此可以透過改寫隱含轉型所用到的函式來達成：

```js
// =====================================
var a = {
  _current: 0,
  valueOf: function () {
    return ++this._current;
  },
  toString: function () {
    console.log("nothing happens");
  },
};
// =====================================

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
// =====================================
var a = {
  _current: 0,
  get a() {
    return ++this._current;
  },
};
// =====================================

// 只能改變題目
if (a.a === 1 && a.a === 2 && a.a === 3) {
  console.log("success!");
}
```

於是想到在瀏覽器的全域（global）就是物件 Window，在全域裡宣告的 `var` 變數都會存入 `window` 其中，由此可對 `window` 寫入 `getter()` 以達成目標，但是 `window` 不能用一般方式寫入。

以下 `get a()` 會失效，`window` 無法直接改寫：

```js
// =====================================
window = {
  ...window,
  _current: 0,
  get a() {
    return ++this._current;
  },
};
// =====================================

if (a === 1 && a === 2 && a === 3) {
  console.log("success!");
}
```

解決方式是利用 `Object.defineProperty()`：

```js
// =====================================
var _current = 0;

Object.defineProperty(window, "a", {
  get: function () {
    return ++this._current;
  },
});
// =====================================

if (a === 1 && a === 2 && a === 3) {
  console.log("success!");
}
```

### 參考

[靜態語言 vs. 動態語言的比較](http://blog.sina.com.tw/dotnet/article.php?entryid=614009)

[你懂 JavaScript 嗎？#8 強制轉型（Coercion）](https://cythilya.github.io/2018/10/15/coercion/)

[MDN - getter](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Functions/get)
