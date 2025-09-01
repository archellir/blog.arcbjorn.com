---
title: Range sum query 2d immutable
published_at: 2023-02-24 12:03
tags: [leetcode, go]
leetcode_number: 304
---

[Leetcode 304 problem.](https://leetcode.com/problems/range-sum-query-2d-immutable/)

## Go

- Time complexity: $O(1)$ - constant amount of time
- Auxiliary space: $O(1)$ - constant amount of space

```go
type NumMatrix struct {
    sum [][]int
}


func Constructor(matrix [][]int) NumMatrix {
    if len(matrix) == 0 || len(matrix[0]) == 0 {
        return NumMatrix{}
    }

    vertical := len(matrix)
    horizontal := len(matrix[0])
    
    sum := make([][]int, vertical + 1)
    for i := 0; i < len(sum); i++ {
        sum[i] = make([]int, horizontal + 1)
    }
    
    // copy the top left element of original matrix
    sum[1][1] = matrix[0][0]

    // fill the rows of matrix with duplicated values
    for i := 2; i < len(sum[0]) ; i++ {
        sum[1][i] = sum[1][i - 1] + matrix[0][i - 1]
    }
    
    // fill the columns of matrix with duplicated values
    for i := 2; i < len(sum); i++ {
        sum[i][1] = sum[i - 1][1] + matrix[i - 1][0]
    }
    
    // fill columns and rows starting from 3rd
    for i := 2; i < len(sum); i++ {
        for j := 2; j < len(sum[0]); j++ {
            // add duplicated values, remove values at the same indices and add values from original matrix
            sum[i][j] = sum[i - 1][j] + sum[i][j - 1] - sum[i - 1][j - 1] + matrix[i - 1][j - 1]
        }
    }

    return NumMatrix{sum : sum}
}


func (this *NumMatrix) SumRegion(row1 int, col1 int, row2 int, col2 int) int {
    return this.sum[row2 + 1][col2 + 1] - this.sum[row2 + 1][col1] - this.sum[row1][col2 + 1] + this.sum[row1][col1]
}


/**
 * Your NumMatrix object will be instantiated and called as such:
 * obj := Constructor(matrix);
 * param_1 := obj.SumRegion(row1,col1,row2,col2);
 */
```
