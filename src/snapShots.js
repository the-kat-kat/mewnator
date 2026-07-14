const size = 200;

export let snapshots = [];

function captureSnapshot(video) {
    const snapCanvas = document.createElement("canvas");
    snapCanvas.width = size;
    snapCanvas.height = size;

    const snapCtx = snapCanvas.getContext("2d");
    snapCtx.drawImage(video, video.videoWidth/2 - size/2, video.videoHeight/2 - size/2, size, size, 
        0, 0, size, size);

    return snapCanvas.toDataURL("image/png");
}

export function addSnapshot(video) {
    const dataUrl = captureSnapshot(video);
    const img = new Image();
    img.src = dataUrl; 
    snapshots.push(img);
    console.log("added snapshot weee", snapshots);

    return dataUrl;
}