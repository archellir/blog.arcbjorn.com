---
title: Ransom note
published_at: 2022-12-22 12:00
tags: [leetcode, go]
leetcode_number: 383
---

[Leetcode 383 problem.](https://leetcode.com/problems/ransom-note/)

A function to determine if `ransomNote` can be constructed by using the letters
from `magazine`, each of them is used only once.

## Go

- Time complexity: $O(n*k)$ - **n** is a length of the first string, **k** is a
  length of the second string (if it's larger than **n**)
- Auxiliary space: $O(1)$ - constant amount of space

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
