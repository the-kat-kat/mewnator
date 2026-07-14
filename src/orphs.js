import { guideBox, player } from "./player.js";
import { snapshots } from "./snapshots.js";

export let orphs = [];
export let evilOrphs = [];

let spawnInterval = 800; //ms
let timeSinceLastSpawn = 0;

const orphImage = new Image();
const evilOrphImage = new Image();
let imageLoaded = false;

orphImage.src = "public/assets/dino.png";
evilOrphImage.src = "public/assets/evil-dino.png";
orphImage.onload = () => {
  imageLoaded = true;
};

export function restartOrphs() {
  orphs = [];
  evilOrphs = [];
  spawnInterval = 1000;
  timeSinceLastSpawn = 0;
}

function isColliding(boxA, boxB) {
  //boxA on the left
  return boxA.x < boxB.x + boxB.width && boxA.x + boxA.width > boxB.x;
}

export function updateOrphs(deltaTime, canvasWidth, onChomp) {
  if (!imageLoaded) return;


  const speed = 0.3; // pixels per ms

  timeSinceLastSpawn += deltaTime;
  if (timeSinceLastSpawn > spawnInterval) {
    spawnOrph(canvasWidth);
    timeSinceLastSpawn = 0;
    spawnInterval -= Math.random() * 25;
    speed += Math.random() * 0.02;
  }

  for (const orph of orphs) {
    orph.x -= (speed + Math.random() * 0.2) * deltaTime;
  }

  for (const evilOrph of evilOrphs) {
    evilOrph.x -= (speed + Math.random() * 0.2) * deltaTime;
  }

  orphs = orphs.filter((orph) => {
    if (isColliding(guideBox, orph) && player.isChomping) {
      onChomp(orph, true);
      return false;
    }

    if (orph.x + orph.width < 0) return false;

    return true;
  });

  evilOrphs = evilOrphs.filter((evilOrph) => {
    if (isColliding(guideBox, evilOrph) && player.isChomping) {
      onChomp(evilOrph, false);
      return false;
    }

    if (evilOrph.x + evilOrph.width < 0) return false;

    return true;
  });
}

function spawnOrph(canvasWidth) {
  const evil = Math.random() > 0.5;
  const width = 30;
  const face = snapshots.length > 0 ? snapshots[Math.floor(snapshots.length * Math.random())] : null;

  if (!evil) {
    orphs.push({
      x: canvasWidth + width,
      y: guideBox.y + guideBox.height / 2,
      width: width,
      height: (width * orphImage.height) / orphImage.width,
      face: face,
    });
  } else {
    evilOrphs.push({
      x: canvasWidth + width,
      y: guideBox.y + guideBox.height / 2,
      width: width,
      height: (width * orphImage.height) / orphImage.width,
      face: face,
    });
  }
}

export function drawOrphs(ctx) {
  const faceWidth = 30 * 0.8;
  for (const orph of orphs) {
    ctx.drawImage(orphImage, orph.x, orph.y, orph.width, orph.height);
    if (orph.face) {
      ctx.drawImage(
        orph.face,
        orph.x - faceWidth / 4,
        orph.y - faceWidth / 2,
        faceWidth,
        faceWidth,
      );
    }
  }
  for (const evilOrph of evilOrphs) {
    ctx.drawImage(
      evilOrphImage,
      evilOrph.x,
      evilOrph.y,
      evilOrph.width,
      evilOrph.height,
    );
    if (evilOrph.face) {
      ctx.drawImage(
        evilOrph.face,
        evilOrph.x - faceWidth / 4,
        evilOrph.y - faceWidth / 2,
        faceWidth,
        faceWidth,
      );
    }
  }
}
