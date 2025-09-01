---
title: Number of atoms
published_at: 2023-02-27 12:00
tags: [leetcode, go]
leetcode_number: 726
---

[Leetcode 726 problem.](https://leetcode.com/problems/number-of-atoms/)

## Go

- Time complexity: $O(n + log(n))$ - `n` is a length of a string
- Auxiliary space: $O(n)$ - `n` is a length of a string

```go
type ElementInfo struct {
	element  string
	amount   int
}

func getElementName(s string) (string, int) {
	for i := 1; i < len(s); i++ {
        // if the next letter is outside of lower letters range, that means the name ended
		if s[i] < 'a' || s[i] > 'z' {
            // up until this point => [:i]
            name := s[:i]
			return name, i
		}
	}

	return s, len(s)
}

func getElementAmount(s string) (int, int) {
	elementAmount := 0

	for i := 0; i < len(s); i++ {
		if s[i] >= '0' && s[i] <= '9' {
            // next number
			elementAmount *= 10
            // '0' is not a string, it's a rune. Rune is a unicode codepoint
            // (ex. 'a' is 97, position in ASCII)
			elementAmount += int(s[i] - '0')
		} else {
			return elementAmount, i
		}
	}

	return elementAmount, len(s)
}

// merge current calculation with new one
func mergeCalc(currentElementAmountMap, newCalc map[string]int, amount int) map[string]int {
	for name, value := range newCalc {
		if existingAmount, ok := currentElementAmountMap[name]; ok {
			currentElementAmountMap[name] = existingAmount + value * amount
		} else {
			currentElementAmountMap[name] = value * amount
		}
	}
	return currentElementAmountMap
}

func countOfAtoms(s string) string {
	if len(s) == 0 {
		return ""
	}

    // key = element, value = amount of this element
	elementAmountMap := make(map[string]int)

    // stack of calculations
	var stack []map[string]int
	var elementsToInsert map[string]int

	for i := 0; i < len(s); {

        // if starts with upper letter, this is a name of element
		if s[i] >= 'A' && s[i] <= 'Z' {
			elementName, nameLength := getElementName(s[i:])

            // cleanup previos elements to insert
			elementsToInsert = make(map[string]int)
            // set current one
			elementsToInsert[elementName] = 1

			elementAmountMap = mergeCalc(elementAmountMap, elementsToInsert, 1)

            // skip until next element/number
			i += nameLength

        // if starts with a number, this is an amount of element
		} else if s[i] >= '0' && s[i] <= '9' {
			number, numberLength := getElementAmount(s[i:])

            // use elementsToInsert that was recorded when parsing its name
			elementAmountMap = mergeCalc(elementAmountMap, elementsToInsert, number - 1)

            // skip until next element/number
			i += numberLength

		} else if s[i] == '(' {
			stack = append(stack, elementAmountMap)

            // cleanup current calculations
			elementAmountMap = make(map[string]int)

			i++
		} else if s[i] == ')' {
			latestCalculation := stack[len(stack) - 1]

            // set elements to insert to current calculation
			elementsToInsert = elementAmountMap

            // pop latest calculation
			stack = stack[:len(stack) - 1]

            // merge calculations
			elementAmountMap = mergeCalc(latestCalculation, elementAmountMap, 1)

			i++
		}
	}


	elements := make([]ElementInfo, 0, len(elementAmountMap))
	for name, value := range elementAmountMap {
		elements = append(elements, ElementInfo{name, value})
	}

    // sort by ascending order by names
	sort.Slice(elements, func(i, j int) bool {
		return elements[i].element < elements[j].element
	})

	var builder strings.Builder
	for i := 0; i < len(elements); i++ {
        // write element name
		builder.WriteString(elements[i].element)

        // write element amount
		if elements[i].amount > 1 {
            // convert amount string to integer
			builder.WriteString(strconv.Itoa(elements[i].amount))
		}
	}

	return builder.String()
}
```
