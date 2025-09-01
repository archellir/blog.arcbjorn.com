---
title: Reverse string
published_at: 2022-12-19 12:00
tags: [leetcode, go]
leetcode_number: 344
---

[Leetcode 344 problem.](https://leetcode.com/problems/reverse-string/)

A function that reverses a string. The input string is given as an array of characters (bytes) `s`.

## Go

- Time complexity: $O(n)$ - **n** is a length of a string
- Auxiliary space: $O(1)$ - constant amount of space

```go
func reverseString(s []byte) string {
    for i, j := 0, len(s)-1; i < j; i, j = i+1, j-1 {
        s[i], s[j] = s[j], s[i]
    }
    return string(s)
}
```
