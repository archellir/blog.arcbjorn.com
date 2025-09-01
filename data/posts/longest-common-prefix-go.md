---
title: Longest common prefix
published_at: 2022-12-15 12:00
tags: [leetcode, go]
leetcode_number: 14
---

[Leetcode 14 problem.](https://leetcode.com/problems/longest-common-prefix/)

A function to find the longest common prefix string amongst an array of strings.

## Go

- Time complexity: $O(n * l)$ - **n** is a length of a strings array and **l**
  is a largest length of a word
- Auxiliary space: $O(n)$ - **n** is a number of all characters in all strings

```go
func longestCommonPrefix(strs []string) string {
    var isMaxCommonPrefix bool = false;

    var commonPrefix string = "";

    firstWord := strs[0];

    for charIdx := 0; isMaxCommonPrefix == false; charIdx++ {
	    // maxCommonPrefix is found
        if (isMaxCommonPrefix) {
            break;
        }

        for wordIdx := 0; wordIdx < len(strs); wordIdx++ {
	        // next word does not have next character
            if (charIdx == len(strs[wordIdx])) {
                isMaxCommonPrefix = true;
                break;
            }

	        // prefix does not match with next word
            if (firstWord[charIdx] != strs[wordIdx][charIdx]) {
                isMaxCommonPrefix = true;
                break;
            }
        }

		// no exceptions thrown
        if (isMaxCommonPrefix == false) {
            commonPrefix += string(firstWord[charIdx]);
        }
    }

    return commonPrefix;
}
```
