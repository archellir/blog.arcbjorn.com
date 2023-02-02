---
title: Robot return to origin
published_at: 2023-01-03 12:00
snippet: 657 - Go solution
tags: [leetcode]
---

[Leetcode 657 problem.](https://leetcode.com/problems/robot-return-to-origin/)

### Go

- Time complexity: `O(n)` - **n** is the length of the string
- Auxiliary space: `O(1)` - constant amount of space

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
