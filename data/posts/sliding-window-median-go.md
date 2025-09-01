---
title: Sliding window median
published_at: 2023-03-05 12:11
tags: [leetcode, go]
leetcode_number: 480
---

[Leetcode 480 problem.](https://leetcode.com/problems/sliding-window-median/)

## Go

#### Min & Max Heaps

- Time complexity: $O(n)$ - `n` is a length of a number array
- Auxiliary space: $O(n)$ - `n` is a length of a number array`

```go
func medianSlidingWindow(nums []int, k int) []float64 {
    smallNumbers := new(maxheap)
    largeNumbers := new(minheap)

    heap.Init(smallNumbers)
    heap.Init(largeNumbers)

    var medians []float64

    hashMap := make(map[int]int)

    i := 0
    for i < k {
        heap.Push(smallNumbers, nums[i])
        i++
    }

    for j := 0; j < k/2; j++ {
        heap.Push(largeNumbers, smallNumbers.Top())
        heap.Pop(smallNumbers)
    }

    for {
        if k % 2 == 1{ 
            medians = append(medians,float64(smallNumbers.Top()))
        } else {
            temp := (float64(smallNumbers.Top()) + float64(largeNumbers.Top())) * 0.5
            medians = append(medians,float64(temp))
        }

        if i >= len(nums) {
            break
        }  

        
        input := nums[i]
        output := nums[i-k]
        i++

        balance := 0  

        if output <= smallNumbers.Top(){
            balance -= 1
        } else {
            balance += 1
        }

        if _, ok := hashMap[output]; ok {  
            hashMap[output]++
        } else{
            hashMap[output] = 1
        }

        if !smallNumbers.Empty() && input <= smallNumbers.Top() {
            balance++
            heap.Push(smallNumbers, input)
        } else {
            balance--
            heap.Push(largeNumbers, input)
        }

        if balance < 0 {
            heap.Push(smallNumbers, largeNumbers.Top())
            heap.Pop(largeNumbers)
            balance++
        }

        if balance > 0 {
            heap.Push(largeNumbers, smallNumbers.Top())
            heap.Pop(smallNumbers)
            balance--
        }

        num, _ := hashMap[smallNumbers.Top()]
        for num > 0 {
            hashMap[smallNumbers.Top()]--
            heap.Pop(smallNumbers)
            num, _ = hashMap[smallNumbers.Top()]
        }

        num, _ = hashMap[largeNumbers.Top()]
        for !largeNumbers.Empty() && num > 0 {
            hashMap[largeNumbers.Top()]--
            heap.Pop(largeNumbers)
            num, _ = hashMap[largeNumbers.Top()]
        }
    }

    return medians
}
```

**Heaps implementation**

```go
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

func (h maxheap) Top() int {
    if h.Empty() {
		return 0
	} else {
		return h[0]
	}
}

func (h maxheap) Empty() bool {
	return len(h) == 0
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

func (h minheap) Top() int {
    if h.Empty() {
		return 0
	} else {
		return h[0]
	}
}

func (h minheap) Empty() bool {
	return len(h) == 0
}
```
