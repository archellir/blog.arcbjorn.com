---
title: Map with sum of pairs function
published_at: 2022-12-4 12:00
tags: [leetcode, go]
leetcode_number: 677
---

[Leetcode 677 problem.](https://leetcode.com/problems/map-sum-pairs/)

Map implementation with Insert and Sum methods.
Sum returns a sum of map values, which keys were matched by some prefix.

### Go

- Time complexity: $O(n*n)$ - **n** is a number of elements in a map
- Auxiliary space: $O(n)$ - **n** is a number of elements in a map

```go
import (
	"sort"
	"strings"
)

type MapSum struct {
	Map  map[string]int
	keys []string
}

func Constructor() MapSum {
	return MapSum{
		Map:  make(map[string]int, 128),
		keys: make([]string, 0, 128),
	}
}

// Insert key-value into the map
func (mapSum *MapSum) Insert(key string, val int) { 
	mapSum.Map[key] = val

	// get index of existing key
	i := sort.SearchStrings(mapSum.keys, key)
	// exit if key exists and has the same string value
	if i < len(mapSum.keys) && mapSum.keys[i] == key {
		return
	}

	// append empty value to keys
	mapSum.keys = append(mapSum.keys, "")
	// merge keys slices
	copy(mapSum.keys[i+1:], mapSum.keys[i:])
	// set key name to inserted key
	mapSum.keys[i] = key
}

func (mapSum *MapSum) Sum(prefix string) int {
	sum := 0
	// find the key with prefix
	i := sort.SearchStrings(mapSum.keys, prefix)
	
	// if it exists and has correct prefix
	for i < len(mapSum.keys) && strings.HasPrefix(mapSum.keys[i], prefix) {
		// add key to the summ
		sum += mapSum.Map[mapSum.keys[i]]
		// `i` was not initilized, had default value of `0`
		i++
	}
	return sum
}

/**
 * Your MapSum object will be instantiated and called as such:
 * obj := Constructor();
 * obj.Insert(key,val);
 * param_2 := obj.Sum(prefix);
 */

```

