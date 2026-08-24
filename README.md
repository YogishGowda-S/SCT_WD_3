# Tic Tac Toe Web Application

An advanced Tic Tac Toe game built for **Task 03** of the SkillCraft Technology Web Development Internship.

## 🔗 Live Demo
[Add your GitHub Pages link here after deploying]

## 📋 Task Requirements
- Build a Tic Tac Toe web application playable against another player or against the computer
- Implement functions to handle user clicks, track game state, and check for winning conditions

## ✨ Features
- **Two game modes**
  - Play vs Friend — local two-player on the same device
  - Play vs Computer — with selectable difficulty
- **Three AI difficulty levels**
  - Easy — computer moves randomly
  - Medium — blocks your winning move and takes its own win when available, otherwise random
  - Hard — unbeatable, powered by the **minimax algorithm** (a game-tree search that always picks the optimal move)
- **Win detection** — checks all 8 possible winning lines (rows, columns, diagonals) and highlights the winning cells
- **Draw detection** — correctly identifies a full board with no winner
- **Scoreboard** — tracks X wins, O wins, and draws across rounds
- **Screen-based navigation** — menu → difficulty select → game board, with back/restart controls
- **Responsive design** — works on mobile and desktop

## 🛠️ Built With
- HTML5
- CSS3 (Grid layout, custom properties, animations)
- Vanilla JavaScript (event delegation, minimax algorithm, game state management)

## 🧠 How the Hard Difficulty Works
The computer uses **minimax**, a recursive algorithm that simulates every possible sequence of remaining moves, scores each outcome (+10 for a computer win, -10 for a human win, 0 for a draw), and always chooses the move that guarantees the best possible result assuming the opponent also plays optimally. This is the same core concept used in real game-playing AI.

## 📂 File Structure
```
├── index.html
├── styles.css
├── script.js
└── README.md
```

## ▶️ How to Run
1. Download/clone this repository
2. Open `index.html` in any browser — no build step or server required

---
Built by [Your Name] as part of the SkillCraft Technology internship.