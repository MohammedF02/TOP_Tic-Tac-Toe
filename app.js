const Player = (name, turn) => {
    const getTurn = () => turn;
    return { name, getTurn };
};
const gameBoard = (() => {
    let cells = ["", "", "", "", "", "", "", "", ""];

    const getCells = () => cells;
    const resetCells = () => {
        cells = ["", "", "", "", "", "", "", "", ""];
    };
    return { getCells, resetCells };
})();


const gameController = (() => {
    let currentPlayer;
    let playerX;
    let playerO;
    let gameOver = false;

    const startGame = () => {
        playerX = Player("Player X", 'X');
        playerO = Player("Player O", 'O');
        currentPlayer = playerX;
        gameBoard.resetCells();
        gameOver = false;
        displayController.renderBoard();
        displayController.updateDisplay();
    }
    const switchPlayer = () => {
        currentPlayer = (currentPlayer === playerX) ? playerO : playerX;
        displayController.updateDisplay();
    };
    const checkForWinner = () => {
        const cell = gameBoard.getCells();
        const winningCondition = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (const condition of winningCondition) {
            const [a, b, c] = condition;
            if (cell[a] && cell[a] === cell[b] && cell[b] === cell[c]) {
                gameOver = true;
                displayController.showWinner(currentPlayer.name);
                return;
            }
        }
        if (!cell.includes("")) {
            gameOver = true;
            displayController.showTie();
        }
    };
    const makeMove = (index) => {
        if (!gameOver && gameBoard.getCells()[index] === '') {
            gameBoard.getCells()[index] = currentPlayer.getTurn();
            displayController.renderBoard();
            checkForWinner();
            switchPlayer();
        }
        displayController.updateDisplay();
    };
    const getCurrentPlayer = () => currentPlayer;
    const isGameOver = () => gameOver;

    return { startGame, makeMove, getCurrentPlayer, isGameOver };
})();
const displayController = (() => {
    const renderBoard = () => {
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell, index) => {
            cell.textContent = gameBoard.getCells()[index];
        });
    };

    const updateDisplay = () => {
        if (!gameController.isGameOver()) {
            const playerTurn = document.querySelector(".player-turn");
            playerTurn.textContent = `${gameController.getCurrentPlayer().name}'s turn`;
        }
    };

    const showWinner = (winner) => {
        const playerTurn = document.querySelector(".player-turn");
        playerTurn.textContent = `${winner} wins!`;
    };
    
    const showTie = () => {
        const playerTurn = document.querySelector(".player-turn");
        playerTurn.textContent = "It's a tie!";
    };
    const eventListeners = () => {
        const restartButton = document.querySelector(".restart-button");
        restartButton.addEventListener('click', gameController.startGame);

        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell, index) => {
            cell.addEventListener('click', () => onClick(index));
        });
    };
    const onClick = (index) => {
        gameController.makeMove(index);
        renderBoard();
    }
    return { renderBoard, updateDisplay, showWinner, showTie, eventListeners };
})();

document.addEventListener('DOMContentLoaded', () => {
    gameController.startGame();
    displayController.eventListeners();
});