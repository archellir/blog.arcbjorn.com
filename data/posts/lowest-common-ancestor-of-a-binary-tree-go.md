---
title: Lowest common ancestor of a binary tree
published_at: 2023-03-04 12:00
snippet: 236 - Go solution
tags: [leetcode]
---

[Leetcode 236 problem.](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/)

## Go

- Time complexity: $O(n)$ - `n` is a number of nodes
- Auxiliary space: $O(h)$ - `h` is a height of a binary tree

```go
func lowestCommonAncestor(root, p, q *TreeNode) *TreeNode {
     if root == p || root == q || root == nil {
         return root
     }
     
     left := lowestCommonAncestor(root.Left, p, q)
     right := lowestCommonAncestor(root.Right, p, q)
     
     if left == nil && right == nil {
         return nil
     }
     
     if left != nil && right != nil {
         return root
     }
     
     if (left != nil) {
         return left
     }
     
     return right
}

```