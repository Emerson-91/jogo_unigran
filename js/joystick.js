// ===== JOYSTICK VIRTUAL PARA MOBILE =====
// Detecta se é dispositivo touch
const isTouchDevice = () => ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

(function initJoystick() {
  if (!isTouchDevice()) return; // só ativa no celular/tablet

  // ---- Estilos do joystick ----
  const style = document.createElement('style');
  style.textContent = `
    #joystick-container {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      pointer-events: none;
      padding: 0 0 12px 0;
      justify-content: space-between;
      align-items: flex-end;
    }
    #joystick-container.visible {
      display: flex;
    }
    #joystick-area {
      pointer-events: all;
      position: relative;
      width: 140px;
      height: 140px;
      margin-left: 16px;
      flex-shrink: 0;
    }
    #joystick-base {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: rgba(255,255,255,0.15);
      border: 3px solid rgba(255,255,255,0.35);
      box-shadow: 0 0 16px rgba(0,0,0,0.4);
    }
    #joystick-knob {
      position: absolute;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: rgba(255,255,255,0.55);
      border: 3px solid rgba(255,255,255,0.8);
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      transition: box-shadow 0.1s;
    }
    #joystick-btns {
      pointer-events: all;
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-right: 20px;
      align-items: center;
    }
    .jbtn {
      width: 84px;
      height: 84px;
      border-radius: 50%;
      border: 3px solid rgba(255,255,255,0.5);
      background: rgba(0,83,160,0.65);
      color: white;
      font-size: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }
    .jbtn:active, .jbtn.pressed {
      background: rgba(0,83,160,0.9);
      border-color: white;
      transform: scale(0.94);
    }
    #btn-jump {
      background: rgba(180,30,30,0.65);
    }
    #btn-jump:active, #btn-jump.pressed {
      background: rgba(180,30,30,0.9);
    }
    #btn-interact {
      background: rgba(20,140,20,0.65);
    }
    #btn-interact:active, #btn-interact.pressed {
      background: rgba(20,140,20,0.9);
    }
  `;
  document.head.appendChild(style);

  // ---- HTML do joystick ----
  const container = document.createElement('div');
  container.id = 'joystick-container';
  container.innerHTML = `
    <div id="joystick-area">
      <div id="joystick-base"></div>
      <div id="joystick-knob"></div>
    </div>
    <div id="joystick-btns">
      <button class="jbtn" id="btn-jump" title="Pular">↑</button>

      <!--<button class="jbtn" id="btn-interact" title="Interagir">✦</button>-->
    </div>
  `;
  document.body.appendChild(container);

  // Mostra o joystick quando o jogo inicia
  function showJoystick() {
    container.classList.add('visible');
  }

  // Aguarda o botão de início existir e o jogo começar
  function hookStartButton() {
    const startBtn = document.getElementById('startButton');
    if (startBtn) {
      startBtn.addEventListener('click', showJoystick);
    } else {
      setTimeout(hookStartButton, 100);
    }
  }
  hookStartButton();

  // ---- Lógica do joystick analógico ----
  const joystickArea = document.getElementById('joystick-area');
  const knob = document.getElementById('joystick-knob');

  const KNOB_MAX = 55; // raio máximo de deslocamento do knob

  let joystickActive = false;
  let joystickOrigin = { x: 0, y: 0 };
  let joystickTouchId = null;

  function getJoystickCenter() {
    const rect = joystickArea.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  function updateKnobPosition(dx, dy) {
    const dist = Math.sqrt(dx * dx + dy * dy);
    const clampDist = Math.min(dist, KNOB_MAX);
    const angle = Math.atan2(dy, dx);
    const cx = Math.cos(angle) * clampDist;
    const cy = Math.sin(angle) * clampDist;
    knob.style.transform = `translate(calc(-50% + ${cx}px), calc(-50% + ${cy}px))`;
    return { cx, cy, dist };
  }

  function resetKnob() {
    knob.style.transform = 'translate(-50%, -50%)';
  }

  function applyJoystickInput(cx, cy, dist) {
    if (typeof player === 'undefined' || typeof keyState === 'undefined') return;

    const threshold = 12;
    const newLeft = cx < -threshold;
    const newRight = cx > threshold;
    const newUp = cy < -threshold;
    const newDown = cy > threshold;

    if (keyState.left !== newLeft || keyState.right !== newRight ||
        keyState.up !== newUp || keyState.down !== newDown) {

      keyState.left = newLeft;
      keyState.right = newRight;
      keyState.up = newUp;
      keyState.down = newDown;

      if (newLeft) lastHoriz = 'left';
      else if (newRight) lastHoriz = 'right';
      if (newUp) lastVert = 'up';
      else if (newDown) lastVert = 'down';

      recomputeMovementFromKeys();
    }
  }

  function releaseJoystick() {
    joystickActive = false;
    joystickTouchId = null;
    resetKnob();

    if (typeof keyState !== 'undefined') {
      keyState.left = keyState.right = keyState.up = keyState.down = false;
      if (typeof recomputeMovementFromKeys === 'function') recomputeMovementFromKeys();
    }
  }

  joystickArea.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (joystickActive) return;
    const touch = e.changedTouches[0];
    joystickActive = true;
    joystickTouchId = touch.identifier;
    joystickOrigin = getJoystickCenter();
  }, { passive: false });

  joystickArea.addEventListener('touchmove', (e) => {
    e.preventDefault();
    for (const touch of e.changedTouches) {
      if (touch.identifier === joystickTouchId) {
        const dx = touch.clientX - joystickOrigin.x;
        const dy = touch.clientY - joystickOrigin.y;
        const { cx, cy, dist } = updateKnobPosition(dx, dy);
        applyJoystickInput(cx, cy, dist);
      }
    }
  }, { passive: false });

  joystickArea.addEventListener('touchend', (e) => {
    e.preventDefault();
    for (const touch of e.changedTouches) {
      if (touch.identifier === joystickTouchId) {
        releaseJoystick();
      }
    }
  }, { passive: false });

  joystickArea.addEventListener('touchcancel', (e) => {
    releaseJoystick();
  }, { passive: false });

  // ---- Botão de Pulo ----
  const btnJump = document.getElementById('btn-jump');

  function doJump() {
    if (typeof player === 'undefined') return;
    if (player.mode === 'plataforma' && !player.jumping) {
      player.velY = -10;
      player.jumping = true;
    }
  }

  btnJump.addEventListener('touchstart', (e) => {
    e.preventDefault();
    btnJump.classList.add('pressed');
    doJump();
  }, { passive: false });

  btnJump.addEventListener('touchend', (e) => {
    e.preventDefault();
    btnJump.classList.remove('pressed');
  }, { passive: false });
/*
  // ---- Botão de Interação (Enter / Space) ----
  const btnInteract = document.getElementById('btn-interact');

  function doInteract() {
    // Dispara evento de teclado Enter para ativar diálogos/botões do jogo
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    setTimeout(() => {
      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
    }, 80);
    // Também tenta click em canvas para jogos que usam mouse
    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      canvas.dispatchEvent(new MouseEvent('click', { clientX: cx, clientY: cy, bubbles: true }));
    }
  }

  btnInteract.addEventListener('touchstart', (e) => {
    e.preventDefault();
    btnInteract.classList.add('pressed');
    doInteract();
  }, { passive: false });

  btnInteract.addEventListener('touchend', (e) => {
    e.preventDefault();
    btnInteract.classList.remove('pressed');
  }, { passive: false });
*/
  // ---- Previne scroll/zoom indesejado durante o jogo ----
  document.addEventListener('touchmove', (e) => {
    if (container.classList.contains('visible')) {
      e.preventDefault();
    }
  }, { passive: false });

})();
