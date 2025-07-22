// script.js

const gridSize = 14;
const grid = document.getElementById("grid");
const wordList = document.getElementById("wordList");
const canvas = document.getElementById("confetti-canvas");

const words = [
  "WHATRASUDEEP", "MACHA", "CHINLUNGS", "OMR", "JYOTHI",
  "VODKA", "RUM", "GIN", "WHISKEY", "BEER",
  "BUDWEISER", "KINGFISHER", "PUBGOLF", "TEQUILA"
];

let placedWords = new Set();

function createGrid() {
  grid.innerHTML = ""; // clear grid if reloading

  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
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
        if (!cell.dataset.words) cell.dataset.words = word;
        else cell.dataset.words += `,${word}`;
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
  wordList.innerHTML = "";
  words
    .filter(w => w !== "JYOTHI") // hides "JYOTHI" from the list
    .forEach(w => {
      const li = document.createElement("li");
      li.textContent = w;
      li.id = `word-${w}`;
      wordList.appendChild(li);
    });
}


function highlightWord(word) {
  for (let cell of grid.children) {
    if (cell.dataset.words && cell.dataset.words.split(",").includes(word)) {
      cell.classList.add("highlight");
    }
  }
}

function launchSecretEffect() {
  // Show dramatic fire popup for "JYOTHI"
  let announce = document.getElementById("secret-announce");
  if (!announce) {
    announce = document.createElement("div");
    announce.id = "secret-announce";
    document.body.appendChild(announce);
  }

  announce.innerHTML = `
    <div class="fire-announce">
      <span class="fire-emoji">🔥🔥🔥 SECRET WORD FOUND 🔥🔥🔥</span><br>
      <span style="font-size:2.5rem; font-weight: bold;">JYOTHI</span>
      <div style="font-size:2rem;">🎉🥳🔥🎆💥</div>
    </div>
  `;

  announce.style.display = "block";
  announce.classList.add("show");

  if (typeof JSConfetti !== "undefined" && canvas) {
    const jsConfetti = new JSConfetti({ canvas });
    jsConfetti.addConfetti({
      emojis: ["🔥", "🎉", "🥳", "💥", "🎆", "🎊"],
      confettiNumber: 150,
      confettiRadius: 10,
      emojiSize: 40,
    });
  }

  setTimeout(() => {
    announce.classList.remove("show");
    announce.style.display = "none";
    announce.innerHTML = "";
  }, 5000);
}

// --- Selection logic ---

let isSelecting = false;
let selection = [];

function clearHighlights() {
  for (let cell of grid.children) {
    cell.classList.remove("selected");
  }
  selection = [];
}

function addToSelection(cell) {
  if (!cell.classList.contains("cell")) return;
  if (!selection.includes(cell)) {
    selection.push(cell);
    cell.classList.add("selected");
  }
}

function handleCellStart(cell) {
  isSelecting = true;
  clearHighlights();
  addToSelection(cell);
}

function handleCellEnter(cell) {
  if (!isSelecting) return;
  addToSelection(cell);
}

function handleSelectionEnd() {
  if (!isSelecting || selection.length === 0) return;
  isSelecting = false;

  const word = selection.map(cell => cell.textContent).join('');
  if (words.includes(word) && !placedWords.has(word)) {
    placedWords.add(word);
    highlightWord(word);
    const li = document.getElementById(`word-${word}`);
    if (li) li.classList.add("struck");

    if (word === "JYOTHI") launchSecretEffect();
  }

  setTimeout(clearHighlights, 200);
}

// Attach mouse events
grid.addEventListener('mousedown', e => {
  e.preventDefault();
  if (e.target.classList.contains("cell")) handleCellStart(e.target);
});
grid.addEventListener('mouseenter', e => {
  e.preventDefault();
  if (e.target.classList.contains("cell") && isSelecting) handleCellEnter(e.target);
}, true);
document.addEventListener('mouseup', handleSelectionEnd);

// Attach touch events
grid.addEventListener('touchstart', e => {
  e.preventDefault();
  const cell = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
  if (cell && cell.classList.contains("cell")) handleCellStart(cell);
});
grid.addEventListener('touchmove', e => {
  e.preventDefault();
  const cell = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
  if (cell && cell.classList.contains("cell")) handleCellEnter(cell);
});
document.addEventListener('touchend', handleSelectionEnd);

window.addEventListener("blur", () => {
  isSelecting = false;
  clearHighlights();
});

// --- Initialize ---

createGrid();
words.forEach(placeWord);
fillRandomLetters();
populateWordList();
