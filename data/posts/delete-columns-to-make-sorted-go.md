---
title: Delete columns to make sorted
published_at: 2022-12-27
snippet: 944 - Go solution
tags: [leetcode]
---

[Leetcode 944 problem.](https://leetcode.com/problems/delete-columns-to-make-sorted/)

A function to delete **delete** the columns that are **not sorted lexicographically** in a grid of words with `n` length.

### Go

```go
func minDeletionSize(strs []string) int {
	if len(strs) <= 1 {
		return 0
	}

	var deletedRows int
	for i := range strs[0] {
        fmt.Println(i)
		for wordsIdx := 0; wordsIdx < len(strs)-1; wordsIdx++ {
			if strs[wordsIdx][i] > strs[wordsIdx+1][i] {
				deletedRows++
				break
			}
		}
	}

	return deletedRows
}
```