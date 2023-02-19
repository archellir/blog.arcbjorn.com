---
title: Insertion sort list
published_at: 2023-12-18 12:03
snippet: 347 - Go solution
tags: [leetcode]
---

[Leetcode 147 problem.](https://leetcode.com/problems/insertion-sort-list/)

- Time complexity: $O(n^2)$ - **n** is a quantity of nodes
- Auxiliary space: $O(1)$ - constant amount of space

### Go

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
 
func insertionSortList(head *ListNode) *ListNode {
    smallestNode := &ListNode{}
    node := smallestNode
    
    // till the end of the list
    for head != nil {
        // while it's not last node and next node value is smaller than current node value
        for node.Next != nil && node.Next.Val < head.Val {
            // swap current and next nodes' positions
            node = node.Next
        }
        
        // save next node
        nextHead := head.Next
        // swap current and next nodes' positions and values
        node.Next, head.Next = head, node.Next
        
        // move to the next node
        head = nextHead
        
        // if next node exists and its value < smallest current node
        if head != nil && head.Val < node.Next.Val {
            // reset smallest node
            node = smallestNode
        }
    }
    
    return smallestNode.Next
}
```