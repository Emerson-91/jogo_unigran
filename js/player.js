class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 80; // largura base do Unicão
    this.h = 100; // altura base do Unicão
    this.dx = 0;
    this.dy = 0;
    this.velY = 0;
    this.jumping = false;
    this.speed = 4;
    this.mode = "plataforma"; // ou "livre"

    // Estado de direção: 'idle', 'right', 'left'
    this.direction = 'idle';
    this.lastNonZeroDir = 'right'; // usado para manter pose olhando para frente ao parar

    // Controle de animação
    this.animTimer = Date.now();
    this.animFrame = 0;
    this.animInterval = 250; // ms

    // Sprites pré-carregados
    this.sprites = {
      idle: [ 'assets/unicao/parado1.png', 'assets/unicao/parado2.png' ].map(src => { const i=new Image(); i.src=src; return i; }),
      right: [ 'assets/unicao/frente1.png', 'assets/unicao/frente2.png' ].map(src => { const i=new Image(); i.src=src; return i; }),
      left: [ 'assets/unicao/tras1.png', 'assets/unicao/tras2.png' ].map(src => { const i=new Image(); i.src=src; return i; })
    };

    // Sprites específicos para modo livre (hubs) usando nomes fornecidos
    this.spritesLivre = {
      right: [ 'assets/unicao/frente1.png', 'assets/unicao/frente2.png' ].map(s=>{const i=new Image(); i.src=s; return i;}),
      left: [ 'assets/unicao/tras1.png', 'assets/unicao/tras2.png' ].map(s=>{const i=new Image(); i.src=s; return i;}),
      up: [ 'assets/unicao/cima1.png', 'assets/unicao/cima2.png' ].map(s=>{const i=new Image(); i.src=s; return i;}),
      down: [ 'assets/unicao/baixo1.png', 'assets/unicao/baixo2.png' ].map(s=>{const i=new Image(); i.src=s; return i;}),
      idle: [ 'assets/unicao/parado1.png', 'assets/unicao/parado2.png' ].map(s=>{const i=new Image(); i.src=s; return i;})
    };

    // Direção cardinal para hubs
    this.freeDir = 'idle';
  }

  updatePlataforma(groundY) {
    this.x += this.dx;

    // Atualiza direção para animação apenas em modo plataforma
    if (this.dx > 0) {
      this.direction = 'right';
      this.lastNonZeroDir = 'right';
    } else if (this.dx < 0) {
      this.direction = 'left';
      this.lastNonZeroDir = 'left';
    } else {
      this.direction = 'idle';
    }

    // gravidade
    this.y += this.velY;
    if (this.y + this.h < groundY) {
      this.velY += 0.5;
      this.jumping = true;
    } else {
      this.y = groundY - this.h;
      this.velY = 0;
      this.jumping = false;
    }

    // limites horizontais
    if (this.x < 0) this.x = 0;
    if (this.x + this.w > 1000) this.x = 1000 - this.w;
  }

  updateLivre(canvas) {
    this.x += this.dx;
    this.y += this.dy;

    // Em modo livre, considerar movimento horizontal para escolha de sprite
    // Define direção principal (prioridade vertical caso haja movimento vertical forte)
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

    // Mantém compatibilidade com lógica existente caso algo use this.direction
    if (this.dx > 0) { this.direction = 'right'; this.lastNonZeroDir = 'right'; }
    else if (this.dx < 0) { this.direction = 'left'; this.lastNonZeroDir = 'left'; }
    else this.direction = 'idle';

    // limites da tela
    if (this.x < 0) this.x = 0;
    if (this.y < 0) this.y = 0;
    if (this.x + this.w > canvas.width) this.x = canvas.width - this.w;
    if (this.y + this.h > canvas.height) this.y = canvas.height - this.h;
  }

  draw(ctx) {
    let frames;
    if (this.mode === 'livre') {
      let k = this.freeDir;
      if (!this.spritesLivre[k]) k = 'idle';
      frames = this.spritesLivre[k];
    } else {
      // plataforma mantém a lógica original (somente left/right/idle)
      let key = this.direction;
      if (key === 'idle') key = 'idle';
      frames = this.sprites[key] || this.sprites.idle;
    }

    // Atualiza frame animado
    if (Date.now() - this.animTimer > this.animInterval) {
      this.animFrame = (this.animFrame + 1) % frames.length;
      this.animTimer = Date.now();
    }

    const img = frames[this.animFrame];

    // Ajuste visual: ao subir (freeDir = 'up') no modo livre, diminui a largura para efeito de "afunilar".
    let drawX = this.x;
    let drawW = this.w;
    let drawH = this.h;
    if (this.mode === 'livre' && this.freeDir === 'up') {
      drawW = Math.round(this.w * 0.60); // 15% menor
      drawX = this.x + (this.w - drawW) / 2; // centraliza a sprite reduzida sem alterar colisão real
    }

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
