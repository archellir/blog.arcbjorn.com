---
title: Symmetric tree
published_at: 2023-03-04 12:10
tags: [leetcode, go]
leetcode_number: 101
---

[Leetcode 101 problem.](https://leetcode.com/problems/symmetric-tree/)

Given the `root` of a binary tree, _check whether it is a mirror of itself_ (i.e., symmetric around its center).

## Go

- Time complexity: $O(n)$ - `n` is a height of a tree
- Auxiliary space: $O(log(n))$ - `n` is a number of recusrsive calls in the stack

```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
 
func isSymmetric(root *TreeNode) bool {
    return isEqual(root, root)
}

func isEqual(left *TreeNode, right *TreeNode) bool {
    if left == nil && right == nil {
        return true
    }

    if left == nil || right == nil {
        return false
    }

    isCurrentEqual := left.Val == right.Val

    isSymmetricLeft := isEqual(left.Left, right.Right)
    isAsymmetricRight := isEqual(left.Right, right.Left)

    return isCurrentEqual && isSymmetricLeft && isAsymmetricRight
}
```
