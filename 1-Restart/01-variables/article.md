# 變數（Variables）

變數可以對資料做"命名儲存（named storage）"。像使用者名稱、商品資訊或廠商地址等等。

JavaScript 中，建立變數可以使用 `var`、`let` 或 `const`關鍵字（它們之間有些微不同）。

- `var` — 傳統的變數宣告方式，它有幾種特性：不具備區塊作用域（Block Scope）、變數會提升（Hoisting）、變數可重複宣告和允許值任意更換。

- `let` — 現代的變數宣告方式，較 `var` 嚴謹，允許值任意更換。

- `const` — 類似 `let`，但是值無法更改（物件與陣列的值除外）

## 宣告（declaration） 與 定義（definition）

```js
var name; // 宣告變數
name = "who?"; // 定義變數

var name = "CJ-Yang"; // 宣告＋定義變數
```

`var name = "CJ-Yang";` 主要分成以下兩步驟

```js
// 第一步：宣告一個名為 name 的變數
var name;

// 第二步：建立字串資料"CJ-Yang"，然後將其賦值給 name 變數，最後定義 name 變數的值並儲存到記憶體
name = "CJ-Yang";
```

## 提升（Hoisting）

JavaScript 是會進行編譯（Compiled）的，所以才有 Hoisting，簡單來說它會先解析程式碼，然後把宣告的變數提升至上面。

因此當我們想用保留字作為變數來宣告時，它會在執行前就報錯。

```js
// 報錯，null 是一個保留字（Reserved Keyword）
var null = "123"; // Uncaught SyntaxError: Unexpected token 'null'

// 有趣的是 undefined 沒問題，因為它是全域物件下的屬性（property），不過 [[Writable]]: false
var undefined = "123";
```

變數會提升，賦值則不會提升：

```js
console.log(a); // undefined
var a = "123";
```

可以想像為：

```js
var a;
console.log(a); // undefined
a = "123";
```

## 作用域（Scope）的簡單例子

`var` 不具備區塊作用域（Block Scope），如果不在 `function` 之中會引發無窮麻煩。

像是著名的例子：

```js
for (var i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}

console.log("outside:", i); // 穿透出迴圈，影響全域
```

執行結果：

```bash
5
5
5
5
5
```

因為 `setTimeout` 非同步事件，`for` 迴圈執行完後才會開始印出 `i`，這時的 `i` 已經是執行完後的值了

解法一：

使用具有塊級作用域的 `let`

```js
for (let i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
```

解法二：

通常提到這個例子真正想知道的答案，利用 IIFE 的函式作用域（Function Scope）

```js
for (var i = 0; i < 5; i++) {
  (function (i) {
    setTimeout(function () {
      console.log(i);
    }, i * 1000);
  })(i);
}
```

終於達到想要的結果了：

```bash
0
1
2
3
4
```
