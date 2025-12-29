// Sistema de teleporte
function setupTeleportButtons() {
  const clickableSphere = document.querySelector('.clickable');
  const visualSphere = document.querySelector('#visual-sphere');
  const rig = document.querySelector('#rig');
  
  // Evento CLICK (ativado após fuse de 2 segundos)
  clickableSphere.addEventListener('click', function() {
    const destX = 0;
    const destY = 4;
    const destZ = 0;

    rig.object3D.position.set(destX, destY, destZ);

    const cameraEntity = document.querySelector('#camera');
    cameraEntity.object3D.position.set(0, 1.6, 0); 

    // Atualizar posição anterior para o seu sistema de colisão
    previousPos = { x: destX, y: destY, z: destZ };

    // Reset ao progresso do cursor
    resetCursorProgress();
  });
  
  // Efeito quando começa a olhar (mouseenter)
  clickableSphere.addEventListener('mouseenter', function() {
    startCursorProgress();
    
    if (visualSphere) {
      visualSphere.setAttribute('color', '#66FF66');
    }
  });
  
  // Efeito quando para de olhar (mouseleave)
  clickableSphere.addEventListener('mouseleave', function() {
    stopCursorProgress();
    
    if (visualSphere) {
      visualSphere.setAttribute('color', '#4CAF50');
      visualSphere.setAttribute('scale', '1 1 1');
    }
  });
}
