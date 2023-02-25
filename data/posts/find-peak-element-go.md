---
title: Find peak element
published_at: 2023-02-25 12:04
snippet: 162 - Go solution
tags: [leetcode]
---

[Leetcode 162 problem.](https://leetcode.com/find-peak-element/)

## Go

- Time complexity: $O(log(n))$ - n is a length of an array
- Auxiliary space: $O(1)$ - constant amount of space

```go
func findPeakElement(nums []int) int {
    left := 0
    right := len(nums) - 1

    if right == 0 {
        return 0
    }

	// first element
    if nums[left] > nums[left + 1] {
        return left
    }

	// last element
    if nums[right] > nums[right - 1] {
        return right
    }

	// iterating over all
    for left < right {
        mid := left + (right - left) / 2

        if nums[mid] > nums[mid - 1] && nums[mid] > nums[mid + 1] {
            return mid
        }

        if nums[mid] > nums[mid - 1] {
            left = mid
            continue
        }
        
        right = mid
    }

    return left
}
```