---
title: Circular array loop
published_at: 2023-03-05 12:00
snippet: 457 - Go solution
tags: [leetcode]
---

[Leetcode 457 problem.](https://leetcode.com/problems/circular-array-loop/)

## Go

- Time complexity: $O(n)$ - `n` is a length of a number array
- Auxiliary space: $O(n)$ - `n` is a length of a number array

```go
func nextIndex(nums []int, currentIndex int) int {
    length := len(nums)

    next := currentIndex + nums[currentIndex]
    next = next % length

    if next < 0 {
        return length + next
    }

    return next
}

func circularArrayLoop(nums []int) bool {
    length := len(nums)

    if length == 1 {
        return false
    }
    
    visited := make([]bool, length)
    for i := 0; i < length; i++ {
        if visited[i] {
            continue
        }

        visited[i] = true

        fast := i
        slow := i
        for {
            // fast 2 steps
            fast = nextIndex(nums, fast)
            visited[fast] = true
            fast = nextIndex(nums, fast)
            visited[fast] = true
            
            // slow 1 step
            slow = nextIndex(nums, slow)
            visited[slow] = true
            
            // always circular
            if fast == slow {
                break
            }
        }
        
        start := i

        for start != slow {
            start = nextIndex(nums, start)
            slow = nextIndex(nums, slow)
        }
        
        currentNext := nextIndex(nums, start)

        if currentNext == start {
            // cycle length is 1
            continue
        }
        
        isForwardDirection := nums[start] > 0
        
        for currentNext != start {

            if (nums[currentNext] > 0) != isForwardDirection {
                break
            }

            currentNext = nextIndex(nums, currentNext)
        }
        
        // finished the cycle
        if currentNext == start {
            return true
        }
    }
    
    return false
}
```