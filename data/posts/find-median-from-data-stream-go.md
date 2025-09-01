---
title: Find median from data stream
published_at: 2023-03-05 12:10
tags: [leetcode, go]
leetcode_number: 295
---

[Leetcode 295 problem.](https://leetcode.com/problems/find-median-from-data-stream/)

## Go

#### Min & Max Heaps

- Time complexity: $O(1)$ - constant amount of time 
- Auxiliary space: $O(n)$ - `n` is a number of elements in `MedianFinder`

```go
type MedianFinder struct {
    max *maxheap
    min *minheap
}

func Constructor() MedianFinder {
    return MedianFinder{
        max: &maxheap{},
        min: &minheap{},
    }
}


func (this *MedianFinder) AddNum(num int)  {
    max, min := this.max, this.min

    // if fist element
    if len(*min) == 0 {
        heap.Push(min, num)
        return
    }
    
    // if max and min heaps are same length
    if len(*max) == len(*min) {
        // if num < fist max element
        if num < (*max)[0] {
            heap.Push(min, (*max)[0])
            heap.Pop(max)
            heap.Push(max, num)
        } else {
            heap.Push(min, num)
        }

    } else {
        // if num > fist max element
        if num > (*min)[0] {
            heap.Push(max, (*min)[0])
            heap.Pop(min)
            heap.Push(min, num)
        } else {
            heap.Push(max, num)
        }
    }    
}


func (this *MedianFinder) FindMedian() float64 {
    max, min := this.max, this.min

    if len(*min) == 0 {
        return 0
    }

    // if max and min heaps are same length
    if len(*max) == len(*min) {
        return (float64((*max)[0]) + float64((*min)[0])) / 2
    } else {
        return float64((*min)[0])
    }
}

// Max heap

type maxheap []int

func (h maxheap) Len() int {
    return len(h)
}

func (h maxheap) Less(i int, j int) bool {
    return h[i] > h[j]
}

func (h maxheap) Swap(i int, j int) {
    h[i], h[j] = h[j], h[i]
}

func (h *maxheap) Pop() interface{} {
    a := *h
    res := a[len(a)-1]
    *h = a[:len(a)-1]
    return res
}

func (h *maxheap) Push(i interface{}) {
    *h = append(*h, i.(int))
}

// Min heap

type minheap []int

func (h minheap) Len() int {
    return len(h)
}

func (h minheap) Less(i int, j int) bool {
    return h[i] < h[j]
}

func (h minheap) Swap(i int, j int) {
    h[i], h[j] = h[j], h[i]
}

func (h *minheap) Pop() interface{} {
    a := *h
    res := a[len(a)-1]
    *h = a[:len(a)-1]
    return res
}

func (h *minheap) Push(i interface{}) {
    *h = append(*h, i.(int))
}


/**
 * Your MedianFinder object will be instantiated and called as such:
 * obj := Constructor();
 * obj.AddNum(num);
 * param_2 := obj.FindMedian();
 */
```