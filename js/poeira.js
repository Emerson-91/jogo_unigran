/**
 * poeira.js - Sistema de Partículas de Poeira
 *
 * Gerencia a criação, física e renderização das partículas de poeira
 * geradas nos pés do personagem ao caminhar, correr ou aterrissar.
 */

// Lista global de partículas de poeira ativas
const dustParticles = [];

/**
 * Adiciona uma partícula de poeira individual.
 * @param {number} x - Posição X inicial.
 * @param {number} y - Posição Y inicial.
 * @param {number} vx - Velocidade X.
 * @param {number} vy - Velocidade Y.
 * @param {number} size - Tamanho inicial do círculo.
 * @param {number} alpha - Opacidade inicial (0 a 1).
 */
function spawnDustParticle(x, y, vx, vy, size, alpha = 0.6) {
  dustParticles.push({
    x: x + (Math.random() * 8 - 4),
    y: y + (Math.random() * 4 - 2),
    vx: vx || (Math.random() * 1.5 - 0.75),
    vy: vy || (-Math.random() * 0.8 - 0.2),
    size: size || (Math.random() * 4 + 3),
    alpha: alpha,
    maxAlpha: alpha,
    life: 0,
    maxLife: 18 + Math.floor(Math.random() * 10)
  });
}

/**
 * Dispara poeira dos pés do personagem ao caminhar.
 * @param {Object} player - Instância do personagem principal.
 */
function triggerFootstepDust(player) {
  if (!player) return;
  const feetX = player.x + player.w / 2;
  const feetY = player.y + player.h - 4;

  const dirX = player.dx > 0 ? -1 : (player.dx < 0 ? 1 : 0);
  spawnDustParticle(feetX, feetY, dirX * (Math.random() * 1.2 + 0.3), -Math.random() * 0.6 - 0.2, Math.random() * 4 + 3);
}

/**
 * Dispara poeira de impacto ao aterrissar de um pulo.
 * @param {Object} player - Instância do personagem principal.
 */
function triggerLandDust(player) {
  if (!player) return;
  const feetX = player.x + player.w / 2;
  const feetY = player.y + player.h - 4;

  for (let i = 0; i < 6; i++) {
    const vx = (i % 2 === 0 ? 1 : -1) * (Math.random() * 2 + 0.5);
    spawnDustParticle(feetX, feetY, vx, -Math.random() * 0.8 - 0.2, Math.random() * 5 + 4, 0.7);
  }
}

/**
 * Atualiza a física e renderiza todas as partículas de poeira no canvas.
 * @param {CanvasRenderingContext2D} ctx - Contexto 2D do Canvas.
 */
function updateAndDrawDustParticles(ctx) {
  for (let i = dustParticles.length - 1; i >= 0; i--) {
    const p = dustParticles[i];
    p.life++;
    p.x += p.vx;
    p.y += p.vy;
    p.size += 0.12; // A poeira se expande levemente
    p.alpha = p.maxAlpha * (1 - p.life / p.maxLife);

    if (p.life >= p.maxLife || p.alpha <= 0) {
      dustParticles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(215, 205, 190, ${p.alpha.toFixed(2)})`; // Tom sutil de poeira bege/terra
    ctx.fill();
    ctx.restore();
  }
}
