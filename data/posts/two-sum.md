---
title: Two sum
published_at: 2023-02-24 12:00
snippet: 1 - Go, Typescript solutions
tags: [leetcode]
---

[Leetcode 1 problem.](https://leetcode.com/problems/two-sum/)

## Go

- Time complexity: $O(n)$ - **n** is a length of an array of integers
- Auxiliary space: $O(n)$ - constant amount of space

```go
func twoSum(nums []int, target int) []int {
	// key is number, value is it's index
    numberIndexMap := make(map[int]int)
    
    for index, num := range nums {
	    // find first number that equals to the difference between current number and target number
        if value, isFound := numberIndexMap[target - num]; isFound {
	        // return found number and current number indices
            return []int{ value, index }
        } 
        
        numberIndexMap[num] = index
    }
    
    return nil
}
```


## Typescript

- Time complexity: $O(n)$ - **n** is a length of an array of integers
- Auxiliary space: $O(n)$ - constant amount of space

```typescript
function twoSum(nums: number[], target: number): number[] {
	// key is number, value is it's index
    const numberIndexMap = new Map();
    
    for (let i = 0; i < nums.length; i++) {
	    // difference between current number and target number
        const difference = target - nums[i];
        
        if (numberIndexMap.has(difference)) {
            return [numberIndexMap.get(difference), i];
        }
        
        numberIndexMap.set(nums[i], i);
    }
    
    return [];
}
```