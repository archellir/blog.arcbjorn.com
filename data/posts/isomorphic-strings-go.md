---
title: Isomorphic strings
published_at: 2022-12-18 12:00
tags: [leetcode, go]
leetcode_number: 205
---

[Leetcode 205 problem.](https://leetcode.com/problems/isomorphic-trings/)

Two strings `s` and `t` are isomorphic if the characters in `s` can be replaced
to get `t`.

All occurrences of a character must be replaced with another character while
preserving the order of characters. No two characters may map to the same
character, but a character may map to itself.

## Go

- Time complexity: $O(n)$ - **n** is a length of a string (assuming both strings
  are the same length)
- Auxiliary space: $O(n)$ - **n** is a length of a string (assuming both strings
  are the same length)

```go
func isIsomorphic(s string, t string) bool {
	charCodes1 := make([]int, 256)
	charCodes2 := make([]int, 256)

	for i := 0; i < len(s); i++ {
		if charCodes1[int(s[i])] != charCodes2[int(t[i])] {
			return false
		}

		nextCharIdx := i + 1
		charCodes1[int(s[i])] = nextCharIdx
		charCodes2[int(t[i])] = nextCharIdx
	}

	return true
}
```
