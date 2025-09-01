---
title: Range sum query - immutable
published_at: 2023-02-20 12:01
tags: [leetcode, go, typescript]
leetcode_number: 303
---

[Leetcode 303 problem.](https://leetcode.com/problems/range-sum-query-immutable/)

## Go

- Time complexity: $O(n)$ - **n** is a length of an array
- Auxiliary space: $O(1)$ - constant amount of space

```go
type NumArray struct {
    nums []int
}


func Constructor(nums []int) NumArray {
    return NumArray{
        nums: nums,
    }
}


func (this *NumArray) SumRange(left int, right int) int {
    sum := 0

    for i := left; i <= right; i++ {
        sum += this.nums[i]
    }

    return sum
}


/**
 * obj := Constructor(nums);
 * param_1 := obj.SumRange(left,right);
 */
```

## Typescript

- Time complexity: $O(n)$ - **n** is a length of an array
- Auxiliary space: $O(1)$ - constant amount of space

```typescript
class NumArray {
    nums: number[];

    constructor(nums: number[]) {
        this.nums = nums;
    }

    sumRange(left: number, right: number): number {
        let sum = 0;

        for (let i = left; i <= right; i++) {
            sum += this.nums[i];
        }

        return sum;
    }
}
```