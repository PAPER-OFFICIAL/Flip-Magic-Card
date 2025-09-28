// Game variables
const emojis = ["🍎","🍌","🍇","🍊","🍓","🍉","🍍","🥝","🥑","🥥","🍒","🥭"];
const pairsPerLevel = {1:4, 2:6, 3:8};
let shuffled = [], flippedCards = [], lockBoard = false;
let timeLeft = 60, movesLeft = 20, level = 1, timerInterval;

// Elements
const landingPage = document.getElementById("landingPage");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const themeSelect = document.getElementById("themeSelect");
const levelSelect = document.getElementById("levelSelect");
const gameBoard = document.getElementById("gameBoard");
const statusBar = document.getElementById("statusBar");
const timerDisplay = document.getElementById("timer");
const movesDisplay = document.getElementById("moves");
const levelDisplay = document.getElementById("level");
const aiPopup = document.getElementById("aiPopup");

// Sounds
const flipSound = document.getElementById("flipSound");
const matchSound = document.getElementById("matchSound");
const wrongSound = document.getElementById("wrongSound");
const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");

// AI messages
const aiMessages = {
  "🍎🍎":"An apple a day keeps bugs away! 🐛",
  "🍌🍌":"Bananas are naturally funny! 🍌😆",
  "🍇🍇":"Grapes like to party in bunches! 🎉",
  "🍊🍊":"Orange you glad we matched? 🍊😂",
  "🥑🥑":"Avocados are toast’s best friend! 🥑🍞",
  "🥝🥝":"Kiwis are small but mighty! 🥝💪",
  "🍉🍉":"Watermelon is 92% fun! 🍉🎉",
  "🍓🍓":"Strawberries bring the sweetness! 🍓💖"
};

// Shuffle helper
function shuffle(array){ return array.sort(() => Math.random() - 0.5); }

// Start game
function startGame(){
  level = parseInt(levelSelect.value);
  levelDisplay.textContent = `Level: ${level}`;
  landingPage.classList.add("hidden");
  statusBar.classList.remove("hidden");
  gameBoard.classList.remove("hidden");
  resetGame();
}

// Reset game
function resetGame(){
  flippedCards = [];
  lockBoard = false;
  timeLeft = 60 - (level-1)*10;
  movesLeft = 20 - (level-1)*5;
  timerDisplay.textContent = `Time: ${timeLeft}s`;
  movesDisplay.textContent = `Moves: ${movesLeft}`;
  createBoard(level);
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
}

// Create board
function createBoard(level){
  gameBoard.innerHTML = "";
  const pairs = pairsPerLevel[level];
  let emojiSet = emojis.slice(0, pairs);
  shuffled = shuffle([...emojiSet, ...emojiSet]);
  shuffled.forEach(emoji => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-front"></div>
        <div class="card-face card-back">${emoji}</div>
      </div>`;
    card.addEventListener("click", () => flipCard(card));
    gameBoard.appendChild(card);
  });
}

// Flip card
function flipCard(card){
  if(lockBoard || card.classList.contains("flipped") || card.classList.contains("matched")) return;
  card.classList.add("flipped"); 
  flipSound.play();
  flippedCards.push(card);
  if(flippedCards.length === 2){
    movesLeft--; 
    movesDisplay.textContent = `Moves: ${movesLeft}`;
    checkMatch();
  }
}

// Check match
function checkMatch(){
  const [c1, c2] = flippedCards;
  const e1 = c1.querySelector(".card-back").textContent;
  const e2 = c2.querySelector(".card-back").textContent;

  if(e1 === e2){
    matchSound.play();
    c1.classList.add("matched");
    c2.classList.add("matched");
    flippedCards = [];

    // AI Twist
    const key = e1 + e2;
    if(aiMessages[key]) showAIPopup(aiMessages[key]);

    checkWin();
  } else {
    lockBoard = true; 
    wrongSound.play();
    setTimeout(()=>{
      c1.classList.remove("flipped");
      c2.classList.remove("flipped");
      flippedCards = [];
      lockBoard = false;
    },1000);
  }
}

// Check win
function checkWin(){
  const matched = document.querySelectorAll(".card.matched").length;
  if(matched === pairsPerLevel[level]*2){
    clearInterval(timerInterval);
    winSound.play();
    showAIPopup(`🎉 Level ${level} completed!`);
    if(level < 3){
      level++;
      levelSelect.value = level;
      setTimeout(()=>startGame(), 1500);
    }
  }
}

// Timer
function updateTimer(){
  timeLeft--; 
  timerDisplay.textContent = `Time: ${timeLeft}s`;
  if(timeLeft <= 0 || movesLeft <= 0){
    clearInterval(timerInterval);
    loseSound.play();
    showAIPopup("❌ Game Over!");
  }
}

// AI Popup
function showAIPopup(msg){
  aiPopup.textContent = msg;
  aiPopup.classList.add("show");
  aiPopup.classList.remove("hidden");
  setTimeout(()=>{
    aiPopup.classList.remove("show");
    setTimeout(()=>aiPopup.classList.add("hidden"),500);
  },3000);
}

// Theme change
themeSelect.addEventListener("change",()=>{
  const t = themeSelect.value;
  switch(t){
    case "day": document.documentElement.style.setProperty('--bg-gradient','linear-gradient(135deg, #1e3c72, #2a5298)'); break;
    case "night": document.documentElement.style.setProperty('--bg-gradient','linear-gradient(135deg, #0f2027, #203a43, #2c5364)'); break;
    case "sunset": document.documentElement.style.setProperty('--bg-gradient','linear-gradient(135deg, #ff7e5f, #feb47b)'); break;
    case "forest": document.documentElement.style.setProperty('--bg-gradient','linear-gradient(135deg, #134e5e, #71b280)'); break;
  }
});

// Event listeners
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", resetGame);
function createBoard(level){
  gameBoard.innerHTML = "";
  const pairs = pairsPerLevel[level];
  const totalCards = pairs * 2;
  let emojiSet = emojis.slice(0, pairs);
  shuffled = shuffle([...emojiSet, ...emojiSet]);

  // Set square grid
  const columns = Math.ceil(Math.sqrt(totalCards));
  gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

  shuffled.forEach(emoji => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-front"></div>
        <div class="card-face card-back">${emoji}</div>
      </div>`;
    card.addEventListener("click", () => flipCard(card));
    gameBoard.appendChild(card);
  });
}
