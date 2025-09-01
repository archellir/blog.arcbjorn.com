---
title: Bitwise and of numbers range
published_at: 2023-03-04 12:07
tags: [leetcode, go]
leetcode_number: 201
---

[Leetcode 201 problem.](https://leetcode.com/problems/bitwise-and-of-numbers-range/)

## Go

#### Using bit

- Time complexity: $O(n)$ - `n` is a quantity of numbers between 2 given numbers
- Auxiliary space: $O(1)$ - constant amount of space

```go
func rangeBitwiseAnd(left int, right int) int {
    difference := right - left
    bit := uint(0)

	// counting how many bits to move
    for difference != 0 {
        difference = difference >> 1
        bit++
    }
    
	// shift and AND both left and right
    return (left >> bit << bit) & (right >> bit << bit)
}
```

#### Iteration AND

- Time complexity: $O(n)$ - `n` is a quantity of numbers between 2 given numbers
- Auxiliary space: $O(1)$ - constant amount of space

```go
func rangeBitwiseAnd(left int, right int) int {
    for right > left && right != 0 {
	    // AND every consecutive number
        right = right & (right - 1)
    }
    
    return right
}
```

#### Counting solution

- Time complexity: $O(log(n))$ - `n` is a quantity of numbers between 2 given numbers
- Auxiliary space: $O(1)$ - constant amount of space

```go
func rangeBitwiseAnd(left int, right int) int {
	// shift until common prefix
    shifts := 0
    for left != right {
        left = left >> 1
        right = right >> 1 
        shifts++
    }
    
    // shift back to get the prefix in original bit positions
    return left << shifts
}
```