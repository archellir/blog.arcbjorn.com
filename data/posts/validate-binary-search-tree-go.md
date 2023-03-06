---
title: Validate binary search tree
published_at: 2023-03-05 12:07
snippet: 98 - Go solution
tags: [leetcode]
---

[Leetcode 98 problem.](https://leetcode.com/problems/validate-binary-search-tree/)

## Go

- Time complexity: $O(n)$ - `n` is a number of nodes
- Auxiliary space: $O(d)$ - `d` is a depth of a binary tree

```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
 
func isValidBST(root *TreeNode) bool {
	return checkWithMinMax(root, -1<<63, 1<<63-1)
}

func checkWithMinMax(root *TreeNode, left, right int) bool {
	if root == nil {
		return true
	}

	if root.Val >= right || root.Val <= left {
		return false
	}

    isValidLeft := checkWithMinMax(root.Left, left, root.Val)
    isValidRight := checkWithMinMax(root.Right, root.Val, right)

	return isValidLeft && isValidRight
}
```