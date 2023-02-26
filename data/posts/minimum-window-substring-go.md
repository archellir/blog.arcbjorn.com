---
title: Minimum window substring
published_at: 2023-02-26 12:00
snippet: 76 - Go solution
tags: [leetcode]
---

[Leetcode 76 problem.](https://leetcode.com/minimum-window-substring-go/)

## Go

#### Two pointers

- Time complexity: $O(s + t)$ - `n` is a length of first string parameter, `t` is a length of second
- Auxiliary space: $O(s + t)$ - `n` is a length of first string parameter, `t` is a length of second

```go
func minWindow(s string, t string) string {
    lengthS := len(s)
    lengthT := len(t)

    if lengthT > lengthS || lengthS == 0 || lengthT == 0 {
        return ""
    }
    
    // key is rune, value is frequency of this rune (letter)
    runeFrequencyT := map[byte]int{}

    for i := 0; i < lengthT; i++ {
        runeFrequencyT[t[i]]++
    }

    // key is rune, value is frequency of this rune (letter)
    runeFrequencyWindow := map[byte]int{}

    currentlyRecordedRunes := 0
    requiredRunes := len(runeFrequencyT)

    windowCoordinates := [3]int{-1, 0, 0}

    // two pointers
    start, end := 0, 0

    for end < lengthS {
        currentRune := s[end]

        runeFrequencyWindow[currentRune]++
        
        // if the frequecny in T matches the frequency in window, add to recorded runes
        if frequency, ok := runeFrequencyT[currentRune]; ok && frequency == runeFrequencyWindow[currentRune] {
            currentlyRecordedRunes++
        }

        // until end > start and not all runes has been recoreded
        for start <= end && currentlyRecordedRunes == requiredRunes {
            if windowCoordinates[0] == -1 || windowCoordinates[0] > end - start + 1 {
                windowCoordinates[0] = end - start + 1
                windowCoordinates[1] = start
                windowCoordinates[2] = end
            }

            // reduce current rune frequency in window
            runeFrequencyWindow[s[start]]--

            // if frequency in window < frequency in T, reduce recorded runes
            if frequency, ok := runeFrequencyT[s[start]]; ok && frequency > runeFrequencyWindow[s[start]] {
                currentlyRecordedRunes--
            }
            start++
        }
        end++
    }

    if windowCoordinates[0] == -1 {
        return ""
    } else {
        return s[windowCoordinates[1]:windowCoordinates[2] + 1]
    }
}
```