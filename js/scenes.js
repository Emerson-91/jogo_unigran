
// Carregamento global usando cache (getImage definido em utils.js)
const npcDefaultImg = getImage("assets/npcs/npc_default.png");
let npcDefaultLoaded = npcDefaultImg && npcDefaultImg.complete && npcDefaultImg.naturalWidth > 0;
if (!npcDefaultLoaded && npcDefaultImg) {
  npcDefaultImg.onload = () => { npcDefaultLoaded = true; };
}

const NPC_ANIM_IMAGES = {
  "Administração": [
    "assets/npcs/npc_admin1.png",
    "assets/npcs/npc_admin2.png"
  ],
  "Arquitetura e Urbanismo": [
    "assets/npcs/npc_arquitetura1.png",
    "assets/npcs/npc_arquitetura2.png"
  ],
  "Ciências Contábeis": [
    "assets/npcs/npc_contabeis1.png",
    "assets/npcs/npc_contabeis2.png"
  ],
  "Design de Interiores": [
    "assets/npcs/npc_design1.png",
    "assets/npcs/npc_design2.png"
  ],
  "Engenharia de Software": [
    "assets/npcs/npc_software1.png",
    "assets/npcs/npc_software2.png"
  ],
  "Estética e Cosmética": [
    "assets/npcs/npc_estetica1.png",
    "assets/npcs/npc_estetica2.png"
  ],
  "Biomedicina": [
    "assets/npcs/npc_biomedicina1.png",
    "assets/npcs/npc_biomedicina2.png"
  ],
  "Educação Física": [
    "assets/npcs/npc_edfisica1.png",
    "assets/npcs/npc_edfisica2.png"
  ],
  "Enfermagem": [
    "assets/npcs/npc_enfermagem1.png",
    "assets/npcs/npc_enfermagem2.png"
  ],
  "Fisioterapia": [
    "assets/npcs/npc_fisioterapia1.png",
    "assets/npcs/npc_fisioterapia2.png"
  ],
  "Nutrição": [
    "assets/npcs/npc_nutricao1.png",
    "assets/npcs/npc_nutricao2.png"
  ],
  "Radiologia": [
    "assets/npcs/npc_radiologia1.png",
    "assets/npcs/npc_radiologia2.png"
  ],
  "Direito": [
    "assets/npcs/npc_direito1.png",
    "assets/npcs/npc_direito2.png"
  ],
  "Psicologia": [
    "assets/npcs/npc_psicologia1.png",
    "assets/npcs/npc_psicologia2.png"
  ],
  "Publicidade": [
    "assets/npcs/npc_comunicacao1.png",
    "assets/npcs/npc_comunicacao2.png"
  ]
};

// ===== Coordenadores (sprites específicos por curso) =====

const COORD_ANIM_IMAGES = {
  'Engenharia de Software': [
    'assets/npcs/coordenadores/coord_software1.png',
    'assets/npcs/coordenadores/coord_software2.png'
  ],
  'Publicidade': [
    'assets/npcs/coordenadores/coord_comunicacao1.png',
    'assets/npcs/coordenadores/coord_comunicacao2.png'
  ]
};

// Pré-carrega coordenadores 
try {
  Object.values(COORD_ANIM_IMAGES).forEach(arr => arr.forEach(f => getImage(f)));
} catch (e) {  }

function gerarSlugCurso(nome) {
  if (!nome) return '';
  return nome
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '') 
    .replace(/\s+e\s+/g, ' ') 
    .replace(/\s+de\s+/g, ' ') 
    .replace(/\s+da\s+/g, ' ')
    .replace(/\s+do\s+/g, ' ')
    .replace(/\s+/g, '') 
    .replace(/[^a-z0-9_]/g, '');
}

// ===== Backgrounds animados por curso =====
const COURSE_BG_OVERRIDE = {
  'Educação Física': { prefix: 'edfisica' },
  'Engenharia de Software': { prefix: 'eng_software' },
  'Publicidade': { prefix: 'comunicacao' }
};

function getCourseBgPrefix(curso) {
  if (COURSE_BG_OVERRIDE[curso]) return COURSE_BG_OVERRIDE[curso].prefix;
  const slug = gerarSlugCurso(curso);
  return slug || '';
}

function drawCourseBackground(ctx, canvas, curso) {
  if (!curso) return;
  if (!window._bgCache) window._bgCache = {};
  const prefix = getCourseBgPrefix(curso);
  if (!prefix) return; 
  if (!window._bgCache[prefix]) {
    window._bgCache[prefix] = {
      frame: 0,
      timer: Date.now(),
      imgs: [
        getImage(`assets/bg/${prefix}1.png`),
        getImage(`assets/bg/${prefix}2.png`)
      ]
    };
  }
  const entry = window._bgCache[prefix];
  if (Date.now() - entry.timer > 600) {
    entry.frame = (entry.frame + 1) % 2;
    entry.timer = Date.now();
  }
  const img = entry.imgs[entry.frame];
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }
}

// Retorna frames do coordenador (dois) se existirem arquivos coord_<slug>1/2.png
function getCoordinatorFrames(curso) {
  if (COORD_ANIM_IMAGES[curso]) return COORD_ANIM_IMAGES[curso];
  const slug = gerarSlugCurso(curso);
  if (!slug) return null;
  const base1 = `assets/npcs/coordenadores/coord_${slug}1.png`;
  const base2 = `assets/npcs/coordenadores/coord_${slug}2.png`;
  const img1 = getImage(base1);
  const img2 = getImage(base2);
  if (img1 || img2) {
    return [base1, base2];
  }
  return null;
}


const PORTAL_IMAGES = {
  "Administração": "assets/portais/admin_portal.png",
  "Direito": "assets/portais/direito_portal.png",
  "Psicologia": "assets/portais/psicologia_portal.png",
  "Publicidade": "assets/portais/comunicacao_portal.png",
  "Arquitetura e Urbanismo": "assets/portais/arquitetura_portal.png",
  "Ciências Contábeis": "assets/portais/contabeis_portal.png",
  "Design de Interiores": "assets/portais/design_portal.png",
  "Engenharia de Software": "assets/portais/software_portal.png",
  "Estética e Cosmética": "assets/portais/estetica_portal.png",
  "Biomedicina": "assets/portais/biomedicina_portal.png",
  "Educação Física": "assets/portais/edfisica_portal.png",
  "Enfermagem": "assets/portais/enfermagem_portal.png",
  "Fisioterapia": "assets/portais/fisioterapia_portal.png",
  "Nutrição": "assets/portais/nutricao_portal.png",
  "Radiologia": "assets/portais/radiologia_portal.png"
};

// ==== Portais de navegação entre hubs (próximo/anterior) ====
const HUB_NAV_IMAGES = {
  proximo: getImage('assets/portais/proximo.png'),
  anterior: getImage('assets/portais/anterior.png')
};

// Pré-carregamento adicional de sprites críticos (NPCs e Portais usados nos hubs)
; (function preloadHubSprites() {
  try {
    Object.values(PORTAL_IMAGES).forEach(src => getImage(src));
    Object.values(NPC_ANIM_IMAGES).forEach(arr => arr.forEach(f => getImage(f)));
  } catch (e) {  }
})();

function desenharPortalNavegacao(ctx, x, y, w, h, tipo, player, destino, changeScene) {
  const img = HUB_NAV_IMAGES[tipo];
  const hitW = Math.max(40, Math.floor(w * 0.6));
  const hitH = Math.max(40, Math.floor(h * 0.6));
  const hx = Math.floor(x + (w - hitW) / 2);
  const hy = Math.floor(y + (h - hitH) / 2);
  let hovered = colide(player, { x: hx, y: hy, w: hitW, h: hitH });
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.save();
    if (hovered) ctx.globalAlpha = 0.9; else ctx.globalAlpha = 0.75;
    ctx.drawImage(img, x, y, w, h);
    ctx.restore();
  } else {
    ctx.save();
    ctx.fillStyle = hovered ? '#0053A0' : '#0A74D9';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tipo === 'proximo' ? '↑' : '↓', x + w / 2, y + h / 2);
    ctx.restore();
    if (img && !img.complete) {
      img.onload = () => {};
    }
  }
  if (hovered) {
    ctx.save();
    ctx.strokeStyle = '#FDB515';
    ctx.lineWidth = 4;
    ctx.strokeRect(x - 4, y - 4, w + 8, h + 8);
    ctx.restore();
    changeScene(destino);
  }
}

const BREATHE_AMP = 1; 

// ==== NPC inicial (recepcionista) ==== 
const NPC_INICIO_IMGS = [
  getImage("assets/npcs/npc_inicio1.png"),
  getImage("assets/npcs/npc_inicio2.png")
];

// ==== NPC Talk (primeiros diálogos lado direito) ====
const NPC_TALK_IMGS = [
  getImage("assets/npcs/npctalk1.png"),
  getImage("assets/npcs/npctalk2.png")
];

// ==== Pré-carregamento global das imagens de fala do Unicao ====
const UNICAO_TALK_IMGS = [
  "assets/unicao/unicaoTalk1.png",
  "assets/unicao/unicaoTalk2.png",
  "assets/unicao/unicaoTalk3.png",
  "assets/unicao/unicaoTalk4.png"
].map(src => getImage(src));

let unicaoFrame = 0;
let unicaoFrameTimer = Date.now();

function drawUnicao(ctx, x, y, w, h, borderColor = "#0053A0") {
  if (Date.now() - unicaoFrameTimer > 400) {
    unicaoFrame = (unicaoFrame + 1) % UNICAO_TALK_IMGS.length;
    unicaoFrameTimer = Date.now();
  }
  const img = UNICAO_TALK_IMGS[unicaoFrame];
  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h - 8, w / 2.2, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  if (img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, x, y, w, h);
  } else {
    img.onload = () => ctx.drawImage(img, x, y, w, h);
    ctx.fillStyle = borderColor;
    ctx.fillRect(x, y, w, h);
  }
  drawRoundedRect(ctx, x, y, w, h, 18, borderColor, 4);
}

function drawNpcTopHalf(ctx, imgSrc, x, y, w, h, borderColor = "#FDB515") {

  const img = getImage(imgSrc);
  if (img && img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
    const srcW = img.naturalWidth;
    const srcH = img.naturalHeight / 2; 
    
    ctx.drawImage(img, 0, 0, srcW, srcH, x, y, w, h);
  } else {
    ctx.fillStyle = borderColor;
    ctx.fillRect(x, y, w, h);
  }
  drawRoundedRect(ctx, x, y, w, h, 18, borderColor, 4);
}

let npcFrame = 0;
let npcFrameTimer = Date.now();
let itemFrame = 0;
let itemFrameTimer = Date.now();
const itemImgs = [
  new Image(),
  new Image()
];
itemImgs[0].src = "assets/item1.png";
itemImgs[1].src = "assets/item2.png";

function resetGame() {
  window.globalScore = 0;
  window.collectedItems = { i1: false, i2: false };
  if (window.puzzleState) {
    window.puzzleState.score = 0;
    window.puzzleState.lastScore = 0;
    window.puzzleState.finalizado = false;
    window.puzzleState.ativo = false;
    window.puzzleState.modo = null;
  }
  window._fimAnim = null;
  try { if (typeof hideMediaOverlay === 'function') hideMediaOverlay(); } catch (e) {  }
  window.currentCursoName = null;
  if (window.player) {
    try {
      window.player.x = 50;
      window.player.y = 0;
      window.player.vx = 0;
      window.player.vy = 0;
    } catch (e) {  }
  }
}

function fase1(ctx, player, changeScene, canvas) {
  // --- Background com imagem ---
  const bgImg = getImage("assets/fase1.png");
  if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Adiciona um pouco de ground na base
  const groundH = 10;
  ctx.fillStyle = "#7a7a7aff";
  ctx.fillRect(0, canvas.height - groundH, canvas.width, groundH);

  // Prédio de chegada
  ctx.fillStyle = "brown";
  ctx.fillRect(canvas.width - 190, canvas.height - groundH - 75, 100, 75);

  // Portal inicial (imagem)
  const portalW = 100, portalH = 120; 
  const portalX = canvas.width - 190;
  const portalY = canvas.height - groundH - portalH;
  const portalImg = getImage("assets/portais/portal_inicial.png");
  if (portalImg && portalImg.complete && portalImg.naturalWidth > 0) {
    ctx.drawImage(portalImg, portalX, portalY, portalW, portalH);
  } else {
    ctx.fillStyle = "brown";
    ctx.fillRect(portalX, portalY, portalW, portalH);
  }

  ctx.fillStyle = "#333333ff";
  ctx.font = "20px PressStart2P-Regular";
  ctx.fillText("Chegue à Unigran Capital →", 50, 50);
  ctx.fillText("utilize as setas para movimentar o Unicão ", 50, 80);

  // ====== ITENS FLUTUANDO ANIMADOS E MAIORES ======
  if (!window.collectedItems) window.collectedItems = { i1: false, i2: false };

  const itemW = 40, itemH = 40;

  // Posição dos itens flutuando
   const item1 = { x: 300, y: canvas.height - groundH - 170, w: itemW, h: itemH };
  const item2 = { x: 600, y: canvas.height - groundH - 80, w: itemW, h: itemH };

  // Alterna o frame a cada 400ms
  if (Date.now() - itemFrameTimer > 400) {
    itemFrame = (itemFrame + 1) % itemImgs.length;
    itemFrameTimer = Date.now();
  }

  if (!window.collectedItems.i1) {
    const img = itemImgs[itemFrame];
    if (img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, item1.x, item1.y, item1.w, item1.h);
    } else {
      ctx.fillStyle = "#FDB515";
      ctx.fillRect(item1.x, item1.y, item1.w, item1.h);
    }
  }
  if (!window.collectedItems.i2) {
    const img = itemImgs[itemFrame];
    if (img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, item2.x, item2.y, item2.w, item2.h);
    } else {
      ctx.fillStyle = "#FDB515";
      ctx.fillRect(item2.x, item2.y, item2.w, item2.h);
    }
  }

  // colisão rudimentar com chão
  player.updatePlataforma(canvas.height - groundH); // base do chão

  // coleta dos itens flutuantes
  if (!window.globalScore) window.globalScore = 0;
  if (!window.collectedItems.i1 && colide(player, item1)) {
    window.collectedItems.i1 = true;
    window.globalScore = Math.min(20, (window.globalScore || 0) + 10);
  }
  if (!window.collectedItems.i2 && colide(player, item2)) {
    window.collectedItems.i2 = true;
    window.globalScore = Math.min(20, (window.globalScore || 0) + 10);
  }
  player.draw(ctx);

  // Colisão com portal para avançar
  if (colide(player, { x: portalX, y: portalY, w: portalW, h: portalH })) {
    changeScene("fasePredio");
  }
}

function fasePredio(ctx, player, changeScene, canvas) {
  let groundY = canvas.height - 30;



  ctx.fillStyle = "gray";
  ctx.fillRect(0, groundY, canvas.width, 100);

  // NPC centralizado (recepcionista animado) - altura aumentada
  let npcW = 80, npcH = 115;
  let npcX_predio = (canvas.width - npcW) / 2;
  let npcY_predio = groundY - npcH;
  const inicioImg = NPC_INICIO_IMGS[npcAnimFrame % NPC_INICIO_IMGS.length];
  // Sombra
  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.ellipse(npcX_predio + npcW / 2, npcY_predio + npcH - 8, npcW / 2.2, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  if (inicioImg.complete && inicioImg.naturalWidth > 0) {
    ctx.drawImage(inicioImg, npcX_predio, npcY_predio, npcW, npcH);
  } else {
    inicioImg.onload = () => ctx.drawImage(inicioImg, npcX_predio, npcY_predio, npcW, npcH);
    ctx.fillStyle = "#0053A0";
    ctx.fillRect(npcX_predio, npcY_predio, npcW, npcH);
  }

  // Texto estilizado e maior 
  ctx.font = "bold 18px Kanit, PressStart2P-Regular, sans-serif";
  ctx.fillStyle = "#c7e4ffff";
  ctx.textAlign = "center";
  ctx.fillText("Fale com o Recepcionista", canvas.width / 2, 60);

  player.updatePlataforma(groundY);
  player.draw(ctx);

  if (colide(player, { x: npcX_predio, y: npcY_predio, w: npcW, h: npcH })) {
    changeScene("dialogoNPC");
  }
}

// Exemplo para qualquer diálogo
function dialogoPadrao(ctx, avatarLabel, npcLabel, textoBalao, botoesArray, canvas, curso = null) {
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Layout 3 colunas
  let avatarW = 100, avatarH = 140;
  // Redução proporcional para cursos específicos (coordenador menor)
  if (curso === 'Ciências Contábeis' || curso === 'Radiologia') {
    const scale = 0.80;
    avatarW = Math.round(avatarW * scale);
    avatarH = Math.round(avatarH * scale);
  }
  const balaoW = 500, balaoH = 220;
  const yBase = 180;

  // Unicao sempre animado (frame avançado em drawUnicao)
  drawUnicao(ctx, 120, yBase, avatarW, avatarH, "#0053A0");
  // ===== Rótulo adaptativo para nome do jogador / avatar =====
  drawAdaptiveLabel(ctx, avatarLabel, 120 + avatarW / 2, yBase + avatarH + 12, avatarW + 40);

  // NPC à direita (imagem animada do curso)
  const npcW = avatarW, npcH = avatarH;
  const npcX = canvas.width - 120 - avatarW;
  let npcAnimImgs = [
    curso && NPC_ANIM_IMAGES[curso] ? NPC_ANIM_IMAGES[curso][0] : "assets/npcs/npc_default.png",
    curso && NPC_ANIM_IMAGES[curso] ? NPC_ANIM_IMAGES[curso][1] : "assets/npcs/npc_default.png"
  ];
  const npcImgTop = npcAnimImgs[npcAnimFrame % 2];
  // Fator de expansão horizontal para evitar aparência "esticada" verticalmente pelo zoom
  const npcScaleX = 1.25; 
  const expandedW = npcW * npcScaleX;
  const offsetX = (expandedW - npcW) / 2;
  const drawX = npcX - offsetX;
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.ellipse(drawX + expandedW / 2, yBase + npcH - 10, (expandedW) / 2.3, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  drawNpcTopHalf(ctx, npcImgTop, drawX, yBase, expandedW, npcH, "#FDB515");
  // Reatribui para labels usarem centro correto
  const npcCenterXAdjusted = drawX + expandedW / 2;
  // ===== Rótulo adaptativo para nome do NPC / curso =====
  const labelNpcCenterX = (typeof npcCenterXAdjusted !== 'undefined' ? npcCenterXAdjusted : npcX + npcW / 2) + 10;
  drawAdaptiveLabel(ctx, npcLabel, labelNpcCenterX, yBase + npcH + 12, expandedW + 40);

  // Balão de fala centralizado com a descrição do curso
  drawSpeechBubble(
    ctx,
    (canvas.width - balaoW) / 2,
    yBase,
    balaoW,
    balaoH,
    textoBalao,
    { radius: 18, padding: 18, fontSize: 18, bgColor: "#fff", borderColor: "#0053A0", textColor: "#00315E", fontFamily: "PressStart2P-Regular" }
  );

  // Botões lado a lado, com espaçamento
  const btnY = yBase + balaoH + 40;
  const btnW = 150, btnH = 54, btnGap = 40;
  const totalBtns = botoesArray.length;
  const totalWidth = totalBtns * btnW + (totalBtns - 1) * btnGap;
  let startX = canvas.width / 2 - totalWidth / 2;
  botoesArray.forEach((btn, i) => {
    criarBotao(ctx, startX + i * (btnW + btnGap), btnY, btnW, btnH, btn.texto, btn.acao);
  });
}

// Função auxiliar: desenha texto em até 2 linhas ajustando fonte para caber na largura
function drawAdaptiveLabel(ctx, text, centerX, topY, maxWidth) {
  const maxFont = 18;
  const minFont = 10;
  let size = maxFont;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#fff';

  // Tenta reduzir fonte inteira primeiro
  while (size > minFont) {
    ctx.font = `${size}px PressStart2P-Regular`;
    const w = ctx.measureText(text).width;
    if (w <= maxWidth) break;
    size--;
  }

  ctx.font = `${size}px PressStart2P-Regular`;
  // Se ainda ultrapassa, faz wrap simples
  if (ctx.measureText(text).width > maxWidth) {
    const words = text.split(/\s+/);
    let lines = [];
    let line = '';
    for (let w of words) {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    // Se mais que 2 linhas, reduz fonte e rewrap
    while (lines.length > 2 && size > minFont) {
      size--;
      ctx.font = `${size}px PressStart2P-Regular`;
      lines = [];
      line = '';
      for (let w of words) {
        const test = line ? line + ' ' + w : w;
        if (ctx.measureText(test).width > maxWidth && line) {
          lines.push(line);
          line = w;
        } else {
          line = test;
        }
      }
      if (line) lines.push(line);
    }
    const lh = size * 1.15;
    let y = topY;
    lines.slice(0, 2).forEach(l => {
      ctx.fillText(l, centerX, y);
      y += lh;
    });
  } else {
    ctx.fillText(text, centerX, topY);
  }
}

function dialogoNPC(ctx, changeScene, canvas) {
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Layout 3 colunas
  const avatarW = 100, avatarH = 140;
  const balaoW = 500, balaoH = 220;
  const yBase = 180;

  // Unicao animado reutilizando função
  drawUnicao(ctx, 120, yBase, avatarW, avatarH, "#0053A0");

  // Estado de paginação do diálogo inicial
  if (typeof window.dialogoNPCPage !== 'number') window.dialogoNPCPage = 0;
  const page = window.dialogoNPCPage;

  // Conteúdo das páginas
  const pages = [
    {
      title: 'Bem-vindo(a) à UNIGRAN Capital!',
      body: 'Aqui você encontra diversos cursos, de gestão e comunicação à tecnologia e saúde. Aqui no game nossa universidade se organiza em três grandes áreas: Humanas, Exatas e Biológicas. Vamos apresentar rapidamente e depois você escolhe por onde começar.'
    },
    {
      title: 'Área 1 — Humanas',
      body: 'Estudo das pessoas, sociedade e expressão:\n• Administração\n• Direito\n• Psicologia\n• Publicidade'
    },
    {
      title: 'Área 2 — Exatas',
      body: 'Raciocínio, estrutura e criação de soluções:\n• Arquitetura e Urbanismo\n• Design de Interiores\n• Ciências Contábeis\n• Engenharia de Software'
    },
    {
      title: 'Área 3 — Biológicas',
      body: 'Vida, saúde e bem-estar:\n• Estética e Cosmética\n• Nutrição\n• Educação Física\n• Biomedicina\n• Radiologia\n• Enfermagem\n• Fisioterapia'
    }
  ];

  const balaoX = (canvas.width - balaoW) / 2;
  if (page <= 3) {
    const p = pages[page];
    drawSpeechBubble(
      ctx,
      balaoX,
      yBase,
      balaoW,
      balaoH,
      `${p.title}\n${p.body}`,
      { radius: 20, padding: 20, fontSize: 18, bgColor: "#fff", borderColor: "#0053A0", textColor: "#00315E", fontFamily: "PressStart2P-Regular" }
    );
  } else {
    drawSpeechBubble(
      ctx,
      balaoX,
      yBase,
      balaoW,
      balaoH,
      'Agora que você viu as 3 áreas, escolha uma para visitar. E lembrando: você pode andar pelas outras áreas do mapa seguindo as placas de \n " ↑ " e " ↓ "!',
      { radius: 20, padding: 20, fontSize: 20, bgColor: "#fff", borderColor: "#0053A0", textColor: "#00315E", fontFamily: "PressStart2P-Regular" }
    );
  }

  // NPC à direita animado (npctalk)
  const talkImg = NPC_TALK_IMGS[npcAnimFrame % NPC_TALK_IMGS.length];
  const npcXdir = canvas.width - 120 - avatarW;
  const npcYdir = yBase;
  // Sombra
  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.ellipse(npcXdir + avatarW / 2, npcYdir + avatarH - 8, avatarW / 2.2, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  const dlgScaleX = 1.25;
  const dlgExpandedW = avatarW * dlgScaleX;
  const dlgOffsetX = (dlgExpandedW - avatarW) / 2;
  const dlgDrawX = npcXdir - dlgOffsetX;
  // sombra
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.ellipse(dlgDrawX + dlgExpandedW / 2, npcYdir + avatarH - 10, dlgExpandedW / 2.3, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  drawNpcTopHalf(ctx, talkImg.src || "assets/npcs/npctalk1.png", dlgDrawX, npcYdir, dlgExpandedW, avatarH, "#FDB515");

  // Botões abaixo do balão: paginação ou escolha de área
  const btnY = yBase + balaoH + 40;
  if (page <= 3) {
    // Voltar (se não for a primeira página)
    if (page > 0) {
      criarBotao(ctx, canvas.width / 2 - 220, btnY, 150, 50, 'Voltar', () => { window.dialogoNPCPage = Math.max(0, window.dialogoNPCPage - 1); });
    }
    // Próximo
    criarBotao(ctx, page > 0 ? (canvas.width / 2 - 40) : (canvas.width / 2 - 75), btnY, 150, 50, 'Próximo', () => { window.dialogoNPCPage = Math.min(4, window.dialogoNPCPage + 1); });
  } else {
    // Escolha de área
    criarBotao(ctx, canvas.width / 2 - 250, btnY, 160, 50, '1 - Humanas', () => changeScene('hubHumanas'));
    criarBotao(ctx, canvas.width / 2 - 60, btnY, 160, 50, '2 - Exatas', () => changeScene('hubExatas'));
    criarBotao(ctx, canvas.width / 2 + 130, btnY, 160, 50, '3 - Biológicas', () => changeScene('hubBiologicas'));
    // Voltar para rever a última explicação
    criarBotao(ctx, canvas.width / 2 - 75, btnY + 70, 150, 46, 'Voltar', () => { window.dialogoNPCPage = 3; });
  }
}
// Explicação da área com NPC e jogador 2 parte
function explicacaoArea(ctx, changeScene, canvas, titulo, texto, destinoHub) {
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Layout 3 colunas
  const avatarW = 100, avatarH = 140;
  const balaoW = 500, balaoH = 220;
  const yBase = 180;

  // Unicao à esquerda animado
  drawUnicao(ctx, 120, yBase, avatarW, avatarH, "#0053A0");

  // Se o texto possui bullets, usamos duas colunas
  const hasBullets = /\n•\s?/.test(texto);
  const textoSemBullets = String(texto).replace(/^\s*•\s*/gm, '');
  drawSpeechBubble(
    ctx,
    (canvas.width - balaoW) / 2,
    yBase,
    balaoW,
    balaoH,
    `${titulo}\n${textoSemBullets}`,
    { radius: 20, padding: 24, fontSize: 18, bgColor: "#fff", borderColor: "#0053A0", textColor: "#00315E", textAlign: "center", columns: 1, fontFamily: "PressStart2P-Regular" }
  );

  // NPC à direita animado (npctalk)
  const npcTalkImg = NPC_TALK_IMGS[npcAnimFrame % NPC_TALK_IMGS.length];
  const npcX2 = canvas.width - 120 - avatarW;
  const npcY2 = yBase;
  // Sombra
  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.ellipse(npcX2 + avatarW / 2, npcY2 + avatarH - 8, avatarW / 2.2, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  const expScaleX = 1.25;
  const expExpandedW = avatarW * expScaleX;
  const expOffsetX = (expExpandedW - avatarW) / 2;
  const expDrawX = npcX2 - expOffsetX;
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.ellipse(expDrawX + expExpandedW / 2, npcY2 + avatarH - 10, expExpandedW / 2.3, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  drawNpcTopHalf(ctx, npcTalkImg.src || "assets/npcs/npctalk1.png", expDrawX, npcY2, expExpandedW, avatarH, "#FDB515");

  const btnY = yBase + balaoH + 40;
  criarBotao(ctx, canvas.width / 2 - 100, btnY, 150, 50, "Selecionar", () => changeScene(destinoHub));
  criarBotao(ctx, canvas.width / 2 + 70, btnY, 150, 50, "Voltar", () => { window.dialogoNPCPage = 3; changeScene("dialogoNPC"); });
}

function hub(ctx, player, changeScene, canvas) {
  ctx.fillStyle = "#EAF3FF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "black";
  ctx.font = "20px PressStart2P-Regular";
  ctx.fillText("Hub - Escolha seu curso", 50, 50);

  player.updateLivre(canvas);
  player.draw(ctx);

  let portalX = 80, portalY = 80, pw = 80, ph = 120;
  ctx.fillStyle = "purple";
  ctx.fillRect(portalX, portalY, pw, ph);

  if (colide(player, { x: portalX, y: portalY, w: pw, h: ph })) {
    changeScene("curso1");
  }
}

function faseCurso(ctx, player, canvas, curso, changeScene) {
  const GROUND_OFFSET = 150; 
  let groundY = canvas.height - GROUND_OFFSET;
  ctx.fillStyle = '#EAF3FF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawCourseBackground(ctx, canvas, curso);


  if (typeof drawHUD === 'function') {
    const courseScore = (window.puzzleState && window.puzzleState.score) || 0;
    const totalScore = Math.min(100, (window.globalScore || 0) + courseScore);
    drawHUD(ctx, curso, totalScore);
  }

  player.updatePlataforma(groundY);
  player.draw(ctx);

  
  const portalEsquerda = { x: 0, y: 0, w: 40, h: canvas.height };
  if (colide(player, portalEsquerda)) {
    changeScene(cursoParaHub(curso));
    return; 
  }

  let npcW = 100, npcH = 140; 
  if (curso === 'Estética e Cosmética') {
    npcW = Math.round(npcW * 0.85); 
  }
  const needsSmaller = (curso === 'Ciências Contábeis' || curso === 'Radiologia');
  if (needsSmaller) {
    const scale = 0.85; 
    npcW = Math.round(npcW * scale);
    npcH = Math.round(npcH * scale);
  }
  let npcX = (canvas.width - npcW) / 2;
  let npcY = groundY - npcH;

  if (curso === 'Engenharia de Software') {
    const OFFSET_X = 90; 
    npcX = Math.min(npcX + OFFSET_X, canvas.width - npcW);
  }

  // Tenta carregar frames do coordenador
  let coordFrames = getCoordinatorFrames && getCoordinatorFrames(curso);
  let frameSrc = null;
  if (coordFrames && coordFrames.length >= 2) {
    frameSrc = coordFrames[npcAnimFrame % 2];
  } else if (NPC_ANIM_IMAGES[curso]) {
    frameSrc = NPC_ANIM_IMAGES[curso][npcAnimFrame % 2];
  }

  // Desenha sombra
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.ellipse(npcX + npcW / 2, npcY + npcH - 12, npcW / 2.4, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (frameSrc) {
    const img = getImage(frameSrc);
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, npcX, npcY, npcW, npcH);
    } else {
      // placeholder enquanto carrega
      ctx.fillStyle = '#FDB515';
      ctx.fillRect(npcX, npcY, npcW, npcH);
    }
  } else {
    // placeholder se nada encontrado
    ctx.fillStyle = "#FDB515";
    ctx.fillRect(npcX, npcY, npcW, npcH);
  }

  // Labels agora na parte inferior (abaixo do personagem)
  ctx.textAlign = "center";
  const labelCursoY = npcY + npcH + 24; // leve ajuste
  const labelInstrY = labelCursoY + 36;
  // Nome do curso: fonte maior, branca, bold (PressStart2P carregada via CSS)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px PressStart2P-Regular, Arial, sans-serif';
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 6;
  ctx.fillText(curso, canvas.width / 2, labelCursoY);
  // Instrução: um pouco menor
  ctx.font = 'bold 20px PressStart2P-Regular, Arial, sans-serif';
  ctx.shadowBlur = 4;
  const feminino = isCoordenadoraCurso(curso);
  const artigo = feminino ? 'A' : 'O';
  const cargo = feminino ? 'COORDENADORA' : 'COORDENADOR';
  ctx.fillText(`FALE COM ${artigo} ${cargo}`, canvas.width / 2, labelInstrY);
  ctx.shadowBlur = 0;

  ctx.textAlign = "left"; // volta ao padrão

  if (colide(player, { x: npcX, y: npcY, w: npcW, h: npcH })) {
    window.currentCursoName = curso;
    changeScene("dialogoCursoInfo");
  }
}

// Estado global simples para diálogo/curso atual
window.currentCursoDialog = null; // { curso, descricao, hubScene }
window.currentCursoName = null;

// Hubs por área com múltiplos portais e NPC em frente
function hubHumanas(ctx, player, changeScene, canvas) {
  desenharHubBase(ctx, canvas, "Hub - Área 01"); //area de humanas

  const cursos = [
    { nome: "Administração", descricao: "Gestão de empresas, finanças, pessoas e estratégia." },
    { nome: "Direito", descricao: "Estudo das leis, justiça, atuação jurídica e cidadania." },
    { nome: "Psicologia", descricao: "Comportamento humano, saúde mental e processos psíquicos." },
    { nome: "Publicidade", descricao: "Criação de campanhas, marketing, comunicação e branding." }
  ];
  desenharPortaisSaguao(ctx, player, changeScene, canvas, cursos, "hubHumanas");

  // Portal superior (imagem 'proximo') para Exatas
  desenharPortalNavegacao(
    ctx,
    (canvas.width - 120) / 2,
    0, 
    120,
    70,
    'proximo',
    player,
    'hubExatas',
    changeScene
  );
}

function hubExatas(ctx, player, changeScene, canvas) {
  desenharHubBase(ctx, canvas, "Hub - Área 02");// area de exatas

  const cursos = [
    { nome: "Arquitetura e Urbanismo", descricao: "Projetos de edificações e planejamento urbano." },
    { nome: "Ciências Contábeis", descricao: "Gestão contábil, fiscal e financeira das organizações." },
    { nome: "Design de Interiores", descricao: "Ambientes funcionais e estéticos, materiais e iluminação." },
    { nome: "Engenharia de Software", descricao: "Desenvolvimento, qualidade e manutenção de software." }
  ];
  desenharPortaisSaguao(ctx, player, changeScene, canvas, cursos, "hubExatas");

  // Superior para Biológicas
  desenharPortalNavegacao(ctx, (canvas.width - 140) / 2, 0, 140, 80, 'proximo', player, 'hubBiologicas', changeScene); // topo
  // Inferior para Humanas
  desenharPortalNavegacao(ctx, (canvas.width - 140) / 2, canvas.height - 80, 140, 80, 'anterior', player, 'hubHumanas', changeScene); // base
}

function hubBiologicas(ctx, player, changeScene, canvas) {
  desenharHubBase(ctx, canvas, "Hub - Área 3"); // area de biologicas

  const cursos = [
    { nome: "Estética e Cosmética", descricao: "Cuidados estéticos, dermocosméticos e bem-estar." },
    { nome: "Biomedicina", descricao: "Análises clínicas, pesquisa e diagnóstico laboratorial." },
    { nome: "Educação Física", descricao: "Atividade física, saúde e performance esportiva." },
    { nome: "Enfermagem", descricao: "Cuidado integral à saúde e assistência clínica." },
    { nome: "Fisioterapia", descricao: "Reabilitação, prevenção e qualidade de vida." },
    { nome: "Nutrição", descricao: "Alimentação, saúde e planejamento nutricional." },
    { nome: "Radiologia", descricao: "Diagnóstico por imagem e proteção radiológica." }
  ];
  // Para Área 3: margem reduzida para permitir colar nas extremidades e ganhar mais espaçamento vertical
  desenharPortaisSaguao(ctx, player, changeScene, canvas, cursos, "hubBiologicas", { margin: 24 });

  // Inferior para Exatas
  desenharPortalNavegacao(ctx, (canvas.width - 140) / 2, canvas.height - 80, 140, 80, 'anterior', player, 'hubExatas', changeScene); // base
}

function desenharHubBase(ctx, canvas, titulo) {
  ctx.save();
  ctx.globalAlpha = 0.18; 
  ctx.fillStyle = "#f0d9b5";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function desenharPortaisComNPCs(ctx, player, changeScene, canvas, cursos, hubScene) {
  // Layout em grid
  const startX = 240;
  const startY = 160;
  const gapX = 260;
  const gapY = 200;
  const portalW = 120; 
  const portalH = 120;

  let colunas = Math.max(1, Math.floor((canvas.width - startX - portalW) / gapX) + 1);
  cursos.forEach((curso, idx) => {
    const col = idx % colunas;
    const row = Math.floor(idx / colunas);
    const x = startX + col * gapX;
    const y = startY + row * gapY;

    ctx.strokeStyle = "#888";
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, portalW, portalH);

    let npcX = x + 10;
    const baseNpcY = y + portalH + 10; 
    let npcW = 60;
    let npcH = 80;
    if (curso.nome === 'Publicidade' || curso.nome === 'Psicologia') {
      const extraH = 27; 
      const extraW = 22; 
      npcH += extraH;
      npcW += extraW;
      // Reposiciona Y para manter os pés no mesmo lugar
      var npcY = baseNpcY + (80 - npcH);
      // Reposiciona X para centralizar em relação à posição original (60 de largura)
      const shiftX = (npcW - 60) / 2;
      const npcXAdjusted = npcX - shiftX;
      // substitui npcX pelo ajustado
      npcX = npcXAdjusted;
    } else {
      var npcY = baseNpcY;
    }
    // Sombra oval
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "#222";
    ctx.beginPath();
    ctx.ellipse(npcX + 30, npcY + 80 - 8, 27, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // NPC animado (duas PNG)
    let npcImgs = NPC_ANIM_IMAGES[curso.nome];
    if (npcImgs && npcImgs.length >= 2) {
      let npcImg = getImage(npcImgs[npcAnimFrame % 2]);
      if (npcImg && npcImg.complete && npcImg.naturalWidth > 0) {
        ctx.drawImage(npcImg, npcX, npcY, npcW, npcH);
      } else {
        ctx.fillStyle = "#FDB515";
        ctx.fillRect(npcX, npcY, npcW, npcH);
      }
    } else {
      ctx.fillStyle = "#FDB515";
      ctx.fillRect(npcX, npcY, npcW, npcH);
    }


    // Checagem de colisão com o portal para abrir diálogo
    if (colide(player, { x, y, w: portalW, h: portalH })) {
      window.currentCursoDialog = {
        curso: curso.nome,
        descricao: curso.descricao,
        hubScene: hubScene
      };
      changeScene("dialogoCurso");
    }
  });

  // Movimento do player em modo livre
  player.updateLivre(canvas);
  player.draw(ctx);
}

function desenharPortaisSaguao(ctx, player, changeScene, canvas, cursos, hubScene, opts = {}) {
  const portalW = 140, portalH = 140, npcW = 60, npcH = 80;
  const margem = (typeof opts.margin === 'number') ? opts.margin : 60; 
  const width = canvas.width, height = canvas.height;

  // Calcula posições: 4 cantos + 3 laterais 
  const posicoes = [
    // canto superior esquerdo
    { x: margem, y: margem, npcX: margem + portalW + 10, npcY: margem + portalH / 2 + Math.sin(Date.now() / 600) * BREATHE_AMP, npcDir: 'right' },
    // canto superior direito
    { x: width - portalW - margem, y: margem, npcX: width - portalW - margem - npcW - 10, npcY: margem + portalH / 2 + Math.sin(Date.now() / 600) * BREATHE_AMP, npcDir: 'left' },
    // canto inferior esquerdo
    { x: margem, y: height - portalH - margem, npcX: margem + portalW + 10, npcY: height - portalH - margem + portalH / 2 + Math.sin(Date.now() / 600) * BREATHE_AMP, npcDir: 'right' },
    // canto inferior direito
    { x: width - portalW - margem, y: height - portalH - margem, npcX: width - portalW - margem - npcW - 10, npcY: height - portalH - margem + portalH / 2 + Math.sin(Date.now() / 600) * BREATHE_AMP, npcDir: 'left' },
    // topo centro
    { x: width / 2 - portalW / 2, y: margem, npcX: width / 2 + portalW / 2 + 10, npcY: margem + portalH / 2 + Math.sin(Date.now() / 600) * BREATHE_AMP, npcDir: 'right' },
    // meio esquerda
    { x: margem, y: height / 2 - portalH / 2, npcX: margem + portalW + 10, npcY: height / 2 + Math.sin(Date.now() / 600) * BREATHE_AMP, npcDir: 'right' },
    // meio direita
    { x: width - portalW - margem, y: height / 2 - portalH / 2, npcX: width - portalW - margem - npcW - 10, npcY: height / 2 + Math.sin(Date.now() / 600) * BREATHE_AMP, npcDir: 'left' }
  ];

 
  while (posicoes.length < cursos.length) {
    // base centro
    posicoes.push({
      x: width / 2 - portalW / 2,
      y: height - portalH - margem,
      npcX: width / 2 + portalW / 2 + 10,
      npcY: height - portalH - margem + portalH / 2 + Math.sin(Date.now() / 600) * BREATHE_AMP,
      npcDir: 'right'
    });
    // topo esquerda extra
    posicoes.push({
      x: margem + 120,
      y: margem,
      npcX: margem + 120 + portalW + 10,
      npcY: margem + portalH / 2 + Math.sin(Date.now() / 600) * BREATHE_AMP,
      npcDir: 'right'
    });
    // base direita extra
    posicoes.push({
      x: width - portalW - margem - 120,
      y: height - portalH - margem,
      npcX: width - portalW - margem - 120 - npcW - 10,
      npcY: height - portalH - margem + portalH / 2 + Math.sin(Date.now() / 600) * BREATHE_AMP,
      npcDir: 'left'
    });
  }


  cursos.forEach((curso, idx) => {
    const p = posicoes[idx];

    // Ajuste específico: subir mais o portal de Fisioterapia na área de Biológicas
    if (hubScene === 'hubBiologicas' && curso.nome === 'Fisioterapia') {
      const OFFSET_UP = 10; 
      const newY = Math.max(margem, p.y - OFFSET_UP);
      const delta = p.y - newY;
      p.y = newY;
      if (typeof p.npcY === 'number') p.npcY = p.npcY - delta;
    }

    let portalImgSrc = PORTAL_IMAGES[curso.nome];
    if (portalImgSrc) {
      let portalImg = getImage(portalImgSrc);
      if (portalImg && portalImg.complete && portalImg.naturalWidth > 0) {
        ctx.drawImage(portalImg, p.x, p.y, portalW, portalH);
      } else {
        ctx.strokeStyle = "#888";
        ctx.lineWidth = 3;
        ctx.strokeRect(p.x, p.y, portalW, portalH);
      }
    } else {
      ctx.strokeStyle = "#888";
      ctx.lineWidth = 3;
      ctx.strokeRect(p.x, p.y, portalW, portalH);
    }

    // NPC colado ao portal, do lado de dentro da tela, alinhado à base
    let npcWidth = 60, npcHeight = 80;
    let npcX = p.npcX;
    let npcY = p.npcY;
    if (curso.nome === 'Publicidade' || curso.nome === 'Psicologia') {
      const extraH = 25;
      const extraW = 18;
      npcHeight += extraH;
      npcWidth += extraW;
      npcY -= extraH; 
      npcX -= extraW / 2; 
    }
    if (curso.nome === 'Enfermagem') {
      const reduceW = 10; // pixels
      const newW = Math.max(40, npcWidth - reduceW);
      const delta = npcWidth - newW;
      npcWidth = newW;
      npcX += delta / 2; 
    }
    // NPC estático, sem respiração
    // Sombra oval
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "#222";
    ctx.beginPath();
    ctx.ellipse(npcX + npcWidth / 2, npcY + npcHeight - 8, npcWidth / 2.2, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // NPC animado (duas PNG)
    let npcImgs = NPC_ANIM_IMAGES[curso.nome];
    if (npcImgs && npcImgs.length >= 2) {
      let npcImg = getImage(npcImgs[npcAnimFrame % 2]);
      if (npcImg && npcImg.complete && npcImg.naturalWidth > 0) {
        ctx.drawImage(npcImg, npcX, npcY, npcWidth, npcHeight);
      } else {
        ctx.fillStyle = "#FDB515";
        ctx.fillRect(npcX, npcY, npcWidth, npcHeight);
      }
    } else {
      // fallback amarelo
      ctx.fillStyle = "#FDB515";
      ctx.fillRect(npcX, npcY, npcWidth, npcHeight);
    }

    // Colisão para abrir diálogo (hitbox reduzido para todos os portais na área Biológicas)
    let hitRect = { x: p.x, y: p.y, w: portalW, h: portalH };
    if (hubScene === 'hubBiologicas') {
      const hitW = Math.max(60, Math.floor(portalW * 0.6));
      const hitH = Math.max(60, Math.floor(portalH * 0.5));
      hitRect = {
        x: Math.floor(p.x + (portalW - hitW) / 2),
        y: Math.floor(p.y + (portalH - hitH) / 2),
        w: hitW,
        h: hitH
      };
    }
    if (colide(player, hitRect)) {
      window.currentCursoDialog = { curso: curso.nome, descricao: curso.descricao, hubScene };
      changeScene("dialogoCurso");
    }
  });

  player.updateLivre(canvas);
  player.draw(ctx);
}


function dialogoCurso(ctx, changeScene, canvas) {
  const dlg = window.currentCursoDialog;
  if (!dlg) return;
  let dialogBody = EXPLICACOES_PORTAL[dlg.curso] || dlg.descricao || dlg.curso;
  // Sempre falar primeiro o nome do curso
  let dialogText = `${dlg.curso}\n${dialogBody}`;
  dialogoPadrao(
    ctx,
    "Você",
    dlg.curso,
    dialogText,
    [
      { texto: "Entrar", acao: () => { window.currentCursoName = dlg.curso; changeScene("curso"); } },
      { texto: "Voltar", acao: () => changeScene(dlg.hubScene) }
    ],
    canvas,
    dlg.curso
  );
}

function dialogoCursoInfo(ctx, changeScene, canvas) {
  const curso = window.currentCursoName || "Curso";
  
  const descricaoCurso = getCursoDescricao(curso);
  const complementoCoord = (typeof EXPLICACOES_COORDENADOR !== 'undefined' && EXPLICACOES_COORDENADOR[curso]) ? EXPLICACOES_COORDENADOR[curso] : '';
  if (typeof window.dialogoCoordPage !== 'number') window.dialogoCoordPage = 0;
  const page = window.dialogoCoordPage; 
  // Descrição do puzzle por curso 
  function getPuzzleDescricaoPorCurso(curso) {
    let mode = 'quiz';
    try { if (typeof COURSE_MODE !== 'undefined' && COURSE_MODE[curso]) mode = COURSE_MODE[curso]; } catch (e) { /* fallback para quiz */ }
    const byMode = {
      quiz: 'Nosso desafio aqui é um quiz rápido. Leia com calma e escolha a melhor alternativa. Cada acerto soma pontos — a ideia é aprender enquanto joga.',
      memoria: 'Aqui o desafio é um jogo da memória. Vire duas cartas por vez e encontre os pares do tema do curso. Acerte os pares para somar pontos e avançar.',
      associacao: 'Este desafio é de associação. Conecte os itens que combinam (conceitos, imagens ou termos) e complete todas as relações.',
      formas: 'O desafio usa formas e padrões visuais. Observe com atenção e escolha a opção que melhor corresponde ao pedido.',
      ordem: 'Neste desafio, você organiza passos na ordem correta. Arraste os cartões até montar a sequência lógica.'
    };
    return byMode[mode] || byMode.quiz;
  }
  // Background genérico + animado (se existir) + overlay
  ctx.fillStyle = '#0d1b2a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawCourseBackground(ctx, canvas, curso);
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Layout 3 colunas
  let avatarW = 100, avatarH = 140;
  if (curso === 'Estética e Cosmética') {
    avatarW = Math.round(avatarW * 0.85); 
  }
  const balaoW = 500, balaoH = 220;
  const yBase = 180;

  // Unicao à esquerda animado
  drawUnicao(ctx, 120, yBase, avatarW, avatarH, "#0053A0");

  // Balão centralizado: página 0 (sobre o curso, com fala do coordenador) / página 1 (sobre o puzzle)
  const textoPagina0Padrao = complementoCoord ? (complementoCoord + "\n" + descricaoCurso) : descricaoCurso;
  let textoPagina0 = textoPagina0Padrao;
  // Ajuste específico para evitar redundância em Design de Interiores
  if (curso === 'Design de Interiores') {
    textoPagina0 = 'Aqui transformamos ideias em ambientes reais. Vamos falar de materiais, iluminação e ergonomia para que o espaço funcione no dia a dia.';
  }
  drawSpeechBubble(
    ctx,
    (canvas.width - balaoW) / 2,
    yBase,
    balaoW,
    balaoH,
    page === 0 ? textoPagina0 : (getPuzzleDescricaoPorCurso(curso) + "\nDivirta-se!"),
    { radius: 20, padding: 24, fontSize: 18, bgColor: "#fff", borderColor: "#0053A0", textColor: "#00315E", textAlign: "center", fontFamily: "PressStart2P-Regular" }
  );

  // Coordenador à direita: usa sprite específico se disponível, senão fallback animado normal, senão placeholder
  const npcX = canvas.width - 120 - avatarW;
  const coordImgs = getCoordinatorFrames(curso);
  let drawSrc = null;
  if (coordImgs && coordImgs.length === 2) {
    drawSrc = coordImgs[npcAnimFrame % 2];
  } else if (NPC_ANIM_IMAGES[curso]) {
    drawSrc = NPC_ANIM_IMAGES[curso][npcAnimFrame % 2];
  }
  if (drawSrc) {
    // Reutiliza técnica de metade superior como nos diálogos anteriores (zoom top-half)
    const scaleX = 1.25;
    const expandedW = avatarW * scaleX;
    const offsetX = (expandedW - avatarW) / 2;
    const drawX = npcX - offsetX;
    // Sombra adaptada
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.ellipse(drawX + expandedW / 2, yBase + avatarH - 10, (expandedW) / 2.3, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    drawNpcTopHalf(ctx, drawSrc, drawX, yBase, expandedW, avatarH, '#FDB515');
  } else {
    ctx.fillStyle = "#FDB515";
    ctx.fillRect(npcX, yBase, avatarW, avatarH);
    ctx.strokeStyle = "#FDB515";
    ctx.lineWidth = 4;
    ctx.strokeRect(npcX, yBase, avatarW, avatarH);
  }

  // Labels adaptativos abaixo dos personagens
  if (typeof drawAdaptiveLabel === 'function') {
    drawAdaptiveLabel(ctx, 'Você', 120 + avatarW / 2, yBase + avatarH + 12, avatarW + 40);
    const labelCoord = isCoordenadoraCurso(curso) ? `${curso} (Coord.)` : `${curso} (Coord.)`;
    // Desloca levemente o nome do coordenador para a direita para evitar corte
    const labelCenterX = npcX + avatarW / 2 + 18;
    drawAdaptiveLabel(ctx, labelCoord, labelCenterX, yBase + avatarH + 12, avatarW + 80);
  } else {
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Você', 120 + avatarW / 2, yBase + avatarH + 20);
    const labelCenterX = npcX + avatarW / 2 + 18;
    ctx.fillText(curso + ' (Coord.)', labelCenterX, yBase + avatarH + 20);
  }

  // Botões: paginação e ação
  const btnY = yBase + balaoH + 80; // espaço extra por causa dos nomes
  const btnW = 150, btnH = 54, btnGap = 40;
  if (page === 0) {
    // Página 0: descrição do curso — Próximo e Voltar (para hub)
    criarBotao(ctx, canvas.width / 2 - btnW - btnGap / 2, btnY, btnW, btnH, "Próximo", () => {
      window.dialogoCoordPage = 1;
    });
    criarBotao(ctx, canvas.width / 2 + btnGap / 2, btnY, btnW, btnH, "Voltar", () => {
      changeScene(cursoParaHub(curso));
    });
  } else {
    // Página 1: explicação do puzzle — Iniciar Puzzle e Voltar (para pág. 0)
    criarBotao(ctx, canvas.width / 2 - btnW - btnGap / 2, btnY, btnW, btnH, "Iniciar Puzzle", () => {
      changeScene("puzzle");
    });
    criarBotao(ctx, canvas.width / 2 + btnGap / 2, btnY, btnW, btnH, "Voltar", () => {
      window.dialogoCoordPage = 0;
    });
  }

  
  if (typeof criarHitArea === 'function') {
    criarHitArea(0, 0, 40, canvas.height, () => {
      changeScene(cursoParaHub(curso));
    });
  }
}

function getCursoDescricao(curso) {
  const map = {
    "Administração": "Gestão de organizações com foco em estratégia, processos, finanças e pessoas. Forma profissionais para liderar e tomar decisões baseadas em dados.",
    "Direito": "Estudo das leis e do sistema de justiça, com atuação consultiva e contenciosa. Desenvolve raciocínio crítico e interpretação jurídica.",
    "Psicologia": "Compreensão do comportamento humano e saúde mental em diferentes contextos. Atuação clínica, organizacional, escolar e social.",
    "Publicidade": "Planejamento e criação de comunicação para marcas. Integra pesquisa, estratégia e criatividade em campanhas multiplataforma.",
    "Arquitetura e Urbanismo": "Concepção de espaços e cidades funcionais, estéticos e sustentáveis. Une técnica, criatividade e responsabilidade urbana.",
    "Ciências Contábeis": "Gestão contábil, auditoria e fiscal das organizações. Foco na conformidade, análise financeira e tomada de decisão.",
    "Design de Interiores": "Projetos de ambientes com conforto, estética e funcionalidade. Integra materiais, iluminação e ergonomia ao uso do espaço.",
    "Engenharia de Software": "Processos, métodos e ferramentas para construir software de qualidade. Abrange requisitos, projeto, testes e manutenção.",
    "Estética e Cosmética": "Cuidados dermoestéticos e tecnologias aplicadas ao bem-estar e autoestima, com foco em protocolos e biossegurança.",
    "Biomedicina": "Diagnóstico laboratorial e pesquisa em saúde. Atua em análises clínicas, biotecnologia e controle de qualidade.",
    "Educação Física": "Promoção de saúde e desempenho por meio do exercício. Atuação em escolas, treinamentos, academias e programas de bem-estar.",
    "Enfermagem": "Cuidado integral em diferentes níveis de atenção à saúde. Envolve assistência, gestão e educação em saúde.",
    "Fisioterapia": "Prevenção e reabilitação de disfunções do movimento. Atuação em clínica, hospital, esporte e saúde coletiva.",
    "Nutrição": "Planejamento alimentar e educação nutricional. Atua em clínica, esportiva, indústria e políticas públicas de saúde.",
    "Radiologia": "Diagnóstico por imagem com segurança e precisão, incluindo raios X, tomografia e ressonância magnética."
  };
  return map[curso] || "Informações sobre o curso em breve.";
}

function cursoParaHub(curso) {
  const humanas = ["Administração", "Direito", "Psicologia", "Publicidade"];
  const exatas = ["Arquitetura e Urbanismo", "Ciências Contábeis", "Design de Interiores", "Engenharia de Software"];
  const biologicas = ["Estética e Cosmética", "Biomedicina", "Educação Física", "Enfermagem", "Fisioterapia", "Nutrição", "Radiologia"];
  if (humanas.includes(curso)) return "hubHumanas";
  if (exatas.includes(curso)) return "hubExatas";
  if (biologicas.includes(curso)) return "hubBiologicas";
  return "dialogoNPC";
}

// Cursos onde a coordenação é feminina (Coordenadora)
function isCoordenadoraCurso(curso) {
  const coordFeminina = [
    'Psicologia',
    'Design de Interiores',
    'Arquitetura e Urbanismo',
    'Estética e Cosmética',
    'Nutrição',
    'Enfermagem',
    'Radiologia'
  ];
  return coordFeminina.includes(curso);
}

function cenaFim(ctx, canvas) {
  
  try { if (typeof hideMediaOverlay === 'function') hideMediaOverlay(); } catch (e) { /* silencioso */ }
  const ps = window.puzzleState || {};
  const puzzleScore = typeof ps.lastScore === 'number' ? ps.lastScore : (ps.score || 0);
  const coletaveisScore = window.globalScore || 0;
  const totalScore = Math.min(100, puzzleScore + coletaveisScore);

  // Estado de animação (confetes + contagem)
  if (!window._fimAnim) {
    window._fimAnim = {
      start: performance.now(),
      duration: 1500,
      countFrom: 0,
      confetes: Array.from({ length: 140 }, () => ({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 400,
        r: 4 + Math.random() * 6,
        vy: 60 + Math.random() * 160,
        vx: -60 + Math.random() * 120,
        rot: Math.random() * Math.PI * 2,
        vr: (-2 + Math.random() * 4) * 0.07,
        color: ['#FDB515', '#FF6F3C', '#06D6A0', '#118AB2', '#EF476F', '#ffffff'][Math.floor(Math.random() * 6)]
      }))
    };
  }
  const anim = window._fimAnim;
  const now = performance.now();
  const t = Math.min(1, (now - anim.start) / anim.duration);
  const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic
  const animatedTotal = Math.round(anim.countFrom + (totalScore - anim.countFrom) * ease);

  // Fundo profissional (gradiente vertical + halo sutil)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGrad.addColorStop(0, '#0d1b2a');       // azul petróleo escuro topo
  bgGrad.addColorStop(0.45, '#1b263b');    // transição
  bgGrad.addColorStop(1, '#415a77');       // base levemente mais clara
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Halo central para foco
  const gradBg = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 120, canvas.width / 2, canvas.height / 2, canvas.width / 1.05);
  gradBg.addColorStop(0, 'rgba(255,255,255,0.10)');
  gradBg.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradBg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Card com sombra e borda suave
  const cardW = canvas.width - 200;
  const cardH = canvas.height - 220;
  const cardX = 100;
  const cardY = 110;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = 28;
  ctx.fillStyle = 'rgba(20,35,50,0.85)';
  ctx.beginPath();
  const radius = 28;
  ctx.moveTo(cardX + radius, cardY);
  ctx.lineTo(cardX + cardW - radius, cardY);
  ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + radius);
  ctx.lineTo(cardX + cardW, cardY + cardH - radius);
  ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - radius, cardY + cardH);
  ctx.lineTo(cardX + radius, cardY + cardH);
  ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - radius);
  ctx.lineTo(cardX, cardY + radius);
  ctx.quadraticCurveTo(cardX, cardY, cardX + radius, cardY);
  ctx.closePath();
  ctx.fill();
  // Borda sutil
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // Título estilizado
  ctx.save();
  ctx.textAlign = 'center';
  const pulse = 0.9 + Math.sin(now / 300) * 0.1;
  ctx.font = `900 ${Math.floor(62 * pulse)}px Arial`;
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#ffffff';
  const gradText = ctx.createLinearGradient(cardX, 0, cardX + cardW, 0);
  gradText.addColorStop(0, '#FDB515');
  gradText.addColorStop(0.5, '#FF4F81');
  gradText.addColorStop(1, '#06D6A0');
  ctx.fillStyle = gradText;
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 18;
  ctx.strokeText('PARABÉNS!', canvas.width / 2, cardY + 110);
  ctx.fillText('PARABÉNS!', canvas.width / 2, cardY + 110);
  ctx.restore();

  // Mensagem e scores
  ctx.save();
  ctx.fillStyle = '#f5f8fa';
  ctx.font = '600 26px Arial';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 6;
  ctx.fillText('Você concluiu o desafio!', canvas.width / 2, cardY + 170);
  ctx.shadowBlur = 0;

  ctx.font = '22px Consolas, monospace';
  ctx.fillStyle = '#e2e8ef';
  ctx.fillText(`Moedas: ${coletaveisScore}`, canvas.width / 2, cardY + 220);
  ctx.fillText(`Puzzle: ${puzzleScore}`, canvas.width / 2, cardY + 250);
  ctx.restore();

  // Total animado destaque
  ctx.save();
  const totalPulse = 1 + Math.sin(now / 200) * 0.08;
  ctx.translate(canvas.width / 2, cardY + 305);
  ctx.scale(totalPulse, totalPulse);
  ctx.font = 'bold 48px Arial';
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#ffffff';
  ctx.fillStyle = '#FF6F3C';
  ctx.strokeText(`TOTAL: ${animatedTotal}`, 0, 0);
  ctx.fillText(`TOTAL: ${animatedTotal}`, 0, 0);
  ctx.restore();


  // Botão de retorno ao início (index)
  botoes = [];
  criarBotao(ctx, cardX + 40, cardY + cardH - 90, 220, 50, 'Voltar ao Início', () => {
    // Reseta estado de jogo
    window._fimAnim = null;
    try { if (typeof hideMediaOverlay === 'function') hideMediaOverlay(); } catch (e) {  }
    if (typeof resetGame === 'function') resetGame();
    // Mostra tela inicial e oculta container do jogo
    const startScreen = document.getElementById('startScreen');
    const gameContainer = document.querySelector('.game-container');
    const toolbar = document.getElementById('topToolbar');
    // Restaura centralização da tela inicial (display:flex)
    if (startScreen) startScreen.style.display = 'flex';
    if (gameContainer) gameContainer.style.display = 'none';
    if (toolbar) toolbar.style.display = 'none';
    canvas.style.display = '';
    // Reseta controles de fade/cena para estado neutro
    try {
      if (window.sceneTransition) {
        window.sceneTransition.active = false;
        window.sceneTransition.phase = null;
        window.sceneTransition.alpha = 0;
      }
      if (typeof scene !== 'undefined') {
        // volta para estado 'start'; fluxo normal recomeça ao clicar Iniciar
        scene = 'start';
      }
      botoes = [];
    } catch (e) { /* silencioso */ }
  });

  // Confetes
  anim.confetes.forEach(c => {
    c.y += c.vy * (1 / 60);
    c.x += c.vx * (1 / 60);
    c.rot += c.vr;
    if (c.y > canvas.height + 40) {
      c.y = -20 - Math.random() * 200;
      c.x = Math.random() * canvas.width;
    }
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rot);
    ctx.fillStyle = c.color;
    ctx.fillRect(-c.r / 2, -c.r / 2, c.r, c.r);
    ctx.restore();
  });
}

let npcAnimFrame = 0;
let npcAnimFrameTimer = Date.now();

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Controle de animação dos NPCs
  if (Date.now() - npcAnimFrameTimer > 400) {
    npcAnimFrame = (npcAnimFrame + 1) % 2;
    npcAnimFrameTimer = Date.now();
  }

  // Desenha o background animado
  drawBackground(ctx, scene);

  requestAnimationFrame(update);
}

function drawRoundedRect(ctx, x, y, w, h, radius, color, lineWidth) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + radius, radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
  ctx.lineTo(x + radius, y + h);
  ctx.arcTo(x, y + h, x, y + h - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
  ctx.restore();
}



