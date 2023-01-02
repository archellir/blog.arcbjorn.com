---
title: Frequency of the most frequent element
published_at: 2022-12-8
snippet: 1838 - Go solution
tags: [leetcode]
---

[Leetcode 1838 problem.](https://leetcode.com/problems/frequency-of-the-most-frequent-element/)

The frequency of an element is the number of times it occurs in an array.

Objective is to find the maximum possible frequency of an element after
performing at most `k` operations of incrementation (+1).

### Go

```go
func maxFrequency(nums []int, k int) int {
	sort.Ints(nums)
	maxFreq := 1
	incrementsUsed := 0

	leftElement, rightElement, sampleLengh := 0, 1, len(nums)

	for rightElement < sampleLengh {
		incrementsUsed += (nums[rightElement] - nums[rightElement-1]) * (rightElement - leftElement)
		rightElement++

		for incrementsUsed > k {
			incrementsUsed -= nums[rightElement-1] - nums[leftElement]
			leftElement++
		}

		maxFreq = max(maxFreq, rightElement-leftElement)
	}
	return maxFreq
}

func max(x, y int) int {
	if x > y {
		return x
	}
	return y
}

// func main() {
// 	sampleArray := []int{9930, 9923, 9983, 9997, 9934, 9952, 9945, 9914, 9985, 9982, 9970, 9932, 9985, 9902, 9975, 9990, 9922, 9990, 9994, 9937, 9996, 9964, 9943, 9963, 9911, 9925, 9935, 9945, 9933, 9916, 9930, 9938, 10000, 9916, 9911, 9959, 9957, 9907, 9913, 9916, 9993, 9930, 9975, 9924, 9988, 9923, 9910, 9925, 9977, 9981, 9927, 9930, 9927, 9925, 9923, 9904, 9928, 9928, 9986, 9903, 9985, 9954, 9938, 9911, 9952, 9974, 9926, 9920, 9972, 9983, 9973, 9917, 9995, 9973, 9977, 9947, 9936, 9975, 9954, 9932, 9964, 9972, 9935, 9946, 9966}
// 	sampleInt := 3056

// 	maxFreq := maxFrequency(sampleArray, sampleInt)
// 	fmt.Println(maxFreq)
// }
```
