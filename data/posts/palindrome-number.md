---
title: Palindrome number [9]
published_at: 2022-10-22
snippet: Go, Typescript, C++ solutions
tags: [leetcode]
---

[Leetcode 9 problem.](https://leetcode.com/problems/palindrome-number/)

Palindrome number is a natural number that has reflectional symmetry across a
vertical axis. It remains the same when its digits are reversed.

## Go

- Time complexity: `O(log10(input))` - each iteration divides the input by 10
- Auxiliary space: `O(1)` - constant amount of space

```go
func isPalindrome(x int) bool {
	if x < 0 || (x % 10 == 0 && x != 0) {
			return false;
	}
	
	var reversedNumber int = 0
	for x > reversedNumber {
			remainder := x % 10
			reversedNumber = reversedNumber * 10 + remainder
			x = x / 10
	}
	
	// odd and even cases
	return x == reversedNumber || x == reversedNumber / 10;
}
```

## Typescript

- Time complexity: `O(1)` - no division/multiplication by dynamic value
- Auxiliary space: `O(1)` - constant amount of space

```typescript
function isPalindrome(x: number): boolean {
  const reversedNumber: Number = Number(
    x.toString().split("").reverse().join(""),
  );

  return x === reversedNumber;
}
```

## C++

#### Number solution:

- Time complexity: `O(log10(input))` - each iteration divides the input by 10
- Auxiliary space: `O(1)` - constant amount of space

```cpp
bool isPalindrome(int x) {

	// can not be 0 or less than 10
	if(x < 0 || (x % 10 == 0 && x != 0)) {
		return false;
	}
	
	long int initialNumber = x, reversedNumber = 0, remainder = 0;

	// can not be less than 10 (result of x / 10)
	while(x != 0)
	{
		remainder = x % 10;
		
		// reverses order of digits
		// takes reversed accumulated last digits * 10 + current last digit
		reversedNumber = reversedNumber * 10 + remainder;
		
		// decreases the number digits by division by 10
		x = x / 10;
	}
	
	return initialNumber == reversedNumber;
};
```

#### String solution:

- Time complexity: `O(1)` - no division/multiplication by dynamic value
- Auxiliary space: `O(1)` - constant amount of space

```cpp
#include <string>

bool isPalindrome(int x) {
	string s = to_string(x);

	bool palindrome = true;
	int length = s.length();
	int stringMiddleChar = length/2;

	// iterate to the middle of the string
	for(int i = 0; i < stringMiddleChar; ++i) {
	
		// compare the chars on the left/right ends
		if(s[i] != s[length-1-i]) {
			palindrome = false;
			break;
		}
	}
	
	return palindrome;
}
```
