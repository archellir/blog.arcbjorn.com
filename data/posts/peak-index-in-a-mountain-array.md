---
title: Peak index in a mountain array
published_at: 2023-02-25 12:00
snippet: 852 - Go, Typescript solutions
tags: [leetcode]
---

[Leetcode 852 problem.](https://leetcode.com/problems/peak-index-in-a-mountain-array/)

## Go

#### Binary search

- Time complexity: $O(log(n))$ - **n** is a length of an array
- Auxiliary space: $O(1)$ - constant amount of space

```go
func peakIndexInMountainArray(nums []int) int {
    left, right := 0, len(nums)

    var mid int

    for left <= right {
        mid = left + (right - left) / 2
        
        if nums[mid] > nums[mid + 1] && nums[mid] > nums[mid - 1]{
            return mid
        }

        if nums[mid] > nums[mid + 1] {
            right = mid - 1
        } else { 
            left = mid + 1
        }
    }
    
    return mid
}
```

#### Array iteration

- Time complexity: $O(n)$ - **n** is a length of an array
- Auxiliary space: $O(1)$ - constant amount of space

```go
func peakIndexInMountainArray(nums []int) int {

	for i, value := range nums {
		if i == 0 {
			continue
		} else if value > nums[i-1] && value > nums[i+1] {
			return i
		}
	}

	return 0
}
```

## Typescript

#### Max number (using standard library)

- Time complexity: $O(log(n))$ - **n** is a length of an array
- Auxiliary space: $O(1)$ - constant amount of space

```typescript
function peakIndexInMountainArray(nums: number[]): number {
  return nums.indexOf(Math.max(...nums));
}
```