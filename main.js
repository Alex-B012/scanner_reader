const scannedSet = new Set();
const scannedIndex = new Map();
let count = 0;

const config = {
  fps: 20,
  qrbox: { width: 320, height: 240 },
  aspectRatio: window.innerHeight / window.innerWidth,
  rememberLastUsedCamera: true,
  formatsToSupport: [Html5QrcodeSupportedFormats.DATA_MATRIX],
};

const html5Qrcode = new Html5Qrcode("reader", config);

function onScanSuccess(text, result) {
  count++;
  console.log("Count:", count);
  console.log("Scanned Text:", text);
  console.log("Scanned Obj:", result);

  console.log("Data type:", result.result.format.formatName);

  if (result.result.format.formatName !== "DATA_MATRIX") return;

  const key = result.decodedText;

  if (scannedIndex.has(key)) {
    console.log("Дубликат, не добавляем:", result);
    return;
  }

  scannedSet.add(result);
  scannedIndex.set(key, result);

  document.getElementById("count_id").textContent = `Count: ${count}`;
  document.getElementById("set-size").textContent =
    `Set size: ${scannedSet.size}`;
  document.getElementById("set-info").textContent =
    `Set info:\n ${[...scannedIndex.keys()].join("\n")}`;

  console.log("Всего уникальных:", scannedSet.size);
  console.log("Set:", scannedSet);
}

function onScanError(err) {
  console.warn("ERROR:", err);
}

Html5Qrcode.getCameras().then((cameras) => {
  if (!cameras.length) {
    console.error("No cameras found");
    return;
  }

  let backCamera =
    cameras.find((camera) => /back|rear|environment/i.test(camera.label)) ||
    cameras.find((camera) => /wide|ultra|tele/i.test(camera.label));

  const cameraId = backCamera ? backCamera.id : cameras[0].id;

  console.log("Using camera:", backCamera?.label || "default");

  document.getElementById("camera-in-use").textContent =
    `Camera: ${backCamera?.label || "default"}`;

  html5Qrcode.start({ deviceId: cameraId }, config, onScanSuccess, onScanError);
});

document.getElementById("ratio-size").textContent =
  `Ratio: ${config.aspectRatio}`;
