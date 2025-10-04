// --- Player ---
let player = {
  x: 50,
  y: 520,
  width: 40,
  height: 40,
  speed: 5,
  dx: 0,
  dy: 0
};

function drawPlayer() {
  ctx.fillStyle = "red"; // placeholder (será sprite futuramente)
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function movePlayer() {
  player.x += player.dx;
  player.y += player.dy;

  // limites da tela
  if (player.x < 0) player.x = 0;
  if (player.y < 0) player.y = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

// Controle teclado
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") player.dx = player.speed;
  if (e.key === "ArrowLeft") player.dx = -player.speed;
  if (e.key === "ArrowUp") player.dy = -player.speed;
  if (e.key === "ArrowDown") player.dy = player.speed;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") player.dx = 0;
  if (e.key === "ArrowUp" || e.key === "ArrowDown") player.dy = 0;
});

// --- Fase 1: Plataforma inicial ---
function fase1Loop() {
  ctx.fillStyle = 'lightblue';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // chão
  ctx.fillStyle = 'green';
  ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

  // prédio
  ctx.fillStyle = 'brown';
  ctx.fillRect(canvas.width - 200, canvas.height - 300, 200, 300);

  // texto
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText('Chegue até o prédio para escolher sua área!', 50, 50);

  drawPlayer();
  movePlayer();

  // colisão com prédio
  if (player.x + player.width > canvas.width - 200 &&
    player.y + player.height > canvas.height - 300) {
    changeScene("fasePredio"); // vai para a cena do prédio com NPC
  }
}
