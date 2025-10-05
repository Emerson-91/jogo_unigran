const canvas = document.getElementById("gameCanvas");
let botoes = [];
let hoverBtnIndex = -1;

// Normaliza coordenadas do mouse para o tamanho real do canvas
function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
}

canvas.addEventListener("mousemove", (e) => {
  const mouse = getMousePos(e);
  hoverBtnIndex = -1;
  botoes.forEach((btn, idx) => {
    if (
      mouse.x > btn.x && mouse.x < btn.x + btn.w &&
      mouse.y > btn.y && mouse.y < btn.y + btn.h
    ) {
      hoverBtnIndex = idx;
    }
  });
});

function criarBotao(ctx, x, y, w, h, texto, acao) {
  const azul = "#0053A0";
  const azulHover = "#1976d2";
  const dourado = "#FDB515";
  const radius = 18;

  // Detecta se está em hover
  let idx = botoes.length;
  let isHover = idx === hoverBtnIndex;

  // Retângulo arredondado
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fillStyle = isHover ? azulHover : azul;
  ctx.fill();
  ctx.strokeStyle = dourado;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Texto centralizado
  ctx.fillStyle = "#ffffff";
  ctx.font = "20px 'Arial'";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(texto, x + w / 2, y + h / 2);

  ctx.restore();

  botoes.push({ x, y, w, h, acao });
}

function criarHitArea(x, y, w, h, acao) {
  botoes.push({ x, y, w, h, acao });
}

// Clique nos botões
canvas.addEventListener("click", (e) => {
  const mouse = getMousePos(e);
  botoes.forEach(btn => {
    if (mouse.x > btn.x && mouse.x < btn.x + btn.w &&
      mouse.y > btn.y && mouse.y < btn.y + btn.h) {
      btn.acao();
    }
  });
});

// Arrastar e soltar para puzzle
canvas.addEventListener("mousedown", (e) => {
  if (!window.puzzleState || !window.puzzleState.ativo) return;
  const mouse = getMousePos(e);
  const obj = (window.puzzleState.objetos || []).slice().reverse().find(o => pointInside(mouse.x, mouse.y, o));
  if (obj) {
    window.puzzleState.draggingId = obj.id;
    window.puzzleState.offset = { x: mouse.x - obj.x, y: mouse.y - obj.y };
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (!window.puzzleState || !window.puzzleState.ativo) return;
  if (!window.puzzleState.draggingId) return;
  const mouse = getMousePos(e);
  const obj = (window.puzzleState.objetos || []).find(o => o.id === window.puzzleState.draggingId);
  if (obj) {
    obj.x = mouse.x - window.puzzleState.offset.x;
    obj.y = mouse.y - window.puzzleState.offset.y;
  }
});

canvas.addEventListener("mouseup", () => {
  if (!window.puzzleState || !window.puzzleState.ativo) return;
  const ps = window.puzzleState;
  if (ps.modo === 'formas' && ps.draggingId) {
    const obj = (ps.objetos || []).find(o => o.id === ps.draggingId);
    if (obj) {
      const slot = (ps.alvos || []).find(a => a.role === obj.role && intersect(obj, a));
      if (slot) {
        obj.x = slot.x;
        obj.y = slot.y;
      }
    }
  }
  window.puzzleState.draggingId = null;
});

function pointInside(px, py, r) {
  return px > r.x && px < r.x + r.w && py > r.y && py < r.y + r.h;
}

function intersect(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function insideBox(a, b) {
  return a.x >= b.x && a.y >= b.y && (a.x + a.w) <= (b.x + b.w) && (a.y + a.h) <= (b.y + b.h);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  let words = text.split(" ");
  let line = "";

  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + " ";
    let metrics = ctx.measureText(testLine);
    let testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

function colide(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

/**
 * Desenha um balão de fala com texto ajustado ao caixa.
 * options:
 *  - padding (px)
 *  - radius (px) borda arredondada
 *  - arrow: { x, y, size }
 *  - fontFamily
 */
function drawSpeechBubble(ctx, x, y, w, h, text, options = {}) {
  const padding = options.padding ?? 12;
  const radius = options.radius ?? 10;
  const arrow = options.arrow ?? null;
  const fontFamily = options.fontFamily ?? 'Arial';
  let fontSize = options.fontSize ?? 20;
  const minFont = options.minFont ?? 12;
  ctx.textBaseline = 'top';

  function wrapWithFont(size) {
    ctx.font = `${size}px ${fontFamily}`;
    const maxW = Math.max(10, w - padding * 2);
    const words = text.split(/\s+/);
    const lines = [];
    let line = '';
    for (let i = 0; i < words.length; i++) {
      const test = line ? line + ' ' + words[i] : words[i];
      const metrics = ctx.measureText(test);
      if (metrics.width > maxW && line) {
        lines.push(line);
        line = words[i];
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    const lineHeight = size * 1.2;
    const totalH = lines.length * lineHeight + padding * 2;
    return { lines, lineHeight, totalH };
  }

  let wrap = wrapWithFont(fontSize);
  while (wrap.totalH > h && fontSize > minFont) {
    fontSize -= 1;
    wrap = wrapWithFont(fontSize);
  }

  // desenha caixa arredondada
  ctx.save();
  ctx.fillStyle = options.bgColor ?? 'white';
  ctx.strokeStyle = options.borderColor ?? '#0053A0';
  ctx.lineWidth = options.borderWidth ?? 3;
  const r = radius;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  if (arrow && arrow.x >= x && arrow.x <= x + w) {
    const arrowW = arrow.size ?? 18;
    const arrowH = (arrow.size ?? 18);
    const ax = Math.min(x + w - r - 10, Math.max(x + r + 10, arrow.x - arrowW / 2));
    ctx.lineTo(ax + arrowW / 2, y + h);
    ctx.lineTo(ax, y + h + arrowH);
    ctx.lineTo(ax - arrowW / 2, y + h);
  }
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Texto centralizado
  ctx.fillStyle = options.textColor ?? '#00315E';
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textAlign = "center";
  const startY = y + padding;
  const centerX = x + w / 2;
  let ty = startY;
  wrap.lines.forEach(lineText => {
    ctx.fillText(lineText, centerX, ty);
    ty += wrap.lineHeight;
  });

  ctx.restore();
}
