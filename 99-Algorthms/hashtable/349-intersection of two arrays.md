<<<<<<< HEAD:99-Algorthms/hashtable/349-intersection of two arrays.md
# [349. Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays/) (Easy)

=======
# 349. Intersection of Two Arrays (Easy)

Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must be unique and you may return the result in any order.

Example 1:

```yml
Input: nums1 = [1,2,2,1], nums2 = [2,2]
Output: [2]
Example 2:
```

```yml
Input: nums1 = [4,9,5], nums2 = [9,4,9,8,4]
Output: [9,4]
Explanation: [4,9] is also accepted.
```

Constraints:

- `1 <= nums1.length, nums2.length <= 1000`
- `0 <= nums1[i], nums2[i] <= 1000`

>>>>>>> d0190545c7d25f92b0042103ad9eeca32d2d786e:99-Algorthms/hashmap/349-intersection of two arrays.md
## **雜湊表（Hash Table）**

### **Solution 1**

時間複雜度：$O(n ^ 2)$

空間複雜度：$O(n)$

```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersection = function (nums1, nums2) {
  const map = new Map(); // 若用 object 要考慮 key 為 string

  for (let num of nums1) {
    if (!map.has(num)) map.set(num, 1);
  }

  return [...map.keys()].filter((key) => nums2.includes(key)); // includes 也要 O(n)
};
```

### **Solution 2**

時間複雜度：$O(n)$

空間複雜度：$O(n)$

```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersection = function (nums1, nums2) {
  const map = new Map();

  for (let num of nums1) {
    if (!map.has(num)) map.set(num, 1);
  }

  return nums2.filter((num) => {
    if (map.has(num)) {
      map.delete(num); // 防止重複讀到相同的元素（題目要求）
      return true;
    } else return false;
  });
};
```

因為 `delete()` 如果成功刪除會返回 `true`，反之 `false`，所以魔幻一點的寫法：

```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersection = function (nums1, nums2) {
  const map = new Map();
  for (let num of nums1) {
    if (!map.has(num)) map.set(num, 1);
  }

  return nums2.filter((num) => (map.delete(num) ? true : false));
};
```

## **集合（Set）**

時間複雜度：$O(n)$

空間複雜度：$O(n)$

```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersection = function (nums1, nums2) {
  const set1 = new Set(nums1); // 儲存任何類型的唯一值（unique）
  const isIntersection = (num) => set1.has(num);

  return [...new Set(nums2.filter(isIntersection))];
};
```
