---
title: Minimum size subarray sum
published_at: 2023-02-26 12:01
tags: [leetcode, go]
leetcode_number: 209
---

[Leetcode 209 problem.](https://leetcode.com/problems/minimum-size-subarray-sum/)

## Go

#### Two pointers

- Time complexity: $O(n)$ - `n` is a length of an array of numbers
- Auxiliary space: $O(n)$ - `n` is a length of an array of numbers

```go
func minSubArrayLen(target int, nums []int) int {
    left := 0
    sum := 0
    length := len(nums)
    minLength := len(nums) + 1
    
    // iterating over nums
    for right := 0; right < length; right++ {
        // sum of numbers up until the current number
        sum += nums[right]
        
        // until sum >= target
        // check if adding next item makes sufficient sum
        for sum >= target {
            currentRange := right - left + 1

            if currentRange < minLength {
                minLength = currentRange
            }

            // remove the previous left limit from the sum
            sum -= nums[left]
            // increment left limit
            left++
        }
    }
    
    if minLength > length {
        return 0
    }

    return minLength
}
```
