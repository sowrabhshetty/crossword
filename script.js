// script.js
const gridSize = 14;
const grid = document.getElementById("grid");
const wordList = document.getElementById("wordList");
const input = document.getElementById("wordInput");
const submitBtn = document.getElementById("submitBtn");
const canvas = document.getElementById("confetti-canvas");

const words = [
  "WHATRASUDEEP", "MACHA", "CHINLUNGS", "OMR", "JYOTHI",
  "VODKA", "RUM", "GIN", "WHISKEY", "BEER",
  "BUDWEISER", "KINGFISHER", "PUBGOLF", "TEQUILA"
];

let placedWords = new Set();

function createGrid() {
  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    grid.appendChild(cell);
  }
}

function randomDirection() {
  return Math.random() < 0.5 ? "H" : "V";
}

function canPlace(word, row, col, dir) {
  if (dir === "H") {
    if (col + word.length > gridSize) return false;
    for (let i = 0; i < word.length; i++) {
      const cell = grid.children[row * gridSize + col + i];
      if (cell.textContent && cell.textContent !== word[i]) return false;
    }
  } else {
    if (row + word.length > gridSize) return false;
    for (let i = 0; i < word.length; i++) {
      const cell = grid.children[(row + i) * gridSize + col];
      if (cell.textContent && cell.textContent !== word[i]) return false;
    }
  }
  return true;
}

function placeWord(word) {
  for (let tries = 0; tries < 100; tries++) {
    const dir = randomDirection();
    const row = Math.floor(Math.random() * gridSize);
    const col = Math.floor(Math.random() * gridSize);
    if (canPlace(word, row, col, dir)) {
      for (let i = 0; i < word.length; i++) {
        const idx = dir === "H" ? row * gridSize + col + i : (row + i) * gridSize + col;
        const cell = grid.children[idx];
        cell.textContent = word[i];
        cell.dataset.word = word;
      }
      return;
    }
  }
}

function fillRandomLetters() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let cell of grid.children) {
    if (!cell.textContent) {
      cell.textContent = alphabet[Math.floor(Math.random() * alphabet.length)];
    }
  }
}

function populateWordList() {
  words.forEach(w => {
    const li = document.createElement("li");
    li.textContent = w;
    li.id = `word-${w}`;
    wordList.appendChild(li);
  });
}

function highlightWord(word) {
  for (let cell of grid.children) {
    if (cell.dataset.word === word) {
      cell.classList.add("highlight");
    }
  }
}

function handleSubmit() {
  const guess = input.value.trim().toUpperCase();
  if (words.includes(guess) && !placedWords.has(guess)) {
    placedWords.add(guess);
    highlightWord(guess);
    document.getElementById(`word-${guess}`).classList.add("struck");
    if (guess === "JYOTHI") launchConfetti();
  }
  input.value = "";
}

function launchConfetti() {
  const jsConfetti = new JSConfetti({ canvas });
  jsConfetti.addConfetti({ emojis: ["🍻", "🎉", "🥳", "💃"] });
}

submitBtn.addEventListener("click", handleSubmit);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") handleSubmit();
});

// Init
createGrid();
words.forEach(placeWord);
fillRandomLetters();
populateWordList();
