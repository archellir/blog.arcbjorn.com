---
title: Maximum subarray
published_at: 2023-02-20 12:03
snippet: 53 - Go, Typescript solutions
tags: [leetcode]
---

[Leetcode 53 problem.](https://leetcode.com/problems/maximum-subarray/)

A function, given an integer array `nums`, find the subarray with the largest sum, and return _its sum_.

## Go

- Time complexity: $O(n)$ - **n** is a length of an array
- Auxiliary space: $O(1)$ - constant amount of space

```go
func maxSubArray(nums []int) int {
    length := len(nums)

	if length == 0 {
		return 0
	}

    // starting as a first value
	maximumSum := nums[0]
    // temprorary sum
	sum := 0

	for i := 0; i < length; i++ {
        // accumulated sum with current value
		currentSum := sum + nums[i]

        // choose between current maximum and current sums
		maximumSum = max(maximumSum, currentSum)

        // reset temprorary sum
		if currentSum <= 0 {
			sum = 0
		} else {
			sum = currentSum
		}
	}

	return maximumSum
}

func max(a, b int) int {
	if (a > b) {
        return a
    } else {
        return b
    }
}
```

## Typescript

- Time complexity: $O(n)$ - **n** is a length of an array
- Auxiliary space: $O(1)$ - constant amount of space

```typescript
function maxSubArray(nums: number[]): number {
  let sum = 0;

  // starting as a first value
  let maximumSum = nums[0];

  for (let num of nums) {
    // reset temprorary
    if (sum < 0) {
        sum = 0
    };
    
    sum += num;

	// pick new maximum sum
    if (sum > maximumSum) {
        maximumSum = sum
    };
  }

  return maximumSum;
}
```