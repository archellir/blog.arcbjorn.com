---
title: K closest points to origin
published_at: 2023-02-18 12:00
snippet: 973 - Go solutions
tags: [leetcode]
---

[Leetcode 973 problem.](https://leetcode.com/problems/k-closest-points-to-origin/)

## Go

- Time complexity: $n*log(n)$ - **n** is a number of all points
- Auxiliary space: $O(1)$ - constant amount of space

```go
// list of points (x, y)
func swap(list [][]int, i int, j int) {
    temp := list[i]
    list[i] = list[j]
    list[j] = temp
}

// point (x, y)
func area(point []int) int {
    return point[0]*point[0] + point[1]*point[1]
}

func kClosest(list [][]int, k int) [][]int {
    left := 0
    right := len(list)-1
    divPoint := len(list)
    
    for divPoint != k {
        divPoint = partition(list, left, right)
        
        if divPoint < k {
            left = divPoint
        } else {
            right = divPoint - 1
        }
    }
    
    return list[:k]
}

// return new division point
func partition(list [][]int, left int, right int) int {
    // the current middle point (between x and y)
    markerPoint := list[left + (right-left)/2]

    // larger area = father from the origin
    markerArea := area(markerPoint)
    
    // iterate until there is no points in between left and right
    for left < right {
        leftPointArea := area(list[left])
        
        // left point distance >= middle point distance
        if (leftPointArea >= markerArea) {
            // swap value for start and end
            swap(list, left, right)
            right = right - 1
        } else {
            // if markerArea closer to the origin, move start (left point) to the right
            left = left + 1
        }
    }
    
    // left point on after the end of left range
    if area(list[left]) < markerArea {
        left = left + 1
    }
    
    return left
}
```
