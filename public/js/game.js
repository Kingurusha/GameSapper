var Minesweeper = Minesweeper || {};

Minesweeper.Game = class {
    constructor(gridSize = 15, mineCount = 30) {
        this.gridSize = gridSize;
        this.mineCount = mineCount;
        this.gameContinue = true;
        this.firstClick = true;
        this.field = [];
        this.gameContainer = document.getElementById('game');
        this.messageContainer = document.createElement('div');
        this.messageContainer.id = 'message';
        this.gameContainer.parentElement.insertBefore(this.messageContainer, this.gameContainer);

        const newGameButton = document.getElementById('newGameButton');
        if (newGameButton) {
            newGameButton.addEventListener('click', () => {
                this.initializeGame();
            });
        }

        this.initializeGame();
    }

    initializeGame() {
        // Initialize the game state and create the minefield
        this.firstClick = true;
        this.gameContinue = true;
        this.messageContainer.innerHTML = '';
        this.field = this.createMinefield(this.gridSize, this.mineCount);
        this.renderMinefield();
    }

    createMinefield(size, mines) {
        // Create the minefield with specified size and number of mines
        let field = Array(size * size).fill(0);

        // Place mines randomly
        let placedMines = 0;
        while (placedMines < mines) {
            let index = Math.floor(Math.random() * field.length);
            if (field[index] === 0) {
                field[index] = 'M';
                placedMines++;
            }
        }

        // Calculate the number of mines around each cell
        for (let i = 0; i < field.length; i++) {
            if (field[i] !== 'M') {
                let count = 0;
                let neighbors = this.getNeighbors(i, size);
                neighbors.forEach(neighbor => {
                    if (field[neighbor] === 'M') {
                        count++;
                    }
                });
                field[i] = count;
            }
        }

        return field;
    }

    getNeighbors(index, size) {
        // Get the indices of all neighboring cells
        let neighbors = [];
        let row = Math.floor(index / size);
        let col = index % size;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                let newRow = row + i;
                let newCol = col + j;
                if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
                    neighbors.push(newRow * size + newCol);
                }
            }
        }

        return neighbors;
    }

    renderMinefield() {
        // Render the minefield in the game container
        this.gameContainer.innerHTML = '';
        this.gameContainer.style.gridTemplateColumns = `repeat(${this.gridSize}, 30px)`;
        this.gameContainer.style.gridTemplateRows = `repeat(${this.gridSize}, 30px)`;
        this.field.forEach((value, index) => {
            let cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = index;

            // Set the cell state based on the field data
            if (typeof value === 'object' && value.open) {
                cell.classList.add('open');
                cell.textContent = value.mineCount > 0 ? value.mineCount : '';
                this.applyNumberStyle(cell, value.mineCount);
            } else if (typeof value === 'object' && value.flagged) {
                cell.classList.add('flag');
            }

            cell.addEventListener('click', () => this.handleClick(cell));
            cell.addEventListener('contextmenu', (e) => this.handleRightClick(e, cell));

            this.gameContainer.appendChild(cell);
        });
    }

    handleClick(cell) {
        // Handle the left click on a cell
        const index = parseInt(cell.dataset.index);
        if (!this.gameContinue) {
            return;
        }

        if (this.firstClick) {
            // Ensure the first click is always safe
            if (this.field[index] === 'M') {
                this.field[index] = 0;
                let newMineIndex;
                do {
                    newMineIndex = Math.floor(Math.random() * this.field.length);
                } while (this.field[newMineIndex] === 'M' || newMineIndex === index);
                this.field[newMineIndex] = 'M';

                let neighbors = this.getNeighbors(newMineIndex, this.gridSize);
                neighbors.forEach(neighbor => {
                    if (this.field[neighbor] !== 'M') {
                        this.field[neighbor]++;
                    }
                });

                neighbors = this.getNeighbors(index, this.gridSize);
                neighbors.forEach(neighbor => {
                    if (
                        this.field[neighbor] !== 'M') {
                        this.field[neighbor]--;
                    }
                });
            }
            this.firstClick = false;
        }

        if (cell.classList.contains('flag')) {
            return;
        }

        if (this.field[index] === 'M') {
            // If a mine is clicked, the game is lost
            cell.className = 'cell mine';
            this.showMessage('You lost!', 'red');
            localStorage.removeItem('minesweeperGameState');
            this.gameContinue = false;
            this.revealMines();
        } else {
            // If a safe cell is clicked, open it
            this.openCell(cell);
            this.checkWin();
        }
        this.saveGame();
    }

    handleRightClick(event, cell) {
        // Handle the right click (flagging) on a cell
        event.preventDefault();
        if (!this.gameContinue) {
            return;
        }
        if (cell.classList.contains('open')) {
            return;
        }
        cell.classList.toggle('flag');
        this.saveGame();
    }

    openCell(cell) {
        // Open a cell and reveal its content
        const index = parseInt(cell.dataset.index);
        if (cell.className.includes('open') || cell.className.includes('flag')) return;

        cell.className = 'cell open';
        cell.textContent = this.field[index] > 0 ? this.field[index] : '';
        this.applyNumberStyle(cell, this.field[index]);

        this.field[index] = {
            open: true,
            mineCount: this.field[index]
        };

        if (this.field[index].mineCount === 0) {
            // Open all neighboring cells if the cell has no adjacent mines
            let neighbors = this.getNeighbors(index, this.gridSize);
            neighbors.forEach(neighbor => {
                let neighborCell = document.querySelector(`.cell[data-index='${neighbor}']`);
                this.openCell(neighborCell);
            });
        }
    }

    revealMines() {
        // Reveal all mines when the game is lost
        this.field.forEach((value, index) => {
            if (value === 'M') {
                let cell = document.querySelector(`.cell[data-index='${index}']`);
                cell.className = 'cell mine';
            }
        });
    }

    applyNumberStyle(cell, number) {
        // Apply styles to the numbers displayed in open cells
        switch (number) {
            case 1:
                cell.style.color = 'lightblue';
                break;
            case 2:
                cell.style.color = 'green';
                break;
            case 3:
                cell.style.color = 'lightcoral';
                break;
            case 4:
                cell.style.color = 'darkblue';
                break;
            case 5:
                cell.style.color = 'darkred';
                break;
            default:
                cell.style.color = 'black';
                break;
        }
    }

    showMessage(message, color) {
        // Display a message to the player
        this.messageContainer.innerText = message;
        this.messageContainer.style.color = color;
    }

    checkWin() {
        // Check if the player has won the game
        let openedCells = document.querySelectorAll('.cell.open').length;
        let totalCells = this.field.length;
        let mineCells = this.field.filter(value => value === 'M').length;

        if (openedCells === totalCells - mineCells) {
            this.showMessage('You win!', 'green');
            localStorage.removeItem('minesweeperGameState');
            this.gameContinue = false;
        }
    }

    saveGame() {
        // Save the current game state to localStorage
        if (!this.gameContinue) return;

        const gameState = {
            gridSize: this.gridSize,
            mineCount: this.mineCount,
            field: this.field,
            firstClick: this.firstClick
        };
        localStorage.setItem('minesweeperGameState', JSON.stringify(gameState));
    }

    loadGame() {
        // Load a saved game state from localStorage
        const savedGameState = localStorage.getItem('minesweeperGameState');
        if (savedGameState) {
            const gameState = JSON.parse(savedGameState);
            this.gridSize = gameState.gridSize;
            this.mineCount = gameState.mineCount;
            this.field = gameState.field;
            this.firstClick = gameState.firstClick;
            this.renderMinefield();
        } else {
            this.initializeGame();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the game when the DOM is fully loaded
    const game = new Minesweeper.Game();
    game.loadGame();
});
