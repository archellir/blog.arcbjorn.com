---
title: Robot return to origin
published_at: 2022-01-03 12:00
tags: [leetcode, go]
leetcode_number: 657
---

[Leetcode 657 problem.](https://leetcode.com/problems/robot-return-to-origin/)

## Go

- Time complexity: $O(n)$ - **n** is a length of a string
- Auxiliary space: $O(1)$ - constant amount of space

```go
import "strings"

func judgeCircle(moves string) bool {
    ups := strings.Count(moves, "U")
    downs := strings.Count(moves, "D")

    if ups != downs {
        return false
    }

    lefts := strings.Count(moves, "L")
    rights := strings.Count(moves, "R")

    if lefts != rights {
        return false
    }


    return true
}
```
