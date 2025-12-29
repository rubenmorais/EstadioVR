// Iniciar quando a cena estiver pronta
document.querySelector('a-scene').addEventListener('loaded', () => {
  createWalls(); 
  setupTeleportButtons();
  updateLoop();  
});