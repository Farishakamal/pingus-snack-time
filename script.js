const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreSpan = document.getElementById('score');
const livesSpan = document.getElementById('lives'); 
const restartIconBtn = document.getElementById('restartIconBtn');

const btnLeft = document.getElementById('btnLeft');
const btnRight = document.getElementById('btnRight');

const playerImg = new Image();
playerImg.src = 'assets/images/pingu.png'; 
const fishImg = new Image();
fishImg.src = 'assets/images/fish.png'; 
const bombImg = new Image();
bombImg.src = 'assets/images/bomb.png'; 
const shrimpImg = new Image();
shrimpImg.src = 'assets/images/shrimp.png'; 
const squidImg = new Image();
squidImg.src = 'assets/images/squid.png'; 
const purpleFishImg = new Image();
purpleFishImg.src = 'assets/images/purple_fish.png'; 

const CANVAS_WIDTH = canvas.width = 350;
const CANVAS_HEIGHT = canvas.height = 450;
const PLAYER_SPEED = 7;
const ITEM_FALL_SPEED = 3;
const SPAWN_INTERVAL = 1000;

let player;
let items = [];
let score = 0;
let lives = 3; 
let gameRunning = true;
let spawnTimer;

let isMovingLeft = false;
let isMovingRight = false;

class Player {
    constructor() {
        this.width = 70; 
        this.height = 70;
        this.x = CANVAS_WIDTH / 2 - this.width / 2;
        this.y = CANVAS_HEIGHT - this.height - 10;
    }
    draw() {
        ctx.drawImage(playerImg, this.x, this.y, this.width, this.height);
    }
    update() {
        if (isMovingLeft && this.x > 0) {
            this.x -= PLAYER_SPEED;
        }
        if (isMovingRight && this.x < CANVAS_WIDTH - this.width) {
            this.x += PLAYER_SPEED;
        }
    }
}

class Item {
    constructor(type) {
        this.type = type;
        this.width = 45; 
        this.height = 45;
        this.x = Math.random() * (CANVAS_WIDTH - this.width);
        this.y = -this.height;
    }
    draw() {
        let img;
        if (this.type === 'fish') img = fishImg;
        else if (this.type === 'shrimp') img = shrimpImg;
        else if (this.type === 'squid') img = squidImg;
        else if (this.type === 'purple_fish') img = purpleFishImg;
        else if (this.type === 'bomb') img = bombImg;

        ctx.drawImage(img, this.x, this.y, this.width, this.height);
    }
    update() {
        this.y += ITEM_FALL_SPEED;
    }
}

function startGame() {
    player = new Player();
    items = [];
    score = 0;
    lives = 3; 
    gameRunning = true;
    
    scoreSpan.innerText = score;
    livesSpan.innerText = '❤️'.repeat(lives); 
    
    isMovingLeft = false;
    isMovingRight = false;
    
    document.getElementById('gameOverScreen').style.display = 'none'; 
    
    loop();
    spawnTimer = setInterval(spawnItem, SPAWN_INTERVAL);
}

function spawnItem() {
    if (!gameRunning) return;
    
    const isSnack = Math.random() < 0.75; 

    if (isSnack) {
        const snacks = ['fish', 'shrimp', 'squid', 'purple_fish'];
        const randomSnack = snacks[Math.floor(Math.random() * snacks.length)];
        items.push(new Item(randomSnack));
    } else {
        items.push(new Item('bomb'));
    }
}

function loop() {
    if (!gameRunning) return;
    
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    player.update();
    player.draw();
    
    for (let i = items.length - 1; i >= 0; i--) {
        items[i].update();
        items[i].draw();
        
        if (items[i].y > CANVAS_HEIGHT) {
            items.splice(i, 1);
            continue;
        }
        
        if (
            items[i].x < player.x + player.width - 15 &&
            items[i].x + items[i].width > player.x + 15 &&
            items[i].y < player.y + player.height &&
            items[i].y + items[i].height > player.y + 10
        ) {
            handleCollision(items[i], i);
        }
    }
    
    requestAnimationFrame(loop);
}

function handleCollision(item, index) {
    items.splice(index, 1); 
    
    if (item.type !== 'bomb') {
        score++;
        scoreSpan.innerText = score;
    } else {
        lives--;
        livesSpan.innerText = '❤️'.repeat(lives); 
        
        if (lives <= 0) {
            gameOver();
        }
    }
}

function gameOver() {
    gameRunning = false;
    clearInterval(spawnTimer);
    
    document.getElementById('finalScore').innerText = score;
    
    document.getElementById('gameOverScreen').style.display = 'flex';
}

btnLeft.addEventListener('mousedown', () => isMovingLeft = true);
btnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); isMovingLeft = true; });

btnRight.addEventListener('mousedown', () => isMovingRight = true);
btnRight.addEventListener('touchstart', (e) => { e.preventDefault(); isMovingRight = true; });

window.addEventListener('mouseup', () => { isMovingLeft = false; isMovingRight = false; });
window.addEventListener('touchend', () => { isMovingLeft = false; isMovingRight = false; });

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') isMovingLeft = true;
    if (e.key === 'ArrowRight') isMovingRight = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') isMovingLeft = false;
    if (e.key === 'ArrowRight') isMovingRight = false;
});

restartIconBtn.addEventListener('click', startGame);

startGame();