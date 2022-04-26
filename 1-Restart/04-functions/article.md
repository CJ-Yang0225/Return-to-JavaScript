# 函式（Functions）

## 提升（Hoisting）

函式類似變數 `var` 的提升，但是是將函式的整體放到作用域的上面，如果函式名和變數名相同（純宣告沒有賦值），函式會覆蓋掉變數

```js
function a() {}
var a;
// var a = 123; // 因為賦值是在執行期間，所以會蓋掉變數和函式的宣告

console.log(a); // function a() {}   若是用 `var a = 123;` 則會印出 123
```

## 參數（Parameters）和引數（Arguments）

[MDN - The arguments object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments#rest_default_and_destructured_parameters) 有一句話：

> Non-strict functions that are passed only simple parameters (that is, not rest, default, or restructured parameters) will sync the value of variables new values in the body of the function with the arguments object, and vice versa

修改 `arguments[0]`：

```js
function test(a) {
  arguments[0] = "引數"; // updating arguments[0] also updates a
  console.log(a, arguments[0]); // 引數 引數
}

test(1);
```

反之修改 `a`：

```js
function test(a) {
  a = "參數"; // updating a also updates arguments[0]
  console.log(a, arguments[0]); // 參數 參數
}

test(1);
```

但是如果參數有預設值（default parameters）、其餘參數（rest parameter）或解構參數（destructured parameters）：

```js
function test(a = "default") {
  a = "參數"; // updating a does not also update arguments[0]
  console.log(a, arguments[0]); // 參數 1
}

test(1);
```

```js
function test(a, ...rest) {
  arguments[0] = "引數"; // updating arguments[0] does not also update a
  console.log(a, arguments[0]); // 1 引數
}

test(1);
```

可以用以下方式查看函式的資訊：

```js
var func = function func2(a, b) {
  console.log("函式名稱：", func.name); // func2
  console.log("參數（parameters）數量：", func.length); // 2
  console.log("引數（arguments）數量：", arguments.length); // 3
};

func(1, 2, 3);
```

也可以用函式自帶的 `caller` 以及自動傳入函式的 `arguments.callee` 來得到資訊（`"use strict";` 嚴格模式下無法使用）：

```js
var test1 = function test2() {
  console.log("我是誰？：", arguments.callee);
  console.log("誰呼叫了我？：", test2.caller);
};

function caller() {
  test1();
}

caller();
```

## 作用域或稱範疇（Scope）

若要理解閉包（Closure），就得理解作用域（Scope）和其產生的相關問題，這麼一來就得理解 GO & AO

- 「當全域執行的前一刻」會產生 GO（Global Object）。

- 「當函式被定義時」會產生函式的作用域 `[[scope]]`，它的作用域中保存了作用域鏈（Scope Chain），而作用域鏈一開始的第 `0` 位會指向全域的 GO（Global Object）。

- 「當函式被執行的前一刻」會建立該函式的 AO（Activation Object），這時作用域鏈的第 `0` 位（最頂端）會被 AO 取代，然後 GO（或是其他 context）變為第 `1` 位，所以變數會先從 AO 尋找，然後依序查找到 GO。

- 「函式執行結束後」一般會銷毀自己的 AO，回到「當函式被定義時」的狀態，若其內部還有函式，那麼內部函式的 `[[scope]]` 也一併銷毀。

### GO (Global Object)

全域執行環境（Execution context）

簡易流程：

1. 建立 GO 物件（當全域執行的前一刻）

2. 尋找變數宣告，將變數**宣告**作為 GO 的屬性名（property name）

3. 尋找函式**宣告**和**定義**，將函式名作為 GO 的屬性名，函式本身作為屬性值（property value）。不包含函式表達式（function expression）

4. 執行，進行變數定義、賦值

```js
var a = 1;
function a() {}

console.log(a); // undefined -> function a() {} -> 1
```

### AO (Activation Object)

函式執行環境（Function execution context）

簡易流程：

1. 建立 AO 物件（當函式被執行的前一刻）

2. 尋找參數（parameter）和變數**宣告**，將參數、變數宣告作為 AO 的屬性名（property name）

3. 將引數（argument）和參數（parameter）統一

4. 尋找函式**宣告**和**定義**，將函式名作為 AO 的屬性名，函式本身作為屬性值（property value）。不包含函式表達式（function expression）

5. 執行，進行變數定義、賦值

```js
function aoTest(a, b) {
  console.log(a); // 1 -> function a() {}
  arguments[0] = 123;
  console.log(a); // 123
  function a() {}
  console.log(a); // 123
  console.log(b); // undefined
  b = function () {};
  console.log(b); // function () {}
}

aoTest(1);
```

```js
a = 123;
function aoTest(a, b) {
  b = 2;
  var c;
  console.log(a); // 1
  console.log(b); // 2
  console.log(c); // undefined
  c = function () {};
  console.log(d); // function d() {}
  var d = 4;
  function d() {}
}

var a;
function a() {}

aoTest(1);

console.log(a); // 123
```

完整模擬 GO & AO：

```js
a = 1;

function test(e) {
  function e() {}
  arguments[0] = 2;
  console.log(e);
  if (a) {
    var b = 3;
  }

  var c;
  a = 4;
  var a;
  console.log(b);
  f = 5;
  console.log(c);
  console.log(a);
}

var a;

test(1);

console.log(a);
console.log(f);
```

GO - 建立 GO 物件、尋找變數宣告：

```js
// 建立 GO 物件
GO = {
  // 尋找變數宣告
  a: undefined,
};
```

GO - 尋找函式宣告：

```js
GO = {
  a: undefined,

  // 尋找函式宣告
  test: function test(e) {
    /* ... */
  },
};
```

GO - 執行，進行變數定義、賦值：

```js
GO = {
  /* 執行，進行變數定義、賦值 */

  a: 1,
  test: function test(e) {
    /* ... */
  },
};
```

AO - 建立 AO 物件並尋找參數、變數宣告：

```js
GO = {
  a: 1,
  test: function test(e) {
    /* ... */
  },
};

// 建立 AO 物件
AO = {
  // 尋找參數、變數宣告
  e: undefined,
  b: undefined, // 注意：此時無視 if
  c: undefined,
  a: undefined,
};
```

AO - 引數和參數統一：

```js
GO = {
  a: 1,
  test: function test(e) {
    /* ... */
  },
};

AO = {
  // 引數和參數統一
  e: 1,
  b: undefined,
  c: undefined,
  a: undefined,
};
```

AO - 尋找函式宣告：

```js
GO = {
  a: 1,
  test: function test(e) {
    /* ... */
  },
};

AO = {
  // 尋找函式宣告
  e: function e() {},
  b: undefined,
  c: undefined,
  a: undefined,
};
```

AO - 執行，進行變數定義、賦值：

```js
GO = {
  a: 1,
  test: function test(e) {
    /* ... */
  },
  f: 5, // AO 找不到 f 變數，所以到 GO 建立
};

AO = {
  /* 執行，進行變數定義、賦值 */

  e: 2, // arguments[0] = 2
  b: undefined, // 此時的 a 為 undefined，故 b 不被賦值
  c: undefined,
  a: /* undefined */ 4,
};
```

最終結果：

```bash
2
undefined
undefined
4
1
5
```

## 閉包（Closure）

當「主函式」執行，它的「內部函式」被回傳到外部並保存時，一定會產生閉包（Closure ），而這個「內部函式」的作用域鏈（Scope Chain）仍會保存「主函式」的 AO （Activation Object），當「內部函式」執行，則會產生它自己的 AO 並放在作用域鏈的最頂端，其他 AO 和 GO 向後依序排列。過度使用閉包可能會導致記憶體流失（memory leak）或是載入變慢。

https://resources.jointjs.com/demos/javascript-ast
