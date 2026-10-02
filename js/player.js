/**
 * player.js - Classe do Personagem Principal (Unicão)
 * 
 * Gerencia posicionamento, movimentação (Plataforma e Livre/Hubs),
 * estados de animação de sprites, pulo, gravidade, poeira e sons de passos.
 */
class Player {
  /**
   * Inicializa o jogador nas coordenadas (x, y).
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 80;  // Largura base do Unicão
    this.h = 100; // Altura base do Unicão
    this.dx = 0;
    this.dy = 0;
    this.velY = 0;
    this.jumping = false;
    this.wasJumping = false; // Auxiliar para detectar aterrissagem
    this.speed = 4;
    this.mode = "plataforma"; // Modos: "plataforma" ou "livre"

    // Estado de direção do personagem
    this.direction = 'idle';
    this.lastNonZeroDir = 'right';
    this.freeDir = 'idle';

    // Controle de animação da sprite
    this.animTimer = Date.now();
    this.animFrame = 0;
    this.animInterval = 250; // Intervalo de troca de frame em ms

    // Temporizador para sincronizar som de passos e poeira
    this.stepTimer = 0;
    this.stepInterval = 220; // ms entre cada passo ao caminhar

    // Carregamento dos sprites de plataforma
    this.sprites = {
      idle: ['assets/unicao/parado1.png', 'assets/unicao/parado2.png'].map(src => { const i = new Image(); i.src = src; return i; }),
      right: ['assets/unicao/frente1.png', 'assets/unicao/frente2.png'].map(src => { const i = new Image(); i.src = src; return i; }),
      left: ['assets/unicao/tras1.png', 'assets/unicao/tras2.png'].map(src => { const i = new Image(); i.src = src; return i; })
    };

    // Carregamento dos sprites de modo livre (Hubs de áreas)
    this.spritesLivre = {
      right: ['assets/unicao/frente1.png', 'assets/unicao/frente2.png'].map(s => { const i = new Image(); i.src = s; return i; }),
      left: ['assets/unicao/tras1.png', 'assets/unicao/tras2.png'].map(s => { const i = new Image(); i.src = s; return i; }),
      up: ['assets/unicao/cima1.png', 'assets/unicao/cima2.png'].map(s => { const i = new Image(); i.src = s; return i; }),
      down: ['assets/unicao/baixo1.png', 'assets/unicao/baixo2.png'].map(s => { const i = new Image(); i.src = s; return i; }),
      idle: ['assets/unicao/parado1.png', 'assets/unicao/parado2.png'].map(s => { const i = new Image(); i.src = s; return i; })
    };
  }

  /**
   * Atualiza física, gravidade e colisão em modo plataforma.
   * @param {number} groundY - Altura do chão.
   */
  updatePlataforma(groundY) {
    this.x += this.dx;

    // Atualiza direção visual
    if (this.dx > 0) {
      this.direction = 'right';
      this.lastNonZeroDir = 'right';
    } else if (this.dx < 0) {
      this.direction = 'left';
      this.lastNonZeroDir = 'left';
    } else {
      this.direction = 'idle';
    }

    // Aplica gravidade e verifica chão
    this.y += this.velY;
    if (this.y + this.h < groundY) {
      this.velY += 0.5;
      this.jumping = true;
    } else {
      this.y = groundY - this.h;
      this.velY = 0;

      // Se acabou de aterrissar, dispara poeira e som de impacto
      if (this.wasJumping) {
        if (typeof triggerLandDust === 'function') triggerLandDust(this);
        if (typeof playLandSound === 'function') playLandSound();
      }
      this.jumping = false;
    }
    this.wasJumping = this.jumping;

    // Emite som de passos e poeira ao caminhar no chão
    if (this.dx !== 0 && !this.jumping) {
      const now = Date.now();
      if (now - this.stepTimer > this.stepInterval) {
        if (typeof playFootstepSound === 'function') playFootstepSound();
        if (typeof triggerFootstepDust === 'function') triggerFootstepDust(this);
        this.stepTimer = now;
      }
    }

    // Limites horizontais da tela
    if (this.x < 0) this.x = 0;
    if (this.x + this.w > 1000) this.x = 1000 - this.w;
  }

  /**
   * Atualiza movimentação livre de 8 direções nos Hubs.
   * @param {HTMLCanvasElement} canvas - Elemento canvas do jogo.
   */
  updateLivre(canvas) {
    this.x += this.dx;
    this.y += this.dy;

    // Define direção cardinal para escolha da sprite
    if (Math.abs(this.dy) > Math.abs(this.dx)) {
      if (this.dy < 0) this.freeDir = 'up';
      else if (this.dy > 0) this.freeDir = 'down';
      else if (this.dx > 0) this.freeDir = 'right';
      else if (this.dx < 0) this.freeDir = 'left';
      else this.freeDir = 'idle';
    } else {
      if (this.dx > 0) this.freeDir = 'right';
      else if (this.dx < 0) this.freeDir = 'left';
      else if (this.dy < 0) this.freeDir = 'up';
      else if (this.dy > 0) this.freeDir = 'down';
      else this.freeDir = 'idle';
    }

    if (this.dx > 0) { this.direction = 'right'; this.lastNonZeroDir = 'right'; }
    else if (this.dx < 0) { this.direction = 'left'; this.lastNonZeroDir = 'left'; }
    else this.direction = 'idle';

    // Emite som de passos e poeira em modo livre
    if (this.dx !== 0 || this.dy !== 0) {
      const now = Date.now();
      if (now - this.stepTimer > this.stepInterval) {
        if (typeof playFootstepSound === 'function') playFootstepSound();
        if (typeof triggerFootstepDust === 'function') triggerFootstepDust(this);
        this.stepTimer = now;
      }
    }

    // Limites da tela
    if (this.x < 0) this.x = 0;
    if (this.y < 0) this.y = 0;
    if (this.x + this.w > canvas.width) this.x = canvas.width - this.w;
    if (this.y + this.h > canvas.height) this.y = canvas.height - this.h;
  }

  /**
   * Desenha as partículas de poeira e a sprite atual do Unicão.
   * @param {CanvasRenderingContext2D} ctx - Contexto de renderização do canvas.
   */
  draw(ctx) {
    // Renderiza as partículas de poeira nos pés antes do personagem
    if (typeof updateAndDrawDustParticles === 'function') {
      updateAndDrawDustParticles(ctx);
    }

    let frames;
    if (this.mode === 'livre') {
      let k = this.freeDir;
      if (!this.spritesLivre[k]) k = 'idle';
      frames = this.spritesLivre[k];
    } else {
      let key = this.direction;
      frames = this.sprites[key] || this.sprites.idle;
    }

    // Alterna o frame da animação
    if (Date.now() - this.animTimer > this.animInterval) {
      this.animFrame = (this.animFrame + 1) % frames.length;
      this.animTimer = Date.now();
    }

    const img = frames[this.animFrame];

    // Ajuste visual ao andar para cima no modo livre (efeito de perspectiva)
    let drawX = this.x;
    let drawW = this.w;
    let drawH = this.h;
    if (this.mode === 'livre' && this.freeDir === 'up') {
      drawW = Math.round(this.w * 0.60);
      drawX = this.x + (this.w - drawW) / 2;
    }

    // Renderiza a imagem do sprite
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, drawX, this.y, drawW, drawH);
    } else if (img) {
      img.onload = () => ctx.drawImage(img, drawX, this.y, drawW, drawH);
      ctx.fillStyle = '#0053A0';
      ctx.fillRect(drawX, this.y, drawW, drawH);
    } else {
      ctx.fillStyle = '#0053A0';
      ctx.fillRect(drawX, this.y, drawW, drawH);
    }
  }
}
