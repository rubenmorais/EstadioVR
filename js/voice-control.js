const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = 'pt-PT';
  recognition.continuous = true;
  recognition.interimResults = false;
  
  let isRecognizing = false;

  recognition.onstart = () => {
    isRecognizing = true;
    showVoiceFeedback('Voz ativada');
  };

  recognition.onend = () => {
    isRecognizing = false;
    setTimeout(() => {
      if (window.voiceControlActive && !isRecognizing) {
        try {
          recognition.start();
        } catch (e) {
          console.log('Já está a correr');
        }
      }
    }, 100);
  };

  recognition.onerror = (e) => {
    console.error('Erro voz:', e.error);
    if (e.error === 'no-speech') {
      console.log('Nenhuma fala detetada, a continuar...');
    }
  };

  const voiceCommands = {
    'placar': 'poi-placar',
    'resultado': 'poi-placar',
    'marcador': 'poi-placar',
    'bancada': 'poi-bancada',
    'central': 'poi-bancada',
    'relvado': 'poi-relvado',
    'campo': 'poi-relvado',
    'cântico': 'poi-cantico',
    'cantico': 'poi-cantico',
    'hino': 'poi-cantico',
    'fechar': 'close',
    'sair': 'close'
  };

  recognition.onresult = (event) => {
    const lastResult = event.results[event.results.length - 1];
    const texto = lastResult[0].transcript.toLowerCase().trim();
    const confidence = lastResult[0].confidence;
    
    console.log('Ouvido:', texto, '| Confiança:', (confidence * 100).toFixed(0) + '%');
    showVoiceFeedback('🎧 ' + texto);

    let commandFound = false;

    for (const [cmd, target] of Object.entries(voiceCommands)) {
      if (texto.includes(cmd)) {
        console.log('Comando reconhecido:', cmd, '→', target);
        commandFound = true;

        if (target === 'close') {
          const activePoi = window.__activePoiComponent;
          if (activePoi) {
            activePoi.closePanel();
            showVoiceFeedback('Painel fechado');
          } else {
            console.log('Nenhum painel aberto');
          }
          break;
        }

        const poiElement = document.querySelector('#' + target);
        
        if (poiElement) {
          
          if (poiElement.components && poiElement.components.poi) {
            poiElement.components.poi.openPanel();
            showVoiceFeedback(cmd.toUpperCase());
          } else {
            console.warn('Componente POI não encontrado em', target);
            poiElement.emit('click');
          }
        } else {
          console.error('Elemento não encontrado:', target);
        }
        
        break;
      }
    }

    if (!commandFound) {
      showVoiceFeedback('Comando não reconhecido');
    }
  };

  window.startVoiceControl = () => {
    if (!isRecognizing) {
      console.log('A iniciar controlo por voz...');
      window.voiceControlActive = true;
      try {
        recognition.start();
      } catch (e) {
        console.error('Erro ao iniciar:', e);
      }
    } else {
      console.log('Reconhecimento já está ativo');
    }
  };

  window.stopVoiceControl = () => {
    window.voiceControlActive = false;
    if (isRecognizing) {
      recognition.stop();
    }
    showVoiceFeedback('Voz desativada');
  };

  // Tecla V para toggle
  document.addEventListener('keydown', (e) => {
    if (e.key === 'v' || e.key === 'V') {
      if (window.voiceControlActive) {
        window.stopVoiceControl();
      } else {
        window.startVoiceControl();
      }
    }
  });

  function showVoiceFeedback(message) {
    let feedback = document.getElementById('voice-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.id = 'voice-feedback';
      feedback.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-size: 16px;
        z-index: 1000;
        display: none;
        font-family: Arial, sans-serif;
      `;
      document.body.appendChild(feedback);
    }
    
    feedback.textContent = message;
    feedback.style.display = 'block';
    
    setTimeout(() => {
      feedback.style.display = 'none';
    }, 2000);
  }

} else {
  console.warn('⚠️ Speech Recognition não suportado neste navegador.');
  alert('O seu navegador não suporta reconhecimento de voz. Use Chrome ou Edge.');
}