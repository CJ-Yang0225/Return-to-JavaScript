# [929. Unique Email Addresses](https://leetcode.com/problems/unique-email-addresses/) (Easy)

## 思路

使用者名稱（local name）是主要判斷的地方，網域名稱（domain）則先保留，透過迴圈遍歷 email，使用 `"@"` 作為分界，將 email 拆分成 `localName` 與 `domain` 兩部份，檢查 `localName` 的每個字元：

- 如果等於 `"."`，忽略並繼續檢查後面字元 — `continue`
- 如果等於 `"+"`，代表可以無視後面的字元 — `break`
- 其他情況時，暫存字元 `c` 到 `trimmedLocalName`

遍歷完成後，還原原本 email 格式，儲存至變數 `trimmedEmail`，注意也要把 `"@"` 加回來，否則會有問題，然後檢查是否在 `trimmedEmails` 之中，不存在就放入，最後回傳 `trimmedEmails.size`（不同的 email 數量）。

假設 email 長度限制在 100 字元下：

時間複雜度：$O(n)$

空間複雜度：$O(n)$

```js
/**
 * @param {string[]} emails
 * @return {number}
 */
var numUniqueEmails = function (emails) {
  const trimmedEmails = new Map();

  for (let i = 0; i < emails.length; i++) {
    const [localName, domain] = emails[i].split("@");
    let trimmedLocalName = "";

    for (let c of localName) {
      if (c === ".") continue;
      else if (c === "+") break;
      else trimmedLocalName += c;
    }
    const trimmedEmail = `${trimmedLocalName}@${domain}`;

    if (!trimmedEmails.has(trimmedEmail)) {
      trimmedEmails.set(trimmedEmail, true);
    }
  }
  return trimmedEmails.size;
};
```
