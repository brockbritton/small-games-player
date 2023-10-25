

const format = [
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    
]

const test_game = [
    [9, 6, [1,4,5,6,7,8,9], null, null, null, null, null, null],
    [null, null, null, null, 4, 2, null, null, 3],
    [null, null, null, null, null, null, null, 9, 8],
    [4, null, null, 2, null, null, null, null, null],
    [null, 1, 8, null, 7, null, null, null, null],
    [null, null, 3, null, null, 9, null, null, null],
    [null, 3, 1, null, null, 8, null, 6, null],
    [6, null, null, null, null, 5, null, null, null],
    [null, 2, null, null, null, 1, 4, null, null],
]

const easy_game1 = [
    [null, null, 8, 2, null, null, 9, null, 3],
    [3, 4, 2, null, 9, 5, null, null, 7],
    [1, 9, 7, null, null, null, null, null, 4],
    [null, null, 5, 3, 1, 2, 4, 7, 9],
    [null, null, null, null, null, null, null, null, null],
    [2, null, null, null, 7, 4, 5, null, null],
    [null, 2, null, null, null, 1, null, null, 5],
    [null, 7, null, null, null, 6, 8, 9, 1],
    [8, null, null, 4, 3, null, 7, null, 6]
]

const medium_game1 = [
    [null, null, null, null, null, null, 6, null, 9],
    [1, null, null, null, null, 4, null, null, null],
    [null, null, 5, 3, null, 6, 8, 2, 1],
    [null, null, 4, 6, 7, null, null, 5, null],
    [null, null, 7, null, null, null, 9, null, null],
    [null, null, null, 5, 4, null, null, null, null],
    [3, 7, null, 4, null, 5, 2, null, 6],
    [null, null, null, null, null, null, 5, 1, null],
    [null, 6, null, null, 2, null, null, 3, 7]
]

const hard_game1 = [
    [null, 2, null, 5, 4, null, null, null, 1],
    [null, null, 9, 8, null, null, 2, 7, null],
    [null, null, 1, null, null, null, null, null, null],
    [null, 6, null, null, 1, 5, null, null, null],
    [null, null, null, null, 6, null, null, 9, null],
    [3, null, 4, null, null, null, null, 1, null],
    [4, null, null, null, null, null, 8, null, null],
    [2, null, null, null, 9, 6, 7, null, null],
    [null, 5, null, null, null, null, null, null, null],
]

const hidden_pairs_test = [
    [null, null, 9, null, 3, 2, null, null, null],
    [null, null, null, 7, null, null, null, null, null],
    [1, 6, 2, null, null, null, null, null, null],
    [null, 1, null, null, 2, null, 5, 6, null],
    [null, null, null, 9, null, null, null, null, null],
    [null, 5, null, null, null, null, 1, null, 7],
    [null, null, null, null, null, null, 4, null, 3],
    [null, 2, 6, null, null, 9, null, null, null],
    [null, null, 5, 8, 7, null, null, null, null],
]

const expert_game1 = [
    [null, null, null, null, null, null, 6, null, null],
    [null, null, null, null, null, 7, null, null, 1],
    [2, null, 8, null, null, null, null, 4, null],
    [6, null, null, null, null, null, null, null, null],
    [null, 5, 1, 4, null, 9, null, null, null],
    [null, null, null, 5, null, null, null, 2, null],
    [null, null, 4, null, null, null, null, 5, null],
    [null, null, 7, 1, 9, 6, null, null, null],
    [null, 8, null, null, null, null, 3, null, null]
]

const evil_game1 = [
    [null, null, null, null, 6, null, null, null, null],
    [null, 2, null, null, null, null, 9, null, null],
    [9, null, null, null, 1, 7, null, null, 8],
    [null, 5, null, null, 7, 4, null, 1, null],
    [null, null, null, 2, null, null, null, null, 4],
    [7, null, null, 6, null, null, null, null, null],
    [2, null, null, null, 9, 8, null, null, 1],
    [null, null, 3, null, null, null, null, 5, null],
    [null, null, null, 4, null, null, null, null, null]
]

const home_display_game = [
    [5, 3, null, null, 7, null, null, null, null],
    [6, null, null, 1, 9, 5, null, null, null],
    [null, 9, 8, null, null, null, null, 6, null],
    [8, null, null, null, 6, null, null, null, 3],
    [4, null, null, 8, null, 3, null, null, 1],
    [7, null, null, null, 2, null, null, null, 6],
    [null, 6, null, null, null, null, 2, 8, null],
    [null, null, null, 4, 1, 9, null, null, 5],
    [null, null, null, null, 8, null, null, 7, 9], 
]

