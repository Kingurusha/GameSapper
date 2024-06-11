var CustomMinesweeper = CustomMinesweeper || {};

CustomMinesweeper.Game = class extends Minesweeper.Game {
    constructor(gridSize = 15, mineCount = 10) {
        super(gridSize, mineCount);
        this.difficulty = 'medium';
        this.czechMode = false;

        // Add event listener for field size input
        const fieldSizeInput = document.getElementById('fieldSize');
        if (fieldSizeInput) {
            fieldSizeInput.addEventListener('input', (e) => {
                this.updateFieldSizeLabel(e.target.value);
            });
        }

        // Add event listeners for difficulty buttons
        const difficultyButtons = document.querySelectorAll('.difficulty-buttons button');
        difficultyButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.setDifficulty(button.id.replace('Button', ''));
            });
        });

        // Add event listener for Czech mode button
        const czechModeButton = document.getElementById('czechModeButton');
        if (czechModeButton) {
            czechModeButton.addEventListener('click', () => {
                this.toggleCzechMode();
            });
        }

        this.loadGame();

        // Bind functions to window for external use
        window.updateFieldSizeLabel = this.updateFieldSizeLabel.bind(this);
        window.setDifficulty = this.setDifficulty.bind(this);
    }

    initializeGame() {
        // Initialize the game state and create the minefield
        this.firstClick = true;
        this.gameContinue = true;
        this.messageContainer.innerHTML = '';
        this.mineCount = this.calculateMineCount(this.difficulty);
        this.field = this.createMinefield(this.gridSize, this.mineCount);
        this.renderMinefield();
    }

    toggleCzechMode() {
        // Toggle Czech mode on or off
        this.czechMode = !this.czechMode;
        const gameContainer = document.getElementById('gameContainer');
        if (this.czechMode) {
            gameContainer.classList.add('czech');
        } else {
            gameContainer.classList.remove('czech');
        }
        this.saveGame();
    }

    saveGame() {
        // Save the current game state to localStorage
        super.saveGame();
        if (!this.gameContinue) return;

        const customGameState = {
            czechMode: this.czechMode,
            difficulty: this.difficulty
        };
        localStorage.setItem('minesweeperCustomGameState', JSON.stringify(customGameState));
    }

    loadGame() {
        // Load a saved game state from localStorage
        super.loadGame();
        const savedCustomGameState = localStorage.getItem('minesweeperCustomGameState');
        if (savedCustomGameState) {
            const customGameState = JSON.parse(savedCustomGameState);
            this.czechMode = customGameState.czechMode || false;
            this.difficulty = customGameState.difficulty || 'easy';
            if (this.czechMode) {
                this.toggleCzechMode();
            }
        }
    }

    updateFieldSizeLabel(value) {
        // Update the field size label and reinitialize the game
        document.getElementById('fieldSizeLabel').innerText = value;
        this.gridSize = parseInt(value);
        this.initializeGame();
        this.saveGame();
    }

    setDifficulty(newDifficulty) {
        // Set the difficulty level and reinitialize the game
        this.difficulty = newDifficulty;
        const buttons = document.querySelectorAll('.difficulty-buttons button');
        buttons.forEach(button => button.classList.remove('active'));
        document.getElementById(this.difficulty + 'Button').classList.add('active');

        this.mineCount = this.calculateMineCount(this.difficulty);
        this.initializeGame();
    }

    calculateMineCount(difficulty) {
        // Calculate the number of mines based on the difficulty level
        switch (difficulty) {
            case 'easy':
                return Math.floor(this.gridSize * this.gridSize * 0.1);
            case 'medium':
                return Math.floor(this.gridSize * this.gridSize * 0.2);
            case 'hard':
                return Math.floor(this.gridSize * this.gridSize * 0.3);
            default:
                return Math.floor(this.gridSize * this.gridSize * 0.1);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the custom game when the DOM is fully loaded
    new CustomMinesweeper.Game();
});
