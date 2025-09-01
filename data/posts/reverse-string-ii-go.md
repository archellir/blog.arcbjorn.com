---
title: Reverse string II
published_at: 2023-01-2 12:00
tags: [leetcode, go]
leetcode_number: 541
---

[Leetcode 541 problem.](https://leetcode.com/problems/reverse-string-ii/)

Function to, given a string `s` and an integer `k`, reverse the first `k`
characters for every `2k` characters counting from the start of the string.

## Go

- Time complexity: $O(n)$ - **n** is a length of a string
- Auxiliary space: $O(n)$ - **n** is a length of a string

```go
import "fmt"

func reverseStr(s string, k int) string {
	var result string
	var reducedString string

	for i, char := range s {
		// if i is 2x bigger than k, then just add reducedString
		if i / k % 2 == 0 {
			reducedString = string(char) + reducedString
		} else {
			// reverse the order
			result = result + reducedString + string(char)
			reducedString = ""
		}
	}

	result = result + reducedString

	return result
}
```
