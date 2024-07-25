---
title: Sort an array
published_at: 2024-07-24 12:00
snippet: 912 - Go solution
tags: [leetcode]
---

[Leetcode 912 problem.](https://leetcode.com/problems/sort-an-array/)

Implement an efficient sorting algorithm (like Quick Sort) that sorts an integer array in ascending order with $O(nlog(n))$ time complexity and minimal space usage, without using built-in sorting functions.

## Go

- Time complexity: $O(nlog(n))$ - **n** is a length of an array
- Auxiliary space: $O(log n) $ - **n** is a length of an array

```go
func sortArray(numbers []int) []int {
	if len(numbers) <= 1 {
			return numbers
	}

	// middle index of the array
	middleIndex := len(numbers) / 2

	// sort the left half of the array
	leftHalf := sortArray(numbers[:middleIndex])

	// sort the right half of the array
	rightHalf := sortArray(numbers[middleIndex:])

	// merge the sorted halves
	return mergeArrays(leftHalf, rightHalf)
}

func mergeArrays(leftArray, rightArray []int) []int {
	mergedArray := make([]int, len(leftArray) + len(rightArray))
	
	leftIndex, rightIndex, mergedIndex := 0, 0, 0

	// compare elements from both arrays and add the smaller one to the merged array
	for leftIndex < len(leftArray) && rightIndex < len(rightArray) {
		if leftArray[leftIndex] <= rightArray[rightIndex] {
			mergedArray[mergedIndex] = leftArray[leftIndex]
			leftIndex++
		} else {
			mergedArray[mergedIndex] = rightArray[rightIndex]
			rightIndex++
		}
		mergedIndex++
	}

	// add remaining elements from the left array
	for leftIndex < len(leftArray) {
		mergedArray[mergedIndex] = leftArray[leftIndex]
		leftIndex++
		mergedIndex++
	}

	// add remaining elements from the right array
	for rightIndex < len(rightArray) {
		mergedArray[mergedIndex] = rightArray[rightIndex]
		rightIndex++
		mergedIndex++
	}

	return mergedArray
}
```