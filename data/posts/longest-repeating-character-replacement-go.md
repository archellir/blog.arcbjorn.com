---
title: Longest repeating character replacement
published_at: 2023-02-26 12:05
tags: [leetcode, go]
leetcode_number: 424
---

[Leetcode 424 problem.](https://leetcode.com/problems/longest-repeating-character-replacement/)

## Go

- Time complexity: $O(n)$ - `n` is a length of a string
- Auxiliary space: $O(n)$ - `n` is a length of a string

```go
func characterReplacement(s string, k int) int {    
    if len(s) <= k {
        return len(s)
    }
    
    result := 0
    currentWindow := 0

    right := 0
    left := 0

    // key = rune, value = frequency in the string
    runeFrequencyMap := make(map[byte]int)

    highestFrequency := 0

    for right < len(s) {
        currentWindow = right - left + 1
        runeFrequencyMap[s[right]] += 1

        // set new highest frequency
        if runeFrequencyMap[s[right]] > highestFrequency {
            highestFrequency = runeFrequencyMap[s[right]]
        }
        
        // make sure the rest of the characters have space
        if (currentWindow - highestFrequency) > k {
            currentWindow -= 1
            runeFrequencyMap[s[left]] -= 1 
            left += 1
        }
        
        if currentWindow > result {
            result = currentWindow
        }
        
        right++
    }
            
    return result
}
```