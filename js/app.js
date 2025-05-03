// DOM Elements
const startGame = document.querySelector(".start-game");
const games = document.querySelector(".game");
const endGame = document.querySelector(".end-game");
const startBtn = document.querySelector(".start-btn");
const playAgain = document.querySelector(".play-again");
const loadingBlock = document.querySelector(".center");
const canfiti = document.querySelector(".cnft");
const scr = document.querySelectorAll("#score");
const gamePlatform = document.querySelector(".game-platform");
const gameContainer = document.querySelector(".game-container");
const screen = document.querySelector(".screen");
const adaptation = document.querySelector(".canvas-container");
const video = document.querySelector(".video");
const volume = document.querySelector(".volume");
const forTime = document.querySelector(".time");
const bird = document.querySelector(".cap");
const pipesContainer = document.querySelector(".pipes");

// Game Variables
let allBalons = 12;
let lengthBallons = 2;
let birdTop = 200;
let gameInterval;
let pipeInterval;
let isGameOver = true;
let score = 0;
let timer = 20;

let gravity = 2;
let velocity = 0;
const jumpForce = -8;
let isHorizontal = window.innerHeight <= 400;
let boolVolume = video.muted;
let timerInterval;

// Event Listeners
document.addEventListener(
  "touchstart",
  function (e) {
    if (e.touches.length > 1) e.preventDefault();
  },
  { passive: false }
);

document.addEventListener("gesturestart", function (e) {
  e.preventDefault();
});

games.addEventListener("touchstart", function (e) {
  e.preventDefault();
});

screen.addEventListener("click", () => {
  if (!isGameOver) velocity = jumpForce;
});

startBtn.addEventListener("click", start_Game);

playAgain.addEventListener("click", () => {
  endGame.classList.add("hidden");
  games.classList.remove("hidden");
  hideBalloons();
  start_Game();
});

volume.addEventListener("click", () => {
  boolVolume = !boolVolume;
  video.muted = boolVolume;
  updateVolumeIcon();
});

window.addEventListener("resize", () => {
  const nowHorizontal = window.innerHeight <= 400;

  if (nowHorizontal) {
    move = 37;
    spawnPipe = 220;
    lengthBallons = 1;
  } else {
    spawnPipe = 100;
    lengthBallons = 2;
  }

  if (nowHorizontal !== isHorizontal) {
    isHorizontal = nowHorizontal;
    setVideoSource();
  }
});

let pipes = [];
let spawnInterval;
let frameId;

forTime.textContent = timer;

function start_Game() {
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  cancelAnimationFrame(frameId);

  isGameOver = false;
  timer = 20;
  score = 0;
  birdTop = 200;
  velocity = 0;
  pipes = [];

  pipesContainer.innerHTML = "";
  forTime.textContent = timer;
  scr.forEach((el) => (el.textContent = score));
  bird.style.top = birdTop + "px";

  startGame.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  endGame.classList.add("hidden");
  canfiti.classList.add("hidden");
  hideBalloons();

  spawnPipe();

  timerInterval = setInterval(() => {
    if (timer > 0) {
      timer--;
      forTime.textContent = timer;
    } else {
      endGames();
    }
  }, 1000);

  spawnInterval = setInterval(spawnPipe, 2000);

  frameId = requestAnimationFrame(gameLoop);
}

function endGames() {
  isGameOver = true;
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  cancelAnimationFrame(frameId);

  pipes = [];
  pipesContainer.innerHTML = "";

  endGame.classList.remove("hidden");
  gameContainer.classList.add("hidden");
  canfiti.classList.remove("hidden");
  showBalloons();

  document.querySelectorAll(".ballons").forEach((el) => {
    el.classList.add("for-away");
  });
}

function gameLoop() {
  if (isGameOver) return;

  birdTop += gravity;
  bird.style.top = birdTop + "px";

  movePipes();
  checkCollision();

  frameId = requestAnimationFrame(gameLoop);
}

function spawnPipe() {
  const gap = 220;
  const topPipeHeight = Math.floor(Math.random() * 200) + 60;
  const bottomPipeHeight = gamePlatform.clientHeight - topPipeHeight - gap;

  const topPipe = document.createElement("div");
  topPipe.classList.add("pipe", "top");
  topPipe.style.height = topPipeHeight + "px";
  topPipe.style.left = gameContainer.clientWidth + 20 + "px";
  topPipe.style.top = "0";
  topPipe.style.position = "absolute";

  const bottomPipe = document.createElement("div");
  bottomPipe.classList.add("pipe", "bottom");
  bottomPipe.style.height = bottomPipeHeight + "px";
  bottomPipe.style.left = "320px";
  bottomPipe.style.bottom = "0";
  bottomPipe.style.position = "absolute";

  pipesContainer.appendChild(topPipe);
  pipesContainer.appendChild(bottomPipe);

  pipes.push({ top: topPipe, bottom: bottomPipe, passed: false });
}

function movePipes() {
  pipes.forEach((pair) => {
    let left = parseInt(pair.top.style.left);
    left -= 2;
    pair.top.style.left = left + "px";
    pair.bottom.style.left = left + "px";

    if (!pair.passed && left + 60 < 50) {
      score++;
      scr.forEach((el) => (el.textContent = score));
      pair.passed = true;
    }

    if (left + 60 < 0) {
      pair.top.remove();
      pair.bottom.remove();
    }
  });

  pipes = pipes.filter((pair) => parseInt(pair.top.style.left) + 60 > 0);
}

function checkCollision() {
  const birdRect = bird.getBoundingClientRect();

  pipes.forEach((pair) => {
    const topRect = pair.top.getBoundingClientRect();
    const bottomRect = pair.bottom.getBoundingClientRect();

    if (
      (birdRect.left < topRect.left + topRect.width &&
        birdRect.left + birdRect.width > topRect.left &&
        birdRect.top < topRect.top + topRect.height) ||
      (birdRect.left < bottomRect.left + bottomRect.width &&
        birdRect.left + birdRect.width > bottomRect.left &&
        birdRect.top + birdRect.height > bottomRect.top)
    ) {
      endGames();
    }
  });

  if (
    birdTop + bird.offsetHeight >= gamePlatform.clientHeight ||
    birdTop <= 0
  ) {
    endGames();
  }
}

function jump(value) {
  if (!isGameOver) {
    birdTop -= value;
  }
}

screen.addEventListener("click", () => jump(50));
screen.addEventListener("touchstart", () => jump(80));

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

    const size = Math.floor(Math.random() * 40) + 20;
    balloon.style.width = size + "px";
    balloon.style.height = "auto";
    balloon.style.left = Math.random() * (platformWidth - size) + "px";
    balloon.style.top = Math.random() * (halfHeight - size) + "px";

    gamePlatform.appendChild(balloon);
  }
}

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

function updateVolumeIcon() {
  volume.innerHTML = "";
  if (video.muted) {
    volume.innerHTML = `<i class="bi bi-volume-mute-fill"></i>`;
  } else {
    volume.innerHTML = `<i class="bi bi-volume-up-fill"></i>`;
  }
}

video.addEventListener("loadeddata", () => {
  loadingBlock.classList.add("hidden");
  video.classList.remove("hidden");
  volume.classList.remove("hidden");
  video.play();
});

video.addEventListener("ended", () => {
  video.classList.add("hidden");
  loadingBlock.classList.add("hidden");
  startGame.classList.remove("hidden");
  showBalloons();
  video.pause();
  volume.classList.add("hidden");

  setTimeout(() => {
    start_Game();
  }, 7000);
});

document.addEventListener("DOMContentLoaded", () => {
  createBaloons("ballons");
  hideBalloons();
  canfiti.classList.add("hidden");
  volume.classList.add("hidden");
});

scr.forEach((text) => (text.textContent = score));
updateVolumeIcon();
