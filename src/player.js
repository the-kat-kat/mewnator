export const guideBox = {
    width: 200,
    height: 150,
};

export const player = {
    isChomping: false,
    mouthX: 0, //remember to set restrictions on the posiition later
    mouuthY: 0,
    inBounds: false,
};

export function updatePlayer(deltaTime, blendshapes, landmarks, canvasWidth, canvasHeight) {
    if (!blendshapes || !landmarks) return;

    const jawOpen = blendshapes.find(c => c.categoryName === "jawOpen");
    player.isChomping = jawOpen && jawOpen.score > 0.5;

    const mouth = landmarks[13] //approx mouth position
    player.mouthX = mouth.x * canvas.width;
    player.mouthY = mouth.y * canvas.height;

    player.inBounds = 
        player.mouthX >= canvasWidth/2 - guideBox.width/2
        player.mouthX <= canvasWidth/2 + guideBox.width/2
        player.mouthY >= canvasHeight/2 - guideBox.height/2
        player.mouthY <= canvasHeight/2 + guideBox.height/2
}

export function drawBox(ctx) {
    ctx.strokeStyle = player.inBounds ? "lime" : "red";
    ctx.lineWidth = 3;
    ctx.strokeRect(canvasWidth/2, canvasHeight/2, guideBox.width, guideBox.height);
}