---
title: Reverse words in a string III
published_at: 2023-01-4 12:00
tags: [leetcode, go]
leetcode_number: 557
---

[Leetcode 557 problem.](https://leetcode.com/problems/reverse-words-in-a-string-iii/)

A function, given a string `s`, to reverse the order of characters in each word
within a sentence while still preserving whitespace and initial word order.

## Go

- Time complexity: $O(n*log_n)$ - **n** is a length of a string
- Auxiliary space: $O(n)$ - **n** is a length of a string

```go
import "fmt"

func reverseWords(s string) string {
    words := strings.Split(s, " ")
    var reversedString string

    for index, word := range words {
        reversedString += reverseWord([]byte(word))

        if index != len(words) - 1 {
            reversedString += " "
        }
    }
    
    return reversedString
}

func reverseWord(s []byte) string {
    for i, j := 0, len(s)-1; i < j; i, j = i + 1, j - 1 {
        s[i], s[j] = s[j], s[i]
    }
    return string(s)
}
```
