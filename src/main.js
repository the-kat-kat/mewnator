import { updateOrphs, drawOrphs, restartOrphs} from "./orphs.js";
import { player, updatePlayer, drawBox, centerGuideBox, restartPlayer} from "./player.js";
import { addSnapshot } from "./snapshots.js";

const { FaceLandmarker, FilesetResolver} =
  await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest");

const video = document.getElementById("video");
const stream = await navigator.mediaDevices.getUserMedia({ video: true });
video.srcObject = stream;

const canvas = document.getElementById("canvas"); //canvas for the green dots, just for testing
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score");

const loseScreen = document.getElementById("lose-screen");
const yourFace = document.getElementById("your-face");
const restartBtn = document.getElementById("restart-btn");

const munch = new Audio("public/assets/munch.mp3");
const miau = new Audio("public/assets/miau.mp3");

//https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker/web_js
const vision = await FilesetResolver.forVisionTasks(
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
);

const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath:
      "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
  },
  runningMode: "VIDEO",
  outputFaceBlendshapes: true,
});

//nom nom game stuff
let score = 0;
let lastTime = 0;
let blendshapes = null;
let landmarks = null;
let guideBoxCentered = false;
let playing = true;

function handleChomp(orph, goodness) {
    if (goodness) {
        score ++;
        scoreText.innerText = score;
        munch.currentTime = 0;
        munch.play();
    }
    else {
        console.log("baddddd");
        miau.currentTime = 0;
        miau.play();
        handleLoss();
    }
    console.log("score + ", score);
}

function handleLoss() {
    console.log("you losttt");
    const snapshot = addSnapshot(video);
    playing = false;
    yourFace.src = snapshot;
    loseScreen.classList.remove("hidden");
}

restartBtn.addEventListener("click", () => {
    restart();
})

function restart() {
    score = 0;
    scoreText.innerText = score;
    lastTime = 0;
    blendshapes = null;
    landmarks = null;
    guideBoxCentered = false;
    restartOrphs();
    restartPlayer();
    loseScreen.classList.add("hidden");
    playing = true;
}

function update(deltaTime) {
    updatePlayer(deltaTime, blendshapes, landmarks, canvas.width, canvas.height);
    updateOrphs(deltaTime, canvas.width, handleChomp);
}

function draw() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawOrphs(ctx);
    drawBox(ctx, canvas.width, canvas.height);
}

function gameLoop(timestamp) {
    if (!playing) {
        lastTime = timestamp;
        requestAnimationFrame(gameLoop);
        return;
    }

    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    const result = faceLandmarker.detectForVideo(video, performance.now());

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (!guideBoxCentered && canvas.width > 0) {
        centerGuideBox(canvas.width, canvas.height);
        guideBoxCentered = true;
    }

    if(result.faceLandmarks.length > 0){
        landmarks = result.faceLandmarks[0];
        blendshapes = result.faceBlendshapes[0].categories;
    } else { 
        landmarks = null;
        blendshapes = null;
    }

    update(deltaTime);
    draw();

    requestAnimationFrame(gameLoop);
}

if (video.readyState >= 2) {
    requestAnimationFrame(gameLoop);
} else {
    video.addEventListener("loadeddata", () => requestAnimationFrame(gameLoop));
}

