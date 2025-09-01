---
title: Valid palindrome
published_at: 2022-12-17 12:00
tags: [leetcode, go]
leetcode_number: 125
---

[Leetcode 125 problem.](https://leetcode.com/problems/valid-palindrome/)

A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

## Go

- Time complexity: $O(n)$ - **n** is a length of a string
- Auxiliary space: $O(n)$ - **n** is a length of a string

```go
import "strings"

func extractAlphaNumChars(s string) string {
    var result strings.Builder

    for i := 0; i < len(s); i++ {
        char := s[i]
        if ('a' <= char && char <= 'z') ||
            ('A' <= char && char <= 'Z') ||
            ('0' <= char && char <= '9') {
            result.WriteByte(char)
        }
    }
    return result.String()
}

func reverseString(s string) string {
    chars := []rune(s)
    for i, j := 0, len(chars)-1; i < j; i, j = i+1, j-1 {
        chars[i], chars[j] = chars[j], chars[i]
    }
    return string(chars)
}

func isPalindrome(s string) bool {
    text := extractAlphaNumChars(s)
    text = strings.ToLower(text)

    return text == reverseString(text)
}
```
