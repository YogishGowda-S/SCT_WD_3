// ============================================
// STATE
// ============================================
let board = Array(9).fill(null);   // 9 cells: null | 'X' | 'O'
let currentPlayer = 'X';
let gameMode = null;               // 'friend' | 'computer'
let difficulty = null;             // 'easy' | 'medium' | 'hard'
let gameActive = false;
let scores = { X: 0, O: 0, draw: 0 };

const HUMAN = 'X';
const COMPUTER = 'O';

const WIN_LINES = [
  [0,1,2], [3,4,5], [6,7,8], // rows
  [0,3,6], [1,4,7], [2,5,8], // columns
  [0,4,8], [2,4,6]           // diagonals
];

// ============================================
// DOM REFERENCES
// ============================================
const menuScreen = document.getElementById('menuScreen');
const difficultyScreen = document.getElementById('difficultyScreen');
const gameScreen = document.getElementById('gameScreen');
const resultOverlay = document.getElementById('resultOverlay');

const vsFriendBtn = document.getElementById('vsFriendBtn');
const vsComputerBtn = document.getElementById('vsComputerBtn');
const backFromDifficulty = document.getElementById('backFromDifficulty');
const backToMenu = document.getElementById('backToMenu');
const restartBtn = document.getElementById('restartBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const overlayMenuBtn = document.getElementById('overlayMenuBtn');

const boardEl = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const turnIndicator = document.getElementById('turnIndicator');
const resultText = document.getElementById('resultText');

const scoreXEl = document.getElementById('scoreX');
const scoreOEl = document.getElementById('scoreO');
const scoreDrawEl = document.getElementById('scoreDraw');
const scoreOLabel = document.getElementById('scoreOLabel');

// ============================================
// SCREEN NAVIGATION
// ============================================
function showScreen(screen){
  [menuScreen, difficultyScreen, gameScreen].forEach(s => s.classList.add('hidden'));
  screen.classList.remove('hidden');
}

vsFriendBtn.addEventListener('click', () => {
  gameMode = 'friend';
  difficulty = null;
  scoreOLabel.textContent = 'O';
  startNewGame();
  showScreen(gameScreen);
});

vsComputerBtn.addEventListener('click', () => {
  gameMode = 'computer';
  showScreen(difficultyScreen);
});

document.querySelectorAll('.btn-diff').forEach(btn => {
  btn.addEventListener('click', () => {
    difficulty = btn.dataset.diff;
    scoreOLabel.textContent = 'Computer';
    startNewGame();
    showScreen(gameScreen);
  });
});

backFromDifficulty.addEventListener('click', () => showScreen(menuScreen));
backToMenu.addEventListener('click', () => showScreen(menuScreen));
overlayMenuBtn.addEventListener('click', () => {
  resultOverlay.classList.add('hidden');
  showScreen(menuScreen);
});

// ============================================
// GAME SETUP
// ============================================
function startNewGame(){
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameActive = true;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'cell';
    cell.disabled = false;
  });
  updateTurnIndicator();
}

restartBtn.addEventListener('click', startNewGame);
playAgainBtn.addEventListener('click', () => {
  resultOverlay.classList.add('hidden');
  startNewGame();
});

function updateTurnIndicator(){
  if (gameMode === 'computer'){
    turnIndicator.textContent = currentPlayer === HUMAN ? 'Your turn' : 'Computer thinking…';
  } else {
    turnIndicator.textContent = `Turn: ${currentPlayer}`;
  }
}

// ============================================
// CLICK HANDLING
// ============================================
boardEl.addEventListener('click', (e) => {
  const cell = e.target.closest('.cell');
  if (!cell || !gameActive) return;

  const index = parseInt(cell.dataset.index, 10);
  if (board[index] !== null) return;

  // In computer mode, block clicks while it's the computer's turn
  if (gameMode === 'computer' && currentPlayer !== HUMAN) return;

  makeMove(index, currentPlayer);

  if (gameMode === 'computer' && gameActive && currentPlayer === COMPUTER){
    // Small delay so the computer's move feels natural, not instant
    setTimeout(computerMove, 450);
  }
});

function makeMove(index, player){
  board[index] = player;
  const cell = cells[index];
  cell.textContent = player;
  cell.classList.add(player.toLowerCase());
  cell.disabled = true;

  const winInfo = checkWinner(board);
  if (winInfo){
    endGame(winInfo);
    return;
  }
  if (board.every(c => c !== null)){
    endGame({ winner: 'draw' });
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateTurnIndicator();
}

// ============================================
// WIN / DRAW DETECTION
// ============================================
function checkWinner(b){
  for (const line of WIN_LINES){
    const [a, bIdx, c] = line;
    if (b[a] && b[a] === b[bIdx] && b[a] === b[c]){
      return { winner: b[a], line };
    }
  }
  return null;
}

function endGame(result){
  gameActive = false;
  cells.forEach(c => c.disabled = true);

  if (result.winner === 'draw'){
    scores.draw++;
    scoreDrawEl.textContent = scores.draw;
    resultText.textContent = "It's a draw!";
  } else {
    scores[result.winner]++;
    (result.winner === 'X' ? scoreXEl : scoreOEl).textContent = scores[result.winner];

    if (result.line){
      result.line.forEach(i => cells[i].classList.add('win'));
    }

    if (gameMode === 'computer'){
      resultText.textContent = result.winner === HUMAN ? 'You win! 🎉' : 'Computer wins!';
    } else {
      resultText.textContent = `Player ${result.winner} wins! 🎉`;
    }
  }

  setTimeout(() => resultOverlay.classList.remove('hidden'), 500);
}

// ============================================
// COMPUTER AI — three difficulty levels
// ============================================
function computerMove(){
  if (!gameActive) return;

  let index;
  if (difficulty === 'easy'){
    index = randomMove(board);
  } else if (difficulty === 'medium'){
    index = mediumMove(board);
  } else {
    index = bestMove(board); // hard = minimax
  }

  if (index !== undefined && index !== null){
    makeMove(index, COMPUTER);
  }
}

// EASY: pick any open cell at random
function randomMove(b){
  const empty = b.map((v, i) => v === null ? i : null).filter(v => v !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

// MEDIUM: win if possible, block if necessary, otherwise random
// (deliberately NOT full minimax, so it's beatable sometimes)
function mediumMove(b){
  // 1) Can computer win this turn?
  const winMove = findWinningMove(b, COMPUTER);
  if (winMove !== null) return winMove;

  // 2) Must computer block the human from winning?
  const blockMove = findWinningMove(b, HUMAN);
  if (blockMove !== null) return blockMove;

  // 3) Otherwise, random — this is what makes Medium beatable
  return randomMove(b);
}

function findWinningMove(b, player){
  for (const line of WIN_LINES){
    const [a, c, d] = line;
    const values = [b[a], b[c], b[d]];
    const emptyIndex = line[values.indexOf(null)];
    const filled = values.filter(v => v === player).length;
    const empties = values.filter(v => v === null).length;
    if (filled === 2 && empties === 1){
      return emptyIndex;
    }
  }
  return null;
}

// HARD: minimax algorithm — computer plays perfectly, cannot lose
function bestMove(b){
  let best = { score: -Infinity, index: null };

  for (let i = 0; i < 9; i++){
    if (b[i] === null){
      b[i] = COMPUTER;
      const score = minimax(b, 0, false);
      b[i] = null;
      if (score > best.score){
        best = { score, index: i };
      }
    }
  }
  return best.index;
}

function minimax(b, depth, isMaximizing){
  const result = checkWinner(b);
  if (result){
    if (result.winner === COMPUTER) return 10 - depth;
    if (result.winner === HUMAN) return depth - 10;
  }
  if (b.every(c => c !== null)) return 0; // draw

  if (isMaximizing){
    let best = -Infinity;
    for (let i = 0; i < 9; i++){
      if (b[i] === null){
        b[i] = COMPUTER;
        best = Math.max(best, minimax(b, depth + 1, false));
        b[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++){
      if (b[i] === null){
        b[i] = HUMAN;
        best = Math.min(best, minimax(b, depth + 1, true));
        b[i] = null;
      }
    }
    return best;
  }
}