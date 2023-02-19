---
title: Student Attendance Record I
published_at: 2023-01-02 12:00
snippet: 551 - Go solutions
tags: [leetcode]
---

[Leetcode 551 problem.](https://leetcode.com/problems/student-attendance-record-i/)

## Go

- Time complexity: $O(n)$ - **n** is a length of a string
- Auxiliary space: $O(1)$ - constant amount of space

```go
func checkRecord(s string) bool {
    consLateCount := 0
    absentCount := 0
    result := true

    for _, rune := range s {

        if string(rune) == "L" {
            consLateCount++
        } else {
            consLateCount = 0
        }

        if string(rune) == "A" {
            absentCount++
        }

        if consLateCount > 2 || absentCount > 1 {
            result = false
            break
        }
    }

    return result
}
```
