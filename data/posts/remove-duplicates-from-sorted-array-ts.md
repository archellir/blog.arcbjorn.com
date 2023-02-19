---
title: Remove duplicates from sorted array
published_at: 2023-01-06 12:00
snippet: 26 - Typescript solution
tags: [leetcode]
---

[Leetcode 26 problem.](https://leetcode.com/problems/remove-duplicates-from-sorted-array/)

## Typescript

- Time complexity: $O(n)$ - **n** is a length of numbers' array
- Auxiliary space: $O(1)$ - constant amount of space

```typescript
function removeDuplicates(nums: number[]): number {
    let count = 0;
    
    for (let i = 0; i < nums.length; i++) {
	    // skip already registered number
        if (i < nums.length - 1 && nums[i] == nums[i + 1]) {
            continue;
        }

		// register number
        nums[count] = nums[i];
        // increment total
        count++;
    }
    
    return count;
};
```