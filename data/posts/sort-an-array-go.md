---
title: Sort an array
published_at: 2023-02-15 12:00
snippet: 912 - Go solutions
tags: [leetcode]
---

[Leetcode 912 problem.](https://leetcode.com/problems/sort-an-array/)

A function, given an array of integers `nums`, sort the array in ascending order and return it.

## Go

#### Selection Sort

- Time complexity: $O(n^{2})$ - **n** is the length of an array
- Auxiliary space: $O(1)$ - constant amount of space

```go
func sortArray(nums []int) []int {
    length := len(nums)

    // Simple Selection Sort
    for i := 0; i < length-1; i++ {
        index_min := i

        // compare current value with next values 1 by 1 and save new minimum index
        for j := i+1; j < length; j++ {
            if (nums[j] < nums[index_min]) {
                index_min = j
            }
        }

        old_value_min := nums[index_min]
        // set current value to minimum value index (swap)
        nums[index_min] = nums[i]
        // set minimum value to current position (since it's less)
        nums[i] = old_value_min
    }

    return nums
}
```

#### Bubble Sort

- Time complexity: $O(n^{2})$ -  **n** is the length of an array
- Auxiliary space: $O(1)$  - constant amount of space

```go
func sortArray(nums []int) []int {
	length := len(nums)
	
	for i :=0; i < length; i++ {
		// compare current index to each item
        for currentIdx := range nums {
            if length > currentIdx + 1 {
	            // swap values positions if current value > next value
                if nums[currentIdx] > nums[currentIdx + 1] {
                    nums[currentIdx], nums[currentIdx+1] = nums[currentIdx+1], nums[currentIdx]
                }
            }
        }
    }

    return nums
}
```

#### Insertion Sort

- Time complexity: $O(n^{2})$ - **n** is the length of an array
- Auxiliary space: $O(1)$  - constant amount of space

```go
func sortArray(items []int) []int {
    length := len(items)
    
    for i := 1; i < length; i++ {
        j := i

		// compare current item to each item before it
        for j > 0 {
	        // swap values positions if previous value > current value
            if items[j-1] > items[j] {
                items[j-1], items[j] = items[j], items[j-1]
            }
            j--
        }
    }

    return items
}
```

#### Merge Sort

- Time complexity: $O(n * log_n)$ - **n** is the length of an array
- Auxiliary space: $O(n)$ - **n** is the length of an array

```go
func sortArray(slice []int) []int {
    length := len(slice)

	if length < 2 {
		return slice
	}

	midIndex := length / 2

	return Merge(sortArray(slice[:midIndex]), sortArray(slice[midIndex:]))
}

func Merge(left, right []int) []int {
    rightSliceLength := len(right)
    leftSliceLength := len(right)

	length, i, j := leftSliceLength + rightSliceLength, 0, 0
    // merged slice
	slice := make([]int, length, length)

    // first 2 cases are for arrays of different length

	for k := 0; k < length; k++ {
        // if i > left last index && j <= right last index, pick from right
		if i > leftSliceLength - 1 && j <= rightSliceLength - 1 {
			slice[k] = right[j]
			j++

        // if j > right last index && i <= left last index, pick from left
		} else if j > rightSliceLength - 1 && i <= leftSliceLength - 1 {
			slice[k] = left[i]
			i++

        // if left < right, pick left
		} else if left[i] < right[j] {
			slice[k] = left[i]
			i++
            
        // else pick right
		} else {
			slice[k] = right[j]
			j++
		}
	}

	return slice
}
```

#### Quick Sort

- Time complexity: $O(n * log_n)$ - **n** is the length of an array
- Auxiliary space: $O(n)$ - **n** is the length of an array

```go
func sortArray(nums []int) []int {
    quickSort(nums, 0, len(nums)-1)

    return nums
}

func quickSort(nums []int, left, right int) {
	// while there is a distance between left and right
    if left < right {
	    // get new division point
        divisionIndex := divide(nums, left, right)

		// sort up to this division point
        quickSort(nums, left, divisionIndex - 1)
		// sort from this division point
        quickSort(nums, divisionIndex + 1, right)
    }
}

func divide(nums []int, left, right int) int {
	// starting from item with index 0
    divisionItem := nums[left]

	// while there is a distance between left and right
    for left < right {
	    // if the right limiter point >= division point, decrement the right limit
        for left < right && nums[right] >= divisionItem {
            right--
        }

		// swap values for start and end
        nums[left], nums[right] = nums[right], nums[left]

	    // if the start point <= division point, increment the left limit
        for left < right && nums[left] <= divisionItem {
            left++
        }

		// swap values for start and end
        nums[left], nums[right] = nums[right], nums[left]
    }
    return left
}
```

#### Counting Sort

- Time complexity: $O(n)$ - **n** is a length of an array of numbers
- Auxiliary space: $O(n)$ - **n** is a length of an array of numbers

```go
func sortArray(nums []int) []int {
    maxNumber := nums[0]

    // iterate and compare to find max number in array
    i := 1
    for i < len(nums) {
        if nums[i] > maxNumber {
            maxNumber = nums[i]
        }

        i++
    }

    // index is a number value, length = the biggest number
    indices := make([]int, maxNumber + 1)

    i = 0
    for i < len(nums) {
        // index = number value
        // value is a frequency of the number in `nums` array
        indices[nums[i]]++

        i++
    }

    i = 1
    for i < len(indices) {
        // increase frequency of each number by adding frequency of previous number
        indices[i] += indices[i - 1]

        i++
    }

    // list of actual numbers
    sortedList := make([]int, len(nums))

    i = 0
    for i < len(nums) {
        // index of sortedList = value (frequency) of the actual number from indices array - 1
        // value of sortedList = actual number
        sortedList[indices[nums[i]] - 1] = nums[i]

        // decrease value of the frequency of current number in indices array
        indices[nums[i]]--

        i++
    }

    return sortedList
}
```