import {updateOrphs, drawOrphs} from "./orphs.js";
import {player, updatePlayer, drawBox, centerGuideBox} from "./player.js";

const { FaceLandmarker, FilesetResolver} =
  await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest");

const video = document.getElementById("video");
const stream = await navigator.mediaDevices.getUserMedia({ video: true });
video.srcObject = stream;

const canvas = document.getElementById("canvas"); //canvas for the green dots, just for testing
const ctx = canvas.getContext("2d");

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

function handleChomp(orph) {
    score ++;
    console.log("score + ", score);
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

