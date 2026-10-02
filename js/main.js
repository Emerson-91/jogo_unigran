/**
 * main.js - Loop Principal do Jogo e Gerenciamento de Cenas
 * 
 * Controla o loop de atualização do Canvas (requestAnimationFrame),
 * fluxo de trocas de cenas com efeito de fade, escuta de teclado
 * e inicialização dos sistemas de som e mídia.
 */

const DEFAULT_WIDTH = 1000;
const DEFAULT_HEIGHT = 600;
const PUZZLE_WIDTH = 1280;
const PUZZLE_HEIGHT = 720;

// Configuração do Canvas
canvas.width = DEFAULT_WIDTH;
canvas.height = DEFAULT_HEIGHT;
const ctx = canvas.getContext("2d");

// Instância global do personagem principal e cena inicial
let player = new Player(50, 500);
let scene = "start";

/**
 * Estado para controle da transição de cena (Fade Out / Fade In)
 */
const sceneTransition = {
  active: false,
  phase: null, // 'fadeOut' ou 'fadeIn'
  alpha: 0,
  duration: 500, // Duração da transição em milissegundos
  startTime: 0,
  nextScene: null
};

/**
 * Inicia a transição suave de tela (Fade Out / Fade In).
 */
function startSceneFade(nextScene, opts = {}) {
  if (opts.instant) {
    internalChangeScene(nextScene);
    return;
  }
  if (sceneTransition.active) {
    sceneTransition.nextScene = nextScene;
    return;
  }
  sceneTransition.active = true;
  sceneTransition.phase = 'fadeOut';
  sceneTransition.alpha = 0;
  sceneTransition.startTime = performance.now();
  sceneTransition.nextScene = nextScene;

  // Reseta velocidade do jogador durante a transição
  player.dx = 0;
  player.dy = 0;
  player.velY = 0;
}

// Mapeamento de backgrounds das fases
const BACKGROUNDS = {
  fasePredio: ['assets/bg_predio_1.png'],
  hubExatas: ['assets/bg_exatas_1.png', 'assets/bg_exatas_2.png'],
  hubHumanas: ['assets/bg_humanas_1.png', 'assets/bg_humanas_2.png'],
  hubBiologicas: ['assets/bg_bio_1.png', 'assets/bg_bio_2.png']
};

// Pré-carregamento dos fundos de tela principais
(function preloadBackgrounds() {
  try {
    Object.keys(BACKGROUNDS).forEach(key => {
      const arr = BACKGROUNDS[key];
      if (arr && arr[0]) getImage(arr[0]);
    });
  } catch (e) { }
})();

let bgFrame = 0;
let bgTimer = Date.now();

// Evento do Botão Iniciar Jogo na tela de abertura
document.getElementById("startButton").addEventListener("click", () => {
  const startScreenEl = document.getElementById("startScreen");
  const gameContainerEl = document.querySelector('.game-container');
  if (startScreenEl) startScreenEl.style.display = "none";
  if (gameContainerEl) gameContainerEl.style.display = "flex";

  // Inicializa áudio no primeiro clique do usuário
  if (typeof initAudioContext === 'function') initAudioContext();

  canvas.style.display = "block";
  if (canvas.width !== DEFAULT_WIDTH || canvas.height !== DEFAULT_HEIGHT) {
    canvas.width = DEFAULT_WIDTH;
    canvas.height = DEFAULT_HEIGHT;
  }
  changeScene("fase1", { instant: true });
});

/**
 * Altera internamente a cena ativa e reconfigura o modo do personagem.
 */
function internalChangeScene(newScene) {
  try { if (typeof hideMediaOverlay === 'function') hideMediaOverlay(); } catch (e) { }
  scene = newScene;
  botoes = [];

  // Atualiza a música/ambiência da nova fase
  if (typeof updatePhaseAudio === 'function') updatePhaseAudio(newScene);

  try {
    if (scene === 'fase1' || scene === 'puzzle') {
      window.__finalScoreLogged = false;
    }
  } catch (e) { }

  if (["fase1", "fasePredio"].includes(scene)) {
    if (canvas.width !== DEFAULT_WIDTH || canvas.height !== DEFAULT_HEIGHT) {
      canvas.width = DEFAULT_WIDTH;
      canvas.height = DEFAULT_HEIGHT;
    }
    player.mode = "plataforma";
    player.x = 50;
    player.y = 500;
    player.dx = 0;
    player.dy = 0;
    player.velY = 0;
    player.jumping = false;
  } else if (scene.includes("hub")) {
    if (canvas.width !== DEFAULT_WIDTH || canvas.height !== DEFAULT_HEIGHT) {
      canvas.width = DEFAULT_WIDTH;
      canvas.height = DEFAULT_HEIGHT;
    }
    player.mode = "livre";
    player.x = canvas.width / 2 - player.w / 2;
    player.y = canvas.height / 2 - player.h / 2;
    player.dx = 0;
    player.dy = 0;
  } else if (scene === "curso") {
    if (canvas.width !== DEFAULT_WIDTH || canvas.height !== DEFAULT_HEIGHT) {
      canvas.width = DEFAULT_WIDTH;
      canvas.height = DEFAULT_HEIGHT;
    }
    player.mode = "plataforma";
    player.x = 50;
    player.y = 500;
    player.dx = 0;
    player.dy = 0;
    player.velY = 0;
    player.jumping = false;
  } else if (scene === "puzzle" || scene === "fim") {
    if (canvas.width !== PUZZLE_WIDTH || canvas.height !== PUZZLE_HEIGHT) {
      canvas.width = PUZZLE_WIDTH;
      canvas.height = PUZZLE_HEIGHT;
    }
  }
}

/**
 * Função pública para solicitar mudança de cena (com fade por padrão).
 */
function changeScene(newScene, opts = {}) {
  startSceneFade(newScene, opts);
}

/**
 * Desenha o fundo correspondente da cena atual.
 */
function drawBackground(ctx, scene) {
  if (scene === 'fim') {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }
  const bgs = BACKGROUNDS[scene];
  if (bgs) {
    const img = getImage(bgs[0]);
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = "#0066cc";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  } else {
    ctx.fillStyle = "#0066cc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

/**
 * Loop Principal de Renderização e Atualização do Jogo
 */
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Limpa lista de botões da interface a cada frame
  if (typeof botoes !== 'undefined') {
    botoes = [];
  }

  // Animação de idle dos NPCs
  if (Date.now() - npcAnimFrameTimer > 400) {
    npcAnimFrame = (npcAnimFrame + 1) % 2;
    npcAnimFrameTimer = Date.now();
  }

  // Renderiza fundo da cena
  drawBackground(ctx, scene);

  // Renderiza a cena atual conforme estado do jogo
  if (scene === "fase1") fase1(ctx, player, changeScene, canvas);
  else if (scene === "fasePredio") fasePredio(ctx, player, changeScene, canvas);
  else if (scene === "dialogoNPC") dialogoNPC(ctx, changeScene, canvas);
  else if (scene === "explicacaoHumanas") explicacaoArea(
    ctx,
    changeScene,
    canvas,
    "Área 1",
    "Estudo das pessoas, sociedade e expressão:\n• Administração\n• Direito\n• Psicologia\n• Publicidade",
    "hubHumanas"
  );
  else if (scene === "explicacaoExatas") explicacaoArea(
    ctx,
    changeScene,
    canvas,
    "Área 2",
    "Raciocínio, estrutura e criação de soluções:\n• Arquitetura e Urbanismo\n• Design de Interiores\n• Ciências Contábeis\n• Engenharia de Software",
    "hubExatas"
  );
  else if (scene === "explicacaoBiologicas") explicacaoArea(
    ctx,
    changeScene,
    canvas,
    "Área 3",
    "Vida, saúde e bem-estar:\n• Estética e Cosmética\n• Nutrição\n• Educação Física\n• Biomedicina\n• Radiologia\n• Enfermagem\n• Fisioterapia",
    "hubBiologicas"
  );
  else if (scene === "hubExatas") hubExatas(ctx, player, changeScene, canvas);
  else if (scene === "hubHumanas") hubHumanas(ctx, player, changeScene, canvas);
  else if (scene === "hubBiologicas") hubBiologicas(ctx, player, changeScene, canvas);
  else if (scene === "dialogoCurso") dialogoCurso(ctx, changeScene, canvas);
  else if (scene === "dialogoCursoInfo") dialogoCursoInfo(ctx, changeScene, canvas);
  else if (scene === "puzzle") renderPuzzle(ctx, canvas, changeScene);
  else if (scene === "curso") faseCurso(ctx, player, canvas, window.currentCursoName || "Curso", changeScene);
  else if (scene === "fim") cenaFim(ctx, canvas);

  // Processa a transição com efeito de fade
  if (sceneTransition.active) {
    const now = performance.now();
    const elapsed = now - sceneTransition.startTime;
    const t = Math.min(1, elapsed / sceneTransition.duration);

    if (sceneTransition.phase === 'fadeOut') {
      sceneTransition.alpha = t;
      try { if (typeof syncMediaOverlayFade === 'function') syncMediaOverlayFade(sceneTransition.alpha); } catch (e) { }
      if (t >= 1) {
        internalChangeScene(sceneTransition.nextScene);
        sceneTransition.phase = 'fadeIn';
        sceneTransition.startTime = performance.now();
      }
    } else if (sceneTransition.phase === 'fadeIn') {
      sceneTransition.alpha = 1 - t;
      try { if (typeof syncMediaOverlayFade === 'function') syncMediaOverlayFade(sceneTransition.alpha); } catch (e) { }
      if (t >= 1) {
        sceneTransition.active = false;
        sceneTransition.phase = null;
        sceneTransition.alpha = 0;
        try { if (typeof scene !== 'undefined' && scene === 'fim' && typeof hideMediaOverlay === 'function') hideMediaOverlay(); } catch (e) { }
      }
    }

    if (sceneTransition.alpha > 0) {
      ctx.save();
      ctx.fillStyle = `rgba(0,0,0,${sceneTransition.alpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
  }

  requestAnimationFrame(update);
}

// ===== Controle Teclado e Movimentação =====
const keyState = { left: false, right: false, up: false, down: false };
let lastHoriz = null;
let lastVert = null;

function clearKeyState() {
  keyState.left = keyState.right = keyState.up = keyState.down = false;
  lastHoriz = lastVert = null;
}

function recomputeMovementFromKeys() {
  let dx = 0;
  if (keyState.left && !keyState.right) { dx = -player.speed; lastHoriz = 'left'; }
  else if (keyState.right && !keyState.left) { dx = player.speed; lastHoriz = 'right'; }
  else if (keyState.left && keyState.right) {
    if (lastHoriz === 'left') dx = -player.speed;
    else if (lastHoriz === 'right') dx = player.speed;
    else dx = 0;
  } else {
    dx = 0;
  }
  player.dx = dx;

  if (player.mode === 'livre') {
    let dy = 0;
    if (keyState.up && !keyState.down) { dy = -player.speed; lastVert = 'up'; }
    else if (keyState.down && !keyState.up) { dy = player.speed; lastVert = 'down'; }
    else if (keyState.up && keyState.down) {
      if (lastVert === 'up') dy = -player.speed;
      else if (lastVert === 'down') dy = player.speed;
      else dy = 0;
    } else {
      dy = 0;
    }
    player.dy = dy;
  } else {
    player.dy = 0;
  }
}

// Pressionar tecla
document.addEventListener("keydown", (e) => {
  if (typeof initAudioContext === 'function') initAudioContext();

  // Reset de atalho (F5 / Ctrl+R)
  if (e.key === 'F5' || (e.ctrlKey && (e.key === 'r' || e.key === 'R'))) {
    e.preventDefault();
    try { if (typeof resetGame === 'function') resetGame(); } catch (err) { }
    changeScene('fase1', { instant: true });
    return;
  }

  if (sceneTransition.active) return;
  const k = e.key;

  if (k === 'ArrowLeft' || k === 'ArrowRight' || k === 'ArrowUp' || k === 'ArrowDown') e.preventDefault();
  if (k === 'ArrowLeft' || k === 'a' || k === 'A') { keyState.left = true; lastHoriz = 'left'; }
  if (k === 'ArrowRight' || k === 'd' || k === 'D') { keyState.right = true; lastHoriz = 'right'; }
  if (k === 'ArrowUp' || k === 'w' || k === 'W') { keyState.up = true; lastVert = 'up'; }
  if (k === 'ArrowDown' || k === 's' || k === 'S') { keyState.down = true; lastVert = 'down'; }

  // Ação de Pulo em modo plataforma
  if ((k === 'ArrowUp' || k === 'w' || k === 'W') && player.mode === 'plataforma' && !player.jumping) {
    player.velY = -10;
    player.jumping = true;
    if (typeof playJumpSound === 'function') playJumpSound();
  }

  recomputeMovementFromKeys();
});

// Soltar tecla
document.addEventListener("keyup", (e) => {
  if (sceneTransition.active) return;
  const k = e.key;
  if (k === 'ArrowLeft' || k === 'a' || k === 'A') keyState.left = false;
  if (k === 'ArrowRight' || k === 'd' || k === 'D') keyState.right = false;
  if (k === 'ArrowUp' || k === 'w' || k === 'W') keyState.up = false;
  if (k === 'ArrowDown' || k === 's' || k === 'S') keyState.down = false;
  recomputeMovementFromKeys();
});

// Limpa estado de movimento ao iniciar fade
const _origStartSceneFade = startSceneFade;
startSceneFade = function (nextScene, opts = {}) {
  clearKeyState();
  try { if (typeof syncMediaOverlayFade === 'function') syncMediaOverlayFade(0); } catch (e) { }
  _origStartSceneFade(nextScene, opts);
};

// Inicia o loop do jogo
update();
