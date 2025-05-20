const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20;
const rows = 20;
const cols = 20;
canvas.width = box * cols;
canvas.height = box * rows;

let snake = [];
let direction = "RIGHT";
let nextDirection = "RIGHT";
let food = spawnFood();
let score = 0;
let speed = 100;
let lastTime = 0;

const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");

// Suara
const eatSound = new Audio("sounds/eat.wav");
const gameOverSound = new Audio("sounds/gameover.wav");
const bgMusic = new Audio("sounds/back.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.4;

function spawnFood() {
  return {
    x: Math.floor(Math.random() * cols) * box,
    y: Math.floor(Math.random() * rows) * box,
    pulse: 0,
  };
}

function drawFood() {
  const radius = box / 3 + Math.sin(food.pulse) * 2;
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#ef4444";
  ctx.shadowColor = "#ff0000";
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0;
  food.pulse += 0.2;
}

function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#22c55e" : "#4ade80";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = "#000";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }
}

function updateSnake() {
  direction = nextDirection;
  const head = { ...snake[0] };

  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  // Game Over
  if (
    head.x < 0 || head.x >= cols * box ||
    head.y < 0 || head.y >= rows * box ||
    snake.some((seg) => seg.x === head.x && seg.y === head.y)
  ) {
    gameOverSound.play();
    bgMusic.pause();
    alert("💀 Game Over!\nScore: " + score);
    resetGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    food = spawnFood();
    eatSound.play();
  } else {
    snake.pop();
  }
}

function animate(timestamp) {
  if (!lastTime || timestamp - lastTime > speed) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateSnake();
    drawFood();
    drawSnake();
    lastTime = timestamp;
  }
  requestAnimationFrame(animate);
}

function resetGame() {
  snake = [];
  for (let i = 4; i >= 0; i--) {
    snake.push({ x: i * box, y: 10 * box });
  }
  direction = "RIGHT";
  nextDirection = "RIGHT";
  score = 0;
  scoreEl.textContent = "0";
  food = spawnFood();
  bgMusic.play();
}

// Kontrol keyboard
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== "DOWN") nextDirection = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") nextDirection = "DOWN";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") nextDirection = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") nextDirection = "RIGHT";
});

// Kontrol mobile swipe
let touchX = 0, touchY = 0;
canvas.addEventListener("touchstart", (e) => {
  touchX = e.touches[0].clientX;
  touchY = e.touches[0].clientY;
});
canvas.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - touchX;
  const dy = e.changedTouches[0].clientY - touchY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && direction !== "LEFT") nextDirection = "RIGHT";
    else if (dx < 0 && direction !== "RIGHT") nextDirection = "LEFT";
  } else {
    if (dy > 0 && direction !== "UP") nextDirection = "DOWN";
    else if (dy < 0 && direction !== "DOWN") nextDirection = "UP";
  }
});

// Kontrol tombol mobile
document.querySelectorAll(".control-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const dir = btn.getAttribute("data-dir");
    if (dir === "UP" && direction !== "DOWN") nextDirection = "UP";
    if (dir === "DOWN" && direction !== "UP") nextDirection = "DOWN";
    if (dir === "LEFT" && direction !== "RIGHT") nextDirection = "LEFT";
    if (dir === "RIGHT" && direction !== "LEFT") nextDirection = "RIGHT";
  });
});

// Restart
restartBtn.addEventListener("click", () => {
  resetGame();
});

// Start
resetGame();
requestAnimationFrame(animate);
