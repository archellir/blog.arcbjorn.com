---
title: Advent of code 2022 - Day 1
published_at: 2022-12-03
snippet: Go solution for Calorie Counting
tags: [advent]
---

### [Calorie Counting](https://adventofcode.com/2022/day/1) 

### Go

```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"strconv"
)

func getPacks(filename string) []int {
	var packs []int

	// read sample data
	file, err := os.Open(filename)
	if err != nil {
		fmt.Println(err.Error())
		return packs
	}

	// close file read at the end of all calculations
	defer file.Close()

	var line string
	var amount int

	var sum int

	// create buffer scanner for file
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		// read by file
		line = scanner.Text()

		// create pack of amounts separated by empty line
		if line == "" {
			packs = append(packs, sum)
			sum = 0

		} else {
			// calculate summ
			amount, err = strconv.Atoi(line)
			if err != nil {
				panic(err)
			}

			sum += amount
		}
	}

	return packs
}

func getMaxPacks(packs []int) (maxPack int, last3Sum int) {
	// sort packs by ascending order
	sort.Ints(packs[:])
	// get largest 3 packs
	last3 := packs[len(packs)-3:]

	// get last (largest) pack
	// 66487
	maxPack = packs[len(packs)-1]

	for _, amount := range last3 {
		// calculate the sum of 3 largest amounts
		// 197301
		last3Sum += amount
	}

	return maxPack, last3Sum
}

func main() {
	// os.Arg[1] should be used for execution a binary
	// os.Arg[2] only for `go run`
	filename := os.Args[2]
	
	packs := getPacks(filename)
	maxPack, last3Sum := getMaxPacks(packs)

	fmt.Println(maxPack, last3Sum)
}
```