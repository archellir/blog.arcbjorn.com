---
title: Goat latin
published_at: 2023-01-05 12:00
snippet: 824 - Go solution
tags: [leetcode]
---

[Leetcode 824 problem.](https://leetcode.com/problems/goat-latin/)

### Go

```go
import "fmt"

func containsChar(arr []string, target string) bool {
    for _, item := range arr {
        if item == target {
            return true
        }
    }

    return false
}

func toGoatLatin(sentence string) string {
    words := strings.Split(sentence, " ")
    vowels := []string{"a", "e", "i", "o", "u"}

    var transformedSentence string

    for index, word := range words {
        newWord := word
        firstLetter := string(word[0])

        if (containsChar(vowels, firstLetter)) {
            newWord += "ma"
        } else {
            newWord = newWord[1:] + firstLetter + "ma"
        }

        for i := 0; i <= index; i++ {
            newWord += "a"
        }

        transformedSentence += newWord

        if (index != len(words)-1) {
            transformedSentence += " "
        }
    }

    return transformedSentence
}
```