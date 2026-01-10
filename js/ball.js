// Configurações
const GROUND_Y = 7.2;
const KICK_DISTANCE = 1.8; 
const KICK_FORCE = 4;
const GRAVITY = -9.8;
const FRICTION = 0.85;
const RESTITUTION = 0.6; 
const BALL_RADIUS = 0.11;
const BALL_START_POS = { x: 0, y: GROUND_Y + BALL_RADIUS, z: 0 };

// Estado da bola
let ballVelocity = { x: 0, y: 0, z: 0 };
let ballAngularVelocity = { x: 0, y: 0, z: 0 };
let canKick = true;
let lastTime = null;

const kickSound = document.querySelector('#kick-sound');
kickSound.volume = 0.6;
const goalSound = document.querySelector('#goal-sound');
goalSound.volume = 0.9;
let goalInProgress = false;

function playGoalSound() {
  goalSound.currentTime = 0;
  goalSound.play();
}


// Inicializar quando tudo carregar
window.addEventListener('load', () => {
  setTimeout(() => {
    const ball = document.querySelector('#ball');
    const camera = document.querySelector('#camera');
    const footPoint = document.createElement('a-entity');
    footPoint.setAttribute('id', 'foot-point');
    footPoint.setAttribute('position', '0 0 -0.4');
    camera.appendChild(footPoint);

    
    if (!ball || !camera) {
      console.error('Bola ou câmera não encontrada');
      return;
    }

    // Colocar a bola no chão
    ball.object3D.position.y = GROUND_Y + BALL_RADIUS;

    // Iniciar loop de física
    updateBallPhysics();

    // Sistema de chute com espaço
    document.addEventListener('keydown', (e) => {
      if (e.code !== 'Space') return;
      if (!canKick) return;

      kickBall(ball, camera);
    });

  }, 1000);
});

// Função para chutar a bola
function kickBall(ball, camera) {
  const ballPos = ball.object3D.position;
  const foot = document.querySelector('#foot-point');
  const footPos = new THREE.Vector3();
  foot.object3D.getWorldPosition(footPos);

  const dx = ballPos.x - footPos.x;
  const dz = ballPos.z - footPos.z;

  const distance = Math.sqrt(dx * dx + dz * dz);

  // Debug: mostrar distância
  console.log(`Distância até a bola: ${distance.toFixed(2)}m (máx: ${KICK_DISTANCE}m)`);

  // Só chuta se estiver perto
  if (distance > KICK_DISTANCE) {
    showKickMessage('Bola muito longe! Aproxime-se mais.');
    return;
  }

  // Direção do chute (direção da câmera)
  const direction = new THREE.Vector3();
  camera.object3D.getWorldDirection(direction);
  direction.normalize();

  // Aplicar velocidade
  ballVelocity.x = -direction.x * KICK_FORCE;
  ballVelocity.y = 2 + Math.random() * 5; 
  ballVelocity.z = -direction.z * KICK_FORCE;

  // Rotação da bola
  ballAngularVelocity.x = -direction.z * 15;
  ballAngularVelocity.z = direction.x * 15;

  kickSound.currentTime = 0;
  kickSound.play();

  // Cooldown
  canKick = false;
  setTimeout(() => {
    canKick = true;
  }, 500);
}

// Loop de física
function updateBallPhysics() {
  if (lastTime === null) {
    lastTime = Date.now();
    requestAnimationFrame(updateBallPhysics);
    return;
  }

  const ball = document.querySelector('#ball');
  if (!ball) {
    requestAnimationFrame(updateBallPhysics);
    return;
  }

  const now = Date.now();
  const dt = Math.min((now - lastTime) / 1000, 0.05); 
  lastTime = now;

  const pos = ball.object3D.position;

  // Aplicar gravidade
  ballVelocity.y += GRAVITY * dt;

  // Atualizar posição
  pos.x += ballVelocity.x * dt;
  pos.y += ballVelocity.y * dt;
  pos.z += ballVelocity.z * dt;

  // Colisão com o chão
  if (pos.y <= GROUND_Y + BALL_RADIUS) {
    pos.y = GROUND_Y + BALL_RADIUS;
    
    if (Math.abs(ballVelocity.y) > 0.5) {
      ballVelocity.y = -ballVelocity.y * RESTITUTION;
    } else {
      ballVelocity.y = 0;
    }

    // Atrito horizontal quando no chão
    ballVelocity.x *= FRICTION;
    ballVelocity.z *= FRICTION;
  }

  // Colisão com paredes
  checkWallCollisions(pos, ballVelocity);

  // Aplicar rotação
  ball.object3D.rotation.x += ballAngularVelocity.x * dt;
  ball.object3D.rotation.z += ballAngularVelocity.z * dt;

  // Diminuir rotação
  ballAngularVelocity.x *= 0.98;
  ballAngularVelocity.z *= 0.98;

  // Parar completamente se velocidade muito baixa
  if (Math.abs(ballVelocity.x) < 0.01) ballVelocity.x = 0;
  if (Math.abs(ballVelocity.z) < 0.01) ballVelocity.z = 0;

  requestAnimationFrame(updateBallPhysics);
}

// Verificar colisões com paredes
function checkWallCollisions(pos, velocity) {
  if (typeof orientedWalls === 'undefined') return;

  orientedWalls.forEach(wall => {
    // Calcular distância até a parede
    const dx = pos.x - wall.centerX;
    const dz = pos.z - wall.centerZ;

    // Distância ao longo da normal da parede
    const distanceToWall = dx * wall.normalX + dz * wall.normalZ;

    // Verificar se está dentro da altura da parede
    if (pos.y < wall.minY || pos.y > wall.maxY) return;

    // Projeção na direção da parede
    const alongWall = dx * wall.dirX + dz * wall.dirZ;
    const halfLength = wall.length / 2;

    // Verificar se está dentro do comprimento da parede
    if (Math.abs(alongWall) > halfLength + BALL_RADIUS) return;

    // Verificar colisão
    const collisionDistance = wall.thickness / 2 + BALL_RADIUS;
    
    if (Math.abs(distanceToWall) < collisionDistance) {
      // Verificar se é uma parede preta
      if (wall.color === '#000000') {
        triggerGoal();
        return;
      }

      // Corrigir posição (limitando a correção para evitar saltos grandes)
      const correction = Math.min(collisionDistance - Math.abs(distanceToWall), 0.3);
      const sign = distanceToWall > 0 ? 1 : -1;
      
      pos.x += wall.normalX * correction * sign;
      pos.z += wall.normalZ * correction * sign;

      // Refletir velocidade
      const velocityAlongNormal = velocity.x * wall.normalX + velocity.z * wall.normalZ;
      
      if (velocityAlongNormal * sign < 0) {
        velocity.x -= 2 * velocityAlongNormal * wall.normalX * RESTITUTION;
        velocity.z -= 2 * velocityAlongNormal * wall.normalZ * RESTITUTION;
        
      }
    }
  });
}


// Função para marcar golo
function triggerGoal() {
  if (goalInProgress) return;
  goalInProgress = true;

  playGoalSound();
  showGoalMessage();

  setTimeout(() => {
    resetBall();
    goalInProgress = false;
  }, 3000);
}


// Mostrar mensagem de golo
function showGoalMessage() {
  // Criar elemento se não existir
  let goalMessage = document.getElementById('goal-message');
  
  if (!goalMessage) {
    goalMessage = document.createElement('div');
    goalMessage.id = 'goal-message';
    goalMessage.innerHTML = `
      <div class="goal-content">
        <h1>⚽ GOLOOOOO! ⚽</h1>
        <p>Que golaço!</p>
      </div>
    `;
    document.body.appendChild(goalMessage);
  }

  // Mostrar com animação
  goalMessage.classList.add('show');

  // Esconder após 3 segundos
  setTimeout(() => {
    goalMessage.classList.remove('show');
  }, 3000);
}

// Mostrar mensagem de feedback 
function showKickMessage(text) {
  let kickMessage = document.getElementById('kick-message');
  
  if (!kickMessage) {
    kickMessage = document.createElement('div');
    kickMessage.id = 'kick-message';
    document.body.appendChild(kickMessage);
  }

  kickMessage.textContent = text;
  kickMessage.classList.add('show');

  // Remover mensagem anterior se existir
  clearTimeout(kickMessage.hideTimeout);
  
  // Esconder após 1.5 segundos
  kickMessage.hideTimeout = setTimeout(() => {
    kickMessage.classList.remove('show');
  }, 1500);
}

// Função para resetar a bola
function resetBall() {
  const ball = document.querySelector('#ball');
  if (!ball) return;

  ball.object3D.position.set(0, GROUND_Y + BALL_RADIUS, 0.2);
  ballVelocity = { x: 0, y: 0, z: 0 };
  ballAngularVelocity = { x: 0, y: 0, z: 0 };

}
