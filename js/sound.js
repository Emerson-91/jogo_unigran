/**
 * sound.js - Sistema de Áudio (Sintetizador Web Audio API)
 *
 * Fornece:
 * 1. Efeitos sonoros para passos, pulo, moedas, portais, botões e respostas dos puzzles.
 * 2. Música/Ambiência de fundo procedural para cada fase/cena do jogo.
 */

// Instância global do AudioContext (inicializado após interação do usuário)
let audioCtx = null;
let currentPhaseMusic = null;
let musicInterval = null;
let currentMusicScene = null;

/**
 * Inicializa ou retoma o AudioContext do navegador após clique/tecla.
 */
function initAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Escuta cliques e teclas para ativar o som no primeiro toque do usuário
document.addEventListener('click', initAudioContext, { once: false });
document.addEventListener('keydown', initAudioContext, { once: false });

// 
// EFEITOS SONOROS (SFX)
// 

/**
 * Som de Passo (Footstep)
 * Ruído filtrado de curta duração simulando passos no chão.
 */
function playFootstepSound() {
  if (!audioCtx || audioCtx.state !== 'running') return;

  try {
    const bufferSize = audioCtx.sampleRate * 0.06;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 220 + Math.random() * 80;
    filter.Q.value = 2.5;

    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.45, audioCtx.currentTime); // Volume amplificado
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    whiteNoise.start();
  } catch (e) { }
}

/**
 * Som de Pulo (Jump)
 */
function playJumpSound() {
  if (!audioCtx || audioCtx.state !== 'running') return;

  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(450, audioCtx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.45, audioCtx.currentTime); // Volume amplificado
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  } catch (e) { }
}

/**
 * Som de Aterrissagem (Landing thud)
 */
function playLandSound() {
  if (!audioCtx || audioCtx.state !== 'running') return;

  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, audioCtx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.50, audioCtx.currentTime); // Volume amplificado
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
  } catch (e) { }
}

/**
 * Som de Coleta de Moeda (Coin Pickup)
 */
function playCoinSound() {
  if (!audioCtx || audioCtx.state !== 'running') return;

  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.45, now); // Volume amplificado
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  } catch (e) { }
}

/**
 * Som de Entrada em Portal
 */
function playPortalSound() {
  if (!audioCtx || audioCtx.state !== 'running') return;

  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);

    gain.gain.setValueAtTime(0.50, now); // Volume amplificado
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  } catch (e) { }
}

/**
 * Som de Clique em Botão / Interface
 */
function playButtonClickSound() {
  if (!audioCtx || audioCtx.state !== 'running') return;

  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.05);

    gain.gain.setValueAtTime(0.35, now); // Volume amplificado
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch (e) { }
}

/**
 * Som de Acerto em Quiz / Puzzle (Sucesso)
 */
function playCorrectSound() {
  if (!audioCtx || audioCtx.state !== 'running') return;

  try {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const startTime = audioCtx.currentTime + idx * 0.07;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.45, startTime); // Volume amplificado
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.18);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.18);
    });
  } catch (e) { }
}

/**
 * Som de Erro em Quiz / Puzzle
 */
function playWrongSound() {
  if (!audioCtx || audioCtx.state !== 'running') return;

  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.2);

    gain.gain.setValueAtTime(0.40, now); // Volume amplificado
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  } catch (e) { }
}

// 
// MÚSICA / AMBIÊNCIA DAS FASES (BGM)
// 

const PHASE_THEMES = {
  fase1: { notes: [261.63, 329.63, 392.00, 523.25], tempo: 400, type: 'sine', vol: 0.15 },
  fasePredio: { notes: [261.63, 329.63, 392.00, 523.25], tempo: 400, type: 'sine', vol: 0.15 },
  hubHumanas: { notes: [349.23, 440.00, 523.25, 659.25], tempo: 600, type: 'triangle', vol: 0.15 },
  hubExatas: { notes: [220.00, 277.18, 329.63, 440.00], tempo: 300, type: 'square', vol: 0.12 },
  hubBiologicas: { notes: [293.66, 369.99, 440.00, 587.33], tempo: 500, type: 'sine', vol: 0.15 },
  puzzle: { notes: [329.63, 392.00, 493.88, 587.33], tempo: 450, type: 'sine', vol: 0.14 },
  curso: { notes: [261.63, 329.63, 392.00, 523.25], tempo: 500, type: 'triangle', vol: 0.15 },
  fim: { notes: [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50], tempo: 250, type: 'triangle', vol: 0.20 }
};

/**
 * Atualiza a música/ambiência de fundo conforme a cena atual.
 * @param {string} scene - Nome da cena ativa.
 */
function updatePhaseAudio(scene) {
  if (currentMusicScene === scene) return;
  currentMusicScene = scene;

  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }

  let key = scene;
  if (!PHASE_THEMES[key]) {
    if (scene.startsWith('hub')) key = scene;
    else if (scene.includes('explicacao')) key = 'hubHumanas';
    else if (scene.includes('dialogo')) key = 'fase1';
    else key = 'fase1';
  }

  const theme = PHASE_THEMES[key];
  if (!theme) return;

  let noteIdx = 0;

  musicInterval = setInterval(() => {
    if (!audioCtx || audioCtx.state !== 'running') return;
    try {
      const freq = theme.notes[noteIdx % theme.notes.length];
      noteIdx++;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = theme.type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      const dur = (theme.tempo / 1000) * 0.8;
      gain.gain.setValueAtTime(theme.vol, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + dur);
    } catch (e) { }
  }, theme.tempo);
}
