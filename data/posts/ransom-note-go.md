---
title: Ransom note
published_at: 2022-12-22
snippet: Go solution for Leetcode 383
tags: [leetcode]
---

[Leetcode 383 problem.](https://leetcode.com/problems/ransom-note/)

A function to determin if `ransomNote` can be constructed by using the letters from `magazine`, each of them is used only once.

### Go

```go
import "strings"

func canConstruct(ransomNote string, magazine string) bool {
    for _, rune := range ransomNote {
        frequencyInRansomNote := strings.Count(ransomNote, string(rune))
        frequencyInMagazine := strings.Count(magazine, string(rune))

        if (frequencyInMagazine < frequencyInRansomNote) {
            return false
        }
    }

    return true
}
```