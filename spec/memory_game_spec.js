const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const { MemoryGame } = require("../src/memory_game.js");

describe("Memory Game", () => {
  let restartButton,
    timerDisplay,
    timerDone,
    cards,
    popup,
    playAgainButton,
    flippedCards,
    gameBoard,
    turnsCounter,
    popupMessage,
    gridSelector,
    gridApply;

  beforeAll(() => {
    const htmlPath = path.join(__dirname, "..", "index.html");
    const html = fs.readFileSync(htmlPath, "utf8");

    const { window } = new JSDOM(html, {
      runScripts: "dangerously",
      resources: "usable",
    });

    global.window = window;
    global.document = window.document;

    require("../src/memory_game_app.js");
  });

  beforeEach(() => {
    restartButton = document.getElementById("restart");
    cards = document.querySelectorAll(".card");
    popup = document.getElementById("popup");
    playAgainButton = document.getElementById("play-again");
    flippedCards = document.querySelectorAll(".card.flipped");
    timerDisplay = document.getElementById("timerDisplay");
    timerDone = document.getElementById("timerDone");
    gameBoard = document.getElementById("game-board");
    turnsCounter = document.getElementById("turns-counter");
    popupMessage = document.getElementById("congrats-message");
    gridSelector = document.getElementById("grid-selector");
    gridApply = document.getElementById("apply-grid");

    jasmine.clock().install();

    jasmine.clock().mockDate(new Date(2024, 0, 1));
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    restartButton.click();
  });

  describe("Grid layout", () => {
    it("should have a button to restart the game", () => {
      expect(restartButton).not.toBeNull();
    });

    it("should create the correct number of cards", () => {
      expect(cards.length).toBe(12);
    });

    it("should have all the required elements present in the DOM", () => {
      expect(gameBoard).toBeTruthy();

      expect(restartButton).toBeTruthy();

      expect(popup).toBeTruthy();

      expect(playAgainButton).toBeTruthy();

      expect(gridSelector).toBeTruthy();

      expect(gridApply).toBeTruthy();

      expect(cards.length).toBeGreaterThan(0);
      cards.forEach((card) => {
        expect(card).toBeTruthy();
      });
    });
  });

  describe("User Interaction", () => {
    it("should flip card and show the image when clicked", () => {
      spyOn(MemoryGame.prototype, "flipCard").and.callThrough();
      cards[0].click();
      expect(MemoryGame.prototype.flipCard).toHaveBeenCalledOnceWith(0);
      expect(cards[0].classList.contains("flipped")).toBe(true);
    });

    it("should have the restart button enabled after any card is flipped in the game", () => {
      expect(restartButton.disabled).toBe(true);
      cards[0].click();
      expect(restartButton.disabled).toBe(false);
    });

    it("should ensure one card is visible even after rapid clicks", () => {
      spyOn(MemoryGame.prototype, "flipCard").and.callThrough();
      cards[0].click();
      cards[0].click();
      cards[0].click();

      const flippedCards = document.querySelectorAll(".card.flipped");
      expect(flippedCards.length).toBe(1);
      expect(MemoryGame.prototype.flipCard).toHaveBeenCalledTimes(1);
    });

    it("should reset the cards flipped state when clicked cards do not matched", () => {
      spyOn(MemoryGame.prototype, "checkMatch").and.callThrough();
      const cardWithA = document.querySelector("[data-symbol='A']");
      const cardWithB = document.querySelector("[data-symbol='B']");
      expect(flippedCards.length).toBe(0);

      cardWithA.click();
      cardWithB.click();

      expect(cardWithA.classList.contains("flipped")).toBe(true);
      expect(cardWithB.classList.contains("flipped")).toBe(true);

      jasmine.clock().tick(2000);

      expect(cardWithA.classList.contains("flipped")).toBe(false);
      expect(cardWithB.classList.contains("flipped")).toBe(false);
      expect(MemoryGame.prototype.checkMatch).toHaveBeenCalledTimes(1);
      expect(flippedCards.length).toBe(0);
    });

    it("should match two cards when clicked", () => {
      spyOn(MemoryGame.prototype, "checkMatch").and.callThrough();
      spyOn(MemoryGame.prototype, "flipCard").and.callThrough();
      const matchingCards = document.querySelectorAll("[data-symbol='A']");
      expect(flippedCards.length).toBe(0);

      matchingCards.forEach((card) => {
        card.click();
      });

      expect(matchingCards[0].classList.contains("flipped")).toBe(true);
      expect(matchingCards[1].classList.contains("flipped")).toBe(true);
      expect(MemoryGame.prototype.checkMatch).toHaveBeenCalledTimes(1);
      expect(MemoryGame.prototype.flipCard).toHaveBeenCalledTimes(2);

      jasmine.clock().tick(2000);

      expect(matchingCards[0].classList.contains("flipped")).toBe(true);
      expect(matchingCards[1].classList.contains("flipped")).toBe(true);
    });

    it("should show the end game popup when all cards are matched", () => {
      spyOn(MemoryGame.prototype, "checkMatch").and.callThrough();
      const symbols = ["A", "B", "C", "D", "E", "F"];

      symbols.forEach((symbol) => {
        const cards = document.querySelectorAll(`[data-symbol="${symbol}"]`);

        cards[0].click();
        cards[1].click();
      });

      jasmine.clock().tick(2000);

      expect(MemoryGame.prototype.checkMatch).toHaveBeenCalledTimes(6);
      expect(popup.classList.contains("hidden")).toBe(false);
    });

    it("Should not allow matched cards to be flipped back", () => {
      spyOn(MemoryGame.prototype, "flipCard").and.callThrough();

      const matchingCards = document.querySelectorAll("[data-symbol='A']");

      expect(flippedCards.length).toBe(0);

      matchingCards.forEach((card) => {
        card.click();
      });

      jasmine.clock().tick(5000);

      expect(matchingCards[0].classList.contains("flipped")).toBe(true);
      expect(matchingCards[1].classList.contains("flipped")).toBe(true);
      expect(MemoryGame.prototype.flipCard).toHaveBeenCalledTimes(2);

      matchingCards.forEach((card) => {
        card.click();
      });

      expect(MemoryGame.prototype.flipCard).toHaveBeenCalledTimes(2);
    });

    it("should not allow more than two cards to be flipped at once", () => {
      spyOn(MemoryGame.prototype, "flipCard").and.callThrough();

      [cards[0], cards[1], cards[2]].forEach((card) => {
        card.click();
      });

      jasmine.clock().tick(500);
      jasmine.clock().tick(50);

      expect(cards[0].classList.contains("flipped")).toBe(true);
      expect(cards[1].classList.contains("flipped")).toBe(true);
      expect(cards[2].classList.contains("flipped")).toBe(false);
    });
  });

  describe("Timer Logic", () => {
    it("should start at 0 seconds", () => {
      expect(timerDisplay.textContent).toBe("Timer: 0 seconds");
    });

    it("should start the timer on first card flip", () => {
      spyOn(MemoryGame.prototype, "startTimer").and.callThrough();
      cards[0].click();
      expect(MemoryGame.prototype.startTimer).toHaveBeenCalledTimes(1);
    });

    it("should update the timer every second after game starts", () => {
      cards[0].click();
      expect(timerDisplay.textContent).toBe("Timer: 0 seconds");

      jasmine.clock().tick(2000);
      expect(timerDisplay.textContent).toBe("Timer: 2 seconds");
    });

    it("should reset timer when game is restarted", () => {
      const restartButton = document.getElementById("restart");

      cards[0].click();
      jasmine.clock().tick(3000);
      expect(timerDisplay.textContent).toBe("Timer: 3 seconds");

      restartButton.click();
      expect(timerDisplay.textContent).toBe("Timer: 0 seconds");
    });

    it("should show the time taken when the game ends in the popup", () => {
      spyOn(MemoryGame.prototype, "stopTimer").and.callThrough();
      const symbols = ["A", "B", "C", "D", "E", "F"];

      symbols.forEach((symbol) => {
        const cards = document.querySelectorAll(`[data-symbol="${symbol}"]`);

        cards[0].click();
        cards[1].click();
      });

      expect(timerDone.textContent).toBe("You took 0 seconds");
      expect(MemoryGame.prototype.stopTimer).toHaveBeenCalledTimes(1);
    });
  });

  describe("Restart Logic", () => {
    it("should have the restart button disabled by default", () => {
      expect(restartButton.disabled).toBe(true);
    });

    it("should restart the game when restart button is clicked", () => {
      spyOn(MemoryGame.prototype, "restartGame").and.callThrough();
      spyOn(MemoryGame.prototype, "initGame").and.callThrough();

      expect(flippedCards.length).toBe(0);
      expect(restartButton.disabled).toBe(true);

      cards[3].click();

      flippedCards = document.querySelectorAll(".card.flipped");
      expect(flippedCards.length).toBe(1);

      restartButton.click();

      expect(MemoryGame.prototype.restartGame).toHaveBeenCalledTimes(1);
      expect(restartButton.disabled).toBe(true);

      flippedCards = document.querySelectorAll(".card.flipped");
      expect(flippedCards.length).toBe(0);
      expect(cards.length).toBe(12);
      expect(MemoryGame.prototype.initGame).toHaveBeenCalledTimes(1);
    });

    it("should disable restart button after it has been clicked", () => {
      expect(restartButton.disabled).toBe(true);

      cards[0].click();
      expect(restartButton.disabled).toBe(false);
      restartButton.click();

      expect(restartButton.disabled).toBe(true);
    });

    it("should restart the game when play again button is clicked", () => {
      spyOn(MemoryGame.prototype, "restartGame").and.callThrough();
      spyOn(MemoryGame.prototype, "checkMatch").and.callThrough();

      expect(restartButton.disabled).toBe(true);

      const symbols = ["A", "B", "C", "D", "E", "F"];

      symbols.forEach((symbol) => {
        const cards = document.querySelectorAll(`[data-symbol="${symbol}"]`);

        cards[0].click();
        cards[1].click();
      });

      expect(restartButton.disabled).toBe(false);

      jasmine.clock().tick(8000);

      expect(MemoryGame.prototype.checkMatch).toHaveBeenCalledTimes(6);
      expect(popup.classList.contains("hidden")).toBe(false);

      playAgainButton.click();

      expect(MemoryGame.prototype.restartGame).toHaveBeenCalledTimes(1);
      expect(popup.classList.contains("hidden")).toBe(true);
      expect(flippedCards.length).toBe(0);
      expect(cards.length).toBe(12);
      expect(restartButton.disabled).toBe(true);
    });
  });

  describe("Turn Counter", () => {
    it("should have the turns counter at 0 when the game starts", () => {
      expect(turnsCounter).toBeTruthy();
      expect(turnsCounter.textContent).toBe("Turns: 0");
    });

    it("should update the turn counter when a match is attempted", () => {
      spyOn(MemoryGame.prototype, "flipCard").and.callThrough();

      const cardWithA = document.querySelector("[data-symbol='A']");
      const cardWithB = document.querySelector("[data-symbol='B']");

      cardWithA.click();
      cardWithB.click();

      expect(cardWithA.classList.contains("flipped")).toBe(true);
      expect(cardWithB.classList.contains("flipped")).toBe(true);
      expect(MemoryGame.prototype.flipCard).toHaveBeenCalledTimes(2);
      expect(turnsCounter.textContent).toBe("Turns: 2");
    });

    it("should update the turn counter when a match is attempted for matching cards", () => {
      spyOn(MemoryGame.prototype, "flipCard").and.callThrough();

      const matchingCards = document.querySelectorAll("[data-symbol='A']");

      expect(flippedCards.length).toBe(0);

      matchingCards.forEach((card) => {
        card.click();
      });

      jasmine.clock().tick(6000);

      expect(matchingCards[0].classList.contains("flipped")).toBe(true);
      expect(matchingCards[1].classList.contains("flipped")).toBe(true);
      expect(MemoryGame.prototype.flipCard).toHaveBeenCalledTimes(2);
      expect(turnsCounter.textContent).toBe("Turns: 2");
    });

    it("should reset the turn counter after the restart button is clicked", () => {
      spyOn(MemoryGame.prototype, "flipCard").and.callThrough();

      const matchingCards = document.querySelectorAll("[data-symbol='A']");

      expect(flippedCards.length).toBe(0);

      matchingCards.forEach((card) => {
        card.click();
      });

      jasmine.clock().tick(7000);

      expect(matchingCards[0].classList.contains("flipped")).toBe(true);
      expect(matchingCards[1].classList.contains("flipped")).toBe(true);
      expect(MemoryGame.prototype.flipCard).toHaveBeenCalledTimes(2);
      expect(turnsCounter.textContent).toBe("Turns: 2");

      restartButton.click();

      expect(turnsCounter.textContent).toBe("Turns: 0");
    });

    it("should display the turn count in the end game popup", () => {
      spyOn(MemoryGame.prototype, "restartGame").and.callThrough();
      spyOn(MemoryGame.prototype, "checkMatch").and.callThrough();
      spyOn(MemoryGame.prototype, "flipCard").and.callThrough();

      expect(restartButton.disabled).toBe(true);

      const symbols = ["A", "B", "C", "D", "E", "F"];

      symbols.forEach((symbol) => {
        const cards = document.querySelectorAll(`[data-symbol="${symbol}"]`);

        cards[0].click();
        cards[1].click();
      });

      expect(restartButton.disabled).toBe(false);

      jasmine.clock().tick(8000);

      expect(MemoryGame.prototype.checkMatch).toHaveBeenCalledTimes(6);
      expect(MemoryGame.prototype.flipCard).toHaveBeenCalledTimes(12);
      expect(popup.classList.contains("hidden")).toBe(false);
      expect(popupMessage.textContent).toBe(
        "Congratulations! You completed the game in 12 turns!"
      );
    });
  });

  describe("Grid Selection", () => {
    beforeEach(() => {
      gridSelector.value = "4x3";
      gridApply.click();
      jasmine.clock().tick(100);
    });

    it("should have 4x3 selected by default", () => {
      expect(cards.length).toBe(12);
      expect(gameBoard.getAttribute("data-grid")).toBe("4x3");
    });

    it("should set the grid size based on the selection", () => {
      gridSelector.value = "3x4";
      gridApply.click();

      jasmine.clock().tick(2000);

      expect(cards.length).toBe(12);
    });
  });
});
