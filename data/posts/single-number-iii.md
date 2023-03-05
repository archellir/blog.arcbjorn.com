---
title: Single number III
published_at: 2023-03-05 12:03
snippet: 260 - Go, C++ solutions
tags: [leetcode]
---

[Leetcode 260 problem.](https://leetcode.com/problems/single-number-iii/)

Given an integer array `nums`, in which exactly two elements appear only once and all the other elements appear exactly twice. Find the two elements that appear only once. You can return the answer in **any order**.

## Go

- Time complexity: $O(n)$ - `n` is a length of a number array
- Auxiliary space: $O(1)$ - constant amount of space

```go
func singleNumber(nums []int) []int {
    xor := 0

    for _, value := range nums {
        xor = xor ^ value
    }

    lastBit := xor & (-xor)
    uniqueNumbers := make([]int, 2)

    for _, value := range nums {

        if value & lastBit == 0 {
            uniqueNumbers[0] = uniqueNumbers[0] ^ value
        } else {
            uniqueNumbers[1] = uniqueNumbers[1] ^ value
        }
    }
    return uniqueNumbers
}
```

## C++

- Time complexity: $O(n)$ - `n` is a length of a number array
- Auxiliary space: $O(1)$ - constant amount of space

```cpp
class Solution {
public:
    vector<int> singleNumber(vector<int>& nums) {
        unsigned int all_xor = 0;
        int length = nums.size();

        // XOR all nums
        for(int i = 0; i < length; i++){
            all_xor = all_xor ^ nums[i];
        }
        
        // right set bit of XOR
        all_xor = all_xor & (-all_xor);
        
        // group with XOR bit position and group with unset bit
        vector<int> uniqueNumbers (2, 0);

        for(int i = 0; i < length; i++){
            if(all_xor & nums[i]){
                uniqueNumbers[0] = uniqueNumbers[0] ^ nums[i];
            } else {
                uniqueNumbers[1] = uniqueNumbers[1] ^ nums[i];
            }
        }
        
        return uniqueNumbers;
    }
};
```