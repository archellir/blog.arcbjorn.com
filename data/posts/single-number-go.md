---
title: Single number
published_at: 2023-03-04 12:11
tags: [leetcode, go]
leetcode_number: 136
---

[Leetcode 136 problem.](https://leetcode.com/problems/single-number/)

Given a **non-empty** array of integers `nums`, every element appears _twice_
except for one. Find that single one.

## Go

- Time complexity: $O(n)$ - `n` is a length of a number array
- Auxiliary space: $O(1)$ - constant amount of space

```go
func singleNumber(nums []int) int {
	singleNumber := 0

	for _, n := range nums {
		singleNumber ^= n
	}

	return singleNumber
}
```
