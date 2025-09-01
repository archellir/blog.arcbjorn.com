---
title: Sort array by increasing frequency
published_at: 2024-07-22 12:00
tags: [leetcode, go]
leetcode_number: 1636
---

[Leetcode 1636 problem.](https://leetcode.com/problems/sort-array-by-increasing-frequency/)

Given an array of integers nums, sort the array in increasing order based on the frequency of the values. If multiple values have the same frequency, sort them in decreasing order.

## Go

- Time complexity: $O(n*log(n))$ - **n** is a length of an array
- Auxiliary space: $O(n)$ - **n** is a length of an array

```go
import (
	"sort"
)

func frequencySort(nums []int) []int {
	// key = number
	// value = frequency of this number in array
	frequencyMap := make(map[int]int)
	for _, num := range nums {
		frequencyMap[num]++
	}

	sort.Slice(nums, func(i, j int) bool {
		// comparing frequency of numbers from recorded frequency map
		if frequencyMap[nums[i]] == frequencyMap[nums[j]] {
			// increasing order
			return nums[i] > nums[j]
		}
		// decreasing order
		return frequencyMap[nums[i]] < frequencyMap[nums[j]]
	})

	return nums
}
```
