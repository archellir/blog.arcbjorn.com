---
title: Middle of the linked list
published_at: 2023-03-04 12:02
tags: [leetcode, go, typescript]
leetcode_number: 876
---

[Leetcode 876 problem.](https://leetcode.com/problems/middle-of-the-linked-list/)

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
func middleNode(head *ListNode) *ListNode {
	slow, fast := head, head

	for fast != nil && fast.Next != nil {
		slow = slow.Next
		fast = fast.Next.Next
	}
    
	return slow
}
```

## Typescript

```typescript
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */
```

#### Counting method

- Time complexity: $O(n)$ - `n` is a length of a list
- Auxiliary space: $O(1)$ - constant amount of space

```typescript
function middleNode(head: ListNode | null): ListNode | null {
  if (!head.next) {
    return head;
  }

  let length = 0;
  let current = head;

  while (current) {
    current = current.next;
    length++;
  }

  current = head;

  for (let i = 0; i < Math.floor(length / 2); i++) {
    current = current.next;
  }

  return current;
}
```

#### Array

- Time complexity: $O(n)$ - `n` is a length of a list
- Auxiliary space: $O(n)$ - `n` is a length of a list

```typescript
function middleNode(head: ListNode | null): ListNode | null {
  const nodes: ListNode[] = [];

  while (head != null) {
    nodes.push(head);
    head = head.next;
  }

  const midIndex = Math.floor(nodes.length / 2);

  return nodes[midIndex];
}
```

#### Slow & fast pointers

- Time complexity: $O(n)$ - `n` is a length of a list
- Auxiliary space: $O(1)$ - constant amount of space

```typescript
function middleNode(head: ListNode | null): ListNode | null {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  return slow;
}
```
