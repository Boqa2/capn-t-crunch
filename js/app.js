const startGame = document.querySelector(".start-game");
const games = document.querySelector(".game");
const endGame = document.querySelector(".end-game");
const startBtn = document.querySelector(".start-btn");
const scr = document.querySelectorAll(".score");
let isGameOver = false;
const gamePlatform = document.querySelector(".game-platform");
const playAgain = document.querySelector('.play-again')
let imagesToLoad = 4;
let imagesLoaded = 0;
let score = 0;
const birdW = 60,
  birdH = 50;
const pipeW = 60,
  pipeH = 300;
scr.forEach((text)=> text.textContent = score)

let cvs = document.querySelector(".canvas");
let ctx = cvs.getContext("2d");
const screen = document.querySelector(".screen");

let clutch = new Image();
let bg = new Image();
let fg = new Image();
let pipeUp = new Image();
let pipeBottom = new Image();
let gap = 170;

let xPos = 10;
let yPos = 200;
let grav = 1;

document.addEventListener(
  "DOMContentLoaded",
  createBaloons("ballons", gamePlatform)
);
function createBaloons(style, gameContent) {
  const platformWidth = gameContent.clientWidth;
  const platformHeight = gameContent.clientHeight;
  const halfHeight = platformHeight / 2;

  const totalBalloons = 9;

  for (let i = 0; i < totalBalloons; i++) {
    const balloon = document.createElement("img");
    balloon.src = "assets/image/Layer 12 copy 3.png";
    balloon.classList.add(style);
    balloon.alt = "";
    balloon.style.position = "absolute";
    balloon.classList.add("for-away");

    const size = Math.floor(Math.random() * 40) + 20;
    balloon.style.width = size + "px";
    balloon.style.height = "auto";
    if (i < 3) {
      balloon.style.top = "0px";
      balloon.style.left = Math.random() * (platformWidth - size) + "px";
    } else if (i < 6) {
      balloon.style.left = "0px";
      balloon.style.top = Math.random() * (halfHeight - size) + "px";
    } else {
      balloon.style.left = platformWidth - size + "px";
      balloon.style.top = Math.random() * (halfHeight - size) + "px";
    }

    gamePlatform.appendChild(balloon);
  }
}

let pipe = [];
pipe[0] = {
  x: cvs.width,
  y: Math.floor(Math.random() * -90),
};

function checkLoaded() {
  imagesLoaded++;
  if (imagesLoaded === imagesToLoad) {
    draw();
  }
}

clutch.src = "assets/image/Layer 6.png";
bg.src = "assets/image/Pattern.png";
pipeUp.src = "assets/image/pipes.png";
pipeBottom.src = "assets/image/pipes.png";

bg.onload = checkLoaded;
pipeUp.onload = checkLoaded;
pipeBottom.onload = checkLoaded;
clutch.onload = checkLoaded;
screen.addEventListener("click", moveUp);
function moveUp() {
  yPos -= 43;
}

function draw() {
  if (isGameOver) return;
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  ctx.drawImage(bg, 0, 0);

  for (let i = 0; i < pipe.length; i++) {
    ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y, pipeW, pipeH);
    ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeH + gap, pipeW, pipeH);

    pipe[i].x--;

    if (pipe[i].x === 100) {
      pipe.push({
        x: cvs.width,
        y: Math.floor(Math.random() * -180),
      });
    }
    if (pipe[i].x === xPos - 1) {
      score++;
      scr.forEach((text)=> text.textContent = score)
    }

    if (
      xPos + birdW >= pipe[i].x &&
      xPos <= pipe[i].x + pipeW &&
      (yPos <= pipe[i].y + pipeH || yPos + birdH >= pipe[i].y + pipeH + gap)
    ) {
      isGameOver = true;
      endGames();
    }
    if (yPos + birdH >= cvs.height) {
      isGameOver = true;
      endGames();
    }
  }

  ctx.drawImage(clutch, xPos, yPos, birdW, birdH);
  yPos += grav;

  requestAnimationFrame(draw);
}
function hideBalloons() {
  document
    .querySelectorAll(".ballons")
    .forEach((b) => (b.style.display = "none"));
}
function showBalloons() {
  document.querySelectorAll(".ballons").forEach((b) => {
    b.style.display = "block";
    b.classList.add("for-away");
  });
}

startBtn.addEventListener("click", () => {
  startGame.classList.add("hidden");
  games.classList.remove("hidden");
  isGameOver = false;
  xPos = 10;
  yPos = 200;
  score = 0;

  pipe = [];
  pipe[0] = {
    x: cvs.width,
    y: Math.floor(Math.random() * -150),
  };

  draw();
  hideBalloons();
});

function endGames() {
  setTimeout(() => {
    endGame.classList.remove("hidden");
    games.classList.add("hidden");
    showBalloons();
  }, 2000);
}


playAgain.addEventListener("click", ()=>{
  endGame.classList.add("hidden");
  games.classList.remove("hidden");
  isGameOver = false;
  xPos = 10;
  yPos = 200;
  score = 0;

  pipe = [];
  pipe[0] = {
    x: cvs.width,
    y: Math.floor(Math.random() * -150),
  };

  draw();
  hideBalloons();
})