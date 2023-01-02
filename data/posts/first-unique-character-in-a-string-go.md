---
title: First unique character in a string
published_at: 2022-12-23
snippet: Go solution for Leetcode 387
tags: [leetcode]
---

[Leetcode 387 problem.](https://leetcode.com/problems/first-unique-character-in-a-string/)

A function to find the first non-repeating character in it and return its index. If it does not exist, it returns `-1`.

### Go

```go
func firstUniqChar(s string) int {
    for index, rune := range s {
        frequency := strings.Count(s, string(rune))

        if (frequency == 1) {
            return index
        }
    }

    return -1
}
```