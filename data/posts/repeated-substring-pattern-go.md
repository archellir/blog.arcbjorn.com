---
title: Repeated substring pattern
published_at: 2022-12-28 12:00
tags: [leetcode, go]
leetcode_number: 459
---

[Leetcode 459 problem.](https://leetcode.com/problems/repeated-substring-pattern/)

A function, given a string `s`, to check if it can be constructed by taking a
substring of it and appending multiple copies of the substring together.

## Go

- Time complexity: $O(n * log_n)$ - **n** is a length of a string
- Auxiliary space: $O(1)$ - constant amount of space

```go
import "strings"

func repeatedSubstringPattern(s string) bool {
    length := len(s)
    for i := length / 2; i >= 1; i-- {
	    // length must always be dividable by the length of repeated string
        if length % i != 0 {
            continue
        }

		// create a string and compare with given
        if strings.Repeat(s[:i], length / i) == s {
            return true
        }
    };
    
    return false
}
```
