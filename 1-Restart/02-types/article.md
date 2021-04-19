# 型別（Types）

JavaScript 是一門動態型別又是弱型別的語言，比其他語言較為寬鬆，所以起手快速、入門容易，但也隱含了許多特性和陷阱。

## 如何區分靜態與動態？

> 區分靜態、動態的根本在於型別檢查（Type Checking）的時機。

### 靜態型別語言（Statically Typed Languages）

- 型別檢查（Type Checking）發生於**編譯時期（Compile Time）**
- 宣告變數必須使用明確的型別 ex: `String name = "CJ-Yang";`
- 型別宣告完後，執行期間無法隨意更改變數的類型

### 動態型別語言（Dynamically Type Languages）

- 型別檢查（Type Checking）發生於**執行時期（Runtime）**
- 不用明確宣告變數的型別 ex: `var name = "CJ-Yang";`
- 執行期間能任意更換變數的類型

### 強型別 vs 弱型別

強型別以 Java 為例

```java
int n = 123 + "456";
System.out.print(n);
```

執行結果：

```bash
error: incompatible types: String cannot be converted to int
```

需要透過顯性轉型（Explicitly Casting）

```java
int n = 123 + Integer.parseInt("456");
System.out.print(n);
```

執行結果：

```bash
> 579
```

### 弱型別以 JavaScript 為例

```js
var n = 123 + "456"; // 觸發 JS 隱含轉型（Implicit Coercion）
console.log(n);
```

執行結果：

```bash
> "123456"
```

### 對於 JavaScript 大家很常認為

> Everything is an object.

### 但這句話實際含意應該是

> Values can behave like objects in JavaScript.

也就是說值的表現（behave）類似物件，但是不代表值的型別就是物件（object）。

## **原始（Primitive）** 型別

- Number — 包含整數、浮點數、Infinity、-Infinity 和 NaN（Not a Number）

- String — 字串類型，ex: `'hello'`, `"hello"`, `` `hello` ``

- Boolean — 邏輯類型：`true` 和 `false`
- Null — 特殊值，代表過去可能有值，但是現在沒有（無、空值、未知）

- Undefined — 特殊值，代表未賦予值，未宣告（undeclared）變數時也會 `undefined` ，但意義不同。

- Symbol — 用於表示獨一無二的值，ex: `Symbol("id")`

- BigInt — 用於表示 Number 無法呈現的數字，像是大於 $2^{53}-1$，ex: `10n`, `BigInt(10)`

## **複合（Composite）** 型別

### 物件（Object）：萬物根源，最複雜的資料型態，擁有多個子型別（Subtype）

- Plain Object — 狹義的物件，透過 `{}` 或 `new Object()` 建立
- Array — 陣列
- Function — 函式

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
