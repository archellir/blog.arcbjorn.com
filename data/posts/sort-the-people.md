---
title: Sort the People
published_at: 2024-07-21 12:00
snippet: 2418 - Go solution
tags: [leetcode]
---

[Leetcode 2418 problem.](https://leetcode.com/problems/sort-the-people/)

Given two parallel arrays of names and heights, return a new array of names sorted in descending order based on the corresponding heights.

## Go

- Time complexity: $O(n*log(n))$ - **n** is a length of an array
- Auxiliary space: $O(n)$ - **n** is a length of an array

```go
import sort

type Person struct {
	name   string
	height int
}


func sortPeople(names []string, heights []int) []string {
	people := make([]Person, len(names))
	for i := range names {
			people[i] = Person{name: names[i], height: heights[i]}
	}

	sort.Slice(people, func (i, j int) bool {
			return people[i].height > people[j].height
	})

	for i, person := range people {
			names[i] = person.name
	}

	return names
}
```