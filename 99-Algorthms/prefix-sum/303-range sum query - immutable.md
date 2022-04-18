# [303. Range Sum Query - Immutable](https://leetcode.com/problems/range-sum-query-immutable/) (Easy)

## 直覺暴力解

```js
/**
 * @param {number[]} nums
 */
var NumArray = function (nums) {
  this.nums = nums;
};

/**
 * @param {number} left
 * @param {number} right
 * @return {number}
 */
NumArray.prototype.sumRange = function (left, right) {
  var sum = 0;

  for (var i = left; i <= right; i++) {
    sum += this.nums[i];
  }

  return sum;
};
```

## 優化 1（理論可行）

```js
/**
 * @param {number[]} nums
 */
var NumArray = function (nums) {
  const length = nums.length;
  const res = new Array(length).fill().map(() => new Array(length).fill(0));
  this.res = res;

  for (let i = 0; i < length; i++) {
    for (let j = i; j < length; j++) {
      for (let k = i; k <= j; k++) {
        res[i][j] += nums[k];
      }
    }
  }
};

/**
 * @param {number} left
 * @param {number} right
 * @return {number}
 */
NumArray.prototype.sumRange = function (left, right) {
  return this.res[left][right];
};
```

## 優化 2（理論可行）

```js
/**
 * @param {number[]} nums
 */
var NumArray = function (nums) {
  const length = nums.length;
  const res = new Array(length).fill().map(() => new Array(length).fill(0));
  this.res = res;

  for (let i = 0; i < length; i++) {
    let sum = 0;
    for (let j = i; j < length; j++) {
      sum += nums[j];
      res[i][j] = sum;
    }
  }
};

/**
 * @param {number} left
 * @param {number} right
 * @return {number}
 */
NumArray.prototype.sumRange = function (left, right) {
  return this.res[left][right];
};
```

## **Prefix Sum**

```js
/**
 * @param {number[]} nums
 */
var NumArray = function (nums) {
  const length = nums.length;
  const prefixSum = new Array(length + 1).fill(0);
  this.prefixSum = prefixSum;

  for (let i = 1; i < length + 1; i++) {
    prefixSum[i] = prefixSum[i - 1] + nums[i - 1];
  }
};

/**
 * @param {number} left
 * @param {number} right
 * @return {number}
 */
NumArray.prototype.sumRange = function (left, right) {
  return this.prefixSum[right + 1] - this.prefixSum[left];
};
```

延伸 - 計算有多少人的分數在區間之中

```js
class Grades {
  constructor(grades) {
    const prefix = new Array(100 + 1).fill(0);
    this._prefix = prefix;

    for (let grade of grades) {
      prefix[grade]++;
    }

    for (let i = 1; i < prefix.length; i++) {
      prefix[i] = prefix[i - 1] + prefix[i];
    }
  }

  countBetween(start, end) {
    start = start - 1 >= 0 ? start - 1 : 0;

    if (start > end) {
      // swap
      start = start + end;
      end = start - end;
      start = start - end;
    }

    if (start === 0 && this._prefix[start] !== 0) {
      return this._prefix[end] - 0;
    } else {
      return this._prefix[end] - this._prefix[start];
    }
  }
}

var failed = [0, 58];
var passed = [60, 90, 85, 99];
var gradeList = [...failed, ...passed];

var grades = new Grades(gradeList);
console.log(grades.countBetween(0, 59));
console.log(grades.countBetween(60, 100));
```

---

[參考](https://leetcode-cn.com/problems/range-sum-query-immutable/solution/jian-dan-wen-ti-xi-zhi-fen-xi-qian-tan-q-t2nz/)
