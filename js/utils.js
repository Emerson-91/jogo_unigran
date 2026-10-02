/**
 * utils.js - Funções Utilitárias e Auxiliares do Canvas
 * 
 * Inclui:
 * 1. Gerenciador e cache de imagens.
 * 2. Controle de overlays de mídia (GIFs de quiz/desafios).
 * 3. Criação de botões interativos e escuta de eventos do mouse/teclado.
 * 4. Lógica de Drag & Drop para os minijogos/puzzles.
 * 5. Detecção de colisões e gerador de balões de fala (Speech Bubbles).
 */

const canvas = document.getElementById("gameCanvas");
let botoes = [];
let hoverBtnIndex = -1;

// ==========================================
// CACHE DE IMAGENS (Evita piscadas na renderização)
// ==========================================
const __imageCache = {};
function getImage(src) {
  if (!src) return null;
  if (!__imageCache[src]) {
    const img = new Image();
    img.src = src;
    __imageCache[src] = img;
  }
  return __imageCache[src];
}

// ==========================================
// OVERLAY DE MÍDIA (GIFs animados e vídeos)
// ==========================================
let __mediaOverlayEl = null;

function ensureMediaOverlay() {
  if (__mediaOverlayEl) return __mediaOverlayEl;
  const img = document.createElement('img');
  img.style.position = 'absolute';
  img.style.pointerEvents = 'none';
  img.style.userSelect = 'none';
  img.style.zIndex = '9999';
  img.style.display = 'none';
  img.style.transition = 'opacity 150ms linear';
  img.style.opacity = '1';
  document.body.appendChild(img);
  __mediaOverlayEl = img;
  return __mediaOverlayEl;
}

function setMediaOverlay(mediaBox, src) {
  try { if (typeof scene !== 'undefined' && scene === 'fim') { hideMediaOverlay(); return; } } catch (e) { }
  const el = ensureMediaOverlay();
  const rect = canvas.getBoundingClientRect();
  const scaleX = rect.width / canvas.width;
  const scaleY = rect.height / canvas.height;
  const left = rect.left + mediaBox.x * scaleX;
  const top = rect.top + mediaBox.y * scaleY;
  const w = mediaBox.maxW * scaleX;
  const h = mediaBox.maxH * scaleY;
  el.style.left = `${left}px`;
  el.style.top = `${top}px`;
  el.style.width = `${w}px`;
  el.style.height = `${h}px`;
  if (el.src !== src) el.src = src;
  el.style.display = 'block';

  try {
    if (window.sceneTransition && window.sceneTransition.active) {
      const a = window.sceneTransition.alpha || 0;
      el.style.opacity = String(1 - a);
    } else {
      el.style.opacity = '1';
    }
  } catch (e) { }
}

function hideMediaOverlay() {
  if (__mediaOverlayEl) __mediaOverlayEl.style.display = 'none';
}

function syncMediaOverlayFade(alpha) {
  if (!__mediaOverlayEl) return;
  if (typeof scene !== 'undefined' && scene === 'fim') { hideMediaOverlay(); return; }
  __mediaOverlayEl.style.opacity = String(1 - Math.max(0, Math.min(1, alpha)));
}

function updateMediaOverlayPosition(mediaBox) {
  if (!__mediaOverlayEl || !mediaBox) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = rect.width / canvas.width;
  const scaleY = rect.height / canvas.height;
  __mediaOverlayEl.style.left = `${rect.left + mediaBox.x * scaleX}px`;
  __mediaOverlayEl.style.top = `${rect.top + mediaBox.y * scaleY}px`;
  __mediaOverlayEl.style.width = `${mediaBox.maxW * scaleX}px`;
  __mediaOverlayEl.style.height = `${mediaBox.maxH * scaleY}px`;
}

// ==========================================
// INTERFACES E BOTÕES
// ==========================================

/**
 * Converte coordenadas da tela (mouse) para as coordenadas internas do Canvas.
 */
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

/**
 * Desenha um botão retangular estilizado com cantos arredondados e registra a ação de clique.
 */
function criarBotao(ctx, x, y, w, h, texto, acao) {
  const azul = "#0053A0";
  const azulHover = "#1976d2";
  const dourado = "#FDB515";
  const radius = 18;

  const linhas = String(texto).split('\n');
  const fontBase = 20;
  const lineHeight = 22;
  const totalTextHeight = linhas.length * lineHeight;
  if (totalTextHeight + 16 > h) {
    h = totalTextHeight + 16;
  }

  let idx = botoes.length;
  let isHover = idx === hoverBtnIndex;

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

  // Efeito de destaque pulsante para hover/foco
  if (isHover) {
    const t = (performance.now() / 400) % 1;
    const pulse = 0.4 + 0.6 * Math.sin(t * Math.PI * 2) * 0.5;
    ctx.save();
    ctx.strokeStyle = `rgba(253,181,21,${pulse.toFixed(3)})`;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(x + radius, y - 2);
    ctx.lineTo(x + w - radius, y - 2);
    ctx.quadraticCurveTo(x + w + 2, y - 2, x + w + 2, y + radius);
    ctx.lineTo(x + w + 2, y + h - radius);
    ctx.quadraticCurveTo(x + w + 2, y + h + 2, x + w - radius, y + h + 2);
    ctx.lineTo(x + radius, y + h + 2);
    ctx.quadraticCurveTo(x - 2, y + h + 2, x - 2, y + h - radius);
    ctx.lineTo(x - 2, y + radius);
    ctx.quadraticCurveTo(x - 2, y - 2, x + radius, y - 2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  // Renderiza texto do botão
  ctx.fillStyle = "#ffffff";
  ctx.font = `${fontBase}px 'Arial'`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const startY = y + (h - totalTextHeight) / 2;
  linhas.forEach((ln, i) => {
    ctx.fillText(ln, x + w / 2, startY + i * lineHeight);
  });

  ctx.restore();
  botoes.push({ x, y, w, h, acao });
}

/**
 * Registra uma área invisível clicável no canvas.
 */
function criarHitArea(x, y, w, h, acao) {
  botoes.push({ x, y, w, h, acao });
}

// Evento de clique no canvas para ativar os botões
canvas.addEventListener("click", (e) => {
  const mouse = getMousePos(e);
  botoes.forEach(btn => {
    if (mouse.x > btn.x && mouse.x < btn.x + btn.w &&
      mouse.y > btn.y && mouse.y < btn.y + btn.h) {
      if (typeof playButtonClickSound === 'function') playButtonClickSound();
      btn.acao();
    }
  });
});

// Suporte a navegação entre botões por teclado (Setas + Enter/Espaço)
document.addEventListener('keydown', (e) => {
  if (!botoes || botoes.length === 0) return;
  const key = e.key;
  if (key === 'ArrowRight' || key === 'ArrowDown') {
    if (hoverBtnIndex === -1) hoverBtnIndex = 0; else hoverBtnIndex = (hoverBtnIndex + 1) % botoes.length;
    e.preventDefault();
  } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
    if (hoverBtnIndex === -1) hoverBtnIndex = botoes.length - 1; else hoverBtnIndex = (hoverBtnIndex - 1 + botoes.length) % botoes.length;
    e.preventDefault();
  } else if (key === 'Enter' || key === ' ') {
    if (hoverBtnIndex >= 0 && hoverBtnIndex < botoes.length) {
      const btn = botoes[hoverBtnIndex];
      if (btn && typeof btn.acao === 'function') {
        e.preventDefault();
        if (typeof playButtonClickSound === 'function') playButtonClickSound();
        btn.acao();
      }
    }
  }
});

// ==========================================
// ARRASTAR E SOLTAR (Minijogos e Puzzles)
// ==========================================
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
  if (ps.draggingId) {
    const obj = (ps.objetos || []).find(o => o.id === ps.draggingId);
    if (obj) {
      if (ps.modo === 'formas') {
        const slot = (ps.alvos || []).find(a => a.role === obj.role);
        if (slot) {
          const overlap = intersect(obj, slot);
          const cx = obj.x + obj.w / 2, cy = obj.y + obj.h / 2;
          const sx = slot.x + slot.w / 2, sy = slot.y + slot.h / 2;
          const dist = Math.hypot(cx - sx, cy - sy);
          const THRESHOLD = Math.max(24, Math.min(slot.w, slot.h) * 0.35);
          if (overlap || dist < THRESHOLD) {
            obj.x = slot.x; obj.y = slot.y; obj.w = slot.w; obj.h = slot.h;
          }
        }
      } else if (ps.modo === 'ordem') {
        const cx = obj.x + obj.w / 2;
        const cy = obj.y + obj.h / 2;
        let best = null; let bestDist = Infinity;
        (ps.alvos || []).forEach(slot => {
          const sx = slot.x + slot.w / 2;
          const sy = slot.y + slot.h / 2;
          const dist = Math.hypot(cx - sx, cy - sy);
          if (dist < bestDist) { bestDist = dist; best = slot; }
        });
        const LIMIAR = 140;
        if (best && bestDist < LIMIAR) {
          obj.x = best.x; obj.y = best.y;
        }
      } else if (ps.modo === 'associacao') {
        const alvo = (ps.alvos || []).find(a => a.role === obj.role);
        if (alvo) {
          const overlap = intersect(obj, alvo);
          const cx = obj.x + obj.w / 2, cy = obj.y + obj.h / 2;
          const sx = alvo.x + alvo.w / 2, sy = alvo.y + alvo.h / 2;
          const dist = Math.hypot(cx - sx, cy - sy);
          const LIMIAR = Math.max(24, Math.min(alvo.w, alvo.h) * 0.45);
          if (overlap || dist < LIMIAR) {
            const pad = 4;
            obj.x = alvo.x + pad;
            obj.y = alvo.y + pad;
            if (obj.w > alvo.w - pad * 2) obj.w = Math.max(20, alvo.w - pad * 2);
            if (obj.h > alvo.h - pad * 2) obj.h = Math.max(20, alvo.h - pad * 2);
          }
        }
      }
    }
  }
  window.puzzleState.draggingId = null;
});

// ==========================================
// COLISÕES E HELPERS MATEMÁTICOS
// ==========================================
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

function colide(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

// ==========================================
// BALÃO DE FALA (Speech Bubble)
// ==========================================
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
    const rawLines = text.split(/\n/);
    const lines = [];
    rawLines.forEach(segment => {
      const words = segment.split(/\s+/);
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
    });

    let colLines = lines;
    const columns = options.columns && options.columns > 1 ? Math.min(options.columns, 4) : 1;
    let matrix = [];
    if (columns > 1) {
      const bulletStartIndex = colLines.findIndex((l, idx) => idx > 0 && /^•\s?/.test(l));
      if (bulletStartIndex !== -1) {
        const header = colLines.slice(0, bulletStartIndex);
        const bullets = colLines.slice(bulletStartIndex);
        const perCol = Math.ceil(bullets.length / columns);
        matrix = header.map(h => [h]);
        const bulletCols = [];
        for (let c = 0; c < columns; c++) {
          bulletCols.push(bullets.slice(c * perCol, (c + 1) * perCol));
        }
        colLines = header.concat(bulletCols.flat());
        wrapWithFont._layout = { header, bulletCols, columns };
      } else {
        wrapWithFont._layout = null;
      }
    } else {
      wrapWithFont._layout = null;
    }
    const lineHeight = size * 1.2;
    const totalH = lines.length * lineHeight + padding * 2;
    return { lines: colLines, lineHeight, totalH, layout: wrapWithFont._layout };
  }

  let wrap = wrapWithFont(fontSize);
  while (wrap.totalH > h && fontSize > minFont) {
    fontSize -= 1;
    wrap = wrapWithFont(fontSize);
  }

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

  ctx.fillStyle = options.textColor ?? '#00315E';
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textAlign = "center";
  const startY = y + padding;
  const centerX = x + w / 2;
  let ty = startY;
  if (wrap.layout && wrap.layout.columns > 1) {
    const { header, bulletCols, columns } = wrap.layout;
    let ty2 = y + padding;
    header.forEach(hline => {
      ctx.fillText(hline, centerX, ty2);
      ty2 += wrap.lineHeight;
    });
    const usableW = w - padding * 2;
    const colW = usableW / columns;
    const startX = x + padding;
    for (let c = 0; c < bulletCols.length; c++) {
      const col = bulletCols[c];
      const colCenter = startX + colW * c + colW / 2;
      let rowY = ty2;
      col.forEach(bLine => {
        ctx.fillText(bLine, colCenter, rowY);
        rowY += wrap.lineHeight;
      });
    }
  } else {
    wrap.lines.forEach(lineText => {
      ctx.fillText(lineText, centerX, ty);
      ty += wrap.lineHeight;
    });
  }

  ctx.restore();
}
