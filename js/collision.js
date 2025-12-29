// Limites gerais da área (para não sair do mapa)
const AREA_LIMIT = {
  minX: -100,
  maxX: 100,
  minZ: -100,
  maxZ: 100,
  minY: 0,
  maxY: 30
};

let previousPos = { x: 0, y: 2.6, z: 45 }; // Posição inicial

// Função para verificar colisão com uma parede
function checkWallCollision(x, y, z) {
  for (let wall of WALLS) {
    if (x >= wall.minX && x <= wall.maxX &&
        z >= wall.minZ && z <= wall.maxZ &&
        y >= wall.minY && y <= wall.maxY) {
      return true; 
    }
  }
  return false;
}

// Loop de atualização - verifica colisões constantemente
function updateLoop() {
  const camera = document.querySelector('#camera');
  const rig = document.querySelector('#rig');
  const posDiv = document.getElementById('posicao');
  
  if (!camera || !rig) {
    requestAnimationFrame(updateLoop);
    return;
  }

  // Atualizar barra de progresso
  updateProgressBar();
  
  // Obter posição da câmera 
  const camPos = camera.object3D.position;
  const rigPos = rig.object3D.position;

  // Calcular posição real 
  const worldX = rigPos.x + camPos.x;
  const worldY = rigPos.y + camPos.y;
  const worldZ = rigPos.z + camPos.z;

  let newX = worldX;
  let newZ = worldZ;
  let newY = worldY;

  // Testar colisão por eixo separadamente 
  const collidesAtNewPos = checkWallCollision(newX, newY, newZ);
  
  if (collidesAtNewPos) {
    // Testar X separadamente - se apenas X colidir, bloquear só X
    const collidesWithNewX = checkWallCollision(newX, newY, previousPos.z);
    if (collidesWithNewX) {
      newX = previousPos.x; // Bloquear movimento em X
    }
    
    // Testar Z separadamente - se apenas Z colidir, bloquear só Z
    const collidesWithNewZ = checkWallCollision(previousPos.x, newY, newZ);
    if (collidesWithNewZ) {
      newZ = previousPos.z; // Bloquear movimento em Z
    }
    
    // Testar Y separadamente
    const collidesWithNewY = checkWallCollision(previousPos.x, newY, previousPos.z);
    if (collidesWithNewY) {
      newY = previousPos.y; // Bloquear movimento em Y
    }
  }

  // Aplicar limites gerais da área
  if (newX < AREA_LIMIT.minX) newX = AREA_LIMIT.minX;
  if (newX > AREA_LIMIT.maxX) newX = AREA_LIMIT.maxX;
  if (newZ < AREA_LIMIT.minZ) newZ = AREA_LIMIT.minZ;
  if (newZ > AREA_LIMIT.maxZ) newZ = AREA_LIMIT.maxZ;
  if (newY < AREA_LIMIT.minY + 1.6) newY = AREA_LIMIT.minY + 1.6;
  if (newY > AREA_LIMIT.maxY) newY = AREA_LIMIT.maxY;

  // Atualizar posição anterior (posição válida)
  previousPos = { x: newX, y: newY, z: newZ };

  // Aplicar correção ao rig
  if (newX !== worldX || newZ !== worldZ || newY !== worldY) {
    rig.object3D.position.set(newX - camPos.x, newY - camPos.y, newZ - camPos.z);
  }

  // Atualizar display de posição
  posDiv.innerText = `x: ${worldX.toFixed(2)}, y: ${worldY.toFixed(2)}, z: ${worldZ.toFixed(2)}`;

  requestAnimationFrame(updateLoop);
}

