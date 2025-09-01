---
title: Detect capital
published_at: 2022-12-24 12:00
tags: [leetcode, go]
leetcode_number: 520
---

[Leetcode 520 problem.](https://leetcode.com/problems/detect-capital/)

A function to determine if the usage of capitals in a word is correct.

### Go

- Time complexity: $O(n)$ - **n** is a length of a string
- Auxiliary space: $O(1)$ - constant amount of space

```go
import "strings"

func detectCapitalUse(word string) bool {
    // all lowercase
    if (strings.ToLower(word) == word) {
        return true
    }

    // all uppercase
    if (strings.ToUpper(word) == word) {
        return true
    }

    // from second letter lowercase
    if (strings.ToLower(word[1:]) == word[1:]) {
        return true
    }

    return false
}
```