---
title: Single number
published_at: 2023-03-05 12:05
snippet: 477 - Go solution
tags: [leetcode]
---

[Leetcode 477 problem.](https://leetcode.com/problems/total-hamming-distance/)

## Go

- Time complexity: $O(n)$ - `n` is a length of a number array
- Auxiliary space: $O(1)$ - constant amount of space

```go
func totalHammingDistance(nums []int) int {
    sum := 0
    length := len(nums)

    for i := 0; i < 32; i++ {
        oneFrequency := 0

        for i := range nums {
            oneFrequency = oneFrequency + nums[i] & 1
            nums[i] = nums[i] >> 1
        }

        sum = sum + oneFrequency * (length - oneFrequency)
    }

    return sum
}
```