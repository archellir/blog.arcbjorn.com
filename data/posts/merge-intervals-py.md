---
title: Merge intervals
published_at: 2023-02-23 12:01
snippet: 56 - Python solution
tags: [leetcode]
---

[Leetcode 56 problem.](https://leetcode.com/problems/merge-intervals/)

## Python

- Time complexity: $O(n * log(n))$ - **n** is a length of an array
- Auxiliary space: $O(1)$ - constant amount of space

```python
class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        
        # Sort by an intervals' start point
        intervals.sort(key = lambda x: x[0])
        i = 1
        
        while i < len(intervals):
            
            previousStart = intervals[i-1][0]
            previousEnd = intervals[i-1][1]

            currentStart = intervals[i][0]
            currentEnd = intervals[i][1]
            
            # if current previousStart is between previous interval
            if previousStart <= currentStart <= previousEnd:
                
                # current interval is minimum and maximum values of starts and ends
                intervals[i] = [min(previousStart, currentStart), max(previousEnd, currentEnd)]
                
                # delete previous interval from intervals
                intervals = intervals[:i-1] + intervals[i:]
            
            else:
                i += 1
                
        return intervals
```