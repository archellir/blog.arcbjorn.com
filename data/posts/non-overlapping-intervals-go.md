---
title: Non-overlapping intervals
published_at: 2023-02-26 12:10
tags: [leetcode, go]
leetcode_number: 435
---

[Leetcode 435 problem.](https://leetcode.com/problems/non-overlapping-intervals/)

## Go

- Time complexity: $O(n * log(n))$ - `n` is a length of a string
- Auxiliary space: $O(1)$ - constant amount of time

```go
func eraseOverlapIntervals(intervals [][]int) int {
    minimumIntervals, previous := 0, 0
    
    // sort in ascending order
    sort.Slice(intervals, func(i, j int) bool {
        return intervals[i][0] < intervals[j][0]
    })

    for i := 1; i < len(intervals); i++ {
        currentIntervalStart := intervals[i][0]
        currentIntervalEnd := intervals[i][1]

        previousIntervalEnd := intervals[previous][1]

        if currentIntervalStart < previousIntervalEnd {
            if currentIntervalEnd < previousIntervalEnd {
                previous = i
            }

            minimumIntervals++
        } else {
            previous = i
        }
    }

    return minimumIntervals
}
```
