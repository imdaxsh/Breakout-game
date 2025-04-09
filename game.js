// Game elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');

// Game state
let score = 0;
let lives = 4;
let gameRunning = false;
let gamePaused = false;

// Game objects
const paddleWidth = 100;
const paddleHeight = 15;
const paddleSpeed = 8;
let paddleX = (canvas.width - paddleWidth) / 2;

const ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballSpeedX = 5;
let ballSpeedY = -5;

// Menu elements
const menu = document.getElementById('menu');
const startBtn = document.getElementById('startBtn');
const resumeBtn = document.getElementById('resumeBtn');
const exitBtn = document.getElementById('exitBtn');

// Menu event listeners
startBtn.addEventListener('click', startGame);
resumeBtn.addEventListener('click', resumeGame);
exitBtn.addEventListener('click', exitGame);

// Show menu initially
showStartMenu();

function showStartMenu() {
    menu.style.display = 'flex';
    startBtn.style.display = 'block';
    resumeBtn.style.display = 'none';
    exitBtn.style.display = 'none';
    gameRunning = false;
}

function showPauseMenu() {
    menu.style.display = 'flex';
    startBtn.style.display = 'none';
    resumeBtn.style.display = 'block';
    exitBtn.style.display = 'block';
    gameRunning = false;
}

function hideMenu() {
    menu.style.display = 'none';
    gameRunning = true;
}

function resumeGame() {
    hideMenu();
    gamePaused = false;
    draw();
}

function startGame() {
    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 600;
    
    hideMenu();
    resetGame();
    draw();
}

function exitGame() {
    window.location.href = '/';
}

function resetGame() {
    score = 0;
    lives = 4;
    scoreElement.textContent = score;
    livesElement.textContent = lives;
    ballX = canvas.width / 2;
    ballY = canvas.height - 30;
    ballSpeedX = 5;
    ballSpeedY = -5;
    paddleX = (canvas.width - paddleWidth) / 2;
}

// Bricks
const brickRowCount = 5;
const brickColumnCount = 9;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 60;
const brickOffsetLeft = 30;

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Input
let rightPressed = false;
let leftPressed = false;

// Event listeners
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (e.key === ' ' || e.key === 'Spacebar') {
        if (gameRunning) {
            gamePaused = !gamePaused;
            if (gamePaused) {
                showPauseMenu();
            } else {
                hideMenu();
                draw();
            }
        }
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

// Collision detection
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brick = bricks[c][r];
            if (brick.status === 1) {
                if (
                    ballX > brick.x &&
                    ballX < brick.x + brickWidth &&
                    ballY > brick.y &&
                    ballY < brick.y + brickHeight
                ) {
                    ballSpeedY = -ballSpeedY;
                    brick.status = 0;
                    score++;
                    scoreElement.textContent = score;
                    
                    // Check if all bricks are cleared
                    if (score === brickRowCount * brickColumnCount) {
                        alert('YOU WIN!');
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// Draw functions
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#4CAF50';
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = '#f44336';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Main game loop
function draw() {
    if (!gameRunning || gamePaused) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw game elements
    drawBricks();
    drawBall();
    drawPaddle();
    drawPauseText();
    collisionDetection();
    
    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    
    // Wall collision
    if (ballX + ballSpeedX > canvas.width - ballRadius || ballX + ballSpeedX < ballRadius) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballY + ballSpeedY < ballRadius) {
        ballSpeedY = -ballSpeedY;
    } else if (ballY + ballSpeedY > canvas.height - ballRadius) {
        // Paddle collision
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballSpeedY = -ballSpeedY;
        } else {
            // Ball missed paddle
            lives--;
            livesElement.textContent = lives;
            
            if (lives <= 0) {
                alert('GAME OVER');
                document.location.reload();
            } else {
                ballX = canvas.width / 2;
                ballY = canvas.height - 30;
                ballSpeedX = 5;
                ballSpeedY = -5;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }
    
    // Paddle movement
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += paddleSpeed;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
    }
    
    requestAnimationFrame(draw);
}

// Add pause indicator text
function drawPauseText() {
    if (gamePaused) {
        ctx.font = '48px "Courier New"';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', canvas.width/2, canvas.height/2);
    }
}

// Initialize game state
resetGame();
