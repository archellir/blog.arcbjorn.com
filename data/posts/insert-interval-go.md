---
title: Insert interval
published_at: 2023-02-26 12:07
tags: [leetcode, go]
leetcode_number: 57
---

[Leetcode 57 problem.](https://leetcode.com/problems/insert-interval/)

## Go

- Time complexity: $O(n)$ - `n` is a length of a string
- Auxiliary space: $O(n)$ - `n` is a length of a string

```go
func max(x, y int) int {
    if x > y {
        return x
    }

    return y
}

func min(x, y int) int {
    if x < y {
        return x
    }
    
    return y
}

func insert(intervals [][]int, newInterval []int) [][]int {
    left, right := [][]int{}, [][]int{}
    start, end := newInterval[0], newInterval[1]
    
    for _, interval := range intervals {
        if interval[1] < start {
            left = append(left, interval)
        } else if interval[0] > end {
            right = append(right, interval)
        } else {
            start = min(start, interval[0])
            end = max(end, interval[1])
        }
    }
    
    mergedInterval := []int{ start, end }
    intervalsUntilMerged := append(left, mergedInterval)
    totalNewIntervals := append(intervalsUntilMerged, right...)

    return totalNewIntervals
}
```