---
title: Invalid transactions
published_at: 2023-02-25 12:01
tags: [leetcode, go]
leetcode_number: 1169
---

[Leetcode 1169 problem.](https://leetcode.com/problems/invalid-transactions/)

## Go

- Time complexity: $O(n^{2})$ - n is a number of transactions
- Auxiliary space: $O(n)$ - n is a number of transactions

```go
type Transaction struct {
	city   string
	time   int
	amount int
	index  int
	valid  bool
}

func invalidTransactions(transactions []string) []string {
	// key is a name of an owner, value is an array of transactions
	nameTransactionMap := map[string][]Transaction{}

	// construct the map
	for i, tran := range transactions {
		info := strings.Split(tran, ",")
		time, _ := strconv.Atoi(info[1])
		amount, _ := strconv.Atoi(info[2])
		nameTransactionMap[info[0]] = append(nameTransactionMap[info[0]], transaction{
			city:  info[3],
			time:  time,
			amount: amount,
			index: i,
			valid: amount <= 1000,
		})
	}

	invalidTransactions := []string{}

	for name := range nameTransactionMap {
		// sort by time to avoid time miscalculation
		sort.Slice(nameTransactionMap[name], func(x, y int) bool {
			return nameTransactionMap[name][x].time < nameTransactionMap[name][y].time
		})

		// add to invalidTransactions based on isValid function's result
		for i := range nameTransactionMap[name] {
			if !isValid(nameTransactionMap[name], i) {
				invalidTransactions = append(invalidTransactions, transactions[nameTransactionMap[name][i].index])
			}
		}
	}
	return invalidTransactions
}

func isValid(list []transaction, index int) bool {
	if list[index].valid == false {
		return false
	}

	// compare previous transactions with the current
	for i := index-1; i >= 0; i-- {
		if list[index].time - list[i].time > 60 {
			break
		}
		if list[index].city != list[i].city {
			list[index].valid = false
			list[i].valid = false
		}
	}

	// compare next transactions with the current
	for i := index + 1; i < len(list); i++ {
		if list[i].time - list[index].time > 60 {
			break
		}
		if list[index].city != list[i].city {
			list[index].valid = false
			list[i].valid = false
		}
	}
	
	return list[index].valid
}
```