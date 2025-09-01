---
title: Longest substring without repeating characters
published_at: 2023-02-25 12:02
tags: [leetcode, typescript]
leetcode_number: 3
---

[Leetcode 3 problem.](https://leetcode.com/problems/longest-substring-without-repeating-characters/)

## Typescript

- Time complexity: $O(n)$ - n is a length of a string
- Auxiliary space: $O(n)$ - n is a length of a string

```typescript
function lengthOfLongestSubstring(s: string): number {
  let longestStringLength = 0;
  let currentPosition = 0;

  let counter = 0;
  let characterSet = new Set();

  while (currentPosition < s.length) {
    if (characterSet.has(s[currentPosition])) {
      characterSet.delete(s[counter++]);
    } else {
      characterSet.add(s[currentPosition++]);
      longestStringLength = Math.max(
        longestStringLength,
        characterSet.size,
      );
    }
  }

  return longestStringLength;
}
```
