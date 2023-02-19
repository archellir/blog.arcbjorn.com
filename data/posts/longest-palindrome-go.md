---
title: Longest palindrome
published_at: 2022-12-27 12:00
snippet: 409 - Go solution
tags: [leetcode]
---

[Leetcode 409 problem.](https://leetcode.com/problems/longest-palindrome/)

A function, given a string `s` which consists of lowercase or uppercase letters, to return _the length of the **longest palindrome**_ that can be built with those letters.

## Go

- Time complexity: $O(n)$ - **n** is a length of a string
- Auxiliary space: $O(n)$ - **n** is a length of a string

```go
func longestPalindrome(s string) int {
    countList, maxLength := make(map[rune]int), 0

    for _, run := range s {
	    // delete from countList in case the letter already recorded
        if _, exists := countList[run]; exists {
            delete(countList, run)
            maxLength++
	    // register letters in countList
        } else {
            countList[run] = 1
        }
    }

	// add new possible letter if countList is not empty
    if len(countList) != 0 {
        return maxLength * 2 + 1
    }

    return maxLength * 2
}
```