const { MemoryGame } = require("./memory_game.js");
const {
  updateUI,
  attachEventListeners,
  renderGameBoard,
} = require("./helper_functions.js");

const game = new MemoryGame();

const closePopup = document.getElementById("play-again");
const timerDisplay = document.getElementById("timerDisplay");
const popupTimerDisplay = document.getElementById("timerDone");
const restartButton = document.getElementById("restart");
const gridSelector = document.getElementById("grid-selector");
const applyButton = document.getElementById("apply-grid");
let isClosePopupListenerAdded = false;

function initUI() {
  applyButton.addEventListener("click", () => {
    const selectedSize = gridSelector.value;
    game.setGridSize(selectedSize);
    updateGameBoard();
  });

  game.initGame(timerDisplay);
  renderGameBoard(game);
  attachEventListeners(game, handleCardClick);
  updateUI(game);
  restartButton.disabled = true;
}

function updateGameBoard() {
  const gameBoard = document.getElementById("game-board");

  const [rows, cols] = game.gridSize.split("x").map(Number);
  gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  gameBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

  renderGameBoard(game);
  attachEventListeners(game, handleCardClick);
  updateUI(game);
  game.initGame(timerDisplay);
  restartGame();
}

function handleCardClick(index) {
  if (game.flippedCards.length >= 2) {
    return;
  }

  if (game.flipCard(index)) {
    updateUI(game);

    if (restartButton.disabled) {
      restartButton.disabled = false;
    }

    if (game.flippedCards.length === 2) {
      if (game.checkMatch()) {
        updateUI(game);
      }
      if (game.isGameOver()) {
        game.stopTimer();
        showPopup();
      }
    }
  }
}

function showPopup() {
  const elapsedTime = game.getElapsedTime();
  const seconds = Math.floor(elapsedTime / 1000);
  popupTimerDisplay.textContent = `You took ${seconds} seconds`;

  setTimeout(() => {
    const popup = document.getElementById("popup");
    popup.classList.remove("hidden");

    const congratsMessage = popup.querySelector("p");
    congratsMessage.textContent = `Congratulations! You completed the game in ${game.turns} turns!`;

    if (!isClosePopupListenerAdded) {
      closePopup.addEventListener("click", () => {
        popup.classList.add("hidden");
        congratsMessage.textContent = "Congratulations! You matched all pairs!";
        restartGame();
      });
      isClosePopupListenerAdded = true;
    }
  }, 1000);
}

function restartGame() {
  game.stopTimer();
  game.restartGame();
  initUI();
}

initUI();
document.getElementById("restart").addEventListener("click", restartGame);
