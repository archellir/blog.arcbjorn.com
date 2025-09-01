---
title: Arranging coins
published_at: 2023-02-23 12:00
tags: [leetcode, go, typescript]
leetcode_number: 441
---

[Leetcode 441 problem.](https://leetcode.com/problems/arranging-coins/)

## Go

- Time complexity: $O(n)$ - **n** is a parameter number
- Auxiliary space: $O(1)$ - constant amount of space

```go
func arrangeCoins(n int) int {
    completeRows := 0

    // first row is 1, i = 1
    for i := 1; i <= n; i++ {
        // if there are still coins after row (i) deduction
        if n - i >= 0 {
            // add row
            completeRows++
            // remove coins of current row from total
            n -= i
        }
    }

    return completeRows
}
```

## Typescript

- Time complexity: $O(n)$ - **n** is a parameter number
- Auxiliary space: $O(1)$ - constant amount of space

```typescript
function arrangeCoins(n: number): number {
    let completeRows = 0;
    let usedCoins = 0;

    for (let i = 1; i <= n; i++) {
        usedCoins += i;

        if (usedCoins <= n) {
            completeRows++
        } else {
            return completeRows
        }
    }

    return completeRows
}
```