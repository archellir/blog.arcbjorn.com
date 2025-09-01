---
title: Linked list cycle II
published_at: 2023-03-04 12:04
tags: [leetcode, go]
leetcode_number: 142
---

[Leetcode 142 problem.](https://leetcode.com/problems/linked-list-cycle-ii/)

## Go

#### Slow & fast pointers

- Time complexity: $O(n)$ - `n` is a length of a list
- Auxiliary space: $O(1)$ - constant amount of space

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func detectCycle(head *ListNode) *ListNode {
    
    if head == nil || head.Next == nil {
        return nil
    }
    
    slow, fast := head, head
   
    for fast != nil && fast.Next != nil {
        slow = slow.Next
        fast = fast.Next.Next
        
        if fast == slow {
            
            slow = head
            
            for fast != slow {
                fast = fast.Next
                slow = slow.Next    
            }

            return slow
        }
    }
    
    return nil
}
```