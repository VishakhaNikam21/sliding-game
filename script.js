const board = document.getElementById('game-board');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart');
let tiles = [];
let emptyIndex = 15;

function initBoard() {
  tiles = Array.from({ length: 16 }, (_, i) => i ? i : 0);
  shuffleTiles();
  renderBoard();
}

function shuffleTiles() {
  // Fisher‑Yates shuffle
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  emptyIndex = tiles.indexOf(0);

  // Ensure solvability via parity rule
  if (!isSolvable()) {
    [tiles[0], tiles[1]] = [tiles[1], tiles[0]];
    emptyIndex = tiles.indexOf(0);
  }
}

function isSolvable() {
  let inv = 0;
  for (let i = 0; i < tiles.length - 1; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] && tiles[j] && tiles[i] > tiles[j]) inv++;
    }
  }
  const rowFromBottom = 4 - Math.floor(emptyIndex / 4);
  return (inv + rowFromBottom) % 2 === 0;
}

function renderBoard() {
  board.innerHTML = '';
  tiles.forEach((tile, idx) => {
    const div = document.createElement('div');
    div.className = tile === 0 ? 'tile empty' : 'tile';
    div.textContent = tile || '';
    if (tile !== 0) div.addEventListener('click', () => moveTile(idx));
    board.appendChild(div);
  });
  checkWin();
}

function moveTile(idx) {
  const row = Math.floor(idx / 4);
  const emptyRow = Math.floor(emptyIndex / 4);
  const col = idx % 4;
  const emptyCol = emptyIndex % 4;

  const isAdjacent = (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
                     (col === emptyCol && Math.abs(row - emptyRow) === 1);
  if (isAdjacent) {
    [tiles[idx], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[idx]];
    emptyIndex = idx;
    renderBoard();
  }
}

function checkWin() {
  const won = tiles.every((tile, i) => tile === (i + 1) % 16);
  message.textContent = won ? '🎉 Congratulations! You solved the puzzle!' : '';
}

restartButton.addEventListener('click', initBoard);
initBoard();
