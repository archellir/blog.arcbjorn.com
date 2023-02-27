---
title: Sliding window maximum
published_at: 2023-02-26 12:05
snippet: 239 - Go solution
tags: [leetcode]
---

[Leetcode 239 problem.](https://leetcode.com/problems/sliding-window-maximum/)

## Go

- Time complexity: $O(n)$ - `n` is a length of an array of numbers
- Auxiliary space: $O(n)$ - `n` is a length of an array of numbers

```go
func maxSlidingWindow(nums []int, k int) []int {
    result := make([]int, 0)
    queue := make([]int, 0)
    
    for index, num := range nums {
        for len(queue) > 0 && nums[queue[len(queue)-1]] <= num {
            queue = queue[:len(queue)-1]
        }
        
        queue = append(queue, index)
        
        if index >= k - 1 {
            result = append(result, nums[queue[0]])
        }
        
        if queue[0] == index - k + 1 {
            queue = queue[1:]
        }
    }
    
    return result
}
```