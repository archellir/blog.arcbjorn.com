---
title: License key formatting
published_at: 2022-12-29 12:00
tags: [leetcode, go]
leetcode_number: 482
---

[Leetcode 482 problem.](https://leetcode.com/problems/license-key-formatting/)

### Go

- Time complexity: $O(n * log_n)$ - **n** is a length of a string
- Auxiliary space: $O(1)$ - constant amount of space

```go
import "strings"

func licenseKeyFormatting(s string, k int) string {
    upperCaseS := strings.ToUpper(s)   
    str := strings.Replace(upperCaseS, "-", "", -1)
    
    lastComboLastCharIdx := len(str) - 1 - k;

    // starting from the end
    // jumping over `k` characters
    // till first character
    for i := lastComboLastCharIdx; i >= 0; i = i - k {
        // concantination of 2 strings:
        // string up untill the begining of the latest combo
        // start of the string of latest combo till the end
        str = str[0:i + 1] + "-" + str[i + 1:]
    }
    
    return str
}
```
