---
title: Lucky numbers in matrix
published_at: 2024-07-23 12:00
tags: [leetcode, go]
leetcode_number: 1380
---

[Leetcode 1380 problem.](https://leetcode.com/problems/lucky-numbers-in-a-matrix)

Find matrix elements that are simultaneously the minimum in their row and maximum in their column.

## Go

- Time complexity: $O(m * n)$ - **n** and **m** are number of rows and columns
- Auxiliary space: $O(m + n)$ - **n** and **m** are number of rows and columns

```go
func luckyNumbers (matrix [][]int) []int {
    rows := len(matrix)
    columns := len(matrix[0])
    
    rowMinNumbers := make([]int, rows)
    columnsMaxNumbers := make([]int, columns)
    
    // init rowMinNumbers with the first element of each row
    for i := range rowMinNumbers {
        rowMinNumbers[i] = matrix[i][0]
    }
    
    // init columnsMaxNumbers with the first element of each column
    columnsMaxNumbers = matrix[0]
    
    // dual sort to minimum in each row and maximum in each column
    for i := 0; i < rows; i++ {
        for j := 0; j < columns; j++ {
            if matrix[i][j] < rowMinNumbers[i] {
                rowMinNumbers[i] = matrix[i][j]
            }
            if matrix[i][j] > columnsMaxNumbers[j] {
                columnsMaxNumbers[j] = matrix[i][j]
            }
        }
    }
    
    luckyNunmbers := []int{}
    for i := 0; i < rows; i++ {
        for j := 0; j < columns; j++ {
            // check if it's a min in the row and max in the column
            if matrix[i][j] == rowMinNumbers[i] && matrix[i][j] == columnsMaxNumbers[j] {
                luckyNunmbers = append(luckyNunmbers, matrix[i][j])
            }
        }
    }
    
    return luckyNunmbers
}
```