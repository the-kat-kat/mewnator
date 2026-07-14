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

function predictWebcam() {
  const result = faceLandmarker.detectForVideo(video, performance.now());
  console.log(result.faceLandmarks.length);
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (result.faceLandmarks.length > 0) {
    for (const point of result.faceLandmarks[0]) {
      ctx.beginPath();
      ctx.arc(
        point.x * canvas.width,
        point.y * canvas.height,
        1.5,
        0,
        2 * Math.PI,
      );
      ctx.fillStyle = "rgba(21, 255, 0, 0.2)";
      ctx.fill();
    }

    const categories = result.faceBlendshapes[0].categories;
    const jawOpen = categories.find((c) => c.categoryName === "jawOpen");

    if (jawOpen && jawOpen.score > 0.5) {
      console.log("jaw  open");
    }
  }
  requestAnimationFrame(predictWebcam); //call predictWebcam right before next frame
}

if (video.readyState >= 2) {
  predictWebcam();
} else {
  video.addEventListener("loadeddata", predictWebcam);
}

//nom nom game stuff

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    update(deltaTime);
    draw();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

