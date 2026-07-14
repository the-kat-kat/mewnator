import { guideBox, player } from "./player.js";

export let orphs = [];

const SPAWN_INTERVAL = 1500; //ms
let timeSinceLastSpawn = 0;

const orphImage = new Image();
let imageLoaded = false;

orphImage.src = "assets/dino.png";
orphImage.onload = () => {
  imageLoaded = true;
};

function isColliding(boxA, boxB) {
  return boxA.x < boxB.x + boxB.width && boxA.x + boxA.width < boxB.x;
}

export function updateOrphs(deltaTime, canvasWidth) {
  if (!imageLoaded) return;

  timeSinceLastSpawn += deltaTime;
  if (timeSinceLastSpawn > SPAWN_INTERVAL) {
    spawnOrph(canvasWidth);
    timeSinceLastSpawn = 0;
    SPAWN_INTERVAL -= Math.random() * 25;
  }

  const speed = 0.2; // pixels per ms

  for (const orph of orphs) {
    orph.x -= (speed + Math.random() * 0.2) * deltaTime;
  }

  orphs = orphs.filter((orph) => {
    if (isColliding(guideBox, orph) && player.isChomping) {
      handleChomp(orph);
      return false;
    }

    if (orph.x + orph.width > 0) return false;

    return true;
  });

  function spawnOrph(canvasWidth) {
    const width = 30;
    orphs.push({
      x: canvasWidth + width,
      y: guideBox.y + guideBox.height / 2,
      width: width,
      height: width * aspectRatio,
    });
  }

  export function drawOrphs(ctx) {
    for (const orph of orphs) {
      ctx.drawImage(orphImage, orph.x, orph.y, orph.width, orph.height);
    }
  }
}
