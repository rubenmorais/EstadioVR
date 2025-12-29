let isRunning = false;

document.addEventListener('keydown', (e) => {
  if (e.shiftKey && !isRunning) {
    isRunning = true;
    const camera = document.querySelector('#camera');
    camera.setAttribute('wasd-controls', 'acceleration: 80');
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'Shift' && isRunning) {
    isRunning = false;
    const camera = document.querySelector('#camera');
    camera.setAttribute('wasd-controls', 'acceleration: 30');
  }
});