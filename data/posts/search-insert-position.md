---
title: Search insert position
published_at: 2023-02-20 12:02
tags: [leetcode, go, typescript]
leetcode_number: 35
---

[Leetcode 35 problem.](https://leetcode.com/problems/search-insert-position/)

A function, given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.

## Go

- Time complexity: $O(n)$ - **n** is a length of an array
- Auxiliary space: $O(1)$ - constant amount of space

```go
func searchInsert(nums []int, target int) int {
    for index, number := range nums {
        // 1. equal number
        // 2. since array is sorted, first larger number has position of possible insert

		if number == target || number > target {
			return index
		}
	}

	// if there is no such a number and none of the numbers is larger than parameter number
	// return new last index
	return len(nums)
}
```

## Typescript

- Time complexity: $O(n)$ - **n** is a length of an array
- Auxiliary space: $O(1)$ - constant amount of space

```typescript
function searchInsert(nums: number[], target: number): number {
    for (let i = 0; i < nums.length; i++){
        // 1. equal number
        // 2. since array is sorted, first larger number has position of possible insert
        
        if (nums[i] == target || nums[i]  > target) {
            return i
        }
    }
    
    // if there is no such a number and none of the numbers is larger than parameter number
	// return new last index
	return nums.length
};
```
