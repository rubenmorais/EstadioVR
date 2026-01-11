// Configuração dos waypoints do tour
const tourWaypoints = [
  {
    name: "Entrada do Estádio",
    position: { x: -9, y: 1, z: 57 },
    rotation: { y: 180 },
    description: "Bem-vindo ao Estádio Virtual! Vamos começar a nossa visita guiada.",
    duration: 4000,
    allowMovement: true
  },
  {
    name: "Relvado",
    position: { x: 0, y: 6.5, z: 4 },
    rotation: { y: 0 },
    description: "O coração do estádio - aqui decorrem as principais ações da partida.",
    duration: 6000,
    poiId: "poi-relvado",
    allowMovement: true
  },
  {
    name: "Placar Principal",
    position: { x: 5, y: 11, z: -20 },
    rotation: { y: 0 },
    duration: 6000,
    poiId: "poi-placar",
    allowMovement: false
  },
  {
    name: "Bancada Central",
    position: { x: -15, y: 11, z: 5 },
    duration: 6000,
    poiId: "poi-bancada",
    rotation: { y: 90 },
    allowMovement: false
  },
  {
    name: "Zona dos Cânticos",
    position: { x: 14, y: 10, z: -13 },
    rotation: { y: -45 },
    duration: 6000,
    poiId: "poi-cantico",
    playAudio: true,
    allowMovement: false
  },
  {
    name: "Sala de Imprensa - Auditório",
    position: { x: 84.58, y: 1, z: -87 },
    rotation: { y: 0 },
    description: "Este é o auditório onde os jornalistas fazem as suas perguntas.",
    duration: 7000,
    teleportToAuditorium: true,
    allowMovement: true
  },
  {
    name: "Fim da Visita",
    position: { x: 0, y: 1, z: 55 },
    rotation: { y: 180 },
    description: "Obrigado por visitar o nosso estádio! Explore livremente ou inicie outro tour.",
    duration: 5000,
    isEnd: true,
    allowMovement: true
  }
];

// Estado do tour
let tourState = {
  active: false,
  currentIndex: 0,
  isPaused: false,
  autoAdvance: true,
  guideEntity: null
};

let advanceTimeout = null;
let wasdControlsEnabled = true;

function initGuidedTour() {
  createTourButton();
  createTourUI();

}

function createTourButton() {
  // Criar botão na entrada
  const tourButtonEntity = document.createElement('a-entity');
  tourButtonEntity.id = 'tour-start-button';
  tourButtonEntity.setAttribute('position', '-10 2.8 50');
  
  // Box invisível clicável
  const clickBox = document.createElement('a-box');
  clickBox.classList.add('clickable');
  clickBox.setAttribute('width', '1');
  clickBox.setAttribute('height', '2');
  clickBox.setAttribute('depth', '0.5');
  clickBox.setAttribute('position', '0 -0.5 0');
  clickBox.setAttribute('material', 'opacity: 0; transparent: true');
  
  // Modelo do guia
  const guide = document.createElement('a-entity');
  guide.setAttribute('gltf-model', '#human');
  guide.setAttribute('position', '0 0.4 0');
  guide.setAttribute('rotation', '0 30 0');
  guide.setAttribute('scale', '10 10 10');
  
  // Fundo do texto
  const textBg = document.createElement('a-plane');
  textBg.setAttribute('width', '5');
  textBg.setAttribute('height', '1.4');
  textBg.setAttribute('position', '0 1.5 -0.05');
  textBg.setAttribute('rotation', '0 20 0');
  textBg.setAttribute('material', 'color: #000000; opacity: 0.55; transparent: true');
  
  // Texto principal
  const mainText = document.createElement('a-entity');
  mainText.setAttribute('troika-text', `
    value: Visita Guiada;
    fontSize: 0.6;
    align: center;
    color: #FFFFFF;
  `);
  mainText.setAttribute('position', '0 1.7 0');
  mainText.setAttribute('rotation', '0 20 0');
  
  // Texto secundário
  const subText = document.createElement('a-entity');
  subText.setAttribute('troika-text', `
    value: Tour completo pelo estádio;
    fontSize: 0.32;
    align: center;
    color: #DDDDDD;
  `);
  subText.setAttribute('position', '0 1.1 0');
  subText.setAttribute('rotation', '0 20 0');
  
  // Montar estrutura
  tourButtonEntity.appendChild(clickBox);
  tourButtonEntity.appendChild(guide);
  tourButtonEntity.appendChild(textBg);
  tourButtonEntity.appendChild(mainText);
  tourButtonEntity.appendChild(subText);
  
  // Adicionar evento de click
  clickBox.addEventListener('click', startTour);
  clickBox.addEventListener('mouseenter', startCursorProgress);
  clickBox.addEventListener('mouseleave', stopCursorProgress);
  
  // Adicionar à cena
  const scene = document.querySelector('a-scene');
  scene.appendChild(tourButtonEntity);
}

function createTourUI() {
  const tourUI = document.createElement('div');
  tourUI.id = 'tour-ui';
  tourUI.innerHTML = `
    <div class="tour-header">
      <div class="tour-progress">
        <span id="tour-step">0</span> / <span id="tour-total">${tourWaypoints.length}</span>
      </div>
      <div class="tour-title" id="tour-location">Visita Guiada</div>
    </div>
    
    <div class="tour-description" id="tour-description">
      Clique em "Iniciar" para começar o tour
    </div>
    
    <div class="tour-controls">
      <button id="tour-prev" class="tour-btn">◀ Anterior</button>
      <button id="tour-pause" class="tour-btn tour-btn-primary">⏸ Pausar</button>
      <button id="tour-next" class="tour-btn">Próximo ▶</button>
      <button id="tour-stop" class="tour-btn tour-btn-danger">✕ Sair</button>
    </div>
    
    <div class="tour-progress-bar">
      <div class="tour-progress-fill" id="tour-progress-fill"></div>
    </div>
  `;
  
  document.body.appendChild(tourUI);
  
  // Event listeners
  document.getElementById('tour-prev').addEventListener('click', previousWaypoint);
  document.getElementById('tour-next').addEventListener('click', nextWaypoint);
  document.getElementById('tour-pause').addEventListener('click', togglePause);
  document.getElementById('tour-stop').addEventListener('click', stopTour);
}

function disableMovement() {
  const camera = document.querySelector('#camera');
  if (camera) {
    camera.setAttribute('wasd-controls', 'enabled: false');
    wasdControlsEnabled = false;
  }
}

function enableMovement() {
  const camera = document.querySelector('#camera');
  if (camera) {
    camera.setAttribute('wasd-controls', 'enabled: true');
    wasdControlsEnabled = true;
  }
}

function startTour() {
  
  tourState.active = true;
  tourState.currentIndex = 0;
  tourState.isPaused = false;
  tourState.autoAdvance = true;

  resetPauseButton();
  
  // Mostrar UI
  const tourUI = document.getElementById('tour-ui');
  tourUI.style.display = 'block';
  setTimeout(() => tourUI.classList.add('show'), 10);
  
  // Ir para primeiro waypoint
  goToWaypoint(0);
}

function stopTour() {
  
  tourState.active = false;
  tourState.isPaused = false;

  resetPauseButton();
  
  // Esconder UI
  const tourUI = document.getElementById('tour-ui');
  tourUI.classList.remove('show');
  setTimeout(() => tourUI.style.display = 'none', 300);
  
  // Limpar timeout
  if (advanceTimeout) {
    clearTimeout(advanceTimeout);
    advanceTimeout = null;
  }
  
  // Fechar painel POI se estiver aberto
  const activePoi = window.__activePoiComponent;
  if (activePoi) {
    activePoi.closePanel();
  }
  
  // Parar áudios
  document.querySelectorAll('audio').forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
  
  // Reativar movimento
  enableMovement();
  
  // Voltar para o início
  const rig = document.querySelector('#rig');
  const camera = document.querySelector('#camera');
  
  if (rig && camera) {
    rig.object3D.position.set(0, 1, 60);
    camera.object3D.position.set(0, 1.6, 0);
    camera.object3D.rotation.set(0, 0, 0);
    
    if (typeof previousPos !== 'undefined') {
      previousPos = { x: 0, y: 2.6, z: 60 };
    }
  }
  
  // Esconder auditório se estiver visível
  const auditoriumContainer = document.querySelector('#auditorium-container');
  if (auditoriumContainer) {
    auditoriumContainer.setAttribute('visible', 'false');
  }
  
  // Reativar todos os event listeners do cursor
  const cursor = document.querySelector('a-cursor');
  if (cursor) {
    // Forçar reinicialização do raycaster
    cursor.setAttribute('raycaster', 'objects: .clickable');
    
    // Reativar fuse
    cursor.setAttribute('fuse', 'true');
    cursor.setAttribute('fuse-timeout', '2000');
  }
  
  // Reativar listeners em todos os elementos clicáveis
  setTimeout(() => {
    const clickables = document.querySelectorAll('.clickable');
    clickables.forEach(el => {
      // Remover e adicionar novamente a classe para forçar refresh
      el.classList.remove('clickable');
      setTimeout(() => el.classList.add('clickable'), 10);
    });
  }, 500);
}

function togglePause() {
  tourState.isPaused = !tourState.isPaused;
  
  const pauseBtn = document.getElementById('tour-pause');
  
  if (tourState.isPaused) {
    pauseBtn.innerHTML = '▶ Continuar';
    pauseBtn.classList.remove('tour-btn-primary');
    pauseBtn.classList.add('tour-btn-warning');
    
    // Limpar auto-advance
    if (advanceTimeout) {
      clearTimeout(advanceTimeout);
      advanceTimeout = null;
    }
  } else {
    pauseBtn.innerHTML = '⏸ Pausar';
    pauseBtn.classList.add('tour-btn-primary');
    pauseBtn.classList.remove('tour-btn-warning');
    
    // Retomar auto-advance
    const waypoint = tourWaypoints[tourState.currentIndex];
    if (tourState.autoAdvance && waypoint.duration) {
      scheduleNextWaypoint(waypoint.duration);
    }
  }
}

function resetPauseButton() {
  const pauseBtn = document.getElementById('tour-pause');
  if (!pauseBtn) return;

  pauseBtn.innerHTML = '⏸ Pausar';
  pauseBtn.classList.add('tour-btn-primary');
  pauseBtn.classList.remove('tour-btn-warning');
}


function nextWaypoint() {
  if (!tourState.active) return;
  
  // Limpar timeout anterior
  if (advanceTimeout) {
    clearTimeout(advanceTimeout);
    advanceTimeout = null;
  }
  
  // Fechar painel POI atual
  const activePoi = window.__activePoiComponent;
  if (activePoi) {
    activePoi.closePanel();
  }
  
  if (tourState.currentIndex < tourWaypoints.length - 1) {
    tourState.currentIndex++;
    goToWaypoint(tourState.currentIndex);
  } else {
    // Último waypoint - terminar tour
    stopTour();
  }
}

function previousWaypoint() {
  if (!tourState.active) return;
  
  // Limpar timeout anterior
  if (advanceTimeout) {
    clearTimeout(advanceTimeout);
    advanceTimeout = null;
  }
  
  // Fechar painel POI atual
  const activePoi = window.__activePoiComponent;
  if (activePoi) {
    activePoi.closePanel();
  }
  
  if (tourState.currentIndex > 0) {
    tourState.currentIndex--;
    goToWaypoint(tourState.currentIndex);
  }
}

function goToWaypoint(index) {
  const waypoint = tourWaypoints[index];
  if (!waypoint) return;

  const waypointIndex = index;
  
  // Atualizar UI
  updateTourUI(index, waypoint);
  
  // Controlar movimento baseado no waypoint
  if (waypoint.allowMovement) {
    enableMovement();
  } else {
    disableMovement();
  }
  
  // Teleportar para auditório se necessário
  if (waypoint.teleportToAuditorium) {
    const auditoriumContainer = document.querySelector('#auditorium-container');
    if (auditoriumContainer) {
      auditoriumContainer.setAttribute('visible', 'true');
    }
  } else {
    const auditoriumContainer = document.querySelector('#auditorium-container');
    if (auditoriumContainer && index < tourWaypoints.length - 1) {
      auditoriumContainer.setAttribute('visible', 'false');
    }
  }
  
  // Teleportar jogador
  const rig = document.querySelector('#rig');
  const camera = document.querySelector('#camera');
  
  if (rig && camera) {
    rig.object3D.position.set(waypoint.position.x, waypoint.position.y, waypoint.position.z);
    camera.object3D.position.set(0, 1.6, 0);
    
    // Rotação da câmera
    if (waypoint.rotation) {
      camera.object3D.rotation.set(0, THREE.MathUtils.degToRad(waypoint.rotation.y), 0);
    }

    
    // Atualizar previousPos para colisões
    if (typeof previousPos !== 'undefined') {
      previousPos = { 
        x: waypoint.position.x, 
        y: waypoint.position.y + 1.6, 
        z: waypoint.position.z 
      };
    }
  }
  
  // Abrir POI se existir
  if (waypoint.poiId) {
    setTimeout(() => {
      const poiElement = document.querySelector(`#${waypoint.poiId}`);
      if (poiElement && poiElement.components && poiElement.components.poi) {
        poiElement.components.poi.openPanel();
      }
    }, 1000);
  }
  
  // Tocar áudio se necessário
    if (waypoint.playAudio) {
        setTimeout(() => {
            if (
            tourState.active &&
            tourState.currentIndex === waypointIndex &&
            !tourState.isPaused
            ) {
            const audio = document.querySelector('#cantico-audio');
            if (audio) {
                audio.currentTime = 0;
                audio.play();
            }
            }
        }, 1500);
    }

  
  // Agendar próximo waypoint (se não pausado)
  if (tourState.autoAdvance && waypoint.duration && !tourState.isPaused && !waypoint.isEnd) {
    scheduleNextWaypoint(waypoint.duration);
  }
}

function scheduleNextWaypoint(delay) {
  // Limpar timeout anterior se existir
  if (advanceTimeout) {
    clearTimeout(advanceTimeout);
  }
  
  advanceTimeout = setTimeout(() => {
    if (tourState.active && !tourState.isPaused) {
      nextWaypoint();
    }
  }, delay);
}

function updateTourUI(index, waypoint) {
  document.getElementById('tour-step').textContent = index + 1;
  document.getElementById('tour-total').textContent = tourWaypoints.length;
  document.getElementById('tour-location').textContent = waypoint.name;
  
  // Mostrar descrição apenas se não houver POI
  const descriptionEl = document.getElementById('tour-description');
  if (waypoint.poiId) {
    descriptionEl.style.display = 'none';
  } else {
    descriptionEl.style.display = 'block';
    descriptionEl.textContent = waypoint.description;
  }
  
  // Atualizar barra de progresso
  const progress = ((index + 1) / tourWaypoints.length) * 100;
  document.getElementById('tour-progress-fill').style.width = progress + '%';
  
  // Controlar botões
  document.getElementById('tour-prev').disabled = (index === 0);
  document.getElementById('tour-next').disabled = (index === tourWaypoints.length - 1);
}


window.addEventListener('load', () => {
  setTimeout(initGuidedTour, 1500);
});

// Atalho de teclado: T para tour
document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 't' && !tourState.active) {
    startTour();
  }
});