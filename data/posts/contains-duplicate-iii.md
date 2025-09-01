---
title: Contains duplicate III
published_at: 2023-02-26 12:04
tags: [leetcode, typescript]
leetcode_number: 220
---

[Leetcode 220 problem.](https://leetcode.com/problems/contains-duplicate-iii/)

## Typescript

- Time complexity: $O(n)$ - **n** is a length of an array of integers
- Auxiliary space: $O(n)$ - constant amount of space

```Typescript
function containsNearbyAlmostDuplicate(
  nums: number[],
  indexDiff: number,
  valueDiff: number,
): boolean {
  let left = 0, right = 1;

  while (right <= nums.length) {
    const currentIndexDiff = Math.abs(left - right);
    const currentValueDiff = Math.abs(nums[left] - nums[right]);

    if (currentIndexDiff <= indexDiff && currentValueDiff <= valueDiff) {
      return true;
    }

    if (right >= nums.length) {
      left++;
      right = left + 1;
    } else {
      right++;

      if (currentIndexDiff > indexDiff) {
        left++;
        right = left + 1;
      }
    }
  }
  return false;
}
```
