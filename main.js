import { initScanner, startScanner } from "./modules/scanner.js";
import { hideModal, showSentModal, hideSentModal } from "./modules/modal.js";
import { resetState, scannedSet } from "./modules/state.js";

const TIMEOUT = 3000;

const config = {
  fps: 20,
  qrbox: { width: 320, height: 240 },
  aspectRatio: window.innerHeight / window.innerWidth,
  rememberLastUsedCamera: true,
  formatsToSupport: [Html5QrcodeSupportedFormats.DATA_MATRIX],
};

initScanner("reader", config);

window.onload = () => {
  document.getElementById("ratio-size").textContent =
    `Ratio: ${config.aspectRatio}`;
};

document.getElementById("rescan-btn").addEventListener("click", () => {
  hideModal();
  resetState();
  startScanner();
});

document.getElementById("send-btn").addEventListener("click", () => {
  console.log(`Отправка... `, scannedSet);
  showSentModal();
  hideModal();
  resetState();
  setTimeout(hideSentModal, TIMEOUT);
  setTimeout(startScanner, TIMEOUT);
});
