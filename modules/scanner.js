import { addScan, getState } from "./state.js";
import { showModal } from "./modal.js";

let html5Qrcode;
let cameraId;
let config;

export function initScanner(readerId, scannerConfig) {
  config = scannerConfig;
  html5Qrcode = new Html5Qrcode(readerId, config);

  Html5Qrcode.getCameras().then((cameras) => {
    const backCamera =
      cameras.find((c) => /back|rear|environment/i.test(c.label)) || cameras[0];

    cameraId = backCamera.id;

    document.getElementById("camera-in-use").textContent =
      `Camera: ${backCamera.label || "default"}`;

    startScanner();
  });
}

export function startScanner() {
  html5Qrcode.start({ deviceId: cameraId }, config, onScanSuccess, onScanError);
}

export function stopScanner() {
  return html5Qrcode.stop();
}

function onScanSuccess(text, result) {
  console.log("onScanSuccess - start");

  if (result.result.format.formatName !== "DATA_MATRIX") return;

  const added = addScan(result.decodedText, result);
  if (!added) return;

  updateUI();
  stopScanner().then(showModal);
}

function onScanError(err) {
  console.warn("SCAN ERROR:", err);
}

function updateUI() {
  const { scannedSet, scannedIndex, count } = getState();

  document.getElementById("count_id").textContent = `Count: ${count}`;
  document.getElementById("set-size").textContent =
    `Set size: ${scannedSet.size}`;
  document.getElementById("set-info").textContent =
    `Set info:\n${[...scannedIndex.keys()].join("\n")}`;
}
