---
title: Smallest range covering elements from k lists
published_at: 2023-02-17 12:00
tags: [leetcode, go]
leetcode_number: 632
---

[Leetcode 632 problem.](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/)

`K` lists of sorted integers in **non-decreasing order**. A function, to find the **smallest** range that includes at least one number from each of the `k` lists.

## Go

- Time complexity: $O(n*log(n) + n*k)$ - **n** is a quantity of all numbers, **k** is a number of lists
- Auxiliary space: $O(n)$ - **n** is a quantity of all numbers

```go
type data struct {
    num int
    list int
}

func smallestRange(nums [][]int) []int {
    var commonList []data

    for i := 0; i < len(nums); i++ {
        for j := 0; j < len(nums[i]); j++ {
            // number from each array is "num", its list is "i" (index of array)
            commonList = append(commonList, data{nums[i][j], i})
        }
    }
    
    // sort by list index
    sort.Slice(commonList, func(i int, j int) bool {
        // if the current number equals next number in the common list
        if commonList[i].num == commonList[j].num {
            // sort by the list
            return commonList[i].list < commonList[j].list
        }
        // if the numbers are not the same, we sort by actual number value
        return commonList[i].num < commonList[j].num
    })
    
    // reset indices
    i, j := 0, 0
    // key is a list index, value is iterations
    dictinary := make(map[int]int)

    count := 0
    result1, result2 := 0, math.MaxInt64

    // iterate over commonList
    for j < len(commonList) {
        if dictinary[commonList[j].list] == 0 {
            count++
        }

        dictinary[commonList[j].list]++
        j++
        
        // iterate over all arrays
        for count == len(nums) {
            // compare the elements by 1 by 1
            if result2 - result1 > commonList[j - 1].num - commonList[i].num {
                result1, result2 = commonList[i].num, commonList[j - 1].num
            }


            // deduct from list iteration
            if dictinary[commonList[i].list] == 1 {
                count--
            }

            // deduct from the count
            dictinary[commonList[i].list]--
            // iterate over elements of arrays
            i++
        }
    }
    return []int{result1, result2}
}
```
