---
title: Word pattern #290
published_at: 2022-12-21 12:00
tags: [leetcode, go]
---

[Leetcode 290 problem.](https://leetcode.com/problems/word-pattern/)

A full match, such that there is a bijection between a letter in `pattern` and a **non-empty** word in `s`.

## Go

- Time complexity: $O(n)$ - **n** is a length of a pattern string
- Auxiliary space: $O(n)$ - **n** is a length of an input string

```go
import "fmt"

func wordPattern(pattern string, str string) bool {
	words := strings.Split(str, " ")

	if len(words) == 0 {
		return false
	}
	if len(words) != len(pattern) {
		return false
	}

	wordRuneMap := make(map[byte]string)
	wordPresenceMap := make(map[string]bool)

	for i := 0; i < len(pattern); i++ {
		rune, word := pattern[i], words[i]

		mappedWord, ok := wordRuneMap[rune]
        
		if ok {
			if mappedWord == word {
				continue
			}
			return false
		}

		present, ok := wordPresenceMap[word]
		if ok && present {
			return false
		}

		wordRuneMap[rune] = word
		wordPresenceMap[word] = true
	}
	
	return true
}
```