---
title: Sort an array
published_at: 2023-02-19 12:03
snippet: 912 - C++ solution
tags: [leetcode]
---

[Leetcode 912 problem.](https://leetcode.com/problems/sort-an-array/)

A function, given an array of integers `nums`, sort the array in ascending order and return it.

## C++

#### Heap Sort

- Time complexity: $O(n * log(n))$ - **n** is a length of an array
- Auxiliary space: $O(n)$ - **n** is a length of an array

```cpp
class Solution {
public:
    vector<int> sortArray(vector<int>& nums) {
        auto heapify = [&](int i, int e) {
            while (i <= e) {
                int left = 2 * i + 1;
                int right = 2 * i + 2;

                int j = i;

                if (left <= e && nums[left] > nums[j]) {
                    j = left;
                };
                if (right <= e && nums[right] > nums[j]) {
                    j = right;
                };

                if (j == i) {
                    break;
                };

                swap(nums[i], nums[j]);
                swap(i, j);
            }
        };
        
        const int length = nums.size();
        
        // initialize heap
        for (int i = length / 2; i >= 0; i--) {
            heapify(i, length - 1);
        }
        
        // get mininimum
        for (int i = length - 1; i >= 1; i--) {
            swap(nums[0], nums[i]);
            heapify(0, i - 1);    
        }
        
        return nums;
    }
};
```