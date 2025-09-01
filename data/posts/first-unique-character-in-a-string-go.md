---
title: First unique character in a string
published_at: 2022-12-23 12:00
tags: [leetcode, go]
leetcode_number: 387
---

[Leetcode 387 problem.](https://leetcode.com/problems/first-unique-character-in-a-string/)

A function to find the first non-repeating character in it and return its index. If it does not exist, it returns `-1`.

## Go

- Time complexity: $O(n^{2})$ - **n** is a length of a string
- Auxiliary space: $O(1)$ - constant amount of space

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