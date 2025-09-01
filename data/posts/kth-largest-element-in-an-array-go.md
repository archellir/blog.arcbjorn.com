---
title: Kth largest element in an array
published_at: 2023-02-18 12:01
tags: [leetcode, go]
leetcode_number: 215
---

[Leetcode 215 problem.](https://leetcode.com/problems/kth-largest-element-in-an-array/)

A function, given an integer array `nums` and an integer `k`, to return _the_
`kth` _largest element in the array_.

## Go

- Time complexity: $O(k*log(n))$ - **n** is a quantity of numbers, k is a
  quantity of numbers to return
- Auxiliary space: $O(1)$ - constant amount of space

```go
import "fmt"

import "container/heap"

type MinHeap []int

// first is smaller than second
func (hp MinHeap) Less(i, j int) bool {
    return hp[i] < hp[j]
}

func (hp MinHeap) Swap(i, j int) {
    hp[i], hp[j] = hp[j], hp[i]
}

func (hp MinHeap) Len() int {
    return len(hp)
}

// simple appending to the same memory address
func (hp *MinHeap) Push(x interface{}) {
    *hp = append(*hp, x.(int))
}

func (hp *MinHeap) Pop() interface{} {
    oldHeap := *hp
    oldLength := len(oldHeap)

    // get and remove last element from heap
    item := oldHeap[oldLength-1]
    *hp = oldHeap[:oldLength-1]

    return item
}

func findKthLargest(nums []int, k int) int {
    hp := MinHeap{}

    // pop all till Kth element
    for _, num := range nums {
        heap.Push(&hp, num)

        if (len(hp) > k) {
            heap.Pop(&hp)
        }
    }

    // pop Kth element
    return heap.Pop(&hp).(int)
}
```
