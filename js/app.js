// DOM Elements
const startGame = document.querySelector(".start-game");
const games = document.querySelector(".game");
const endGame = document.querySelector(".end-game");
const startBtn = document.querySelector(".start-btn");
const playAgain = document.querySelector(".play-again");
const loadingBlock = document.querySelector(".center");
const canfiti = document.querySelector(".cnft");
const scr = document.querySelectorAll(".score");
const gamePlatform = document.querySelector(".game-platform");
const screen = document.querySelector(".screen");
const adaptation = document.querySelector(".canvas-container");
const video = document.querySelector(".video");
const volume = document.querySelector(".volume");

let allBalons = 12;
let lengthBallons = 2;

let cvs = document.querySelector(".canvas");
let ctx = cvs.getContext("2d");

document.addEventListener(
  "touchstart",
  function (e) {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  },
  { passive: false }
);

document.addEventListener("gesturestart", function (e) {
  e.preventDefault();
});

games.addEventListener("touchstart", function (e) {
  e.preventDefault();
  moveUp();
});

let canvasWidth = 320;
let canvasHeight = 560;

cvs.width = canvasWidth;
cvs.height = canvasHeight;
let score = 0;
let isGameOver = true;
let xPos = 10;
let yPos = 200;
let grav = 1;
let gap = 170;
let pipe = [];
let spawnPipe = 80;
pipe[0] = {
  x: cvs.width,
  y: Math.floor(Math.random() * -90),
};

// Sizes
let birdW = 60;
let birdH = 50;
let pipeW = 60;
let pipeH = 300;
let move = 47;

// Images
let clutch = new Image();
let bg = new Image();
let fg = new Image();
let pipeUp = new Image();
let pipeBottom = new Image();

clutch.src = "assets/image/Layer 6.png";
bg.src = "assets/image/Pattern.png";
pipeUp.src = "assets/image/pipes.png";
pipeBottom.src = "assets/image/pipes.png";

let imagesToLoad = 4;
let imagesLoaded = 0;

function checkLoaded() {
  imagesLoaded++;
  if (imagesLoaded === imagesToLoad) {
    draw();
  }
}

bg.onload = checkLoaded;
pipeUp.onload = checkLoaded;
pipeBottom.onload = checkLoaded;
clutch.onload = checkLoaded;

// Balloon creation
function createBaloons(style) {
  const platformWidth = gamePlatform.clientWidth;
  const platformHeight = gamePlatform.clientHeight;
  const halfHeight = platformHeight / 2;
  const totalBalloons = 20;

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

    // Позиционируем случайно по верхней половине платформы
    balloon.style.left = Math.random() * (platformWidth - size) + "px";
    balloon.style.top = Math.random() * (halfHeight - size) + "px";

    gamePlatform.appendChild(balloon);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  createBaloons("ballons");
  hideBalloons();
  canfiti.classList.add("hidden");
  volume.classList.add("hidden");
});

function hideBalloons() {
  document
    .querySelectorAll(".ballons")
    .forEach((b) => (b.style.display = "none"));
  canfiti.classList.add("hidden");
}

function showBalloons() {
  document.querySelectorAll(".ballons").forEach((b) => {
    b.style.display = "block";
  });
}

function draw() {
  if (isGameOver) return;
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  ctx.drawImage(bg, 0, 0);

  for (let i = 0; i < pipe.length; i++) {
    ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y, pipeW, pipeH);
    ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeH + gap, pipeW, pipeH);

    pipe[i].x--;

    if (pipe[i].x === spawnPipe) {
      pipe.push({
        x: cvs.width,
        y: Math.floor(Math.random() * -100),
      });
    }

    if (pipe[i].x === xPos - 1) {
      score++;
      scr.forEach((text) => (text.textContent = score));
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
  hideBalloons();
}

function moveUp() {
  yPos -= move;
}
screen.addEventListener("click", moveUp);

function endGames() {
  setTimeout(() => {
    endGame.classList.remove("hidden");
    games.classList.add("hidden");
    canfiti.classList.remove("hidden");
    showBalloons();
  }, 2000);
}

startBtn.addEventListener("click", () => {
  startGame.classList.add("hidden");
  games.classList.remove("hidden");
  isGameOver = false;
  xPos = 10;
  yPos = 200;
  score = 0;
  pipe = [{ x: cvs.width, y: Math.floor(Math.random() * -150) }];
  draw();
  hideBalloons();
});

playAgain.addEventListener("click", () => {
  endGame.classList.add("hidden");
  games.classList.remove("hidden");
  isGameOver = false;
  xPos = 10;
  yPos = 200;
  score = 0;
  scr.forEach((el) => (el.textContent = score));
  pipe = [{ x: cvs.width, y: Math.floor(Math.random() * -150) }];
  draw();
  hideBalloons();
});

function waitForLoading(callback) {
  const images = startGame.querySelectorAll("img");
  let loadedCount = 0;

  if (images.length === 0) {
    callback();
    return;
  }

  images.forEach((img) => {
    if (img.complete) {
      loadedCount++;
      if (loadedCount === images.length) callback();
    } else {
      img.addEventListener("load", () => {
        loadedCount++;
        if (loadedCount === images.length) callback();
      });
    }
  });
}
let isHorizontal = window.innerHeight <= 400;

function setVideoSource() {
  const currentTime = video.currentTime;

  if (isHorizontal) {
    video.src = "assets/video/horizontall.mp4";
    allBalons = 20;
  } else {
    video.src = "assets/video/vertical.mp4";
    allBalons = 12;
  }

  video.addEventListener(
    "loadedmetadata",
    () => {
      video.currentTime = currentTime;
      video.play();
    },
    { once: true }
  );
}

window.addEventListener("resize", () => {
  const nowHorizontal = window.innerHeight <= 400;

  if (nowHorizontal) {
    birdH = 75;
    birdW = 25;
    pipeH = 320;
    pipeW = 25;
    gap = 170;
    move = 37;
    spawnPipe = 220;
    lengthBallons = 1;
    console.log(birdH, birdW, pipeH, pipeW);
  } else {
    birdH = 60;
    birdW = 40;
    pipeH = 300;
    pipeW = 60;
    spawnPipe = 100;
    lengthBallons = 2;
  }
  if (nowHorizontal !== isHorizontal) {
    isHorizontal = nowHorizontal;
    setVideoSource();
  }
});
let boolVolume = video.muted;

volume.addEventListener("click", () => {
  boolVolume = !boolVolume;
  video.muted = boolVolume;
  updateVolumeIcon();
});

function updateVolumeIcon() {
  volume.innerHTML = "";
  if (video.muted) {
    volume.innerHTML = `<i class="bi bi-volume-mute-fill"></i>`;
  } else {
    volume.innerHTML = `<i class="bi bi-volume-up-fill"></i>`;
  }
}

updateVolumeIcon();

video.play();
video.addEventListener("loadeddata", () => {
  loadingBlock.classList.add("hidden");
  video.classList.remove("hidden");
  volume.classList.remove("hidden");
  video.play();
});
video.addEventListener("ended", () => {
  video.classList.add("hidden");
  startGame.classList.remove("hidden");
  showBalloons();
  video.pause();
  volume.classList.add("hidden");

  waitForLoading(() => {
    loadingBlock.classList.add("hidden");
    startGame.classList.remove("hidden");
    document
      .querySelectorAll(".ballons")
      .forEach((b) => (b.style.display = "block"));
  });
});

scr.forEach((text) => (text.textContent = score));
