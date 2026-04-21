const DEFAULT_WIDTH = 1000;
const DEFAULT_HEIGHT = 600;
const PUZZLE_WIDTH = 1280;
const PUZZLE_HEIGHT = 720;
canvas.width = DEFAULT_WIDTH;
canvas.height = DEFAULT_HEIGHT;
const ctx = canvas.getContext("2d");

let player = new Player(50, 500);
let scene = "start";

// Estado para transição de cenas com fade
const sceneTransition = {
  active: false,
  phase: null, // 'fadeOut' ou 'fadeIn'
  alpha: 0,
  duration: 500, // ms para cada fase
  startTime: 0,
  nextScene: null
};

function startSceneFade(nextScene, opts = {}) {
  // Se instantâneo, troca direto
  if (opts.instant) {
    internalChangeScene(nextScene);
    return;
  }
  // Se já em fade, apenas agenda a próxima cena
  if (sceneTransition.active) {
    sceneTransition.nextScene = nextScene;
    return;
  }
  sceneTransition.active = true;
  sceneTransition.phase = 'fadeOut';
  sceneTransition.alpha = 0;
  sceneTransition.startTime = performance.now();
  sceneTransition.nextScene = nextScene;
  // Congela player para evitar atravessar colisores durante transição
  player.dx = 0;
  player.dy = 0;
  player.velY = 0;
}

// Mapeamento de backgrounds animados
const BACKGROUNDS = {
  fasePredio: ['assets/bg_predio_1.png'],
  hubExatas: ['assets/bg_exatas_1.png', 'assets/bg_exatas_2.png'],
  hubHumanas: ['assets/bg_humanas_1.png', 'assets/bg_humanas_2.png'],
  hubBiologicas: ['assets/bg_bio_1.png', 'assets/bg_bio_2.png']
  // Adicione outros conforme necessário
};

// Pré-carrega alguns backgrounds mais comuns para reduzir piscadas na primeira entrada
; (function preloadBackgrounds() {
  try {
    Object.keys(BACKGROUNDS).forEach(key => {
      const arr = BACKGROUNDS[key];
      if (arr && arr[0]) getImage(arr[0]);
    });
  } catch (e) { /* silencioso */ }
})();

let bgFrame = 0;
let bgTimer = Date.now();

// Início do jogo
document.getElementById("startButton").addEventListener("click", () => {
  const startScreenEl = document.getElementById("startScreen");
  const gameContainerEl = document.querySelector('.game-container');
  if (startScreenEl) startScreenEl.style.display = "none";
  if (gameContainerEl) gameContainerEl.style.display = "flex";
  // Garante canvas visível e com tamanho padrão para fase1
  canvas.style.display = "block";
  if (canvas.width !== DEFAULT_WIDTH || canvas.height !== DEFAULT_HEIGHT) {
    canvas.width = DEFAULT_WIDTH;
    canvas.height = DEFAULT_HEIGHT;
  }
  changeScene("fase1", { instant: true });
});

function internalChangeScene(newScene) {
  // Ao mudar de cena, garanta que nenhum overlay de mídia anterior permaneça (ex.: GIF do quiz)
  try { if (typeof hideMediaOverlay === 'function') hideMediaOverlay(); } catch (e) { /* silencioso */ }
  scene = newScene;
  botoes = [];
  // Telemetria por cena desativada: registro somente ao finalizar o jogo
  // Reinicia a flag de relatório final quando começar fase/puzzle para permitir registrar novamente
  try {
    if (scene === 'fase1' || scene === 'puzzle') {
      window.__finalScoreLogged = false;
    }
  } catch (e) { /* silencioso */ }
  if (["fase1", "fasePredio", "curso1", "curso2", "curso3"].includes(scene)) {
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

function changeScene(newScene, opts = {}) {
  startSceneFade(newScene, opts);
}

function drawBackground(ctx, scene) {
  if (scene === 'fim') {
    // Cena final cuida do próprio fundo (gradiente profissional), não desenhar imagem
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }
  const bgs = BACKGROUNDS[scene];
  if (bgs) {
    // Usa cache de imagens para evitar piscadas (getImage definido em utils.js)
    const img = getImage(bgs[0]);
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    } else {
      // Enquanto carrega mostra fundo sólido; próxima frame desenha imagem
      ctx.fillStyle = "#0066cc";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  } else {
    ctx.fillStyle = "#0066cc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// Exemplo de uso em cada renderização de tela
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Reinicia lista de botões a cada frame para permitir que o índice de seleção (hoverBtnIndex)
  // aplique destaque corretamente quando navegado por teclado. Mantemos hoverBtnIndex.
  // Isso também evita crescimento indefinido do array a cada frame.
  if (typeof botoes !== 'undefined') {
    botoes = [];
  }

  // Controle de animação dos NPCs (deve estar aqui!)
  if (Date.now() - npcAnimFrameTimer > 400) {
    npcAnimFrame = (npcAnimFrame + 1) % 2;
    npcAnimFrameTimer = Date.now();
  }

  // Desenha o background animado
  drawBackground(ctx, scene);

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

  // Processar fade
  if (sceneTransition.active) {
    const now = performance.now();
    const elapsed = now - sceneTransition.startTime;
    const t = Math.min(1, elapsed / sceneTransition.duration);
    if (sceneTransition.phase === 'fadeOut') {
      sceneTransition.alpha = t; // 0 -> 1
      try { if (typeof syncMediaOverlayFade === 'function') syncMediaOverlayFade(sceneTransition.alpha); } catch (e) { /* silencioso */ }
      if (t >= 1) {
        internalChangeScene(sceneTransition.nextScene);
        sceneTransition.phase = 'fadeIn';
        sceneTransition.startTime = performance.now();
      }
    } else if (sceneTransition.phase === 'fadeIn') {
      sceneTransition.alpha = 1 - t; // 1 -> 0
      try { if (typeof syncMediaOverlayFade === 'function') syncMediaOverlayFade(sceneTransition.alpha); } catch (e) { /* silencioso */ }
      if (t >= 1) {
        sceneTransition.active = false;
        sceneTransition.phase = null;
        sceneTransition.alpha = 0;
        // Após finalizar o fade-in, se for cena final, esconda overlay de vez
        try { if (typeof scene !== 'undefined' && scene === 'fim' && typeof hideMediaOverlay === 'function') hideMediaOverlay(); } catch (e) { /* silencioso */ }
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

// ===== Movimento suave com estado de teclas =====
const keyState = { left: false, right: false, up: false, down: false };
let lastHoriz = null; // 'left' | 'right'
let lastVert = null;  // 'up' | 'down'

function clearKeyState() {
  keyState.left = keyState.right = keyState.up = keyState.down = false;
  lastHoriz = lastVert = null;
}

function recomputeMovementFromKeys() {
  // Horizontal
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

  // Vertical (apenas no modo livre)
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
    // Em plataforma, zera DY controlado por teclas; pulo é por velY
    player.dy = 0;
  }
}

document.addEventListener("keydown", (e) => {
  // Soft reload: F5 ou Ctrl+R fazem reset interno sem recarregar a página (mantém F11)
  if (e.key === 'F5' || (e.ctrlKey && (e.key === 'r' || e.key === 'R'))) {
    e.preventDefault();
    try { if (typeof resetGame === 'function') resetGame(); } catch (err) { /* silencioso */ }
    changeScene('fase1', { instant: true });
    return;
  }
  if (sceneTransition.active) return; // ignora input durante fade
  const k = e.key;
  if (k === 'ArrowLeft' || k === 'ArrowRight' || k === 'ArrowUp' || k === 'ArrowDown') e.preventDefault();
  if (k === 'ArrowLeft' || k === 'a' || k === 'A') { keyState.left = true; lastHoriz = 'left'; }
  if (k === 'ArrowRight' || k === 'd' || k === 'D') { keyState.right = true; lastHoriz = 'right'; }
  if (k === 'ArrowUp' || k === 'w' || k === 'W') { keyState.up = true; lastVert = 'up'; }
  if (k === 'ArrowDown' || k === 's' || k === 'S') { keyState.down = true; lastVert = 'down'; }

  // Pulo apenas no pressionar da tecla (modo plataforma)
  if ((k === 'ArrowUp' || k === 'w' || k === 'W') && player.mode === 'plataforma' && !player.jumping) {
    player.velY = -10;
    player.jumping = true;
  }

  recomputeMovementFromKeys();
});

document.addEventListener("keyup", (e) => {
  if (sceneTransition.active) return; // ignora input durante fade
  const k = e.key;
  if (k === 'ArrowLeft' || k === 'a' || k === 'A') keyState.left = false;
  if (k === 'ArrowRight' || k === 'd' || k === 'D') keyState.right = false;
  if (k === 'ArrowUp' || k === 'w' || k === 'W') keyState.up = false;
  if (k === 'ArrowDown' || k === 's' || k === 'S') keyState.down = false;
  recomputeMovementFromKeys();
});

// Limpa estado de teclas ao iniciar fade para não "grudar" direção
const _origStartSceneFade = startSceneFade;
startSceneFade = function (nextScene, opts = {}) {
  clearKeyState();
  // Ao iniciar a transição, sincroniza a opacidade do overlay (deixa 100% visível; o fade irá escurecer)
  try { if (typeof syncMediaOverlayFade === 'function') syncMediaOverlayFade(0); } catch (e) { /* silencioso */ }
  _origStartSceneFade(nextScene, opts);
};

update();
