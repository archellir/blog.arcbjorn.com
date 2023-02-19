---
title: Top k frequent elements
published_at: 2023-12-18 12:03
snippet: 347 - Go solution
tags: [leetcode]
---

[Leetcode 347 problem.](https://leetcode.com/problems/top-k-frequent-elements/)

A function, given an integer array `nums` and an integer `k`, to return _the_ `k` _most frequent elements_.

- Time complexity: $n*log(n)$ - **n** is a quantity of numbers
- Auxiliary space: $O(n)$ - depends on **n** - a quantity of all numbers

### Go

```go
func topKFrequent(nums []int, k int) []int {
    numberFrequencyMap := make(map[int]int, k)

    // map with a number is a key and value is a frequency of this number in array
    for _, num := range nums {
        numberFrequencyMap[num]++
    }

    var numbers []int
    
    // create numbers' slice with no duplicates
    for num, _ := range numberFrequencyMap {
        numbers = append(numbers, num)
    }
    
    // sort numbers by its frequency values in numberFrequencyMap
    sort.Slice(numbers, func (i int, j int) bool {
        return numberFrequencyMap[numbers[i]] > numberFrequencyMap[numbers[j]]
    })
    
    // return slice with the size up to k elements
    return numbers[:k]
}
```