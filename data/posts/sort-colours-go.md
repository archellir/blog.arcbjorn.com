---
title: Sort colours
published_at: 2023-12-19 12:00
snippet: 75 - Go solution
tags: [leetcode]
---

[Leetcode 75 problem.](https://leetcode.com/problems/sort-colors/)

## Go

- Time complexity: $O(n)$ - **n** is a length of numbers array
- Auxiliary space: $O(1)$ - constant amount of space

```go
func sortColors(nums []int) []int {
    // index is a colour (0, 1, 2)
    // value a is a frequency of the number in the parameter array
    colourFrequencies := make([]int, 3)
    for _, num := range nums {
        colourFrequencies[num]++
    }

	sortedIndex := 0

    // for each of the colours (0, 1, 2)
    for i := 0; i < 3; i++ {
        // iterate for frequency times of each number
		for j := 0; j < colourFrequencies[i]; j++ {
            // add the number to array
			nums[sortedIndex] = i
            
			sortedIndex++
		}
	}

    return nums
}

// func sortColors(nums []int)  {
// 	sort.Ints(nums)
// }
```
