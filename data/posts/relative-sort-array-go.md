---
title: Relative sort array
published_at: 2023-02-19 12:01
tags: [leetcode, go]
leetcode_number: 1122
---

[Leetcode 1122 problem.](https://leetcode.com/problems/relative-sort-array/)

## Go

- Time complexity: $O(n)$ - **n** is a quantity of elements in array with
  maximum length
- Auxiliary space: $O(1)$ - constant amount of space

```go
import "sort"

func relativeSortArray(arr1 []int, arr2 []int) []int {
    var result []int
    numberFrequencyArr1 := make(map[int]int)

    // hash map of frequency of numbers in arr1
    for _, v := range arr1 {
        numberFrequencyArr1[v]++
    }

    // take the equal elements of arr1 from the numberFrequencyArr1
    for _, num := range arr2 {
        currentFrequency := numberFrequencyArr1[num]
        
        for i := 0; i < currentFrequency; i++ {
            result = append(result, num)
        }

        // reset frequency in arr1
        numberFrequencyArr1[num] = 0
    }

    var uncommonNumbers []int
    for num, frequency := range numberFrequencyArr1 {
        for i := 0; i < frequency; i++ {
            uncommonNumbers = append(uncommonNumbers, num)
        }
    }

    sort.Ints(uncommonNumbers)
    result = append(result, uncommonNumbers...)

    return result
}
```
