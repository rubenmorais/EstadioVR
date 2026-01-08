// Limites gerais da área (para não sair do mapa)
const AREA_LIMIT = {
  minX: -100,
  maxX: 100,
  minZ: -100,
  maxZ: 100,
  minY: 0,
  maxY: 45
};

let previousPos = { x: 0, y: 2.6, z: 60 }; // Posição inicial

// Função de colisão para paredes 
function checkWallCollision(x, y, z) {
    for (let wall of orientedWalls) {
        // Verificar altura
        if (y < wall.minY || y > wall.maxY) continue;
        
        // Vetor do centro da parede até o ponto
        const toPointX = x - wall.centerX;
        const toPointZ = z - wall.centerZ;
        
        // Projeção no vetor direção (comprimento da parede)
        const projLength = toPointX * wall.dirX + toPointZ * wall.dirZ;
        
        // Projeção no vetor normal (espessura da parede)
        const projThickness = toPointX * wall.normalX + toPointZ * wall.normalZ;
        
        // Verificar se está dentro da parede
        const halfLength = wall.length / 2;
        const halfThickness = wall.thickness / 2;
        
        if (Math.abs(projLength) <= halfLength && Math.abs(projThickness) <= halfThickness) {
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
  
  const MAX_STEP = 0.20;

  const dx = newX - previousPos.x;
  const dz = newZ - previousPos.z;

  const dist = Math.sqrt(dx * dx + dz * dz);

  if (dist > MAX_STEP) {
    const ratio = MAX_STEP / dist;
    newX = previousPos.x + dx * ratio;
    newZ = previousPos.z + dz * ratio;
  }

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

