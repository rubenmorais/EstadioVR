AFRAME.registerComponent('day-night-system', {
    schema: {
        initialMode: { type: 'string', default: 'day' } // 'day' ou 'night'
    },

    init: function() {
        this.currentMode = this.data.initialMode;
        this.scene = document.querySelector('a-scene');
        this.sun = document.getElementById('sun');
        this.moon = document.getElementById('moon');
        this.lampLeft = document.getElementById('lamp-left');
        this.lampRight = document.getElementById('lamp-right');
        this.setupLighting();
        this.createToggleButton();
    },

    setupLighting: function() {
        this.sunLight = document.getElementById('sunLight');
        this.ambientLight = document.querySelector('[light][type="ambient"]');

        this.applyMode(this.currentMode, false);
    },

    applyMode: function(mode, animate = true) {
        const duration = animate ? 2000 : 0;

        if (mode === 'day') {
            this.transitionSkybox('#87CEEB', duration);
            this.transitionLight(this.sunLight, 1.0, '#ffffff', duration);
            this.transitionLight(this.ambientLight, 0.5, '#ffffff', duration);
            this.sun.setAttribute('visible', true);
            this.moon.setAttribute('visible', false);
            this.lampLeft.setAttribute('visible', false);
            this.lampRight.setAttribute('visible', false);
            const stars = document.getElementById('stars-container');
            if (stars) stars.remove();

        } else {
            this.transitionSkybox('#0a0a20', duration);
            this.transitionLight(this.sunLight, 0.25, '#6699ff', duration);
            this.transitionLight(this.ambientLight, 0.2, '#4455aa', duration);
            this.sun.setAttribute('visible', false);
            this.moon.setAttribute('visible', true);
            this.lampLeft.setAttribute('visible', true);
            this.lampRight.setAttribute('visible', true);
            this.addStars();
        }

        this.currentMode = mode;
    },

    transitionSkybox: function(color, duration) {
        if (duration === 0) {
        this.scene.setAttribute('background', 'color', color);
        } else {
        const bg = this.scene.getAttribute('background');
        const startColor = bg.color || '#87CEEB';
        
        this.scene.setAttribute('animation__skybox', {
            property: 'background.color',
            from: startColor,
            to: color,
            dur: duration,
            easing: 'easeInOutQuad'
        });
        }
    },

    transitionLight: function(lightEl, intensity, color, duration) {
        if (!lightEl) return;
        
        if (duration === 0) {
        lightEl.setAttribute('light', {
            intensity: intensity,
            color: color
        });
        } else {
        const currentIntensity = lightEl.getAttribute('light').intensity;
        const currentColor = lightEl.getAttribute('light').color;
        
        lightEl.setAttribute('animation__intensity', {
            property: 'light.intensity',
            from: currentIntensity,
            to: intensity,
            dur: duration,
            easing: 'easeInOutQuad'
        });
        
        lightEl.setAttribute('animation__color', {
            property: 'light.color',
            from: currentColor,
            to: color,
            dur: duration,
            easing: 'easeInOutQuad'
        });
        }
    },

    addStars: function() {
        const existingStars = document.getElementById('stars-container');
        if (existingStars) existingStars.remove();

        const starsContainer = document.createElement('a-entity');
        starsContainer.id = 'stars-container';

        for (let i = 0; i < 300; i++) {
            const star = document.createElement('a-sphere');

            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI / 2;
            const radius = 180;

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.cos(phi);
            const z = radius * Math.sin(phi) * Math.sin(theta);

            const baseSize = 0.12 + Math.random() * 0.12;

            star.setAttribute('position', `${x} ${y} ${z}`);
            star.setAttribute('radius', baseSize);

            star.setAttribute('material', `
                color: #ffffff;
                emissive: #ffffff;
                emissiveIntensity: 1;
            `);

            star.setAttribute('animation__pulse', `
                property: scale;
                dir: alternate;
                dur: ${1200 + Math.random() * 2000};
                loop: true;
                to: 3 3 3;
            `);
            starsContainer.appendChild(star);
        }
        this.scene.appendChild(starsContainer);
    },

    createToggleButton: function() {
        const button = document.createElement('div');
        button.id = 'day-night-toggle';
        button.innerHTML = `
            <button id="toggle-btn" style="
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 24px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                border: 2px solid #ffffff;
                border-radius: 8px;
                cursor: pointer;
                font-family: Arial, sans-serif;
                font-size: 16px;
                font-weight: bold;
                z-index: 1000;
                transition: all 0.3s;
            ">
                🌙 Modo Noite
            </button>
        `;
        
        document.body.appendChild(button);
        
        const btn = document.getElementById('toggle-btn');
        btn.addEventListener('click', () => {
        this.toggleMode();
        });
        
        btn.addEventListener('mouseenter', () => {
        btn.style.background = 'rgba(255, 255, 255, 0.2)';
        btn.style.transform = 'scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', () => {
        btn.style.background = 'rgba(0, 0, 0, 0.7)';
        btn.style.transform = 'scale(1)';
        });
    },

    toggleMode: function() {
        const newMode = this.currentMode === 'day' ? 'night' : 'day';
        this.applyMode(newMode, true);
        
        const btn = document.getElementById('toggle-btn');
        btn.innerHTML = newMode === 'day' ? '🌙 Modo Noite' : '☀️ Modo Dia';
    }
});