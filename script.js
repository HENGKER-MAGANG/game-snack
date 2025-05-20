const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");

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
let gameRunning = true;
let gameInterval;
let currentSpeed = 130;

function spawnFood() {
  const x = Math.floor(Math.random() * cols) * box;
  const y = Math.floor(Math.random() * rows) * box;
  return { x, y };
}

function drawSnake() {
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = "#22c55e";
  ctx.lineWidth = box * 0.8;

  ctx.beginPath();
  ctx.moveTo(snake[0].x + box / 2, snake[0].y + box / 2);
  for (let i = 1; i < snake.length; i++) {
    const current = snake[i];
    ctx.lineTo(current.x + box / 2, current.y + box / 2);
  }
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(snake[0].x + box / 2, snake[0].y + box / 2, box / 3, 0, Math.PI * 2);
  ctx.fillStyle = "#4ade80";
  ctx.fill();
}

function drawFood() {
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 3, 0, Math.PI * 2);
  ctx.fillStyle = "#ef4444";
  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur = 4;
  ctx.fill();
  ctx.shadowBlur = 0;
}

function update() {
  if (!gameRunning) return;

  direction = nextDirection;

  const head = { ...snake[0] };
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvas.width ||
    head.y >= canvas.height ||
    snake.some(seg => seg.x === head.x && seg.y === head.y)
  ) {
    gameRunning = false;
    clearInterval(gameInterval);
    alert("💀 Game Over!\nSkor: " + score);
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    food = spawnFood();
    increaseSpeedIfNeeded();
  } else {
    snake.pop();
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFood();
  drawSnake();
  update();
}

function resetGame() {
  snake = [];
  for (let i = 5; i >= 0; i--) {
    snake.push({ x: i * box, y: 10 * box });
  }
  direction = "RIGHT";
  nextDirection = "RIGHT";
  score = 0;
  scoreEl.textContent = "0";
  food = spawnFood();
  gameRunning = true;
  currentSpeed = 130;
  clearInterval(gameInterval);
  startGameWithSpeed(currentSpeed);
}

function startGameWithSpeed(speed) {
  gameInterval = setInterval(() => {
    gameLoop();
  }, speed);
}

function increaseSpeedIfNeeded() {
  if (score % 5 === 0 && score !== 0) {
    if (currentSpeed > 60) {
      currentSpeed -= 10;
      clearInterval(gameInterval);
      startGameWithSpeed(currentSpeed);
    }
  }
}

// Kontrol Keyboard
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== "DOWN") nextDirection = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") nextDirection = "DOWN";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") nextDirection = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") nextDirection = "RIGHT";
});

// Kontrol Mobile: swipe
let touchX, touchY;
canvas.addEventListener("touchstart", (e) => {
  touchX = e.touches[0].clientX;
  touchY = e.touches[0].clientY;
});
canvas.addEventListener("touchmove", (e) => {
  const dx = e.touches[0].clientX - touchX;
  const dy = e.touches[0].clientY - touchY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && direction !== "LEFT") nextDirection = "RIGHT";
    else if (dx < 0 && direction !== "RIGHT") nextDirection = "LEFT";
  } else {
    if (dy > 0 && direction !== "UP") nextDirection = "DOWN";
    else if (dy < 0 && direction !== "DOWN") nextDirection = "UP";
  }
  touchX = null;
  touchY = null;
});

// Kontrol Mobile: tombol
document.querySelectorAll(".control-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const dir = btn.getAttribute("data-dir");
    if (dir === "UP" && direction !== "DOWN") nextDirection = "UP";
    if (dir === "DOWN" && direction !== "UP") nextDirection = "DOWN";
    if (dir === "LEFT" && direction !== "RIGHT") nextDirection = "LEFT";
    if (dir === "RIGHT" && direction !== "LEFT") nextDirection = "RIGHT";
  });
});

// Restart button
restartBtn.addEventListener("click", () => {
  resetGame();
});

// Start game
resetGame();
