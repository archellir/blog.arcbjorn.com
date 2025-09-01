---
title: Find minimum in rotated sorted array
published_at: 2023-02-25 12:03
tags: [leetcode, go]
leetcode_number: 153
---

[Leetcode 153 problem.](https://leetcode.com/find-minimum-in-rotated-sorted-array/)

## Go

- Time complexity: $O(log(n))$ - n is a length of an array
- Auxiliary space: $O(1)$ - constant amount of space

```go
func findMin(nums []int) int {
    left, right := 0, len(nums) - 1

    for left < right {
        mid := left + (right - left) / 2

        if nums[mid] < nums[left]{
            right = mid
        }else if nums[mid] < nums[right]{
            right = mid
        }else{
            left = mid + 1
        }
    }
    return nums[left]
}
```
