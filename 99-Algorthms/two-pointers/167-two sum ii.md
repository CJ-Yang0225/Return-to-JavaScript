# [167. Two Sum II - Input array is sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) (Easy)

關鍵是有序陣列，所以可透過 Two Pointers 解題，分為兩個 Pointer，`left` 一端指向陣列開頭，`right` 一端指向陣列結尾：

- 如果 `target` 比兩端對應的值加總還大，將 `right` 位置左移；反之將 `left` 右移
- 如果兩端的加總等於 `target` 時，跳出迴圈並回傳對應的索引值陣列
- 如果找不到答案（`left > right`），則回傳空陣列。

```js
/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (numbers[left] + numbers[right] !== target) {
    if (left > right) return [];
    if (numbers[left] + numbers[right] > target) {
      right--;
    } else {
      left++;
    }
  }
  return [left + 1, right + 1];
};
```
