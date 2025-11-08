const { BOARD_CONFIGS } = require('../config/boards');

class BoardService {
    constructor() {
        // Cache generated boards to avoid rebuilding
        this.boardCache = new Map();
        this.jumpsCache = new Map();
    }

    generateBoard(boardId) {
        // Return cached board if available
        if (this.boardCache.has(boardId)) {
            return this.boardCache.get(boardId);
        }

        const config = BOARD_CONFIGS[boardId];
        if (!config) {
            throw new Error(`Board configuration not found for ID: ${boardId}`);
        }

        const { size, snakes, ladders, name } = config;
        const board = [];
        let num = size * size;

        // Generate the board grid
        for (let row = 0; row < size; row++) {
            const rowArr = [];
            for (let col = 0; col < size; col++) {
                const cell = { number: num--, type: null, to: null };
                
                // Check for snakes
                const snake = snakes.find(s => s.from === cell.number);
                if (snake) {
                    cell.type = "SNAKE";
                    cell.to = snake.to;
                }
                
                // Check for ladders
                const ladder = ladders.find(l => l.from === cell.number);
                if (ladder) {
                    cell.type = "LADDER";
                    cell.to = ladder.to;
                }
                
                rowArr.push(cell);
            }
            
            // Reverse every odd row for snake pattern
            if (row % 2 === 0) {
                board.push(rowArr);
            } else {
                board.push(rowArr.reverse());
            }
        }

        // Generate jumps lookup for quick access
        const jumps = {};
        [...snakes, ...ladders].forEach(jump => {
            jumps[jump.from] = jump.to;
        });

        const result = {
            board,
            name,
            id: boardId,
            size,
            jumps,
            totalCells: size * size
        };

        // Cache it for next time
        this.boardCache.set(boardId, result);
        this.jumpsCache.set(boardId, jumps);

        return result;
    }

    // OPTIMIZED: Get just the jumps lookup without building entire board
    getJumpsLookup(boardId) {
        if (this.jumpsCache.has(boardId)) {
            return this.jumpsCache.get(boardId);
        }

        const config = BOARD_CONFIGS[boardId];
        const jumps = {};
        [...config.snakes, ...config.ladders].forEach(jump => {
            jumps[jump.from] = jump.to;
        });

        this.jumpsCache.set(boardId, jumps);
        return jumps;
    }

    getRandomBoard() {
        const boardIds = Object.keys(BOARD_CONFIGS).map(Number);
        const randomId = boardIds[Math.floor(Math.random() * boardIds.length)];
        return this.generateBoard(2);
    }

    getBoardById(boardId) {
        return this.generateBoard(boardId);
    }

    getAllBoards() {
        return Object.keys(BOARD_CONFIGS).map(id => 
            this.generateBoard(Number(id))
        );
    }

    validatePosition(boardId, position) {
        const config = BOARD_CONFIGS[boardId];
        if (!config) return false;
        return position >= 1 && position <= (config.size * config.size);
    }

    // OPTIMIZED: Ultra-fast position calculation
    // This should be called for every dice roll
    calculateNewPosition(boardId, currentPosition, diceValue) {
        const t = Date.now();
        
        // Get config (fast lookup)
        const config = BOARD_CONFIGS[boardId];
        const totalCells = config.size * config.size;
        
        // Calculate new position
        let newPosition = currentPosition + diceValue;
        
        // Handle board boundaries
        if (newPosition > totalCells) {
            newPosition = currentPosition; // Stay in place if overshoot
        }
        
        // Handle snakes and ladders - use cached jumps lookup
        const jumps = this.getJumpsLookup(boardId);
        if (jumps[newPosition]) {
            newPosition = jumps[newPosition];
        }
        
        console.log(`calculateNewPosition: ${Date.now() - t}ms`);
        return newPosition;
    }

    // Alternative: Even faster if you just need position without full board
    calculateNewPositionFast(boardId, currentPosition, diceValue) {
        const config = BOARD_CONFIGS[boardId];
        const totalCells = config.size * config.size;
        
        let newPosition = currentPosition + diceValue;
        if (newPosition > totalCells) return currentPosition;
        
        // Direct lookup - no object creation
        const jumps = this.getJumpsLookup(boardId);
        return jumps[newPosition] ?? newPosition;
    }

    getBoardInfo(boardId) {
        const config = BOARD_CONFIGS[boardId];
        if (!config) return null;
        
        return {
            id: boardId,
            name: config.name,
            size: config.size,
            totalCells: config.size * config.size,
            snakeCount: config.snakes.length,
            ladderCount: config.ladders.length
        };
    }

    // Clear cache if needed (on server restart, etc)
    clearCache() {
        this.boardCache.clear();
        this.jumpsCache.clear();
    }
}

module.exports = new BoardService();