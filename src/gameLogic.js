const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

const canvas = document.querySelector("#canvas");
canvas.width = screenWidth;
canvas.height = screenHeight;
const context = canvas.getContext("2d");

let startIntervalId;
let enemyIntervalId;

let score = 0;

function increaseScore(){
  const scoreText = document.querySelector("p span");
  score++
  scoreText.innerHTML = score
}

let player = { x: screenWidth / 2, y: screenHeight / 2, radius: 100, color: "red"};

let enemies = [{x: 0, y: 0, radius: 30, color: "blue", speedX: 5, speedY: 5},];

function onMouseMove(event) {
  player.x = event.clientX;
  player.y = event.clientY;
}

function drawCircle(x, y, radius, color) {
  context.beginPath();
  context.fillStyle = color;
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.fill();
}

function clearScreen() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
  drawCircle(player.x, player.y, player.radius, player.color);
}

function drawEnemies() {
  enemies.forEach(enemy => {
    drawCircle(enemy.x, enemy.y, enemy.radius, enemy.color);
  });
}

function moveEnemy() {
  enemies.forEach(enemy=>{
    enemy.x += enemy.speedX;
    enemy.y += enemy.speedY;
  });
}

function checkEnemyCollision() {
  let colision = false
  enemies.forEach(enemy=>{
    const distance = Math.sqrt(
      (player.x - enemy.x) ** 2 + (player.y - enemy.y) ** 2
    );
    const result = distance < player.radius + enemy.radius;
    if(result){
      colision = true
    }
  })
  return colision
}

function bounceEnemyOnEdge() {
  enemies.forEach(enemy=>{
    if (enemy.x < 0 || enemy.x > screenWidth) {
      enemy.speedX *= -1;
    }

    if (enemy.y < 0 || enemy.y > screenHeight) {
      enemy.speedY *= -1;
    }
  });
}

function increaseEnemySpeed() {
  enemies.forEach(enemy=>{
    enemy.speedX *= 1.001;
    enemy.speedY *= 1.001;
  });
}

function createMoreEnemies(){
  if(Math.random() > 0.80) enemies.push({x: Math.random()*screenWidth, y: 0, radius: 30, color: "blue", speedX: 5, speedY: 5})
}

function endGame() {
  alert(`Fim de jogo sua pontuação foi: ${score}`);
  clearInterval(startIntervalId);
  clearInterval(enemyIntervalId);
  startGame();
}

function startGame() {
  player.x = screenWidth / 2;
  player.y = screenHeight / 2;

  enemies = [{x: Math.random()*screenWidth, y: 0, radius: 30, color: "blue", speedX: 5, speedY: 5}];

  clearInterval(startIntervalId);
  clearInterval(enemyIntervalId);
  score = 0;
  startIntervalId = setInterval(gameLoop, 1000 / 60);
  enemyIntervalId = setInterval(createMoreEnemies, 1000)
}

window.onblur = ()=>{
  clearInterval(startIntervalId);
  clearInterval(enemyIntervalId);
}

window.onfocus = ()=>{
  startIntervalId = setInterval(gameLoop, 1000 / 60);
  enemyIntervalId = setInterval(createMoreEnemies, 1000)
}

function gameLoop() {
  clearScreen();
  moveEnemy();

  if (checkEnemyCollision()) {
    endGame();
  }

  bounceEnemyOnEdge();
  increaseEnemySpeed();
  increaseScore();
  drawPlayer();
  drawEnemies();
}

startGame();