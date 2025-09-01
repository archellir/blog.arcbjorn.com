---
title: Longest nice subarray
published_at: 2023-03-04 12:01
tags: [leetcode, go]
leetcode_number: 2401
---

[Leetcode 2401 problem.](https://leetcode.com/problems/longest-nice-subarray/)

## Go

- Time complexity: $O(n)$ - `n` is a length of number
- Auxiliary space: $O(1)$ - constant amount of space

```go
func longestNiceSubarray(nums []int) int {
	maxLength := 0
	sum := 0
	startSubArrayIndex := 0

	for index := range nums {
        for sum&nums[index] != 0 {
		    sum ^= nums[startSubArrayIndex]
		    startSubArrayIndex++
	    }
	
	    sum ^= nums[index]
        maxLength = max(maxLength, index - startSubArrayIndex + 1)
    }

    return maxLength
}


func max(num1 int, num2 int) int {
	if num1 > num2 {
		return num1
    }
    return num2
}
```
