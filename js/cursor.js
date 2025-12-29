// Variáveis para barra de progresso do cursor
let fusingStartTime = null;
let isFusing = false;
const FUSE_DURATION = 2000; 

// Iniciar progresso do cursor
function startCursorProgress() {
  isFusing = true;
  fusingStartTime = Date.now();
}

// Parar progresso do cursor
function stopCursorProgress() {
  isFusing = false;
  fusingStartTime = null;
  resetCursorProgress();
}

// Resetar progresso do cursor
function resetCursorProgress() {
  isFusing = false;
  const cursorProgress = document.querySelector('#cursor-progress');
  if (cursorProgress) {
    cursorProgress.setAttribute('theta-length', '0');
  }
}

// Atualizar barra de progresso do cursor
function updateProgressBar() {
  if (!isFusing || !fusingStartTime) return;
  
  const elapsed = Date.now() - fusingStartTime;
  const progress = Math.min(elapsed / FUSE_DURATION, 1);
  const cursorProgress = document.querySelector('#cursor-progress');
  
  if (cursorProgress) {
    const thetaLength = progress * 360;
    cursorProgress.setAttribute('theta-length', thetaLength);
  }
}