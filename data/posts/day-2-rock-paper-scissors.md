---
title: Day_2 - Rock Paper Scissors
published_at: 2022-12-05
snippet: Go solution
tags: [advent2022]
---

### Advent of code 2022 - Day_2: [Rock Paper Scissors](https://adventofcode.com/2022/day/2) 

### Go

```go
package main

import (
	"bufio"
	"fmt"
	"os"
)

const (
	opponentRock     string = "A"
	opponentPaper    string = "B"
	opponentScissors string = "C"
)

const (
	myRock     string = "X"
	myPaper    string = "Y"
	myScissors string = "Z"
)

func getShapeScore(shape string) int {
	switch shape {
	case myRock:
		return 1
	case myPaper:
		return 2
	case myScissors:
		return 3
	default:
		return 0
	}
}

func getPairResult(opponentShape string, myShape string) int {
	// both rock
	if opponentShape == opponentRock && myShape == myRock {
		return 3
	}
	// both paper
	if opponentShape == opponentPaper && myShape == myPaper {
		return 3
	}
	// both scissors
	if opponentShape == opponentScissors && myShape == myScissors {
		return 3
	}

	// opponentShape is rock
	if opponentShape == opponentRock && myShape == myPaper {
		return 6
	}
	if opponentShape == opponentRock && myShape == myScissors {
		return 0
	}

	// opponentShape is paper
	if opponentShape == opponentPaper && myShape == myScissors {
		return 6
	}
	if opponentShape == opponentPaper && myShape == myRock {
		return 0
	}

	// opponentShape is scissors
	if opponentShape == opponentScissors && myShape == myRock {
		return 6
	}
	if opponentShape == opponentScissors && myShape == myPaper {
		return 0
	}

	return 0
}

func calculateTotalScore(filename string) int {
	file, err := os.Open(filename)
	if err != nil {
		fmt.Println(err.Error())
		return 0
	}

	defer file.Close()

	var line string
	var totalScore int

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line = scanner.Text()

		opponentShape := line[0:1]
		myShape := line[2:3]

		shapeScore := getShapeScore(myShape)

		pairResult := getPairResult(opponentShape, myShape)

		totalScore = totalScore + shapeScore + pairResult
	}

	return totalScore
}

func main() {
	filename := os.Args[2]
	score := calculateTotalScore(filename)

	fmt.Println(score)
}

```