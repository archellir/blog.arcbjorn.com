---
title: Contains duplicate II
published_at: 2023-02-24 12:01
tags: [leetcode, go, typescript]
leetcode_number: 219
---

[Leetcode 219 problem.](https://leetcode.com/problems/contains-duplicate-ii/)

## Go

- Time complexity: $O(n)$ - **n** is a length of an array of integers
- Auxiliary space: $O(n)$ - constant amount of space

```go
func abs(a int, b int) int {
    if (a - b ) < 0 {
        return b - a
    }
    return a - b
}

func containsNearbyDuplicate(nums []int, k int) bool {
    // key is number, value is it's index in parameter array
    numberIndexMap := make(map[int]int)

    for i :=0 ; i <len(nums); i++ {
        // the same number
        value, isFound := numberIndexMap[nums[i]]
        // distance between the same numbers
        distanceBetween := abs(value, i)

        if (isFound && distanceBetween <= k) {
            return true;
        }

        numberIndexMap[nums[i]] = i
    }

    return false;
}
```

## Typescript

- Time complexity: $O(n)$ - **n** is a length of an array of integers
- Auxiliary space: $O(n)$ - constant amount of space

```typescript
function twoSum(nums: number[], target: number): number[] {
  const numberIndexHash = {};

  return nums.some((num, index) => {
    if (num in numberIndexHash && Math.abs(index - numberIndexHash[num]) <= k) {
      return true;
    }

    numberIndexHash[num] = index;
  });
}
```
