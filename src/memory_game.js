const { updateUI } = require("./helper_functions");

class MemoryGame {
  constructor(gridSize = "4x3") {
    this.symbolColorMap = {};
    this.colors = [
      "#6e6218",
      "#c0c0c0",
      "#9B59B6",
      "#E74C3C",
      "#FF69B4",
      "#FFD700",
      "#1ABC9C",
      "#34495E",
    ];
    this.gridSize = gridSize;
    this.symbolArrays = {
      "2x2": ["A", "B", "A", "B"],
      "3x2": ["A", "B", "C", "A", "B", "C"],
      "3x4": ["A", "B", "C", "D", "E", "F", "A", "B", "C", "D", "E", "F"],
      "4x3": ["A", "B", "C", "D", "E", "F", "A", "B", "C", "D", "E", "F"],
      "4x4": [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
      ],
    };

    this.symbols = this.symbolArrays[gridSize];
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.turns = 0;
    this.startTime = 0;
    this.intervalId = null;
    this.timerDisplay = 0;
  }

  setGridSize(newSize) {
    this.gridSize = newSize;
    this.symbols = this.symbolArrays[newSize];
    this.symbolColorMap = {};
    this.initGame();
    return this.gridSize;
  }

  initGame(timerDisplay) {
    this.shuffleSymbols();
    this.createCards();
    this.turns = 0;
    this.timerDisplay = timerDisplay;

    this.startTime = 0;
    this.intervalId = null;
    if (this.timerDisplay) {
      this.timerDisplay.textContent = "Timer: 0 seconds";
    }
  }

  shuffleSymbols() {
    for (let i = this.symbols.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [this.symbols[i], this.symbols[randomIndex]] = [
        this.symbols[randomIndex],
        this.symbols[i],
      ];
    }

    let availableColors = [...this.colors];

    this.symbols.forEach((symbol) => {
      if (!this.symbolColorMap[symbol]) {
        const randomIndex = Math.floor(Math.random() * availableColors.length);
        const selectedColor = availableColors[randomIndex];

        this.symbolColorMap[symbol] = selectedColor;
        availableColors.splice(randomIndex, 1);
      }
    });
  }

  createCards() {
    this.cards = this.symbols.map((symbol, index) => ({
      symbol,
      index,
      color: this.symbolColorMap[symbol],
      isFlipped: false,
      isMatched: false,
    }));
  }

  startTimer() {
    this.startTime = new Date().getTime();
    this.intervalId = setInterval(() => this.updateTimerDisplay(), 1000);
    this.updateTimerDisplay();
  }

  updateTimerDisplay() {
    if (this.startTime) {
      const elapsedTime = Math.floor(
        (new Date().getTime() - this.startTime) / 1000
      );
      if (this.timerDisplay) {
        this.timerDisplay.textContent = `Timer: ${elapsedTime} seconds`;
      }
    }
  }

  getElapsedTime() {
    if (this.startTime === null) {
      return 0;
    }
    return new Date().getTime() - this.startTime;
  }
  stopTimer() {
    clearInterval(this.intervalId);
  }

  flipCard(index) {
    if (this.flippedCards.length >= 2) {
      return false;
    }

    if (!this.startTime) {
      this.startTimer();
    }

    if (!this.cards[index].isFlipped && !this.cards[index].isMatched) {
      this.cards[index].isFlipped = true;
      this.flippedCards.push(this.cards[index]);

      this.turns++;
      return true;
    }
    return false;
  }

  checkMatch() {
    if (this.flippedCards.length === 2) {
      const [card1, card2] = this.flippedCards;
      if (card1.symbol === card2.symbol) {
        card1.isMatched = true;
        card2.isMatched = true;
        this.matchedPairs++;
        this.flippedCards = [];
        return true;
      } else {
        setTimeout(() => {
          card1.isFlipped = false;
          card2.isFlipped = false;
          this.flippedCards = [];
          updateUI(this);
        }, 1000);
        return false;
      }
    }
    return false;
  }

  isGameOver() {
    return this.matchedPairs === this.symbols.length / 2;
  }

  restartGame() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.matchedPairs = 0;
    this.flippedCards = [];
    this.turns = 0;
    this.startTime = 0;
    this.intervalId = null;
    this.timerDisplay.textContent = "Timer: 0 seconds";
  }
}

module.exports = { MemoryGame };
