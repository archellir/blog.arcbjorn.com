---
title: Valid anagram
published_at: 2022-12-20 12:00
snippet: 242 - Go solutions
tags: [leetcode]
---

[Leetcode 242 problem.](https://leetcode.com/problems/valid-anagram/)

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

## Go

- Time complexity: `O(n)` - **n** is the length of the string
- Auxiliary space: `O(1)` - constant amount of space

#### Byte comparison solution:

```go
func isAnagram(s string, t string) bool {
    if len(s)!=len(t) {
        return false
    }
    
	sourceArray := []byte(s)
	// descending sort
	sort.Slice(sourceArray, func(i, j int) bool {
		return sourceArray[i] < sourceArray[j]
	})

	// descending sort
	targetArray := []byte(t)
	sort.Slice(targetArray, func(i, j int) bool {
		return targetArray[i] < targetArray[j]
	})

    return bytes.Equal(sourceArray,targetArray)
}
```

#### Character frequency solution:

```go
import "strings"

func isAnagram(s string, t string) bool {
    if len(s) != len(t) {
        return false
    }

    for _, rune := range s {
        frequencyS := strings.Count(s, string(rune))
        frequencyT := strings.Count(t, string(rune))

        if (frequencyS != frequencyT) {
            return false
        }
    }

    return true
}
```

#### Hash table solution:

```go
func isAnagram(s string, t string) bool {
    if len(s) != len(t) {
        return false
    }
    
    sourceMap := make(map[rune]int)
	targetMap := make(map[rune]int)
    
	for _, char := range s {
		sourceMap[char]++
	}

	for _, char := range t {
		targetMap[char]++
	}

    for char, sourceCount := range sourceMap {
		if targetCount, exists := targetMap[letter]; !exists || sourceCount != targetCount {
			return false
		}
	}

    return true
}
```

