const size = 200;

export let snapshots = [];

export function restartSnapshots() {
    snapshots = [];
}

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
    snapshots.push(dataUrl);

    return dataUrl;
}