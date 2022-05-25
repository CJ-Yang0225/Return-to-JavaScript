# 型別（Types）

JavaScript 是一門動態型別又是弱型別的語言，比其他語言較為寬鬆，所以起手快速、入門容易，但也隱藏了許多特性和陷阱。

## 如何區分**靜態**與**動態**？

> 區分靜態、動態的根本在於型別檢查（Type Checking）的時機。

### **靜態型別語言（Statically Typed Languages）**

- 型別檢查（Type Checking）發生於**編譯時期（Compile Time）**
- 宣告變數必須使用明確的型別 ex. `String name = "CJ-Yang";`
- 型別宣告完後，執行期間無法隨意更改變數的類型

### **動態型別語言（Dynamically Type Languages）**

- 型別檢查（Type Checking）發生於**執行時期（Runtime）**
- 不用明確宣告變數的型別 ex. `var name = 'CJ-Yang';`
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

Java 需要透過顯性轉型（Explicitly Casting）：

```java
int n = 123 + Integer.parseInt("456");
System.out.print(n);
```

執行結果：

```bash
579
```

弱型別以 JavaScript 為例：

```js
var n = 123 + '456'; // 觸發 JS 隱含轉型（Implicit Coercion）
console.log(n);
```

執行結果：

```bash
'123456'
```

## JavaScript 之 強制轉型（Coercion）

JS 的強制轉型分為兩種：

- 「明確的」強制轉型 **Explicit** Coercion

以 `Number()` 和 `parseInt()` 為例：

```js
// string
Number('1asd'); // NaN
parseInt('1asd'); // 1
Number('12.3e1'); // 123  12.3 * 10^1
parseInt('12.3e1'); // 12

// boolean
Number(true); // 1
parseInt(true); // NaN

// null
Number(null); // 0
parseInt(null); // NaN

// undefined
Number(undefined); // NaN
parseInt(undefined); // NaN

// -------

// array
/**
 * Array.prototype 沒有 valueOf()，但有 toString()
 * 它定義的 toString() 會回傳字串，ex. [1,2,3].toString() => '1,2,3'
 * 若是空字串，[].toString() => ''
 */
Number([]); // 0
parseInt([]); // NaN

// object
/**
 * Object.prototype 有 valueOf()，也有 toString()
 * 優先使用 valueOf()，如果返回的值不能轉變為目標類型，則再用 toString()
 */
Number({}); // NaN
parseInt({}); // NaN
```

- 「隱含的」強制轉型 **Implicit** Coercion

以 `for` 迴圈的條件判斷為例：

```js
var i = 10;

// Number 轉為 Boolean 再做判斷，數字 0 => false，所以不進到迴圈內
for (; i; ) {
  console.log(i--); // 10 9 8 7 6 5 4 3 2 1
}
```

以 `undefined` 和 `null` 為例：

```js
console.log(undefined >= 0); // false  相當於 +undefined 所以是 NaN >= 0
console.log(undefined <= 0); // false
console.log(undefined == 0); // false  特殊，ECMA-262 演算法推算

console.log(null >= 0); // true  相當於 +null 所以是 0 >= 0
console.log(null <= 0); // true
console.log(null == 0); // false  特殊，ECMA-262 演算法推算

console.log(undefined == null); // true  特殊，ECMA-262 演算法推算
```

ECMA-262 [7.2.11 Abstract Relational Comparison](https://262.ecma-international.org/6.0/#sec-abstract-equality-comparison) 翻譯：

1. 如果 x 不是正常值（例如拋出錯誤），中斷執行。
2. 如果 y 不是正常值，中斷執行。
3. 如果 Type(x) 與 Type(y) 相同，執行嚴格相等運算 x === y。
4. 如果 x 是 null，y 是 undefined，返回 true。
5. 如果 x 是 undefined，y 是 null，返回 true。
6. 如果 Type(x) 是數值，Type(y) 是字串，返回 x == ToNumber(y) 的結果。
7. 如果 Type(x) 是字串，Type(y) 是數值，返回 ToNumber(x) == y 的結果。
8. 如果 Type(x) 是布林值，返回 ToNumber(x) == y 的結果。
9. 如果 Type(y) 是布林值，返回 x == ToNumber(y) 的結果。
10. 如果 Type(x) 是字串或數值或 Symbol 值，Type(y) 是物件，返回 x == ToPrimitive(y) 的結果。
11. 如果 Type(x) 是物件，Type(y) 是字串或數值或 Symbol 值，返回 ToPrimitive(x) == y 的結果。
12. 返回 false。

因為前11步得不到答案（`==` 比較時 `undefined`、`null` 不會轉型），所以 `undefined == 0` 和 `null == 0` 直接返回 `false`；而第4、第5步表明 `undefined == null` 為 `true`。

## **原始（Primitive）** 型別

- Number — 包含整數、浮點數、Infinity、-Infinity 和 NaN（Not a Number）

- String — 字串類型，ex. `'hello'`, `"hello"`, `` `hello` ``

- Boolean — 邏輯類型：`true` 和 `false`。除了 `false` 、`0`、`-0`、`0n`（bigint）、`''`、`null`、`undefined`、`NaN` 為 falsy，其餘皆為 truthy

- Null — 特殊值，代表過去可能有值，但是現在沒有（無、空值、未知）

- Undefined — 特殊值，代表未賦予值，和未宣告（undeclared）變數時會得到的 `ReferenceError` 意義不同。ex. `var a; // undefined`

- Symbol — 用於表示獨一無二的值，可作為物件屬性（property）。因為不支援舊瀏覽器，實務上較少使用。宣告不需要 `new`，ex. `Symbol('id')`

- BigInt — 用於表示 Number 無法呈現的數字，像是大於 $2^{53}-1$，宣告不需要 `new`，ex. `10n`, `BigInt(10)`

## **參考（Reference）** 型別

### 物件（Object）：JS 萬物根源，最複雜的資料型態，擁有多個子型別（subtype）

- Array — 陣列，透過陣列實字（literal）的 `[]` 或 `new Array()` 建立

- Function — 函式，可以呼叫的物件（Callable Object）

- Date — 時間日期

- 等等......

## typeof 運算子（Operator）

可以回傳參數的型別，在處理個別型別或快速檢查資料等等，很有幫助。

```js
typeof 123; // 'number'
typeof '123'; // 'string'
typeof true; // 'boolean'
typeof null; // 'object'  bug，但為了兼容過去，沒有修復
typeof undefined; // 'undefined'
typeof undeclared; // 'undefined'  變數未宣告卻直接使用會出現 ReferenceError，但 typeof 會出現 'undefined'，可以用來檢查變數是否宣告
typeof {}; // 'object'
typeof []; // 'object'
typeof function () {}; // 'function'  ECMA-262 特別定義
```

有趣的小測驗：

```js
console.log(typeof a && -true + +undefined + '');

console.log(!!' ' + !!'' + 'false' || '會印出什麼？');
console.log(!!' ' + !!'' - 'false' || '這樣會印出什麼？');

// 有陷阱，() 最優先，所以先判斷
console.log(window.a || (window.a = 'A_A'));
```

### 參考

- [靜態語言 vs. 動態語言的比較](http://blog.sina.com.tw/dotnet/article.php?entryid=614009)

- [MDN - Equality (==)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality)

- [你懂 JavaScript 嗎？#8 強制轉型（Coercion）](https://cythilya.github.io/2018/10/15/coercion/)
