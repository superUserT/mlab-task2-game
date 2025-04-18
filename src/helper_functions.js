function updateUI(game) {
  game.cards.forEach((card, index) => {
    const cardElement = document.getElementById(`card-${index}`);

    if (card.isFlipped || card.isMatched) {
      cardElement.textContent = card.symbol;
      cardElement.style.backgroundColor = game.symbolColorMap[card.symbol];
      cardElement.classList.add("flipped");
    } else {
      cardElement.textContent = "";
      cardElement.style.backgroundColor = "";
      cardElement.classList.remove("flipped");
    }
  });

  const turnsCounter = document.getElementById("turns-counter");
  turnsCounter.textContent = `Turns: ${game.turns}`;
}

function attachEventListeners(game, handleCardClick) {
  game.cards.forEach((card, index) => {
    const cardElement = document.getElementById(`card-${index}`);

    cardElement.addEventListener("click", () => {
      if (!card.isFlipped && !card.isMatched) {
        handleCardClick(index);
      }
    });
  });
}

function renderGameBoard(game) {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";

  const [rows, cols] = game.gridSize.split("x").map(Number);
  gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  gameBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

  gameBoard.setAttribute("data-grid", game.gridSize);

  game.cards.forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.id = `card-${index}`;
    cardElement.classList.add("card");
    cardElement.setAttribute("data-symbol", card.symbol);
    cardElement.style.backgroundColor = game.symbolColorMap[card.symbol];
    gameBoard.appendChild(cardElement);
  });
}

module.exports = { updateUI, attachEventListeners, renderGameBoard };
