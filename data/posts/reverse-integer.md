---
title: Reverse integer
published_at: 2022-11-01
snippet: Go, Typescript, C++ solutions
---

32-bit integer with its digits reversed.

## Go

- Time Complexity: `O(log10(input))` - each iteration divides the input by 10
- Auxiliary space: `O(1)` - constant amount of space

```go
func reverse(x int) int {
	result, sign := 0, 1
 
    if (x < 0) {
        sign = -1
        x = -x     
    }

    for x > 0 {
        remainder := x % 10;
        result = result * 10 + remainder
		x /= 10;
    }
    
    var int32Converted int = int(int32(result))

    if int32Converted != result {
        return 0
    }

    return result * sign
}
```

## Typescript

- Time complexity: `O(1)` - no division/multiplication by dynamic value
- Auxiliary space: `O(1)` - constant amount of space

```typescript
function reverse(x: number): number {
  const reversed = x.toString().split("").reverse().join("");

  // 32-bit signed integer overflow results in 0
  if (parseInt(reversed) > 2 ** 31) {
    return 0;
  }

  return parseInt(reversed) * Math.sign(x);
}
```

## C++

- Time Complexity: `O(log10(input))` - each iteration divides the input by 10
- Auxiliary space: `O(1)` - constant amount of space

```cpp
class Solution {

public:

	int reverse(int n) {
	
		int reversed_number = 0, remainder;
		
		while(n != 0) {
		
			remainder = n % 10;
			
			if(reversed_number > INT_MAX/10 || reversed_number == INT_MAX/10 && remainder > 7){
				return 0 ;
			}
		
			if(reversed_number < INT_MIN/10 || reversed_number == INT_MIN/10 && remainder < -8){
				return 0 ;
			}
		
			reversed_number = reversed_number * 10 + remainder;
			n /= 10;
		}	  
		
		return reversed_number;
	}

};
```
