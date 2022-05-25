# 變數（Variables）

變數可以對資料做「命名儲存（named storage）」。像使用者名稱、商品資訊或廠商地址等等。

在 JavaScript 中，建立變數可以使用 `var`、`let` 或 `const` 關鍵字（它們之間有些微不同）。

- `var` — 傳統的變數宣告方式，它有幾種特性：不具備區塊作用域（Block Scope）、變數會提升（Hoisting）、變數可重複宣告和允許值任意更換。

- `let` — 現代的變數宣告方式，較 `var` 嚴謹，允許值任意更換。[有 Hoisting！？](#那麼-let-和-const-也會-hoisting-嗎)

- `const` — 類似 `let`，但是值無法更改（物件與陣列的值除外）。[有 Hoisting！？](#那麼-let-和-const-也會-hoisting-嗎)

## 宣告（declaration） 與 定義（definition）

簡單來說：

```js
var name; // 宣告變數： 預設的初始化（initialization）為 undefined
name = 'who?'; // 定義變數： 將 'who' 賦值（assign）到變數中
```

```js
var name = 'CJ-Yang'; // 宣告並定義變數： 初始化為 'CJ-Yang'，然後賦值到變數中
```

背後 JavaScript 引擎將記憶體劃分為兩個區塊：

- 程式碼空間
- Stack & Heap（資料空間）

一般 Primitive 型別會存於 Stack 之中，而 Reference 型別存於 Heap 之中，但不是絕對的，要取決於環境的實作方式等，因此以下以「儲存到 Stack & Heap 」來描述。

較完整的例子主要分成兩步驟：

```js
// 第一步：宣告一個名為 name 的變數，將 name 儲存到程式碼空間的記憶體
var name;

// 第二步：先尋找 'CJ-Yang' 是否存在，若不存在則建立並儲存到 Stack & Heap 的記憶體中，然後將其賦值到 name 變數
name = 'CJ-Yang';
```

假如過程中修改了變數的值：

```js
var name = 'CJ-Yang';

// 先尋找 'New name'，若不存在則建立並儲存到 Stack & Heap 的記憶體中，然後賦值到 name 變數，
// 但原本的字串 'CJ-Yang' 仍然存在，所以這時就需要靠 JS 的 Garbage Collector 系統來判斷是否進行垃圾回收。
name = 'New name';
```

## 提升（Hoisting）

JavaScript 是會進行編譯（Compiled）的，所以才有 Hoisting，簡單來說它會先解析程式碼，然後把宣告的變數提升至上面。

因此當我們想用保留字作為變數來宣告時，它會在執行前就報錯：

```js
// 報錯，null 是一個保留字（Reserved Keyword）
var null = '123'; // Uncaught SyntaxError: Unexpected token 'null'

// 有趣的是 undefined 沒問題，因為它是全域物件下的屬性（property），不過 [[Writable]]: false
var undefined = '123';
```

變數會提升，賦值則不會提升：

```js
console.log(a); // undefined
var a = '123';
```

可以想像為：

```js
var a;
console.log(a); // undefined
a = '123';
```

另一個例子：

```js
(function () {
  a = 5;
  console.log(window.a);
  var a = 10;
  console.log(a);
})();
```

.

.

.

.

.

印出：

```bash
undefined
10
```

可以想像為：

```js
(function () {
  var a;
  a = 5;
  console.log(window.a);
  a = 10;
  console.log(a);
})();
```

### 那麼 `let` 和 `const` 也會 Hoisting 嗎？

`let`:

```js
var a = 'parent `a`';

// 塊級作用域
{
  console.log(a); // Uncaught ReferenceError: Cannot access `a` before initialization

  let a = 'child `a`';
};
```

`const`:

```js
var b = 'parent `b`';

// 塊級作用域
{
  console.log(b); // Uncaught ReferenceError: Cannot access `b` before initialization

  const b = 'child `b`';
}
```

乍看之下 `let`／`const` 沒有被提升，但如果沒有被提升，不是應該印出全域的變數嗎？

除此之外，可以看到 ES6 標準的章節[13.3.1](http://www.ecma-international.org/ecma-262/6.0/#sec-let-and-const-declarations)提到：

> The variables are created when their containing Lexical Environment
> is instantiated but may not be accessed in any way until the
> variable’s LexicalBinding is evaluated.

說明當新的作用域環境（Lexical Environment）實體化後，在此作用域中使用 `let`／`const` 宣告的變數也會先被建立，但是變數未經過詞法綁定（LexicalBinding），所以被存取時就會拋出錯誤訊息。這段執行流程進入作用域環境建立變數，到變數可以開始被存取的一段時間，稱之為暫時死區（Temporal Dead Zone）。

由上述說明可以得知其實 `let` 和 `const` 還是存在 Hoisting，只是 `var` 得到 `undefined`，而 `let`／`const` 是在執行前拋出錯誤。

## `var` 和 `let` 在不同作用域（Scope）下的影響

簡單的函式作用域例子（較詳細的筆記在 [Functions 章節](../04-functions/article.md#作用域或稱範疇scope)）

`var` 不具備區塊作用域（Block Scope），所以若不在 `function` 之中使用可能會造成奇怪的問題。

常見的例子 - 想要1到5秒正確地依序印出 `1`、`2`、`3`、`4`、`5`：

```js
// var i = 1; 實際上就像在這宣告

for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}

console.log('outside:', i); // 穿透出迴圈區塊，影響全域
```

執行結果：

```bash
6
6
6
6
6
```

因為 `setTimeout` 是非同步事件，`for` 迴圈執行完後才會開始印出 `i`，這時的 `i` 已經是執行完後的值了。

解法一：

使用具有塊級作用域的 `let`

```js
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
```

解法二：

通常提到這個例子真正想要的答案，利用 IIFE 產生的函式作用域（[Function Scope](../04-functions/article.md#作用域scope和作用域鏈scope-chain)）

```js
for (var i = 1; i <= 5; i++) {
  (function (i) {
    setTimeout(function () {
      console.log(i);
    }, i * 1000);
  })(i);
}
```

或是這樣，有點醜，但有效果：

```js
for (var i = 1; i <= 5; i++) {
  // 加上 `void` 只是不想看到 setTimeout 回傳的 `timeoutID`
  void setTimeout(
    (function (i) {
      return function () {
        console.log(i);
      };
    })(i),
    i * 1000
  );
}
```

總算印出理想的結果：

```bash
1
2
3
4
5
```

### 參考

- [身為 JS 開發者，你應該要知道的記憶體管理機制](https://medium.com/starbugs/%E8%BA%AB%E7%82%BA-js-%E9%96%8B%E7%99%BC%E8%80%85-%E4%BD%A0%E4%B8%8D%E8%83%BD%E4%B8%8D%E7%9F%A5%E9%81%93%E7%9A%84%E8%A8%98%E6%86%B6%E9%AB%94%E7%AE%A1%E7%90%86%E6%A9%9F%E5%88%B6-d9db2fd66f8)

- [前端小誌(轉型中) - Javascript memory in use](https://ernieyang09.github.io/posts/javascript-memory/)

- [我知道你懂 hoisting，可是你了解到多深？](https://blog.techbridge.cc/2018/11/10/javascript-hoisting/)

- [理解 ES6 中的暫時死區(TDZ)](https://eddychang.me/es6-tdz)
