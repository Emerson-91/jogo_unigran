// Hub: Escolha da área
function hubLoop() {
  ctx.fillStyle = 'lightgray';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.font = '24px PressStart2P-Regular';
  ctx.fillText('Escolha sua área: Exatas, Humanas ou Biológicas', 50, 50);
}
