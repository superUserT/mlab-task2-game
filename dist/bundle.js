/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/helper_functions.js":
/*!*********************************!*\
  !*** ./src/helper_functions.js ***!
  \*********************************/
/***/ ((module) => {

eval("function updateUI(game) {\n  game.cards.forEach((card, index) => {\n    const cardElement = document.getElementById(`card-${index}`);\n\n    if (card.isFlipped || card.isMatched) {\n      cardElement.textContent = card.symbol;\n      cardElement.style.backgroundColor = game.symbolColorMap[card.symbol];\n      cardElement.classList.add(\"flipped\");\n    } else {\n      cardElement.textContent = \"\";\n      cardElement.style.backgroundColor = \"\";\n      cardElement.classList.remove(\"flipped\");\n    }\n  });\n\n  const turnsCounter = document.getElementById(\"turns-counter\");\n  turnsCounter.textContent = `Turns: ${game.turns}`;\n}\n\nfunction attachEventListeners(game, handleCardClick) {\n  game.cards.forEach((card, index) => {\n    const cardElement = document.getElementById(`card-${index}`);\n\n    cardElement.addEventListener(\"click\", () => {\n      if (!card.isFlipped && !card.isMatched) {\n        handleCardClick(index);\n      }\n    });\n  });\n}\n\nfunction renderGameBoard(game) {\n  const gameBoard = document.getElementById(\"game-board\");\n  gameBoard.innerHTML = \"\";\n\n  const [rows, cols] = game.gridSize.split(\"x\").map(Number);\n  gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;\n  gameBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;\n\n  gameBoard.setAttribute(\"data-grid\", game.gridSize);\n\n  game.cards.forEach((card, index) => {\n    const cardElement = document.createElement(\"div\");\n    cardElement.id = `card-${index}`;\n    cardElement.classList.add(\"card\");\n    cardElement.setAttribute(\"data-symbol\", card.symbol);\n    cardElement.style.backgroundColor = game.symbolColorMap[card.symbol];\n    gameBoard.appendChild(cardElement);\n  });\n}\n\nmodule.exports = { updateUI, attachEventListeners, renderGameBoard };\n\n\n//# sourceURL=webpack://thabiso-rantsho-222-memory-game-in-vanilla-js-javascript/./src/helper_functions.js?");

/***/ }),

/***/ "./src/memory_game.js":
/*!****************************!*\
  !*** ./src/memory_game.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { updateUI } = __webpack_require__(/*! ./helper_functions */ \"./src/helper_functions.js\");\n\nclass MemoryGame {\n  constructor(gridSize = \"4x3\") {\n    this.symbolColorMap = {};\n    this.colors = [\n      \"#6e6218\",\n      \"#c0c0c0\",\n      \"#9B59B6\",\n      \"#E74C3C\",\n      \"#FF69B4\",\n      \"#FFD700\",\n      \"#1ABC9C\",\n      \"#34495E\",\n    ];\n    this.gridSize = gridSize;\n    this.symbolArrays = {\n      \"2x2\": [\"A\", \"B\", \"A\", \"B\"],\n      \"3x2\": [\"A\", \"B\", \"C\", \"A\", \"B\", \"C\"],\n      \"3x4\": [\"A\", \"B\", \"C\", \"D\", \"E\", \"F\", \"A\", \"B\", \"C\", \"D\", \"E\", \"F\"],\n      \"4x3\": [\"A\", \"B\", \"C\", \"D\", \"E\", \"F\", \"A\", \"B\", \"C\", \"D\", \"E\", \"F\"],\n      \"4x4\": [\n        \"A\",\n        \"B\",\n        \"C\",\n        \"D\",\n        \"E\",\n        \"F\",\n        \"G\",\n        \"H\",\n        \"A\",\n        \"B\",\n        \"C\",\n        \"D\",\n        \"E\",\n        \"F\",\n        \"G\",\n        \"H\",\n      ],\n    };\n\n    this.symbols = this.symbolArrays[gridSize];\n    this.cards = [];\n    this.flippedCards = [];\n    this.matchedPairs = 0;\n    this.turns = 0;\n    this.startTime = 0;\n    this.intervalId = null;\n    this.timerDisplay = 0;\n  }\n\n  setGridSize(newSize) {\n    this.gridSize = newSize;\n    this.symbols = this.symbolArrays[newSize];\n    this.symbolColorMap = {};\n    this.initGame();\n    return this.gridSize;\n  }\n\n  initGame(timerDisplay) {\n    this.shuffleSymbols();\n    this.createCards();\n    this.turns = 0;\n    this.timerDisplay = timerDisplay;\n\n    this.startTime = 0;\n    this.intervalId = null;\n    if (this.timerDisplay) {\n      this.timerDisplay.textContent = \"Timer: 0 seconds\";\n    }\n  }\n\n  shuffleSymbols() {\n    for (let i = this.symbols.length - 1; i > 0; i--) {\n      const randomIndex = Math.floor(Math.random() * (i + 1));\n      [this.symbols[i], this.symbols[randomIndex]] = [\n        this.symbols[randomIndex],\n        this.symbols[i],\n      ];\n    }\n\n    let availableColors = [...this.colors];\n\n    this.symbols.forEach((symbol) => {\n      if (!this.symbolColorMap[symbol]) {\n        const randomIndex = Math.floor(Math.random() * availableColors.length);\n        const selectedColor = availableColors[randomIndex];\n\n        this.symbolColorMap[symbol] = selectedColor;\n        availableColors.splice(randomIndex, 1);\n      }\n    });\n  }\n\n  createCards() {\n    this.cards = this.symbols.map((symbol, index) => ({\n      symbol,\n      index,\n      color: this.symbolColorMap[symbol],\n      isFlipped: false,\n      isMatched: false,\n    }));\n  }\n\n  startTimer() {\n    this.startTime = new Date().getTime();\n    this.intervalId = setInterval(() => this.updateTimerDisplay(), 1000);\n    this.updateTimerDisplay();\n  }\n\n  updateTimerDisplay() {\n    if (this.startTime) {\n      const elapsedTime = Math.floor(\n        (new Date().getTime() - this.startTime) / 1000\n      );\n      if (this.timerDisplay) {\n        this.timerDisplay.textContent = `Timer: ${elapsedTime} seconds`;\n      }\n    }\n  }\n\n  getElapsedTime() {\n    if (this.startTime === null) {\n      return 0;\n    }\n    return new Date().getTime() - this.startTime;\n  }\n  stopTimer() {\n    clearInterval(this.intervalId);\n  }\n\n  flipCard(index) {\n    if (this.flippedCards.length >= 2) {\n      return false;\n    }\n\n    if (!this.startTime) {\n      this.startTimer();\n    }\n\n    if (!this.cards[index].isFlipped && !this.cards[index].isMatched) {\n      this.cards[index].isFlipped = true;\n      this.flippedCards.push(this.cards[index]);\n\n      this.turns++;\n      return true;\n    }\n    return false;\n  }\n\n  checkMatch() {\n    if (this.flippedCards.length === 2) {\n      const [card1, card2] = this.flippedCards;\n      if (card1.symbol === card2.symbol) {\n        card1.isMatched = true;\n        card2.isMatched = true;\n        this.matchedPairs++;\n        this.flippedCards = [];\n        return true;\n      } else {\n        setTimeout(() => {\n          card1.isFlipped = false;\n          card2.isFlipped = false;\n          this.flippedCards = [];\n          updateUI(this);\n        }, 1000);\n        return false;\n      }\n    }\n    return false;\n  }\n\n  isGameOver() {\n    return this.matchedPairs === this.symbols.length / 2;\n  }\n\n  restartGame() {\n    if (this.intervalId) {\n      clearInterval(this.intervalId);\n    }\n\n    this.matchedPairs = 0;\n    this.flippedCards = [];\n    this.turns = 0;\n    this.startTime = 0;\n    this.intervalId = null;\n    this.timerDisplay.textContent = \"Timer: 0 seconds\";\n  }\n}\n\nmodule.exports = { MemoryGame };\n\n\n//# sourceURL=webpack://thabiso-rantsho-222-memory-game-in-vanilla-js-javascript/./src/memory_game.js?");

/***/ }),

/***/ "./src/memory_game_app.js":
/*!********************************!*\
  !*** ./src/memory_game_app.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const { MemoryGame } = __webpack_require__(/*! ./memory_game.js */ \"./src/memory_game.js\");\nconst {\n  updateUI,\n  attachEventListeners,\n  renderGameBoard,\n} = __webpack_require__(/*! ./helper_functions.js */ \"./src/helper_functions.js\");\n\nconst game = new MemoryGame();\n\nconst closePopup = document.getElementById(\"play-again\");\nconst timerDisplay = document.getElementById(\"timerDisplay\");\nconst popupTimerDisplay = document.getElementById(\"timerDone\");\nconst restartButton = document.getElementById(\"restart\");\nconst gridSelector = document.getElementById(\"grid-selector\");\nconst applyButton = document.getElementById(\"apply-grid\");\nlet isClosePopupListenerAdded = false;\n\nfunction initUI() {\n  applyButton.addEventListener(\"click\", () => {\n    const selectedSize = gridSelector.value;\n    game.setGridSize(selectedSize);\n    updateGameBoard();\n  });\n\n  game.initGame(timerDisplay);\n  renderGameBoard(game);\n  attachEventListeners(game, handleCardClick);\n  updateUI(game);\n  restartButton.disabled = true;\n}\n\nfunction updateGameBoard() {\n  const gameBoard = document.getElementById(\"game-board\");\n\n  const [rows, cols] = game.gridSize.split(\"x\").map(Number);\n  gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;\n  gameBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;\n\n  renderGameBoard(game);\n  attachEventListeners(game, handleCardClick);\n  updateUI(game);\n  game.initGame(timerDisplay);\n  restartGame();\n}\n\nfunction handleCardClick(index) {\n  if (game.flippedCards.length >= 2) {\n    return;\n  }\n\n  if (game.flipCard(index)) {\n    updateUI(game);\n\n    if (restartButton.disabled) {\n      restartButton.disabled = false;\n    }\n\n    if (game.flippedCards.length === 2) {\n      if (game.checkMatch()) {\n        updateUI(game);\n      }\n      if (game.isGameOver()) {\n        game.stopTimer();\n        showPopup();\n      }\n    }\n  }\n}\n\nfunction showPopup() {\n  const elapsedTime = game.getElapsedTime();\n  const seconds = Math.floor(elapsedTime / 1000);\n  popupTimerDisplay.textContent = `You took ${seconds} seconds`;\n\n  setTimeout(() => {\n    const popup = document.getElementById(\"popup\");\n    popup.classList.remove(\"hidden\");\n\n    const congratsMessage = popup.querySelector(\"p\");\n    congratsMessage.textContent = `Congratulations! You completed the game in ${game.turns} turns!`;\n\n    if (!isClosePopupListenerAdded) {\n      closePopup.addEventListener(\"click\", () => {\n        popup.classList.add(\"hidden\");\n        congratsMessage.textContent = \"Congratulations! You matched all pairs!\";\n        restartGame();\n      });\n      isClosePopupListenerAdded = true;\n    }\n  }, 1000);\n}\n\nfunction restartGame() {\n  game.stopTimer();\n  game.restartGame();\n  initUI();\n}\n\ninitUI();\ndocument.getElementById(\"restart\").addEventListener(\"click\", restartGame);\n\n\n//# sourceURL=webpack://thabiso-rantsho-222-memory-game-in-vanilla-js-javascript/./src/memory_game_app.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/memory_game_app.js");
/******/ 	
/******/ })()
;