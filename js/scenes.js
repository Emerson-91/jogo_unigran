function fase1(ctx, player, changeScene, canvas) {
  let groundY = canvas.height - 100;

  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "green";
  ctx.fillRect(0, groundY, canvas.width, 100);

  ctx.fillStyle = "brown";
  ctx.fillRect(canvas.width - 100, groundY - 150, 100, 150);

  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Chegue ao prédio →", 50, 50);

  // plataformas simples
  const plataforma = { x: 200, y: groundY - 60, w: 160, h: 20 };
  const plataforma2 = { x: 420, y: groundY - 120, w: 160, h: 20 };
  ctx.fillStyle = "#8B4513";
  ctx.fillRect(plataforma.x, plataforma.y, plataforma.w, plataforma.h);
  ctx.fillRect(plataforma2.x, plataforma2.y, plataforma2.w, plataforma2.h);

  // itens colecionáveis (+10 cada, máximo +20)
  if (!window.collectedItems) window.collectedItems = { i1: false, i2: false };
  ctx.fillStyle = "#FDB515";
  if (!window.collectedItems.i1) ctx.fillRect(plataforma.x + 60, plataforma.y - 20, 20, 20);
  if (!window.collectedItems.i2) ctx.fillRect(plataforma2.x + 60, plataforma2.y - 20, 20, 20);

  // colisão rudimentar com plataformas
  const prevY = player.y;
  player.updatePlataforma(groundY);
  // suporte sobre plataformas
  [plataforma, plataforma2].forEach(p => {
    const feetY = player.y + player.h;
    const wasAbove = prevY + player.h <= p.y;
    if (player.x + player.w > p.x && player.x < p.x + p.w && feetY >= p.y && feetY <= p.y + 10 && wasAbove) {
      player.y = p.y - player.h;
      player.velY = 0;
      player.jumping = false;
    }
  });

  // coleta
  if (!window.globalScore) window.globalScore = 0;
  if (!window.collectedItems.i1 && colide(player, { x: plataforma.x + 60, y: plataforma.y - 20, w: 20, h: 20 })) {
    window.collectedItems.i1 = true;
    window.globalScore = Math.min(20, (window.globalScore || 0) + 10);
  }
  if (!window.collectedItems.i2 && colide(player, { x: plataforma2.x + 60, y: plataforma2.y - 20, w: 20, h: 20 })) {
    window.collectedItems.i2 = true;
    window.globalScore = Math.min(20, (window.globalScore || 0) + 10);
  }
  player.draw(ctx);

  if (colide(player, { x: canvas.width - 100, y: groundY - 150, w: 100, h: 150 })) {
    changeScene("fasePredio");
  }
}

function fasePredio(ctx, player, changeScene, canvas) {
  let groundY = canvas.height - 100;

  ctx.fillStyle = "#e0e0e0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "gray";
  ctx.fillRect(0, groundY, canvas.width, 100);

  // NPC centralizado
  let npcW = 60, npcH = 80;
  let npcX = (canvas.width - npcW) / 2;
  let npcY = groundY - npcH;
  ctx.fillStyle = "blue";
  ctx.fillRect(npcX, npcY, npcW, npcH);

  // Texto estilizado e maior
  ctx.font = "bold 38px Kanit, Arial, sans-serif";
  ctx.fillStyle = "#0053A0";
  ctx.textAlign = "center";
  ctx.fillText("Fale com o npc da primeira cena →", canvas.width / 2, 100);

  player.updatePlataforma(groundY);
  player.draw(ctx);

  if (colide(player, { x: npcX, y: npcY, w: npcW, h: npcH })) {
    changeScene("dialogoNPC");
  }
}

// Exemplo para dialogoNPC
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
  ctx.font = "16px Arial";
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
  ctx.font = "16px Arial";
  ctx.fillText("NPC", canvas.width - 120 - avatarW + 20, yBase + avatarH + 20);

  // Botões abaixo do balão
  criarBotao(ctx, canvas.width / 2 - 220, yBase + balaoH + 40, 150, 50, "Humanas", () => changeScene("explicacaoHumanas"));
  criarBotao(ctx, canvas.width / 2 - 60, yBase + balaoH + 40, 150, 50, "Exatas", () => changeScene("explicacaoExatas"));
  criarBotao(ctx, canvas.width / 2 + 100, yBase + balaoH + 40, 150, 50, "Biológicas", () => changeScene("explicacaoBiologicas"));
}

function explicacaoArea(ctx, changeScene, canvas, titulo, texto, destinoHub) {
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.fillRect(150, 100, 700, 350);

  ctx.fillStyle = "black";
  ctx.font = "26px Arial";
  ctx.fillText(titulo, 180, 150);

  ctx.font = "18px Arial";
  wrapText(ctx, texto, 180, 190, 640, 22);

  criarBotao(ctx, 250, 380, 150, 50, "Selecionar", () => changeScene(destinoHub));
  criarBotao(ctx, 500, 380, 150, 50, "Voltar", () => changeScene("dialogoNPC"));
}

function hub(ctx, player, changeScene, canvas) {
  // Fundo com tema Unigran (azul)
  ctx.fillStyle = "#EAF3FF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Hub - Escolha seu curso", 50, 50);

  player.updateLivre(canvas);
  player.draw(ctx);

  // exemplo de portal
  let portalX = 200, portalY = 200, pw = 80, ph = 120;
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

    // Portal
    ctx.fillStyle = "#0053A0";
    ctx.fillRect(x, y, portalW, portalH);

    // NPC à frente do portal (retângulo azul logo abaixo)
    const npcX = x + 10;
    const npcY = y + portalH + 10;
    ctx.fillStyle = "#FDB515";
    ctx.fillRect(npcX, npcY, 60, 80);

    // Rótulo do curso
    ctx.fillStyle = "#00315E";
    ctx.font = "16px Arial";
    ctx.fillText(curso.nome, x - 10, y - 10);

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
    // Portal
    ctx.fillStyle = azul;
    ctx.fillRect(p.x, p.y, portalW, portalH);

    // NPC
    ctx.fillStyle = dourado;
    ctx.fillRect(p.npcX, p.npcY, npcW, npcH);

    // Rótulo do curso (sempre voltado para dentro)
    ctx.fillStyle = "#00315E";
    ctx.font = "16px Arial";
    let labelX = p.x, labelY = p.y - 10;
    if (p.npcDir === 'right') labelX = p.x + portalW + 20;
    if (p.npcDir === 'left') labelX = p.x - 80;
    ctx.fillText(curso.nome, labelX, labelY);

    // Colisão para abrir diálogo
    if (colide(player, { x: p.x, y: p.y, w: portalW, h: portalH })) {
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

  ctx.fillStyle = "rgba(0,83,160,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Layout 3 colunas
  const avatarW = 100, avatarH = 120;
  const balaoW = 500, balaoH = 220; // aumente o tamanho do balão
  const yBase = 180;

  // Jogador à esquerda
  ctx.fillStyle = "#0053A0";
  ctx.fillRect(120, yBase, avatarW, avatarH);
  ctx.fillStyle = "#fff";
  ctx.font = "16px Arial";
  ctx.fillText("Você", 140, yBase + avatarH + 20);

  // Balão centralizado
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#0053A0";
  ctx.lineWidth = 3;
  ctx.fillRect((canvas.width - balaoW) / 2, yBase, balaoW, balaoH);
  ctx.strokeRect((canvas.width - balaoW) / 2, yBase, balaoW, balaoH);
  ctx.fillStyle = "#00315E";
  ctx.font = "22px Arial";
  ctx.textAlign = "center";
  ctx.fillText(dlg.curso, canvas.width / 2, yBase + 40);
  ctx.font = "16px Arial";
  ctx.textAlign = "left";
  // Ajuste: wrapText dentro do balão, com margens
  wrapText(
    ctx,
    EXPLICACOES_PORTAL[dlg.curso] || dlg.descricao,
    (canvas.width - balaoW) / 2 + 24,
    yBase + 70,
    balaoW - 48,
    22
  );

  // NPC à direita
  ctx.fillStyle = "#FDB515";
  ctx.fillRect(canvas.width - 120 - avatarW, yBase, avatarW, avatarH);
  ctx.fillStyle = "#fff";
  ctx.font = "16px Arial";
  ctx.fillText("Coordenador", canvas.width - 120 - avatarW + 2, yBase + avatarH + 20);

  // Botões abaixo do balão
  criarBotao(ctx, canvas.width / 2 - 120, yBase + balaoH + 30, 150, 50, "Entrar", () => {
    window.currentCursoName = dlg.curso;
    changeScene("curso");
  });
  criarBotao(ctx, canvas.width / 2 + 20, yBase + balaoH + 30, 150, 50, "Voltar", () => {
    changeScene(dlg.hubScene);
  });
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
  ctx.font = "16px Arial";
  ctx.fillText("Você", 140, yBase + avatarH + 20);

  // Balão centralizado
  drawSpeechBubble(
    ctx,
    (canvas.width - balaoW) / 2,
    yBase,
    balaoW,
    balaoH,
    `${curso}\n${descricao}`,
    { radius: 18, padding: 18, fontSize: 18, bgColor: "#fff", borderColor: "#0053A0", textColor: "#00315E" }
  );

  // NPC à direita
  ctx.fillStyle = "#FDB515";
  ctx.fillRect(canvas.width - 120 - avatarW, yBase, avatarW, avatarH);
  ctx.fillStyle = "#fff";
  ctx.font = "16px Arial";
  ctx.fillText("Coordenador", canvas.width - 120 - avatarW + 2, yBase + avatarH + 20);

  // Botões lado a lado, com espaçamento
  const btnY = yBase + balaoH + 40;
  criarBotao(ctx, canvas.width / 2 - 170, btnY, 150, 50, "Iniciar Puzzle", () => {
    changeScene("puzzle");
  });
  criarBotao(ctx, canvas.width / 2 + 20, btnY, 150, 50, "Voltar", () => {
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

  ctx.fillStyle = "#00315E";
  ctx.font = "36px Arial";
  ctx.fillText("Parabéns!", cardX + 40, cardY + 60);

  ctx.font = "22px Arial";
  ctx.fillText(`Você concluiu o puzzle!`, cardX + 40, cardY + 100);
  ctx.fillText(`Pontuação: ${totalScore}`, cardX + 40, cardY + 140);

  if (totalScore >= 100) {
    ctx.fillStyle = "#008f5a";
    ctx.font = "22px Arial";
    ctx.fillText("Parabéns! Você acertou tudo e ganhou um brinde especial!", cardX + 40, cardY + 180);
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