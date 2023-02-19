---
title: Delete columns to make sorted
published_at: 2022-12-27 12:00
snippet: 944 - Go solution
tags: [leetcode]
---

[Leetcode 944 problem.](https://leetcode.com/problems/delete-columns-to-make-sorted/)

A function to **delete** the columns that are **not sorted lexicographically** in a grid of words with `n` length.

## Go

- Time complexity: $O(n*w)$ - **n** is a number of letter columns, w is a number of words
- Auxiliary space: $O(1)$ - constant amount of space

```go
func minDeletionSize(strs []string) int {
	if len(strs) <= 1 {
		return 0
	}

	var deletedCols int
	for i := range strs[0] {
        fmt.Println(i)
		for wordsIdx := 0; wordsIdx < len(strs)-1; wordsIdx++ {
			if strs[wordsIdx][i] > strs[wordsIdx+1][i] {
				deletedCols++
				break
			}
		}
	}

	return deletedCols
}
```