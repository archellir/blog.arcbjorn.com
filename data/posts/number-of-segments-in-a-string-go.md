---
title: Number of segments in a string
published_at: 2022-12-28 12:00
tags: [leetcode, go]
leetcode_number: 434
---

[Leetcode 434 problem.](https://leetcode.com/problems/number-of-segments-in-a-string/)

A function, given a string `s`, to return _the number of segments in the
string_. A **segment** is defined to be a contiguous sequence of **non-space
characters**.

## Go

- Time complexity: $O(n * log_{n})$ - **n** is a length of a string
- Auxiliary space: $O(n)$ - **n** is a length of a string

```go
func countSegments(s string) int {
    trimmedS := strings.Trim(s, " ")
    length := len(trimmedS)

    if length == 0 {
        return 0
    }

    var segmentsNumber int

    for idx, rune := range trimmedS {
	    // skip last character
        if (idx+1 == length) {
            continue
        }

        nextRune := trimmedS[idx+1]
	    // count only if next character is not whitespace
        if string(rune) == " " && string(nextRune) != " " {
            segmentsNumber++
        }
    }

    return segmentsNumber+1
}
```
