// Centralized board configurations
const BOARD_CONFIGS = {
    1: {
        name: "Classic Board",
        size: 10,
        snakes: [
            { from: 99, to: 79 },
            { from: 86, to: 66 },
            { from: 78, to: 24 },
            { from: 71, to: 9 },
            { from: 56, to: 36 },
            { from: 47, to: 26 },
            { from: 39, to: 20 },
            { from: 30, to: 10 },
            { from: 23, to: 3 }
        ],
        ladders: [
            { from: 85, to: 95 },
            { from: 72, to: 90 },
            { from: 62, to: 80 },
            { from: 53, to: 87 },
            { from: 42, to: 63 },
            { from: 33, to: 49 },
            { from: 28, to: 51 },
            { from: 16, to: 67 },
            { from: 13, to: 27 }
        ]
    },
    2: {
        name: "Adventure Board",
        size: 10,
        snakes: [
            { from: 98, to: 77 },
            { from: 95, to: 75 },
            { from: 93, to: 69 },
            { from: 87, to: 24 },
            { from: 67, to: 30 },
            { from: 63, to: 19 },
            { from: 59, to: 17 },
            { from: 16, to: 7 },
        ],
        ladders: [
            { from: 9, to: 27 },
            { from: 18, to: 37 },
            { from: 25, to: 54 },
            { from: 28, to: 51 },
            { from: 56, to: 64 },
            { from: 68, to: 88 },
            { from: 76, to: 97 },
            { from: 79, to: 100 }
        ]
    },
    3: {
        name: "Quick Play Board",
        size: 8,
        snakes: [
            { from: 60, to: 25 },
            { from: 48, to: 15 },
            { from: 35, to: 8 }
        ],
        ladders: [
            { from: 5, to: 28 },
            { from: 17, to: 45 },
            { from: 32, to: 52 }
        ]
    }
};

module.exports = { BOARD_CONFIGS };