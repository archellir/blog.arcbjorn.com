---
title: Length of last word
published_at: 2022-12-16
snippet: Go solution for Leetcode 58
tags: [leetcode]
---

[Leetcode 58 problem.](https://leetcode.com/problems/length-of-last-word/)

Given a string s consisting of words and spaces, return the length of the last word in the string.
A word is a maximal substring consisting of non-space characters only.

### Go

```go
import "strings"

func lengthOfLastWord(s string) int {
    text := strings.Trim(s, " ")

    var maxCharacters bool = false
    maxLen := 0

	// stop on the end of the text or on whitespace
    for i := len(text)-1; i >= 0 && maxCharacters == false; i-- {
        if (text[i] == ' ') {
            maxCharacters = true
            break
        }
        maxLen++
    }

    return maxLen
}
```