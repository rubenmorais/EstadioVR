AFRAME.registerComponent('poi', {
  schema: {
    title: { type: 'string', default: 'POI' },
    text:  { type: 'string', default: '' },
    image: { type: 'selector', default: null },
    audio: { type: 'selector', default: null }
  },

  init: function () {
    const self = this;

    this.panel    = document.querySelector('#poi-panel');
    this.titleEl  = document.querySelector('#poi-title');
    this.textEl   = document.querySelector('#poi-text');
    this.imgEl    = document.querySelector('#poi-image');
    this.closeBtn = document.querySelector('#poi-close');

    this.camera   = document.querySelector('#camera');
    this.cursor   = document.querySelector('a-cursor');
    this.prevRaycasterObjects = null;

    const mat = this.el.getAttribute('material');
    this.originalColor = (mat && mat.color) ? mat.color : '#4CAF50';

    const s = this.el.getAttribute('scale');
    this.originalScale = s ? { x: s.x, y: s.y, z: s.z } : { x: 1, y: 1, z: 1 };

    // Hover highlight
    this.el.addEventListener('mouseenter', () => {
      this.el.setAttribute('material', 'color', '#66FF66');
      this.el.object3D.scale.set(
        this.originalScale.x * 1.15,
        this.originalScale.y * 1.15,
        this.originalScale.z * 1.15
      );
      if (typeof startCursorProgress === 'function') startCursorProgress();
    });

    this.el.addEventListener('mouseleave', () => {
      this.el.setAttribute('material', 'color', this.originalColor);
      this.el.object3D.scale.set(
        this.originalScale.x,
        this.originalScale.y,
        this.originalScale.z
      );
      if (typeof stopCursorProgress === 'function') stopCursorProgress();
    });

    // Abrir painel ao clicar no POI
    this.el.addEventListener('click', () => this.openPanel());

    // Configurar listener global do botão fechar 
    if (!window.__poiCloseSetup) {
      window.__poiCloseSetup = true;
      
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => {
          const activePoi = window.__activePoiComponent;
          if (activePoi) {
            activePoi.closePanel();
          }
        });

        this.closeBtn.addEventListener('mouseenter', () => {
          if (typeof startCursorProgress === 'function') startCursorProgress();
        });

        this.closeBtn.addEventListener('mouseleave', () => {
          if (typeof stopCursorProgress === 'function') stopCursorProgress();
        });
      }
    }

    // Fechar com ESC
    if (!window.__poiEscSetup) {
      window.__poiEscSetup = true;
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const p = document.querySelector('#poi-panel');
          if (p && p.getAttribute('visible')) {
            const activePoi = window.__activePoiComponent;
            if (activePoi) {
              activePoi.closePanel();
            }
          }
        }
      });
    }
  },

  openPanel: function () {
    if (!this.panel || !this.titleEl || !this.textEl || !this.camera) return;

    // Registar este POI como o ativo
    window.__activePoiComponent = this;

    // Tornar a bola invisível
    this.el.setAttribute('visible', false);

    // Preencher texto
    this.titleEl.setAttribute('troika-text', { value: this.data.title });
    this.textEl.setAttribute('troika-text',  { value: this.data.text  });

    // Imagem opcional
    if (this.imgEl) {
      if (this.data.image) {
        this.imgEl.setAttribute('material', 'src', '#' + this.data.image.id);
        this.imgEl.setAttribute('visible', true);
      } else {
        this.imgEl.setAttribute('visible', false);
      }
    }

    // Áudio opcional
    if (this.data.audio) {
      try {
        this.data.audio.currentTime = 0;
        this.data.audio.play();
      } catch (e) {}
    }

    // ========= POSICIONAR PAINEL AO LADO DO POI =========
    const poiWorldPos = new THREE.Vector3();
    this.el.object3D.getWorldPosition(poiWorldPos);

    const cameraWorldPos = new THREE.Vector3();
    this.camera.object3D.getWorldPosition(cameraWorldPos);

    const offset = new THREE.Vector3(0.8, 0.4, 0.3);
    const panelPos = poiWorldPos.clone().add(offset);

    this.panel.object3D.position.copy(panelPos);

    // Olhar para a câmara
    this.panel.object3D.lookAt(cameraWorldPos);

    // Quanto mais longe, maior fica o painel 
    const distance = panelPos.distanceTo(cameraWorldPos);

    const scaleFactor = THREE.MathUtils.clamp(distance * 0.18, 1.6, 3.5);
    this.panel.object3D.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // Raycaster só no FECHAR (evita conflito com POIs/teleporte)
    if (this.cursor) {
      const rc = this.cursor.getAttribute('raycaster');
      this.prevRaycasterObjects = (rc && rc.objects) ? rc.objects : '.clickable';
      this.cursor.setAttribute('raycaster', 'objects: .poi-ui');
    }

    this.panel.setAttribute('visible', true);
    if (typeof resetCursorProgress === 'function') resetCursorProgress();
  },

  closePanel: function () {
    if (!this.panel) return;

    // Tornar a bola visível novamente
    this.el.setAttribute('visible', true);

    // Limpar o POI ativo
    window.__activePoiComponent = null;

    // Parar áudio
    document.querySelectorAll('audio').forEach(a => {
      try {
        a.pause();
        a.currentTime = 0;
      } catch (e) {}
    });

    this.panel.setAttribute('visible', false);

    // Restaurar raycaster
    if (this.cursor) {
      const objs = this.prevRaycasterObjects || '.clickable';
      this.cursor.setAttribute('raycaster', 'objects: ' + objs);
    }

    if (typeof resetCursorProgress === 'function') resetCursorProgress();
  }
});