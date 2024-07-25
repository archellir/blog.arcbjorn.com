---
title: Roman to integer
published_at: 2024-07-25 12:00
snippet: 13 - Go solution
tags: [leetcode]
---

[Leetcode 13 problem.](https://leetcode.com/problems/roman-to-integer/)

Given a roman numeral, convert it to an integer.

## Go

- Time complexity: $O(n)$ - **n** is a length of a string
- Auxiliary space: $O(1)$ - **n** is a length of a string

```go
func romanToInt(s string) int {
	// rune to their integer values
	romanValues := map[rune]int{
		'I': 1,
		'V': 5,
		'X': 10,
		'L': 50,
		'C': 100,
		'D': 500,
		'M': 1000,
	}
	
	result := 0
	prevValue := 0
	
	// iterate over each character (rune) in the string
	for _, char := range s {
		// integer value for the current symbol
		currentValue := romanValues[char]
		
		// value to the result
		result += currentValue
		
		// handle a subtraction case
		if currentValue > prevValue {
			// if current value is greater than previous value,
			// subtract twice the previous value:
			// once to cancel the previous addition, and once for the actual subtraction
			result = result - (2 * prevValue)
		}
		
		// next iteration
		prevValue = currentValue
	}
	
	return result
}
```