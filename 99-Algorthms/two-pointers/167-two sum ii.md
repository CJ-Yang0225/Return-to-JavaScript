# 167. Two Sum II - Input array is sorted

Given an array of integers numbers that is already sorted in ascending order, find two numbers such that they add up to a specific target number.

Return the indices of the two numbers (1-indexed) as an integer array answer of size 2, where 1 <= answer[0] < answer[1] <= numbers.length.

You may assume that each input would have exactly one solution and you may not use the same element twice.

Example 1:

```yml
Input: numbers = [2,7,11,15], target = 9
Output: [1,2]
Explanation: The sum of 2 and 7 is 9. Therefore index1 = 1, index2 = 2.
```

Example 2:

```yml
Input: numbers = [2,3,4], target = 6
Output: [1,3]
```

Example 3:

```yml
Input: numbers = [-1,0], target = -1
Output: [1,2]
```

Constraints:

- 2 <= numbers.length <= 3 * 104
- -1000 <= numbers[i] <= 1000
- numbers is sorted in increasing order.
- -1000 <= target <= 1000
- **Only one valid answer exists.**

## **Two Pointers**

關鍵是有序陣列，所以可透過 Two Pointer 解題，分為兩個 Pointer，`left` 一端指向陣列開頭，`right` 一端指向陣列結尾，如果 `target` 比兩端對應的值加總還大，將 `right` 位置左移，反之將 `left` 右移，直到加總等於 `target` 或找不到答案，回傳空陣列。

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
