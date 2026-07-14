export const guideBox = {
    width: 70,
    height: 150,
};

export function centerGuideBox(canvasWidth, canvasHeight) {
    guideBox.x = canvasWidth/2 - guideBox.width/2;
    guideBox.y = canvasHeight/2 - guideBox.height/2;
}

export const player = {
    isChomping: false,
    mouthX: 0,
    mouthY: 0,
    inBounds: false,
};

export function updatePlayer(deltaTime, blendshapes, landmarks, canvasWidth, canvasHeight) {
    if (!blendshapes || !landmarks) return;

    const jawOpen = blendshapes.find(c => c.categoryName === "jawOpen");
    player.isChomping = jawOpen && jawOpen.score > 0.5;

    const mouth = landmarks[13] //approx mouth position
    player.mouthX = mouth.x * canvasWidth;
    player.mouthY = mouth.y * canvasHeight;

    player.inBounds = 
        player.mouthX >= guideBox.x &&
        player.mouthX <= guideBox.x + guideBox.width &&
        player.mouthY >= guideBox.y &&
        player.mouthY <= guideBox.y + guideBox.height;
}

export function drawBox(ctx, canvasWidth, canvasHeight) {
    ctx.strokeStyle = player.inBounds ? "lime" : "red";
    ctx.lineWidth = 3;
    ctx.strokeRect(canvasWidth/2 - guideBox.width/2, canvasHeight/2 - guideBox.height/2, guideBox.width, guideBox.height);
}