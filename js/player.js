class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 50;
    this.h = 50;
    this.dx = 0;
    this.dy = 0;
    this.velY = 0;
    this.jumping = false;
    this.speed = 4;
    this.mode = "plataforma"; // ou "livre"
  }

  updatePlataforma(groundY) {
    this.x += this.dx;

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

    // limites da tela
    if (this.x < 0) this.x = 0;
    if (this.y < 0) this.y = 0;
    if (this.x + this.w > canvas.width) this.x = canvas.width - this.w;
    if (this.y + this.h > canvas.height) this.y = canvas.height - this.h;
  }

  draw(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}
