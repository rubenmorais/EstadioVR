// Iniciar quando a cena estiver pronta
document.querySelector('a-scene').addEventListener('loaded', () => {
  createWalls(); 
  setupTeleportButtons();
  updateLoop();  
});
function toggleControls() {
  const panel = document.getElementById('controls-help');
  panel.classList.toggle('show');
}