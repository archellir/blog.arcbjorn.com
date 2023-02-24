---
title: Maximum tastiness of a candy basket
published_at: 2023-02-23 12:00
snippet: 2517 - Python solution
tags: [leetcode]
---

[Leetcode 2517 problem.](https://leetcode.com/problems/maximum-tastiness-of-candy-basket/)

## Python

- Time complexity: $O(n * log(n))$ - **n** is a length of an array
- Auxiliary space: $O(1)$ - constant amount of space

```python
class Solution:
    def maximumTastiness(self, price: List[int], k: int) -> int:
        price.sort()
        low, high = 0, sum(price)
        
        def isValidQuantity(value):
            candiesNumber = 1
            cheapest = price[0]

            for i in range(1, len(price)):
                if price[i] - cheapest >= value:
                    candiesNumber += 1
                    cheapest = price[i]

            return candiesNumber >= k

        
        while low <= high:
            mid = low + (high - low) // 2

            if isValidQuantity(mid):
                low = mid + 1
            else:
                high = mid - 1

        return high
```