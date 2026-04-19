const boardDiv = document.getElementById('board');
const messageDiv = document.getElementById('message');
const resetBtn = document.getElementById('resetBtn');

let board = ["","","","","","","","",""];
let currentPlayer = "X";
let gameMode = "";
let gameOver = false;
let playerSymbol = "X"; // Player's symbol if vs AI
let aiSymbol = "O";

// Winning combinations
const winCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// Start the game with selected mode
function startGame(mode){
  gameMode = mode;
  document.getElementById('modeSelect').style.display = 'none';

  if(mode === 'ai'){
    document.getElementById('symbolSelect').style.display = 'block';
  } else {
    drawBoard();
    messageDiv.textContent = `Current Player: ${currentPlayer}`;
    resetBtn.style.display = 'inline-block';
  }
}

// Choose symbol for player vs AI
function chooseSymbol(symbol){
  playerSymbol = symbol;
  aiSymbol = symbol === "X" ? "O" : "X";
  currentPlayer = "X"; // X always goes first
  document.getElementById('symbolSelect').style.display = 'none';
  resetBtn.style.display = 'inline-block';
  drawBoard();
  messageDiv.textContent = `Current Player: ${currentPlayer}`;
  
  // If AI is X, make AI move first
  if(gameMode === 'ai' && currentPlayer === aiSymbol){
    aiMove();
  }
}

// Draw the board
function drawBoard(){
  boardDiv.innerHTML = '';
  board.forEach((cell, index)=>{
    const cellDiv = document.createElement('div');
    cellDiv.classList.add('cell');
    cellDiv.textContent = cell;
    cellDiv.addEventListener('click', ()=>handleMove(index));
    boardDiv.appendChild(cellDiv);
  });
}

// Handle a move
function handleMove(index){
  if(board[index] !== "" || gameOver) return;

  // Friend mode or player's turn in AI mode
  if(gameMode === 'friend' || currentPlayer === playerSymbol){
    board[index] = currentPlayer;
    drawBoard();
    if(checkWinner(currentPlayer)){
      messageDiv.textContent = `${currentPlayer} Wins!`;
      gameOver = true;
      return;
    }
    if(board.every(c => c !== "")){
      messageDiv.textContent = "It's a Tie!";
      gameOver = true;
      return;
    }
    // Switch player
    if(gameMode === 'friend'){
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      messageDiv.textContent = `Current Player: ${currentPlayer}`;
    } else {
      currentPlayer = aiSymbol;
      aiMove();
    }
  }
}

// Simple AI: choose random empty cell
function aiMove(){
  if(gameOver) return;
  let emptyIndices = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  let move = emptyIndices[Math.floor(Math.random()*emptyIndices.length)];
  board[move] = aiSymbol;
  drawBoard();
  if(checkWinner(aiSymbol)){
    messageDiv.textContent = `${aiSymbol} Wins!`;
    gameOver = true;
    return;
  }
  if(board.every(c => c !== "")){
    messageDiv.textContent = "It's a Tie!";
    gameOver = true;
    return;
  }
  currentPlayer = playerSymbol;
  messageDiv.textContent = `Current Player: ${currentPlayer}`;
}

// Check for a winner
function checkWinner(player){
  return winCombos.some(combo=>{
    return combo.every(i=>board[i]===player);
  });
}

// Reset game
function resetGame(){
  board = ["","","","","","","","",""];
  currentPlayer = "X";
  gameOver = false;
  drawBoard();
  messageDiv.textContent = gameMode === 'ai' ? "Choose your symbol" : `Current Player: ${currentPlayer}`;
  if(gameMode === 'ai'){
    document.getElementById('symbolSelect').style.display = 'block';
  }
}