// Cache para animação gifler
const giflerCache = {};

// Carregamento global do NPC default
const npcDefaultImg = new Image();
npcDefaultImg.src = "assets/npcs/npc_default.png";
let npcDefaultLoaded = false;
npcDefaultImg.onload = () => { npcDefaultLoaded = true; };

const NPC_ANIM_IMAGES = {
  "Administração": [
    "assets/npcs/npc_admin1.png",
    "assets/npcs/npc_admin2.png"
  ],
  "Biomedicina": [
    "assets/npcs/npc_biomedicina1.png",
    "assets/npcs/npc_biomedicina2.png"
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
    "assets/npcs/npc_publicidade1.png",
    "assets/npcs/npc_publicidade2.png"
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
  ]
};

const NPC_IMAGES = {
  "Administração": "assets/npcs/npc_admin.png",
  "Direito": "assets/npcs/npc_direito.png",
  "Psicologia": "assets/npcs/npc_psicologia.png",
  "Publicidade": "assets/npcs/npc_publicidade.png",
  "Arquitetura e Urbanismo": "assets/npcs/npc_arquitetura.png",
  "Ciências Contábeis": "assets/npcs/npc_contabeis.png",
  "Design de Interiores": "assets/npcs/npc_design.png",
  "Engenharia de Software": "assets/npcs/npc_software.png",
  "Estética e Cosmética": "assets/npcs/npc_estetica.png",
  "Biomedicina": "assets/npcs/npc_biomedicina.png",
  "Educação Física": "assets/npcs/npc_edfisica.gif",
  "Enfermagem": "assets/npcs/npc_enfermagem.png",
  "Fisioterapia": "assets/npcs/npc_fisioterapia.png",
  "Nutrição": "assets/npcs/npc_nutricao.png",
  "Radiologia": "assets/npcs/npc_radiologia.png"
};

const PORTAL_IMAGES = {
  "Administração": "assets/portais/admin_portal.png",
  "Direito": "assets/portais/direito_portal.png",
  "Psicologia": "assets/portais/psicologia_portal.png",
  "Publicidade": "assets/portais/publicidade_portal.png",
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

function fase1(ctx, player, changeScene, canvas) {
  // --- Background com imagem ---
  const bgImg = new Image();
  bgImg.src = "assets/fase1.png";
  if (bgImg.complete && bgImg.naturalWidth > 0) {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  } else {
    bgImg.onload = () => {
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    };
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
  const portalImg = new Image();
  portalImg.src = "assets/portais/portal_inicial.png";
  if (portalImg.complete && portalImg.naturalWidth > 0) {
    ctx.drawImage(portalImg, portalX, portalY, portalW, portalH);
  } else {
    portalImg.onload = () => {
      ctx.drawImage(portalImg, portalX, portalY, portalW, portalH);
    };
    // fallback enquanto carrega
    ctx.fillStyle = "brown";
    ctx.fillRect(portalX, portalY, portalW, portalH);
  }

  ctx.fillStyle = "#333333ff";
  ctx.font = "20px PressStart2P-Regular";
  ctx.fillText("Chegue à Unigran →", 50, 50);

  // ====== ITENS FLUTUANDO ANIMADOS E MAIORES ======
  if (!window.collectedItems) window.collectedItems = { i1: false, i2: false };

  // Tamanho maior dos itens
  const itemW = 40, itemH = 40;

  // Posição dos itens flutuando
  const item1 = { x: 300, y: canvas.height - groundH - 120, w: itemW, h: itemH };
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

  //ctx.fillStyle = "#e0e0e0";
  //ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "gray";
  ctx.fillRect(0, groundY, canvas.width, 100);

  // NPC centralizado
  let npcW = 60, npcH = 80;
  let npcX = (canvas.width - npcW) / 2;
  let npcY = groundY - npcH;
  ctx.fillStyle = "blue";
  ctx.fillRect(npcX, npcY, npcW, npcH);

  // Texto estilizado e maior 
  ctx.font = "bold 18px Kanit, PressStart2P-Regular, sans-serif";
  ctx.fillStyle = "#c7e4ffff";
  ctx.textAlign = "center";
  ctx.fillText("Fale com o Recepcionista", canvas.width / 2, 60);

  player.updatePlataforma(groundY);
  player.draw(ctx);

  if (colide(player, { x: npcX, y: npcY, w: npcW, h: npcH })) {
    changeScene("dialogoNPC");
  }
}

// Exemplo para qualquer diálogo
function dialogoPadrao(ctx, avatarLabel, npcLabel, textoBalao, botoesArray, canvas, curso = null) {
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Layout 3 colunas
  const avatarW = 100, avatarH = 120;
  const balaoW = 500, balaoH = 220;
  const yBase = 180;

  // Imagem do personagem à esquerda
  const unicaoImg = new Image();
  unicaoImg.src = "assets/unicaoTalk.png";
  if (unicaoImg.complete && unicaoImg.naturalWidth > 0) {
    ctx.drawImage(unicaoImg, 120, yBase, avatarW, avatarH);
  } else {
    unicaoImg.onload = () => {
      ctx.drawImage(unicaoImg, 120, yBase, avatarW, avatarH);
    };
  }
  ctx.fillStyle = "#fff";
  ctx.font = "18px PressStart2P-Regular";
  ctx.textAlign = "center";
  ctx.fillText(avatarLabel, 120 + avatarW / 2, yBase + avatarH + 24);

  // Balão centralizado
  drawSpeechBubble(
    ctx,
    (canvas.width - balaoW) / 2,
    yBase,
    balaoW,
    balaoH,
    textoBalao,
    { radius: 20, padding: 24, fontSize: 18, bgColor: "#fff", borderColor: "#0053A0", textColor: "#00315E", textAlign: "center" }
  );

  // Imagem do NPC à direita (específico do curso)
  let npcImgSrc = "assets/npcs/npc_default.png";
  if (curso && NPC_IMAGES[curso]) npcImgSrc = NPC_IMAGES[curso];
  const npcImg = new Image();
  npcImg.src = npcImgSrc;
  const npcX = canvas.width - 120 - avatarW;
  if (npcImg.complete && npcImg.naturalWidth > 0) {
    ctx.drawImage(npcImg, npcX, yBase, avatarW, avatarH);
  } else {
    npcImg.onload = () => {
      ctx.drawImage(npcImg, npcX, yBase, avatarW, avatarH);
    };
  }
  ctx.fillStyle = "#fff";
  ctx.font = "18px PressStart2P-Regular";
  ctx.textAlign = "center";
  ctx.fillText(npcLabel, npcX + avatarW / 2, yBase + avatarH + 24);

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

function dialogoNPC(ctx, changeScene, canvas) {
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Layout 3 colunas
  const avatarW = 100, avatarH = 120;
  const balaoW = 420, balaoH = 140;
  const yBase = 200;

  // Jogador à esquerda
  ctx.fillStyle = "#0053A0";
  ctx.fillRect(120, yBase, avatarW, avatarH);
  ctx.fillStyle = "#fff";
  ctx.font = "16px PressStart2P-Regular";
  ctx.fillText("Você", 140, yBase + avatarH + 20);

  // Balão centralizado usando drawSpeechBubble
  drawSpeechBubble(
    ctx,
    (canvas.width - balaoW) / 2,
    yBase,
    balaoW,
    balaoH,
    "Qual área você tem interesse?",
    { radius: 18, padding: 18, fontSize: 22, bgColor: "#fff", borderColor: "#0053A0", textColor: "#00315E" }
  );

  // NPC à direita
  ctx.fillStyle = "#FDB515";
  ctx.fillRect(canvas.width - 120 - avatarW, yBase, avatarW, avatarH);
  ctx.fillStyle = "#fff";
  ctx.font = "16px PressStart2P-Regular";
  ctx.fillText("NPC", canvas.width - 120 - avatarW + 20, yBase + avatarH + 20);

  // Botões abaixo do balão
  criarBotao(ctx, canvas.width / 2 - 220, yBase + balaoH + 40, 150, 50, "Humanas", () => changeScene("explicacaoHumanas"));
  criarBotao(ctx, canvas.width / 2 - 60, yBase + balaoH + 40, 150, 50, "Exatas", () => changeScene("explicacaoExatas"));
  criarBotao(ctx, canvas.width / 2 + 100, yBase + balaoH + 40, 150, 50, "Biológicas", () => changeScene("explicacaoBiologicas"));
}

function explicacaoArea(ctx, changeScene, canvas, titulo, texto, destinoHub) {
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Layout 3 colunas
  const avatarW = 100, avatarH = 120;
  const balaoW = 500, balaoH = 220;
  const yBase = 180;

  // Jogador à esquerda
  ctx.fillStyle = "#0053A0";
  ctx.fillRect(120, yBase, avatarW, avatarH);
  ctx.fillStyle = "#fff";
  ctx.font = "18px PressStart2P-Regular";
  ctx.textAlign = "center";
  ctx.fillText("Você", 120 + avatarW / 2, yBase + avatarH + 24);

  // Balão centralizado
  drawSpeechBubble(
    ctx,
    (canvas.width - balaoW) / 2,
    yBase,
    balaoW,
    balaoH,
    `${titulo}\n${texto}`,
    { radius: 20, padding: 24, fontSize: 18, bgColor: "#fff", borderColor: "#0053A0", textColor: "#00315E", textAlign: "center" }
  );

  // NPC1 à direita
  ctx.fillStyle = "#FDB515";
  ctx.fillRect(canvas.width - 120 - avatarW, yBase, avatarW, avatarH);
  ctx.fillStyle = "#fff";
  ctx.font = "18px PressStart2P-Regular";
  ctx.textAlign = "center";
  ctx.fillText("NPC1", canvas.width - 120 - avatarW / 2, yBase + avatarH + 24);

  // Botões lado a lado, com espaçamento
  const btnY = yBase + balaoH + 40;
  criarBotao(ctx, canvas.width / 2 - 100, btnY, 150, 50, "Selecionar", () => changeScene(destinoHub));
  criarBotao(ctx, canvas.width / 2 + 70, btnY, 150, 50, "Voltar", () => changeScene("dialogoNPC"));
}

function hub(ctx, player, changeScene, canvas) {
  // Fundo com tema Unigran (azul)
  ctx.fillStyle = "#EAF3FF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "black";
  ctx.font = "20px PressStart2P-Regular";
  ctx.fillText("Hub - Escolha seu curso", 50, 50);

  player.updateLivre(canvas);
  player.draw(ctx);

  // exemplo de portal
  let portalX = 80, portalY = 80, pw = 80, ph = 120;
  ctx.fillStyle = "purple";
  ctx.fillRect(portalX, portalY, pw, ph);

  if (colide(player, { x: portalX, y: portalY, w: pw, h: ph })) {
    changeScene("curso1");
  }
}

function faseCurso(ctx, player, canvas, curso, changeScene) {
  let groundY = canvas.height - 100;
  ctx.fillStyle = "#EAF3FF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "green";
  ctx.fillRect(0, groundY, canvas.width, 100);

  if (typeof drawHUD === 'function') {
    const courseScore = (window.puzzleState && window.puzzleState.score) || 0;
    const totalScore = Math.min(100, (window.globalScore || 0) + courseScore);
    drawHUD(ctx, curso, totalScore);
  }

  player.updatePlataforma(groundY);
  player.draw(ctx);

  // NPC coordenador centralizado
  let npcW = 60, npcH = 80;
  let npcX = (canvas.width - npcW) / 2;
  let npcY = groundY - npcH;
  ctx.fillStyle = "#FDB515";
  ctx.fillRect(npcX, npcY, npcW, npcH);

  ctx.fillStyle = "#15548fff";
  ctx.font = "28px Kanit, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Fale com o Coordenador →", canvas.width / 2, npcY - 30);

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
  desenharHubBase(ctx, canvas, "Hub - Área de Humanas");

  const cursos = [
    { nome: "Administração", descricao: "Gestão de empresas, finanças, pessoas e estratégia." },
    { nome: "Direito", descricao: "Estudo das leis, justiça, atuação jurídica e cidadania." },
    { nome: "Psicologia", descricao: "Comportamento humano, saúde mental e processos psíquicos." },
    { nome: "Publicidade", descricao: "Criação de campanhas, marketing, comunicação e branding." }
  ];
  desenharPortaisSaguao(ctx, player, changeScene, canvas, cursos, "hubHumanas");
}

function hubExatas(ctx, player, changeScene, canvas) {
  desenharHubBase(ctx, canvas, "Hub - Área de Exatas");

  const cursos = [
    { nome: "Arquitetura e Urbanismo", descricao: "Projetos de edificações e planejamento urbano." },
    { nome: "Ciências Contábeis", descricao: "Gestão contábil, fiscal e financeira das organizações." },
    { nome: "Design de Interiores", descricao: "Ambientes funcionais e estéticos, materiais e iluminação." },
    { nome: "Engenharia de Software", descricao: "Desenvolvimento, qualidade e manutenção de software." }
  ];
  desenharPortaisSaguao(ctx, player, changeScene, canvas, cursos, "hubExatas");
}

function hubBiologicas(ctx, player, changeScene, canvas) {
  desenharHubBase(ctx, canvas, "Hub - Área de Biológicas");

  const cursos = [
    { nome: "Estética e Cosmética", descricao: "Cuidados estéticos, dermocosméticos e bem-estar." },
    { nome: "Biomedicina", descricao: "Análises clínicas, pesquisa e diagnóstico laboratorial." },
    { nome: "Educação Física", descricao: "Atividade física, saúde e performance esportiva." },
    { nome: "Enfermagem", descricao: "Cuidado integral à saúde e assistência clínica." },
    { nome: "Fisioterapia", descricao: "Reabilitação, prevenção e qualidade de vida." },
    { nome: "Nutrição", descricao: "Alimentação, saúde e planejamento nutricional." },
    { nome: "Radiologia", descricao: "Diagnóstico por imagem e proteção radiológica." }
  ];
  desenharPortaisSaguao(ctx, player, changeScene, canvas, cursos, "hubBiologicas");
}

function desenharHubBase(ctx, canvas, titulo) {
  ctx.fillStyle = "#f0d9b5";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#0053A0";
  ctx.font = "28px Arial";
  // Centraliza o texto
  const textWidth = ctx.measureText(titulo).width;
  ctx.fillText(titulo, (canvas.width - textWidth) / 2, 50);
}

function desenharPortaisComNPCs(ctx, player, changeScene, canvas, cursos, hubScene) {
  // Layout em grid
  const startX = 240;
  const startY = 160;
  const gapX = 260;
  const gapY = 200;
  const portalW = 80;
  const portalH = 120;

  // Calcular colunas que cabem na largura do canvas
  let colunas = Math.max(1, Math.floor((canvas.width - startX - portalW) / gapX) + 1);
  cursos.forEach((curso, idx) => {
    const col = idx % colunas;
    const row = Math.floor(idx / colunas);
    const x = startX + col * gapX;
    const y = startY + row * gapY;

    // Portal dos  cursos com cor azul (retângulo azul)
    ctx.fillStyle = "#0053A0";
    ctx.fillRect(x, y, portalW, portalH);

    // NPC à frente do portal (retângulo azul logo abaixo)
    const npcX = x + 10;
    const npcY = y + portalH + 10;
    ctx.fillStyle = "#FDB515";
    ctx.fillRect(npcX, npcY, 60, 80);

    // Rótulo do curso centralizado acima do portal
    ctx.fillStyle = "#00315E";
    ctx.font = "18px Arial bold";
    ctx.textAlign = "center";
    ctx.fillText(
      curso.nome,
      p.x + portalW / 2,           // centraliza em relação ao portal
      p.y - 22                     // um pouco acima do portal
    );

    // Checagem de colisão com o portal para abrir diálogo
    if (colide(player, { x, y, w: portalW, h: portalH })) {
      window.currentCursoDialog = {
        curso: curso.nome,
        descricao: curso.descricao,
        hubScene
      };
      changeScene("dialogoCurso");
    }
  });

  // Movimento do player em modo livre
  player.updateLivre(canvas);
  player.draw(ctx);
}

function desenharPortaisSaguao(ctx, player, changeScene, canvas, cursos, hubScene) {
  const portalW = 100, portalH = 140, npcW = 60, npcH = 80, margem = 60;
  const width = canvas.width, height = canvas.height;

  // Calcula posições: 4 cantos + 3 laterais (topo centro, meio esquerda, meio direita)
  const posicoes = [
    // canto superior esquerdo
    { x: margem, y: margem, npcX: margem + portalW + 10, npcY: margem + portalH / 2, npcDir: 'right' },
    // canto superior direito
    { x: width - portalW - margem, y: margem, npcX: width - portalW - margem - npcW - 10, npcY: margem + portalH / 2, npcDir: 'left' },
    // canto inferior esquerdo
    { x: margem, y: height - portalH - margem, npcX: margem + portalW + 10, npcY: height - portalH - margem + portalH / 2, npcDir: 'right' },
    // canto inferior direito
    { x: width - portalW - margem, y: height - portalH - margem, npcX: width - portalW - margem - npcW - 10, npcY: height - portalH - margem + portalH / 2, npcDir: 'left' },
    // topo centro
    { x: width / 2 - portalW / 2, y: margem, npcX: width / 2 + portalW / 2 + 10, npcY: margem + portalH / 2, npcDir: 'right' },
    // meio esquerda
    { x: margem, y: height / 2 - portalH / 2, npcX: margem + portalW + 10, npcY: height / 2, npcDir: 'right' },
    // meio direita
    { x: width - portalW - margem, y: height / 2 - portalH / 2, npcX: width - portalW - margem - npcW - 10, npcY: height / 2, npcDir: 'left' }
  ];

  // Se houver mais cursos, distribua na base centro, topo direita/esquerda, base direita/esquerda, etc.
  // Adicione mais posições conforme necessário para todos os cursos
  while (posicoes.length < cursos.length) {
    // base centro
    posicoes.push({
      x: width / 2 - portalW / 2,
      y: height - portalH - margem,
      npcX: width / 2 + portalW / 2 + 10,
      npcY: height - portalH - margem + portalH / 2,
      npcDir: 'right'
    });
    // topo esquerda extra
    posicoes.push({
      x: margem + 120,
      y: margem,
      npcX: margem + 120 + portalW + 10,
      npcY: margem + portalH / 2,
      npcDir: 'right'
    });
    // base direita extra
    posicoes.push({
      x: width - portalW - margem - 120,
      y: height - portalH - margem,
      npcX: width - portalW - margem - 120 - npcW - 10,
      npcY: height - portalH - margem + portalH / 2,
      npcDir: 'left'
    });
  }

  const azul = "#0053A0";
  const dourado = "#FDB515";

  cursos.forEach((curso, idx) => {
    const p = posicoes[idx];

    // Portal: usa imagem específica se existir, senão um retângulo azul
    let portalImgSrc = PORTAL_IMAGES[curso.nome];
    if (portalImgSrc) {
      let portalImg = new Image();
      portalImg.src = portalImgSrc;
      if (portalImg.complete && portalImg.naturalWidth > 0) {
        ctx.drawImage(portalImg, p.x, p.y, portalW, portalH);
      } else {
        portalImg.onload = () => {
          ctx.drawImage(portalImg, p.x, p.y, portalW, portalH);
        };
        ctx.fillStyle = "#0053A0";
        ctx.fillRect(p.x, p.y, portalW, portalH);
      }
    } else {
      ctx.fillStyle = "#0053A0";
      ctx.fillRect(p.x, p.y, portalW, portalH);
    }

    // NPC colado ao portal, do lado de dentro da tela, alinhado à base
    const npcW = 60, npcH = 80;
    let npcX, npcY;
    if (p.npcDir === 'right') {
      npcX = p.x + portalW + 2;
      npcY = p.y + portalH - npcH;
    } else {
      npcX = p.x - npcW - 2;
      npcY = p.y + portalH - npcH;
    }

    // Usa animação de 2 frames se existir
    let npcImgs = NPC_ANIM_IMAGES[curso.nome];
    if (npcImgs) {
      let npcImg = new Image();
      npcImg.src = npcImgs[npcAnimFrame];
      if (npcImg.complete && npcImg.naturalWidth > 0) {
        ctx.drawImage(npcImg, npcX, npcY, npcW, npcH);
      } else {
        npcImg.onload = () => {
          ctx.drawImage(npcImg, npcX, npcY, npcW, npcH);
        };
        ctx.fillStyle = "#FDB515";
        ctx.fillRect(npcX, npcY, npcW, npcH);
      }
    } else {
      // fallback para NPC único ou default
      let npcImgSrc = NPC_IMAGES[curso.nome] || "assets/npcs/npc_default.png";
      let npcImg = new Image();
      npcImg.src = npcImgSrc;
      if (npcImg.complete && npcImg.naturalWidth > 0) {
        ctx.drawImage(npcImg, npcX, npcY, npcW, npcH);
      } else {
        npcImg.onload = () => {
          ctx.drawImage(npcImg, npcX, npcY, npcW, npcH);
        };
        ctx.fillStyle = "#FDB515";
        ctx.fillRect(npcX, npcY, npcW, npcH);
      }
    }

    // Rótulo do curso centralizado acima do portal
    ctx.fillStyle = "#00315E";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      curso.nome,
      p.x + portalW / 2,           // centraliza em relação ao portal
      p.y - 12                     // um pouco acima do portal
    );

    // Colisão para abrir diálogo
    if (colide(player, { x: p.x, y: p.y, w: portalW, h: portalH })) {
      window.currentCursoDialog = { curso: curso.nome, descricao: curso.descricao, hubScene };
      changeScene("dialogoCurso");
    }
  });

  player.updateLivre(canvas);
  player.draw(ctx);
}

// Para cada NPC, desenhe o GIF animado apenas uma vez
function desenharGifNPC(npcImgSrc, ctx, x, y, w, h, key) {
  if (!giflerCache[key]) {
    gifler(npcImgSrc).get(function (anim) {
      giflerCache[key] = anim;
    });
    // Enquanto não carrega, desenhe um quadrado laranja
    ctx.fillStyle = "#FDB515";
    ctx.fillRect(x, y, w, h);
  } else {
    // Sempre chama animate a cada frame!
    giflerCache[key].animate(ctx, { x, y, width: w, height: h });
  }
}

function dialogoCurso(ctx, changeScene, canvas) {
  const dlg = window.currentCursoDialog;
  if (!dlg) return;
  dialogoPadrao(
    ctx,
    "Você",
    "Coordenador",
    `${dlg.curso}\n${EXPLICACOES_PORTAL[dlg.curso] || dlg.descricao}`,
    [
      { texto: "Entrar", acao: () => { window.currentCursoName = dlg.curso; changeScene("curso"); } },
      { texto: "Voltar", acao: () => changeScene(dlg.hubScene) }
    ],
    canvas,
    dlg.curso // <-- passa o nome do curso para pegar o NPC correto
  );
}

function dialogoCursoInfo(ctx, changeScene, canvas) {
  const curso = window.currentCursoName || "Curso";
  const descricao = EXPLICACOES_COORDENADOR[curso] || getCursoDescricao(curso);

  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Layout 3 colunas
  const avatarW = 100, avatarH = 120;
  const balaoW = 500, balaoH = 220;
  const yBase = 180;

  // Jogador à esquerda
  ctx.fillStyle = "#0053A0";
  ctx.fillRect(120, yBase, avatarW, avatarH);
  ctx.fillStyle = "#fff";
  ctx.font = "18px PressStart2P-Regular";
  ctx.textAlign = "center";
  ctx.fillText("Você", 120 + avatarW / 2, yBase + avatarH + 24);

  // Balão centralizado com cantos arredondados
  drawSpeechBubble(
    ctx,
    (canvas.width - balaoW) / 2,
    yBase,
    balaoW,
    balaoH,
    `${curso}\n${descricao}`,
    { radius: 20, padding: 24, fontSize: 18, bgColor: "#fff", borderColor: "#0053A0", textColor: "#00315E", textAlign: "center", fontFamily: "PressStart2P-Regular" }
  );

  // NPC à direita
  ctx.fillStyle = "#FDB515";
  ctx.fillRect(canvas.width - 120 - avatarW, yBase, avatarW, avatarH);
  ctx.fillStyle = "#fff";
  ctx.font = "18px PressStart2P-Regular";
  ctx.textAlign = "center";
  ctx.fillText("Coordenador", canvas.width - 120 - avatarW / 2, yBase + avatarH + 24);

  // Botões lado a lado, com espaçamento
  const btnY = yBase + balaoH + 40;
  const btnW = 150, btnH = 54, btnGap = 40;
  criarBotao(ctx, canvas.width / 2 - btnW - btnGap / 2, btnY, btnW, btnH, "Iniciar Puzzle", () => {
    changeScene("puzzle");
  });
  criarBotao(ctx, canvas.width / 2 + btnGap / 2, btnY, btnW, btnH, "Voltar", () => {
    changeScene(cursoParaHub(curso));
  });
}

function getCursoDescricao(curso) {
  const map = {
    "Administração": "Curso voltado à gestão de organizações, estratégia, processos e finanças para resultados sustentáveis.",
    "Direito": "Estudo das leis e do sistema de justiça, com atuação em diversas áreas jurídicas.",
    "Psicologia": "Compreensão do comportamento humano e saúde mental em diversos contextos.",
    "Publicidade": "Planejamento e criação de campanhas para comunicação e marketing de marcas.",
    "Arquitetura e Urbanismo": "Concepção de espaços e cidades funcionais, estéticos e sustentáveis.",
    "Ciências Contábeis": "Contabilidade, auditoria e gestão fiscal-financeira das empresas.",
    "Design de Interiores": "Projetos de ambientes internos com conforto, estética e funcionalidade.",
    "Engenharia de Software": "Engenharia para desenvolver, testar e manter sistemas de software.",
    "Estética e Cosmética": "Cuidados dermoestéticos com foco em bem-estar e autoestima.",
    "Biomedicina": "Diagnóstico laboratorial e pesquisa em saúde.",
    "Educação Física": "Promoção de saúde e desempenho por meio da atividade física.",
    "Enfermagem": "Cuidado integral de saúde em diferentes níveis de atenção.",
    "Fisioterapia": "Reabilitação e prevenção de disfunções do movimento.",
    "Nutrição": "Alimentação equilibrada, clínica e saúde coletiva.",
    "Radiologia": "Diagnóstico por imagem com segurança e precisão."
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

function cenaFim(ctx, canvas) {
  const puzzleScore = (window.puzzleState && window.puzzleState.lastScore) || 0;
  const coletaveisScore = window.globalScore || 0;
  const totalScore = Math.min(100, puzzleScore + coletaveisScore);

  ctx.fillStyle = "#0053A0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Card central
  ctx.fillStyle = "#ffffff";
  const cardW = canvas.width - 200;
  const cardH = canvas.height - 220;
  const cardX = 100;
  const cardY = 110;
  ctx.fillRect(cardX, cardY, cardW, cardH);

  // ===== Parabéns centralizado e letras maiores =====
  ctx.fillStyle = "#00315E";
  ctx.font = "bold 64px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Parabéns!", canvas.width / 2, cardY + 100);

  ctx.font = "28px Arial";
  ctx.fillText(`Você concluiu o puzzle!`, canvas.width / 2, cardY + 160);
  ctx.fillText(`Pontuação: ${totalScore}`, canvas.width / 2, cardY + 210);

  if (totalScore >= 100) {
    ctx.fillStyle = "#008f5a";
    ctx.font = "24px Arial";
    ctx.fillText("Parabéns! Você acertou tudo e ganhou um brinde especial!", canvas.width / 2, cardY + 260);
  }

  // Botão para voltar ao hub da área do curso atual
  botoes = [];
  criarBotao(ctx, cardX + 40, cardY + cardH - 90, 260, 50, "Voltar ao Início do Prédio", () => {
    changeScene("fasePredio");
  });

  // Redirecionamento automático ao início do prédio após 4s
  if (!window._fimRedirectScheduled) {
    window._fimRedirectScheduled = true;
    setTimeout(() => {
      window._fimRedirectScheduled = false;
      changeScene("fasePredio");
    }, 4000);
  }
}

let npcAnimFrame = 0;
let npcAnimFrameTimer = Date.now();

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Controle de animação dos NPCs (deve estar aqui!)
  if (Date.now() - npcAnimFrameTimer > 400) {
    npcAnimFrame = (npcAnimFrame + 1) % 2;
    npcAnimFrameTimer = Date.now();
  }

  // Desenha o background animado
  drawBackground(ctx, scene);

  requestAnimationFrame(update);
}



