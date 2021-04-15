# 變數（Variables）

變數可以對資料做"命名儲存（named storage）"。像使用者名稱、商品資訊或廠商地址等等。

JavaScript 中，建立變數可以使用 `var`、`let` 或 `const`關鍵字（它們之間有些微不同）。

- `var` — 傳統的變數宣告方式，它有幾種特性：不具備區塊作用域（Block Scope）、變數會提升（Hoisting）、變數可重複宣告和允許值任意更換。

- `let` — 現代的變數宣告方式，較 `var` 嚴謹，允許值任意更換。

- `const` — 類似 `let`，但是值無法更改（物件與陣列的值除外）

**宣告（declaration）** 與 **定義（definition）**：

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
