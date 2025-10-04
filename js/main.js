const DEFAULT_WIDTH = 1000;
const DEFAULT_HEIGHT = 600;
const PUZZLE_WIDTH = 1280;
const PUZZLE_HEIGHT = 720;
canvas.width = DEFAULT_WIDTH;
canvas.height = DEFAULT_HEIGHT;
const ctx = canvas.getContext("2d");

let player = new Player(50, 500);
let scene = "start";

// Mapeamento de backgrounds animados
const BACKGROUNDS = {
  fase1: ['assets/bg_fase1_1.png', 'assets/bg_fase1_2.png'],
  fasePredio: ['assets/bg_predio_1.png', 'assets/bg_predio_2.png'],
  hubExatas: ['assets/bg_exatas_1.png', 'assets/bg_exatas_2.png'],
  hubHumanas: ['assets/bg_humanas_1.png', 'assets/bg_humanas_2.png'],
  hubBiologicas: ['assets/bg_bio_1.png', 'assets/bg_bio_2.png'],
  curso: ['assets/bg_curso_1.png', 'assets/bg_curso_2.png'],
  puzzle: ['assets/bg_puzzle_1.png', 'assets/bg_puzzle_2.png'],
  fim: ['assets/bg_fim_1.png', 'assets/bg_fim_2.png']
  // Adicione outros conforme necessário
};

let bgFrame = 0;
let bgTimer = Date.now();

// Início do jogo
document.getElementById("startButton").addEventListener("click", () => {
  document.getElementById("startScreen").style.display = "none";
  canvas.style.display = "block";
  changeScene("fase1");
});

function changeScene(newScene) {
  scene = newScene;
  botoes = []; // resetar botões

  if (["fase1", "fasePredio", "curso1", "curso2", "curso3"].includes(scene)) {
    // tamanho padrão de jogo
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
    // AJUSTE: posição central, longe dos portais
    player.x = canvas.width / 2 - player.w / 2;
    player.y = canvas.height / 2 - player.h / 2;
    player.dx = 0;
    player.dy = 0;
  } else if (scene === "curso") {
    // curso em modo plataforma com pulo
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
    // expandir para puzzles/tela final
    if (canvas.width !== PUZZLE_WIDTH || canvas.height !== PUZZLE_HEIGHT) {
      canvas.width = PUZZLE_WIDTH;
      canvas.height = PUZZLE_HEIGHT;
    }
  }
}

function drawBackground(ctx, scene) {
  const bgs = BACKGROUNDS[scene];
  if (bgs) {
    // Alterna entre os dois PNGs a cada 1 segundo
    if (Date.now() - bgTimer > 1000) {
      bgFrame = (bgFrame + 1) % 2;
      bgTimer = Date.now();
    }
    const img = new Image();
    img.src = bgs[bgFrame];
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    // Se não carregar, usa cor padrão
    img.onerror = () => {
      ctx.fillStyle = "#0066cc"; // cor padrão do index
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    // Se já carregou, desenha imediatamente
    if (img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  } else {
    // Se não houver PNG, cor padrão
    ctx.fillStyle = "#0066cc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// Exemplo de uso em cada renderização de tela
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenha o background animado
  drawBackground(ctx, scene);

  if (scene === "fase1") fase1(ctx, player, changeScene, canvas);
  else if (scene === "fasePredio") fasePredio(ctx, player, changeScene, canvas);
  else if (scene === "dialogoNPC") dialogoNPC(ctx, changeScene, canvas);
  else if (scene === "explicacaoHumanas") explicacaoArea(ctx, changeScene, canvas, "Área de Humanas", "Cursos ligados à sociedade, comunicação, história e direito.", "hubHumanas");
  else if (scene === "explicacaoExatas") explicacaoArea(ctx, changeScene, canvas, "Área de Exatas", "Cursos que envolvem cálculos, lógica, engenharias e tecnologia.", "hubExatas");
  else if (scene === "explicacaoBiologicas") explicacaoArea(ctx, changeScene, canvas, "Área de Biológicas", "Cursos que estudam a vida, saúde e meio ambiente.", "hubBiologicas");
  else if (scene === "hubExatas") hubExatas(ctx, player, changeScene, canvas);
  else if (scene === "hubHumanas") hubHumanas(ctx, player, changeScene, canvas);
  else if (scene === "hubBiologicas") hubBiologicas(ctx, player, changeScene, canvas);
  else if (scene === "dialogoCurso") dialogoCurso(ctx, changeScene, canvas);
  else if (scene === "dialogoCursoInfo") dialogoCursoInfo(ctx, changeScene, canvas);
  else if (scene === "puzzle") renderPuzzle(ctx, canvas, changeScene);
  else if (scene === "curso") faseCurso(ctx, player, canvas, window.currentCursoName || "Curso", changeScene);
  else if (scene === "fim") cenaFim(ctx, canvas);

  requestAnimationFrame(update);
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft":
    case "a":
    case "A":
      player.dx = -player.speed;
      break;
    case "ArrowRight":
    case "d":
    case "D":
      player.dx = player.speed;
      break;
    case "ArrowUp":
    case "w":
    case "W":
      if (player.mode === "plataforma" && !player.jumping) {
        player.velY = -10;
        player.jumping = true;
      } else if (player.mode === "livre") {
        player.dy = -player.speed;
      }
      break;
    case "ArrowDown":
    case "s":
    case "S":
      if (player.mode === "livre") {
        player.dy = player.speed;
      }
      break;
  }
});

document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowLeft":
    case "ArrowRight":
    case "a":
    case "A":
    case "d":
    case "D":
      player.dx = 0;
      break;
    case "ArrowUp":
    case "ArrowDown":
    case "w":
    case "W":
    case "s":
    case "S":
      player.dy = 0;
      break;
  }
});

update();
