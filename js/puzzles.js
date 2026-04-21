// ===== CONSTANTES DE PONTUAÇÃO =====
const COIN_VALUE = 10;            // Valor fixo por moeda coletada
const QUIZ_CORRECT_VALUE = 20;    // Valor fixo por questão correta

// ===== MAPEAMENTO DE MODOS POR CURSO =====
// Humanas: Administração (ordem), Direito (quiz), Psicologia (memória), Publicidade (quiz)
// Exatas: Arquitetura e Urbanismo (formas), Ciências Contábeis (quiz), Design de Interiores (associação), Engenharia de Software (memória)
// Biológicas: Estética e Cosmética (memória), Biomedicina (quiz), Educação Física (quiz), Enfermagem (quiz), Fisioterapia (associacao), Nutrição (associacao), Radiologia (quiz)
const COURSE_MODE = {
  'Administração': 'quiz',                 // Jogo de Administração: quiz (trocado de ordem)
  'Direito': 'quiz',                       // Jogo de Direito: quiz
  'Psicologia': 'memoria',                 // Jogo de Psicologia: memória
  'Publicidade': 'quiz',                   // Jogo de Publicidade: quiz
  'Arquitetura e Urbanismo': 'formas',     // Jogo de Arquitetura e Urbanismo: formas
  'Ciências Contábeis': 'quiz',            // Jogo de Ciências Contábeis: quiz
  'Design de Interiores': 'quiz',          // Jogo de Design de Interiores: quiz (trocado de associação)
  'Engenharia de Software': 'memoria',     // Jogo de Engenharia de Software: memória
  'Estética e Cosmética': 'memoria',       // Jogo de Estética e Cosmética: memória
  'Biomedicina': 'quiz',                   // Jogo de Biomedicina: quiz
  'Educação Física': 'quiz',               // Jogo de Educação Física: quiz
  'Enfermagem': 'quiz',                    // Jogo de Enfermagem: quiz
  'Fisioterapia': 'quiz',                  // Jogo de Fisioterapia: quiz (trocado de associação)
  'Nutrição': 'quiz',                      // Jogo de Nutrição: quiz (convertido de associação)
  'Radiologia': 'quiz'                     // Jogo de Radiologia: quiz
};

// ===== TEMA E HELPERS VISUAIS PARA PUZZLES =====
const PUZZLE_THEME = {
  titleFont: '700 26px Arial, sans-serif',
  bodyFont: '500 18px Arial, sans-serif',
  smallFont: '500 16px Arial, sans-serif',
  primary: '#0053A0',
  primaryDark: '#00315E',
  surface: '#FFFFFF',
  outline: '#B6C6DD',
  shadow: 'rgba(0,0,0,0.18)',
  correct: '#06D6A0',
  wrong: '#EF476F',
  accent: '#FDB515',
};

function drawRoundedRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawTitle(ctx, text, x, y, maxWidth) {
  ctx.save();
  ctx.font = PUZZLE_THEME.titleFont;
  ctx.fillStyle = PUZZLE_THEME.primary; // cor sólida do tema
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawPillFeedback(ctx, text, centerX, topY, opts = {}) {
  const padX = opts.padX ?? 16;
  const h = 34;
  ctx.save();
  ctx.font = PUZZLE_THEME.bodyFont;
  const w = ctx.measureText(text).width + padX * 2;
  const x = centerX - w / 2;
  const y = topY;
  ctx.shadowColor = PUZZLE_THEME.shadow;
  ctx.shadowBlur = 10;
  ctx.fillStyle = opts.bg || 'rgba(255,255,255,0.95)';
  drawRoundedRectPath(ctx, x, y, w, h, 14);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = opts.border || PUZZLE_THEME.outline;
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = opts.color || PUZZLE_THEME.primaryDark;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(text, x + w / 2, y + h / 2);
  ctx.restore();
}

// ===== ORDEM (Administração, Engenharia de Software) =====
// Jogo de Administração: ordem
// Jogo de Engenharia de Software: ordem (se trocar o modo para 'ordem')
function prepararOrdem(ps) {
  let sequencias, enunciado;
  if (ps.curso === 'Engenharia de Software') {
    // Puzzle "O Envio Desordenado"
    sequencias = [
      { texto: 'Pesar e Medir o Pacote', cor: '#cfe8ff', ordem: 0 },
      { texto: 'Calcular Rota de Entrega', cor: '#fff2cc', ordem: 1 },
      { texto: 'Imprimir Etiqueta', cor: '#e8ffe1', ordem: 2 },
      { texto: 'Colar Etiqueta no Pacote', cor: '#ffe0e0', ordem: 3 },
      { texto: 'Colocar Pacote na Esteira', cor: '#f1d9ff', ordem: 4 }
    ];
    ps.objetos = sequencias.map((s, i) => ({ id: 'ord' + i, tipo: 'card', x: 120, y: 180 + i * 80, w: 300, h: 60, ...s }));
    ps.alvos = [0, 1, 2, 3, 4].map((ord, i) => ({ id: 'slot' + i, tipo: 'slot', x: 500, y: 180 + i * 80, w: 300, h: 60, ordem: ord }));
  } else {
    // Administração - questões descritivas, imagens e enunciado
    const questoes = [
      {
        enunciado: 'Organize as etapas do processo produtivo de uma empresa:',
        cards: [
          { texto: 'Etapa inicial: transformar matéria-prima em produto', cor: '#9ad', ordem: 0, img: 'assets/administracao/producao.png' },
          { texto: 'Etapa de apresentar o produto ao cliente', cor: '#8cb', ordem: 1, img: 'assets/administracao/venda.png' },
          { texto: 'Resultado financeiro após todas as etapas', cor: '#fdb', ordem: 2, img: 'assets/administracao/lucro.png' }
        ]
      },
      {
        enunciado: 'Coloque na ordem correta as fases do ciclo de gestão:',
        cards: [
          { texto: 'Definir objetivos e estratégias antes de agir', cor: '#cfe8ff', ordem: 0, img: 'assets/administracao/planejamento.png' },
          { texto: 'Colocar em prática o que foi planejado', cor: '#fff2cc', ordem: 1, img: 'assets/administracao/execucao.png' },
          { texto: 'Acompanhar e avaliar se tudo saiu como esperado', cor: '#e8ffe1', ordem: 2, img: 'assets/administracao/controle.png' }
        ]
      },
      {
        enunciado: 'Organize o fluxo de mercadorias em uma empresa:',
        cards: [
          { texto: 'Comprar insumos necessários para o negócio', cor: '#ffe0e0', ordem: 0, img: 'assets/administracao/compra.png' },
          { texto: 'Guardar os produtos até o momento da venda', cor: '#f1d9ff', ordem: 1, img: 'assets/administracao/estoque.png' },
          { texto: 'Entregar o produto ao consumidor', cor: '#cfe8ff', ordem: 2, img: 'assets/administracao/venda.png' }
        ]
      },
      {
        enunciado: 'Coloque na ordem correta as etapas de gestão de pessoas:',
        cards: [
          { texto: 'Selecionar pessoas para trabalhar na empresa', cor: '#fff2cc', ordem: 0, img: 'assets/administracao/recrutamento.png' },
          { texto: 'Preparar os funcionários para suas funções', cor: '#e8ffe1', ordem: 1, img: 'assets/administracao/treinamento.png' },
          { texto: 'Reconhecer e valorizar quem se destaca', cor: '#fdb', ordem: 2, img: 'assets/administracao/promocao.png' }
        ]
      }
    ];
    // Seleciona a questão conforme etapa
    const etapa = ps.etapa || 0;
    const questaoAtual = questoes[etapa % questoes.length];
    sequencias = questaoAtual.cards;
    enunciado = questaoAtual.enunciado;

    ps.objetos = sequencias.map((s, i) => ({
      id: 'ord' + i,
      tipo: 'card',
      x: 120,
      y: 180 + i * 90,
      w: 220,
      h: 80,
      ...s
    }));
    ps.alvos = [0, 1, 2].map((ord, i) => ({
      id: 'slot' + i,
      tipo: 'slot',
      x: 420 + i * 230,
      y: 190,
      w: 220,
      h: 80,
      ordem: ord
    }));
    ps.enunciado = enunciado; // Salva o enunciado para usar no desenho
    ps.gabarito = sequencias
      .slice()
      .sort((a, b) => a.ordem - b.ordem)
      .map(s => s.texto);
  }
}

function drawPuzzleOrdem(ctx, ps) {
  drawTitle(ctx, ps.enunciado || 'Organize as etapas na ordem correta', 100, 150, 820);

  // desenha slots
  ps.alvos.forEach(a => {
    ctx.save();
    ctx.lineWidth = 3;
    ctx.strokeStyle = PUZZLE_THEME.outline;
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    drawRoundedRectPath(ctx, a.x, a.y, a.w, a.h, 10);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });
  // desenha cartões
  ps.objetos.forEach(o => {
    // Cartão com cantos arredondados e sombra suave
    const baseCor = o.incorreto ? '#FFD3DD' : (o.cor || '#e8f0ff');
    ctx.save();
    ctx.shadowColor = PUZZLE_THEME.shadow;
    ctx.shadowBlur = 8;
    ctx.fillStyle = baseCor;
    drawRoundedRectPath(ctx, o.x, o.y, o.w, o.h, 12);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 2;
    ctx.strokeStyle = o.incorreto ? PUZZLE_THEME.wrong : PUZZLE_THEME.primary;
    ctx.stroke();
    ctx.restore();
    // Imagem opcional
    let textoYBase = o.y + 12;
    if (o.img) {
      const img = getImage(o.img);
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, o.x + 8, o.y + 8, 48, 48);
      } // se não estiver carregada ainda, apenas não desenha (evita piscada); próxima frame ela aparece
      textoYBase = o.y + 10;
    }
    ctx.fillStyle = PUZZLE_THEME.primaryDark;
    ctx.font = PUZZLE_THEME.smallFont;
    const maxTextW = o.w - (o.img ? 64 : 16);
    wrapText(ctx, o.texto, o.x + (o.img ? 64 : 10), textoYBase + 18, maxTextW, 16);
  });
  // feedback (estilo padronizado)
  if (ps.feedback) {
    const texto = ps.feedback;
    const cartas = ps.objetos || [];
    let maxY = 0;
    cartas.forEach(c => { const bottom = c.y + c.h; if (bottom > maxY) maxY = bottom; });
    let baseY = maxY + 28;
    if (baseY > canvas.height - 110) baseY = canvas.height - 110;
    drawPillFeedback(ctx, texto, canvas.width / 2, baseY, {
      bg: 'rgba(255,255,255,0.95)',
      border: ps.feedbackColor || PUZZLE_THEME.outline,
      color: (ps.feedbackColor === PUZZLE_THEME.correct) ? '#064e3b' : PUZZLE_THEME.primaryDark
    });
  }
  // botão validar
  criarBotao(ctx, 100, canvas.height - 140, 200, 50, 'Validar', () => {
    if (ps.revelando) return; // evita múltiplos cliques
    let corretos = 0;
    ps.objetos.forEach(o => {
      const slot = ps.alvos.find(a => intersect(o, a));
      if (slot && slot.ordem === o.ordem) {
        o.incorreto = false;
        corretos++;
      } else {
        o.incorreto = true;
      }
    });
    if (corretos === ps.objetos.length) {
      ps.score = Math.min(80, ps.score + QUIZ_CORRECT_VALUE);
      ps.feedback = 'Correto!';
      ps.feedbackColor = PUZZLE_THEME.correct;
      ps.etapa = (ps.etapa || 0) + 1;
      const totalQuestoes = 4;
      setTimeout(() => {
        if (ps.etapa >= totalQuestoes) finalizarPuzzle(); else { prepararOrdem(ps); ps.feedback = ''; }
      }, 800);
    } else {
      // Mostra gabarito abaixo e marca incorretos
      ps.feedback = 'Alguns estão fora da ordem. Veja o gabarito abaixo.';
      ps.feedbackColor = PUZZLE_THEME.wrong;
      ps.revelando = true;
      ps.mostrarGabarito = true;
      ps.revealStart = performance.now();
      ps.revealDuration = 6000; // ms
      setTimeout(() => {
        ps.etapa = (ps.etapa || 0) + 1;
        const totalQuestoes = 4;
        ps.revelando = false;
        if (ps.etapa >= totalQuestoes) finalizarPuzzle(); else { prepararOrdem(ps); ps.feedback = ''; ps.mostrarGabarito = false; }
      }, 6000);
    }
  });

  // Gabarito
  if (ps.mostrarGabarito && ps.gabarito) {
    ctx.fillStyle = '#00315E';
    ctx.font = '16px Arial';
    wrapText(ctx, 'Gabarito: ' + ps.gabarito.join(' | '), 100, canvas.height - 260, canvas.width - 200, 22);
    if (ps.revealStart && ps.revealDuration) {
      const elapsed = performance.now() - ps.revealStart;
      const remain = Math.max(0, Math.ceil((ps.revealDuration - elapsed) / 1000));
      ctx.fillStyle = '#0053A0';
      ctx.font = '20px Arial';
      ctx.fillText('Avançando em ' + remain + 's', 100 + 160, canvas.height - 220);
    }
  }
}


// ===== FORMAS (Arquitetura e Urbanismo) =====
// Jogo de Arquitetura e Urbanismo: formas
function prepararFormas(ps) {
  // Nova proposta: montar uma planta simplificada com 6 ambientes
  // Apenas ativa este layout para Arquitetura e Urbanismo
  if (ps.curso === 'Arquitetura e Urbanismo') {
    // Enunciado
    ps.enunciado = 'Monte a planta conforme a planta baixa: arraste os ambientes para os locais corretos.';

    // Área do card branco
    const whiteX = 80, whiteY = 80, whiteW = canvas.width - 160, whiteH = canvas.height - 160;
    // Define um retângulo da casa centralizado (contíguo) com 2 colunas x 3 linhas
    const maxHouseW = Math.min(880, whiteW - 160);
    const maxHouseH = Math.min(520, whiteH - 180);
    const houseW = maxHouseW;
    const houseH = maxHouseH;
    const houseX = whiteX + Math.floor((whiteW - houseW) / 2);
    const houseY = whiteY + 120; // deixa espaço para o título

    // Proporções aproximadas da planta (conforme imagem):
    // - Largura: esquerda ~68.5% (Sala de Estar ampla), direita ~31.5%
    const leftW = Math.floor(houseW * 0.685);
    const rightW = houseW - leftW;
    // - Alturas por coluna (frações somando 1 por coluna)
    const L1 = Math.floor(houseH * 0.31);   // Dormitório 1
    const L2 = Math.floor(houseH * 0.18);   // WC (aumentado)
    const L3 = houseH - L1 - L2;            // Sala de Estar (reduzido)
    const R1 = Math.floor(houseH * 0.413); // Dormitório 2
    const R2 = Math.floor(houseH * 0.31);  // Cozinha
    const R3 = houseH - R1 - R2;           // Sala de Jantar

    const slots = [
      // Coluna esquerda
      { id: 'slot_quarto1', tipo: 'slotForma', role: 'quarto1', label: 'Dormitório 1', x: houseX, y: houseY, w: leftW, h: L1, preview: 'assets/arquitetura/quarto1.svg' },
      { id: 'slot_banheiro', tipo: 'slotForma', role: 'banheiro', label: 'WC', x: houseX, y: houseY + L1, w: leftW, h: L2, preview: 'assets/arquitetura/banheiro.svg' },
      { id: 'slot_sala_estar', tipo: 'slotForma', role: 'sala_estar', label: 'Sala de Estar', x: houseX, y: houseY + L1 + L2, w: leftW, h: L3, preview: 'assets/arquitetura/sala.svg' },
      // Coluna direita
      { id: 'slot_quarto2', tipo: 'slotForma', role: 'quarto2', label: 'Dormitório 2', x: houseX + leftW, y: houseY, w: rightW, h: R1, preview: 'assets/arquitetura/quarto2.svg' },
      { id: 'slot_cozinha', tipo: 'slotForma', role: 'cozinha', label: 'Cozinha', x: houseX + leftW, y: houseY + R1, w: rightW, h: R2, preview: 'assets/arquitetura/cozinha.svg' },
      { id: 'slot_sala_jantar', tipo: 'slotForma', role: 'sala_jantar', label: 'Sala de Jantar', x: houseX + leftW, y: houseY + R1 + R2, w: rightW, h: R3, preview: 'assets/arquitetura/sala_jantar.svg' }
    ];
    ps.alvos = slots;

    // Peças com imagens e papéis definidos, posições iniciais em coluna à esquerda
    const startX = whiteX + 20;
    const startY0 = whiteY + 120;
    // Todos os blocos começam do mesmo tamanho (menores) e redimensionam ao encaixar
    const initW = Math.max(90, Math.min(200, Math.floor(houseW * 0.22)));
    const initH = Math.max(70, Math.min(150, Math.floor(houseH * 0.18)));
    const gapY = initH + 18;
    ps.objetos = [
      { id: 'p_quarto1', tipo: 'formaPiece', role: 'quarto1', img: 'assets/arquitetura/quarto1.svg', w: initW, h: initH, label: 'Dormitório 1' },
      { id: 'p_quarto2', tipo: 'formaPiece', role: 'quarto2', img: 'assets/arquitetura/quarto2.svg', w: initW, h: initH, label: 'Dormitório 2' },
      { id: 'p_banheiro', tipo: 'formaPiece', role: 'banheiro', img: 'assets/arquitetura/banheiro.svg', w: initW, h: initH, label: 'WC' },
      { id: 'p_cozinha', tipo: 'formaPiece', role: 'cozinha', img: 'assets/arquitetura/cozinha.svg', w: initW, h: initH, label: 'Cozinha' },
      { id: 'p_sala_estar', tipo: 'formaPiece', role: 'sala_estar', img: 'assets/arquitetura/sala.svg', w: initW, h: initH, label: 'Sala de Estar' },
      { id: 'p_sala_jantar', tipo: 'formaPiece', role: 'sala_jantar', img: 'assets/arquitetura/sala_jantar.svg', w: initW, h: initH, label: 'Sala de Jantar' }
    ].map((p, i) => ({ ...p, x: startX, y: startY0 + i * gapY }));

    // Guarda bounding box da casa para desenhar contorno externo na renderização
    ps.houseBounds = { x: houseX, y: houseY, w: houseW, h: houseH };
    return;
  }

  // Fallback (caso outro curso reutilize este modo): triângulo simples
  const alvoBase = { id: 'slotBase', tipo: 'slotForma', role: 'base', x: 520, y: 360, w: 220, h: 40 };
  const alvoLadoE = { id: 'slotLadoE', tipo: 'slotForma', role: 'ladoE', x: 520, y: 280, w: 100, h: 40 };
  const alvoLadoD = { id: 'slotLadoD', tipo: 'slotForma', role: 'ladoD', x: 640, y: 280, w: 100, h: 40 };
  ps.alvos = [alvoBase, alvoLadoE, alvoLadoD];
  ps.objetos = [
    { id: 'pBase', tipo: 'formaPiece', role: 'base', x: 120, y: 220, w: 220, h: 40, cor: '#cfe8ff', label: 'Base' },
    { id: 'pLadoE', tipo: 'formaPiece', role: 'ladoE', x: 120, y: 300, w: 100, h: 40, cor: '#ffe0e0', label: 'Lado E' },
    { id: 'pLadoD', tipo: 'formaPiece', role: 'ladoD', x: 120, y: 380, w: 100, h: 40, cor: '#e8ffe1', label: 'Lado D' }
  ];
  ps.enunciado = 'Forme o triângulo: arraste as peças aos slots corretos.';
}

function drawPuzzleFormas(ctx, ps) {
  // Título padrão (estilo Administração)
  drawTitle(ctx, ps.enunciado || 'Arraste as peças para os slots corretos.', 100, 150, 1000);

  // Slots da planta: fundo suave + contorno tracejado + rótulo e preview
  // Contorno externo da casa (contígua)
  if (ps.houseBounds) {
    const b = ps.houseBounds;
    ctx.save();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#0053A0';
    ctx.fillStyle = 'rgba(0,83,160,0.04)';
    drawRoundedRectPath(ctx, b.x, b.y, b.w, b.h, 12);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  ps.alvos.forEach(a => {
    ctx.save();
    // preenchimento leve sem borda para parecer contíguo
    ctx.fillStyle = 'rgba(0,83,160,0.06)';
    ctx.fillRect(a.x, a.y, a.w, a.h);
    // preview
    if (a.preview) {
      const img = getImage(a.preview);
      if (img && img.complete && img.naturalWidth > 0) {
        const ratio = Math.min((a.w - 20) / img.naturalWidth, (a.h - 20) / img.naturalHeight);
        const iw = Math.floor(img.naturalWidth * ratio);
        const ih = Math.floor(img.naturalHeight * ratio);
        const ix = a.x + Math.floor((a.w - iw) / 2);
        const iy = a.y + Math.floor((a.h - ih) / 2);
        ctx.globalAlpha = 0.12;
        ctx.drawImage(img, ix, iy, iw, ih);
        ctx.globalAlpha = 1;
      }
    }
    // label
    ctx.fillStyle = '#00315E';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(a.label || a.role, a.x + 4, a.y + 16);
    ctx.restore();
  });

  // Peças: moldura clara + imagem + rótulo
  ps.objetos.forEach(o => {
    ctx.save();
    ctx.shadowColor = PUZZLE_THEME.shadow;
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#ffffff';
    drawRoundedRectPath(ctx, o.x, o.y, o.w, o.h, 10);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 2;
    ctx.strokeStyle = o.error ? PUZZLE_THEME.wrong : PUZZLE_THEME.primary;
    ctx.stroke();
    // imagem
    if (o.img) {
      const img = getImage(o.img);
      if (img && img.complete && img.naturalWidth > 0) {
        const ratio = Math.min((o.w - 20) / img.naturalWidth, (o.h - 34) / img.naturalHeight);
        const iw = Math.floor(img.naturalWidth * ratio);
        const ih = Math.floor(img.naturalHeight * ratio);
        const ix = o.x + Math.floor((o.w - iw) / 2);
        const iy = o.y + Math.floor((o.h - ih) / 2);
        ctx.drawImage(img, ix, iy, iw, ih);
      }
    }
    // rótulo discreto
    ctx.fillStyle = '#00315E';
    ctx.font = '600 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(o.label || '', o.x + o.w / 2, o.y + o.h + 18);
    ctx.restore();
  });
  criarBotao(ctx, 100, canvas.height - 140, 200, 50, 'Validar', () => {
    const total = ps.objetos.length;
    let corretas = 0;
    ps.objetos.forEach(o => {
      const slot = ps.alvos.find(a => a.role === o.role);
      const ok = !!(slot && intersect(o, slot));
      if (ok) corretas += 1;
      o.error = !ok;
    });
    // Pontuação proporcional até 80 pontos quando tudo correto
    const alvoMax = 80;
    const pontos = Math.round((corretas / total) * alvoMax);
    ps.score = pontos; // define diretamente a pontuação do puzzle de formas
    if (corretas === total) {
      ps.feedback = 'Planta montada com sucesso!';
      ps.feedbackColor = PUZZLE_THEME.correct;
      setTimeout(() => finalizarPuzzle(), 600);
    } else {
      const erros = total - corretas;
      ps.feedback = `Faltam ${erros} ambiente(s) no lugar correto. (${corretas}/${total})`;
      ps.feedbackColor = PUZZLE_THEME.wrong;
    }
  });

  // Feedback visual com fonte e espaçamento unificados
  if (ps.feedback) {
    const maxSlotBottom = ps.alvos.reduce((m, a) => Math.max(m, a.y + a.h), 0);
    const maxPieceBottom = ps.objetos.reduce((m, o) => Math.max(m, o.y + o.h), 0);
    const anchor = Math.max(maxSlotBottom, maxPieceBottom);
    const pillY = Math.min(anchor + 28, canvas.height - 110);
    const centerX = canvas.width / 2;
    drawPillFeedback(ctx, ps.feedback, centerX, pillY, {
      bg: 'rgba(255,255,255,0.95)',
      border: ps.feedbackColor || PUZZLE_THEME.outline,
      color: (ps.feedbackColor === '#008f5a') ? '#064e3b' : PUZZLE_THEME.primaryDark
    });
  }
}

// ===== QUIZ (Direito, Publicidade, Ciências Contábeis, Biomedicina, Educação Física, Enfermagem, Radiologia, Nutrição, Estética e Cosmética, Engenharia de Software) =====
// Jogo de Direito: quiz
// Jogo de Publicidade: quiz
// Jogo de Ciências Contábeis: quiz
// Jogo de Biomedicina: quiz
// Jogo de Educação Física: quiz
// Jogo de Enfermagem: quiz
// Jogo de Radiologia: quiz
// Jogo de Nutrição: quiz (se trocar o modo para 'quiz')
// Jogo de Estética e Cosmética: quiz (se trocar o modo para 'quiz')
// Jogo de Engenharia de Software: quiz (se trocar o modo para 'quiz')
function prepararQuiz(ps) {
  // Enunciado padrão (fallback)
  ps.enunciado = 'Selecione a alternativa correta:';
}

function drawPuzzleQuiz(ctx, ps) {
  const perguntas = obterPerguntasPorCurso(ps.curso);
  const idx = Math.min(ps.etapa, perguntas.length - 1);
  const q = perguntas[idx];
  // Título: usar a pergunta como título no estilo Administração
  drawTitle(ctx, (q && q.pergunta) ? q.pergunta : (ps.enunciado || 'Selecione a alternativa correta:'), 100, 150, 1000);
  // Evita recontar pontos se já foi respondida corretamente
  if (!ps.quizAnswered) ps.quizAnswered = {}; // mapa idx->true quando já pontuou

  // Mapeamento de GIFs para Educação Física
  // Ajustado para apontar para os arquivos existentes no projeto
  const gifsEducacaoFisica = [
    'assets/puzzle/edfisica/q1.gif',
    'assets/puzzle/edfisica/q2.gif',
    'assets/puzzle/edfisica/q3.gif',
    'assets/puzzle/edfisica/q4.gif'
  ];

  // Layout em duas colunas para TODOS os cursos com modo 'quiz'
  const QUIZ_TWO_COL = ['Direito', 'Publicidade', 'Ciências Contábeis', 'Biomedicina', 'Educação Física', 'Enfermagem', 'Radiologia', 'Nutrição', 'Design de Interiores', 'Fisioterapia', 'Administração'];
  if (QUIZ_TWO_COL.includes(ps.curso)) {
    const isEdFis = ps.curso === 'Educação Física';

    // Área maior reservada para a mídia à direita (abaixada para não colidir com o título)
    const baseMediaY = 180; // antes era 140
    const mediaBox = { x: 520, y: (ps.curso === 'Ciências Contábeis' ? baseMediaY + 30 : baseMediaY), maxW: 620, maxH: 400 };

    // Coluna esquerda: apenas opções (pergunta já exibida como título)
    ctx.fillStyle = PUZZLE_THEME.primaryDark;
    ctx.font = PUZZLE_THEME.bodyFont;
    const isPublicidade = ps.curso === 'Publicidade';
    const isRadiologia = ps.curso === 'Radiologia';
    const isNutricao = ps.curso === 'Nutrição';
    const isDireito = ps.curso === 'Direito';
    const isContabeis = ps.curso === 'Ciências Contábeis';
    const isBiomedicina = ps.curso === 'Biomedicina';
    const isEnfermagem = ps.curso === 'Enfermagem';
    // Leve padding extra nos cursos que usavam margem menor (de 80 para 100)
    const leftPad = (isPublicidade || isRadiologia || isNutricao || isDireito || isContabeis || isBiomedicina || isEnfermagem) ? 120 : 100;
    const columnRight = mediaBox.x - 20; // margem direita da coluna esquerda
    const baseY = 230;
    q.opcoes.forEach((op, i) => {
      const y = baseY + i * 70;
      const btnW = Math.max(220, columnRight - leftPad);
      const textoOp = `${i + 1}) ${op}`;
      const wrapped = breakButtonText(ctx, textoOp, btnW - 32, 20); // 16px padding interno por lado
      criarBotao(ctx, leftPad, y, btnW, 50, wrapped, () => {
        if (ps.quizAnswered[idx]) return; // evita duplicar pontos
        if (i !== q.correta) {
          ps.quizHighlight = { wrongIndex: i, correctIndex: q.correta, baseY };
          ps.feedback = 'Resposta incorreta.';
          ps.feedbackColor = PUZZLE_THEME.wrong;
        } else {
          ps.quizHighlight = { wrongIndex: null, correctIndex: q.correta, baseY };
          ps.feedback = 'Correto!';
          ps.feedbackColor = PUZZLE_THEME.correct;
          ps.score = Math.min(80, ps.score + QUIZ_CORRECT_VALUE);
          ps.quizAnswered[idx] = true;
        }
        setTimeout(() => {
          if (ps.etapa < perguntas.length - 1) {
            ps.etapa += 1;
            ps.feedback = '';
            ps.quizHighlight = null;
          } else {
            finalizarPuzzle();
          }
        }, 700);
      });
    });

    // Destaques nas opções
    if (ps.quizHighlight) {
      const x = leftPad, w = Math.max(220, columnRight - leftPad), h = 50;
      if (ps.quizHighlight.correctIndex != null) {
        const y = baseY + ps.quizHighlight.correctIndex * 70;
        ctx.strokeStyle = PUZZLE_THEME.correct; ctx.lineWidth = 4; ctx.strokeRect(x, y, w, h); ctx.lineWidth = 3;
      }
      if (ps.quizHighlight.wrongIndex != null) {
        const y = baseY + ps.quizHighlight.wrongIndex * 70;
        ctx.strokeStyle = PUZZLE_THEME.wrong; ctx.lineWidth = 4; ctx.strokeRect(x, y, w, h); ctx.lineWidth = 3;
      }
    }

    // Feedback textual abaixo das opções (fonte e espaçamento ajustados)
    if (ps.feedback) {
      const btnWCol = Math.max(220, columnRight - leftPad);
      const optionsBottom = baseY + (q.opcoes.length - 1) * 70 + 50; // último botão
      const pillY = Math.min(optionsBottom + 18, canvas.height - 110);
      const centerX = leftPad + btnWCol / 2;
      drawPillFeedback(ctx, ps.feedback, centerX, pillY, {
        bg: 'rgba(255,255,255,0.95)',
        border: ps.feedbackColor || PUZZLE_THEME.outline,
        color: (ps.feedbackColor === PUZZLE_THEME.correct) ? '#064e3b' : PUZZLE_THEME.primaryDark
      });
    }

    // Coluna direita: mídia ilustrativa
    if (isEdFis) {
      // Educação Física: no projeto atual existem apenas .gif em assets/puzzle/edfisica
      const base = `assets/puzzle/edfisica/q${idx + 1}`;
      const candidatosEF = [`${base}.gif`];
      let desenhadaEF = false;
      let carregandoEF = false;
      let overlaySrc = null;
      for (let src of candidatosEF) {
        const img = getImage(src);
        if (!img) continue;
        if (!img.complete) { carregandoEF = true; continue; }
        if (img.complete && img.naturalWidth === 0) { continue; }
        const ratio = Math.min(mediaBox.maxW / img.naturalWidth, mediaBox.maxH / img.naturalHeight);
        const w = img.naturalWidth * ratio;
        const h = img.naturalHeight * ratio;
        const drawX = mediaBox.x + (mediaBox.maxW - w) / 2;
        const drawY = mediaBox.y + (mediaBox.maxH - h) / 2;
        // Se for GIF, usa overlay de <img> para manter animação
        if (/\.gif($|\?)/i.test(src)) {
          overlaySrc = src;
        } else {
          ctx.drawImage(img, drawX, drawY, w, h);
        }
        desenhadaEF = true;
        break;
      }
      if (!desenhadaEF) {
        // Fallback para lista antiga de GIFs
        const mediaSrc = gifsEducacaoFisica[idx] || '';
        if (mediaSrc) {
          const img = getImage(mediaSrc);
          if (img && img.complete && img.naturalWidth > 0) {
            const ratio = Math.min(mediaBox.maxW / img.naturalWidth, mediaBox.maxH / img.naturalHeight);
            const w = img.naturalWidth * ratio;
            const h = img.naturalHeight * ratio;
            const drawX = mediaBox.x + (mediaBox.maxW - w) / 2;
            const drawY = mediaBox.y + (mediaBox.maxH - h) / 2;
            if (/\.gif($|\?)/i.test(mediaSrc)) {
              overlaySrc = mediaSrc;
            } else {
              ctx.drawImage(img, drawX, drawY, w, h);
            }
            desenhadaEF = true;
          } else {
            carregandoEF = carregandoEF || (img && !img.complete);
          }
        }
      }
      if (overlaySrc) {
        if (typeof setMediaOverlay === 'function') setMediaOverlay(mediaBox, overlaySrc);
      } else {
        if (typeof hideMediaOverlay === 'function') hideMediaOverlay();
      }
      if (!desenhadaEF) {
        ctx.strokeStyle = PUZZLE_THEME.primaryDark;
        ctx.setLineDash([10, 6]);
        ctx.strokeRect(mediaBox.x, mediaBox.y, mediaBox.maxW, mediaBox.maxH);
        ctx.setLineDash([]);
        ctx.fillStyle = PUZZLE_THEME.primaryDark;
        ctx.textAlign = 'center';
        ctx.font = '18px Arial';
        const centerX = mediaBox.x + mediaBox.maxW / 2;
        const centerY = mediaBox.y + mediaBox.maxH / 2 - 10;
        if (carregandoEF) {
          ctx.fillText('Carregando imagem...', centerX, centerY);
        } else {
          ctx.fillText(`Imagem q${idx + 1} não encontrada`, centerX, centerY);
          ctx.font = '14px Arial';
          ctx.fillText(`assets/puzzle/edfisica/q${idx + 1}.{gif}`, centerX, centerY + 22);
        }
        ctx.textAlign = 'left';
      }
    } else {
      if (typeof hideMediaOverlay === 'function') hideMediaOverlay();
      // Demais cursos com quiz: tentar carregar imagens por pasta mapeada (formatos limitados por pasta)
      const COURSE_MEDIA_FOLDERS = {
        'Publicidade': 'comunicacao',
        'Direito': 'direito',
        'Ciências Contábeis': 'contabeis',
        'Biomedicina': 'biomedicina',
        'Enfermagem': 'enfermagem',
        'Radiologia': 'radiologia',
        'Nutrição': 'nutricao',
        'Design de Interiores': 'design',
        'Fisioterapia': 'fisioterapia',
        'Administração': 'administracao'
      };
      const folder = COURSE_MEDIA_FOLDERS[ps.curso];
      const base = folder ? `assets/puzzle/${folder}/q${idx + 1}` : '';
      // Extensões válidas por pasta, na ordem preferida
      const extsByFolder = {
        administracao: ['.png'],
        comunicacao: ['.png'],
        direito: ['.png', '.svg'],
        contabeis: ['.png', '.svg'],
        biomedicina: ['.webp', '.png', '.svg'],
        enfermagem: ['.png', '.svg'],
        radiologia: ['.png'],
        nutricao: ['.png', '.svg'],
        design: ['.webp'],
        fisioterapia: ['.webp']
      };
      const candidatos = base && folder ? (extsByFolder[folder] || ['.png']).map(ext => `${base}${ext}`) : [];
      let carregando = false;
      let desenhada = false;
      for (let src of candidatos) {
        const img = getImage(src);
        if (!img) continue;
        if (!img.complete) { carregando = true; continue; }
        if (img.complete && img.naturalWidth === 0) { continue; }
        const ratio = Math.min(mediaBox.maxW / img.naturalWidth, mediaBox.maxH / img.naturalHeight);
        const w = img.naturalWidth * ratio;
        const h = img.naturalHeight * ratio;
        const drawX = mediaBox.x + (mediaBox.maxW - w) / 2;
        const drawY = mediaBox.y + (mediaBox.maxH - h) / 2;
        ctx.drawImage(img, drawX, drawY, w, h);
        desenhada = true;
        break;
      }
      if (!desenhada) {
        ctx.strokeStyle = PUZZLE_THEME.primaryDark;
        ctx.setLineDash([10, 6]);
        ctx.strokeRect(mediaBox.x, mediaBox.y, mediaBox.maxW, mediaBox.maxH);
        ctx.setLineDash([]);
        ctx.fillStyle = PUZZLE_THEME.primaryDark;
        ctx.textAlign = 'center';
        ctx.font = '18px Arial';
        const centerX = mediaBox.x + mediaBox.maxW / 2;
        const centerY = mediaBox.y + mediaBox.maxH / 2 - 10;
        if (carregando) {
          ctx.fillText('Carregando imagem...', centerX, centerY);
        } else if (folder) {
          ctx.fillText(`Imagem q${idx + 1} não encontrada`, centerX, centerY);
          ctx.font = '14px Arial';
          const hintExts = (extsByFolder[folder] || ['.png']).map(e => e.replace('.', '')).join('|');
          ctx.fillText(`assets/puzzle/${folder}/q${idx + 1}.{${hintExts}}`, centerX, centerY + 22);
        } else {
          ctx.fillText('Sem pasta de mídia definida', centerX, centerY);
        }
        ctx.textAlign = 'left';
      }
    }
  } else {
    // Layout padrão: nenhum overlay deve ficar ativo
    if (typeof hideMediaOverlay === 'function') hideMediaOverlay();
    // Layout padrão para outros cursos
    while (q.opcoes.length < 4) q.opcoes.push('—');
    const baseY = 220;
    q.opcoes.forEach((op, i) => {
      const y = baseY + i * 70;
      const textoOp = `${i + 1}) ${op}`;
      const btnW = canvas.width - 240;
      const wrapped = breakButtonText(ctx, textoOp, btnW - 40, 20);
      criarBotao(ctx, 120, y, btnW, 50, wrapped, () => {
        if (ps.quizAnswered[idx]) return; // evita duplicar pontos
        if (i !== q.correta) {
          ps.quizHighlight = { wrongIndex: i, correctIndex: q.correta, baseY };
          ps.feedback = 'Resposta incorreta.';
          ps.feedbackColor = PUZZLE_THEME.wrong;
        } else {
          ps.quizHighlight = { wrongIndex: null, correctIndex: q.correta, baseY };
          ps.feedback = 'Correto!';
          ps.feedbackColor = PUZZLE_THEME.correct;
          ps.score = Math.min(80, ps.score + QUIZ_CORRECT_VALUE);
          ps.quizAnswered[idx] = true;
        }
        setTimeout(() => {
          if (ps.etapa < perguntas.length - 1) {
            ps.etapa += 1;
            ps.feedback = '';
            ps.quizHighlight = null;
          } else {
            finalizarPuzzle();
          }
        }, 700);
      });
    });
    // Destaques visuais
    if (ps.quizHighlight) {
      const x = 120, w = canvas.width - 240, h = 50;
      if (ps.quizHighlight.correctIndex != null) {
        const y = baseY + ps.quizHighlight.correctIndex * 70;
        ctx.strokeStyle = PUZZLE_THEME.correct; ctx.lineWidth = 4; ctx.strokeRect(x, y, w, h); ctx.lineWidth = 3;
      }
      if (ps.quizHighlight.wrongIndex != null) {
        const y = baseY + ps.quizHighlight.wrongIndex * 70;
        ctx.strokeStyle = PUZZLE_THEME.wrong; ctx.lineWidth = 4; ctx.strokeRect(x, y, w, h); ctx.lineWidth = 3;
      }
    }
    // Feedback textual com melhor fonte e espaçamento (fora dos destaques)
    if (ps.feedback) {
      const optionsBottom = baseY + (q.opcoes.length - 1) * 70 + 50;
      const pillY = Math.min(optionsBottom + 18, canvas.height - 110);
      const centerX = 120 + (canvas.width - 240) / 2;
      drawPillFeedback(ctx, ps.feedback, centerX, pillY, {
        bg: 'rgba(255,255,255,0.95)',
        border: ps.feedbackColor || PUZZLE_THEME.outline,
        color: (ps.feedbackColor === PUZZLE_THEME.correct) ? '#064e3b' : PUZZLE_THEME.primaryDark
      });
    }
  }
}

// Utilitário: quebra texto para caber em uma largura maxW usando fonte de 20px já configurada fora
function breakButtonText(ctx, texto, maxW, fontSize) {
  if (!texto) return '';
  const prevFont = ctx.font;
  ctx.font = `${fontSize || 20}px Arial`;
  const words = String(texto).split(/\s+/);
  let lines = [];
  let line = '';
  words.forEach(word => {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  });
  if (line) lines.push(line);
  ctx.font = prevFont; // restaura
  return lines.join('\n');
}

// ===== MEMÓRIA (Psicologia, Estética e Cosmética, Engenharia de Software) =====
// Jogo de Psicologia: memória
// Jogo de Estética e Cosmética: memória
// Jogo de Engenharia de Software: memória
function prepararMemoria(ps) {
  let faces;
  if (ps.curso === 'Engenharia de Software') {
    // Pares de linguagens de programação
    faces = [
      { nome: 'Java', img: 'assets/puzzle/software/java.png' },
      { nome: 'Python', img: 'assets/puzzle/software/python.png' },
      { nome: 'PHP', img: 'assets/puzzle/software/php.png' },
      { nome: 'JavaScript', img: 'assets/puzzle/software/js.png' }
    ];
  } else if (ps.curso === 'Psicologia') {
    // Jogo de Psicologia: usar imagens de teorias abordagens (gestalt, psicanálise, tcc, social)
    // As imagens devem estar em assets/puzzle/psicologia/
    faces = [
      { nome: 'Gestalt', img: 'assets/puzzle/psicologia/gestalt.png' },
      { nome: 'Psicanálise', img: 'assets/puzzle/psicologia/psicanalise.png' },
      { nome: 'TCC', img: 'assets/puzzle/psicologia/tcc.png' },
      { nome: 'Social', img: 'assets/puzzle/psicologia/social.png' }
    ];
  } else {
    if (ps.curso === 'Estética e Cosmética') {
      // No projeto atual, os arquivos existentes são .png em assets/puzzle/estetica
      const EXTS = ['.png'];
      function cand(name) {
        return EXTS.map(ext => `assets/puzzle/estetica/${name}${ext}`);
      }
      faces = [
        { nome: 'Oil free', imgCandidates: cand('oilfree') },
        { nome: 'FPS', imgCandidates: cand('fps') },
        { nome: 'Esfoliação', imgCandidates: cand('esfoliacao') },
        { nome: 'Hidratante', imgCandidates: cand('hidratante') }
      ];
    } else {
      faces = ['Oil free', 'FPS', 'Esfoliação', 'Hidratante'];
    }
  }
  // Enunciado padrão (estilo Administração)
  ps.enunciado = 'Memória: encontre dois cartões iguais';
  const cartas = [];
  let id = 0;
  faces.forEach((face, idx) => {
    // Para Engenharia, face é objeto; para outros, é string
    cartas.push({ id: id++, pair: idx, face });
    cartas.push({ id: id++, pair: idx, face });
  });
  shuffleArray(cartas);
  // Layout: cartas maiores e centralizadas no card branco
  const n = cartas.length; // geralmente 8
  const cols = Math.min(4, n); // 4 colunas para 8 cartas
  const rows = Math.ceil(n / cols);
  const whiteX = 80, whiteY = 80, whiteW = canvas.width - 160, whiteH = canvas.height - 160;
  const titlePadTop = 90;   // espaço desde o topo do card branco até o início da área das cartas (evita título)
  const bottomPad = 140;    // espaço para feedback/botões
  const innerPadX = 40;     // margem interna lateral
  const gapX = 28, gapY = 28;
  const usableW = whiteW - innerPadX * 2;
  const usableH = whiteH - titlePadTop - bottomPad;
  const w = Math.min(260, Math.floor((usableW - gapX * (cols - 1)) / cols));
  const h = Math.min(160, Math.floor((usableH - gapY * (rows - 1)) / rows));
  const totalGridW = cols * w + (cols - 1) * gapX;
  const totalGridH = rows * h + (rows - 1) * gapY;
  const startX = whiteX + (whiteW - totalGridW) / 2;
  const startY = whiteY + titlePadTop + (usableH - totalGridH) / 2;
  const pos = cartas.map((c, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return { x: Math.round(startX + col * (w + gapX)), y: Math.round(startY + row * (h + gapY)), w, h };
  });
  ps.mem = {
    cartas: cartas.map((c, i) => ({ ...c, x: pos[i].x, y: pos[i].y, w: pos[i].w, h: pos[i].h, open: false, matched: false })),
    flipped: [],
    matchedCount: 0,
    lock: false,
    firstTry: true, // Adiciona flag para controlar a primeira tentativa
    penaltyActive: false, // Ativa penalidade só depois de todas cartas terem sido vistas (Psicologia)
    totalSeen: 0 // Quantidade de cartas únicas que já foram abertas ao menos uma vez
  };
}

function drawPuzzleMemoria(ctx, ps) {
  // Título padrão (estilo Administração)
  drawTitle(ctx, ps.enunciado || 'Memória: encontre dois cartões iguais', 100, 150, 820);
  botoes = [];
  const azul = '#0053A0', dourado = '#FDB515';
  ps.mem.cartas.forEach((c) => {
    const aberto = c.open || c.matched;
    ctx.fillStyle = aberto ? '#ffffff' : azul;
    ctx.fillRect(c.x, c.y, c.w, c.h);
    ctx.strokeStyle = dourado;
    ctx.lineWidth = 3;
    ctx.strokeRect(c.x, c.y, c.w, c.h);

    if (aberto) {
      // Se for objeto com imagem (Psicologia, Engenharia, Estética, etc.)
      if (typeof c.face === 'object' && (c.face.img || c.face.imgCandidates)) {
        let drawn = false;
        if (c.face.imgCandidates && c.face.imgCandidates.length) {
          for (let src of c.face.imgCandidates) {
            const img = getImage(src);
            if (!img || !img.complete || img.naturalWidth === 0) continue;
            const ratio = Math.min((c.w - 20) / img.naturalWidth, (c.h - 20) / img.naturalHeight);
            const iw = Math.floor(img.naturalWidth * ratio);
            const ih = Math.floor(img.naturalHeight * ratio);
            const ix = c.x + Math.floor((c.w - iw) / 2);
            const iy = c.y + Math.floor((c.h - ih) / 2);
            ctx.drawImage(img, ix, iy, iw, ih);
            drawn = true;
            break;
          }
        }
        if (!drawn && c.face.img) {
          const img = getImage(c.face.img);
          if (img && img.complete && img.naturalWidth > 0) {
            const ratio = Math.min((c.w - 20) / img.naturalWidth, (c.h - 20) / img.naturalHeight);
            const iw = Math.floor(img.naturalWidth * ratio);
            const ih = Math.floor(img.naturalHeight * ratio);
            const ix = c.x + Math.floor((c.w - iw) / 2);
            const iy = c.y + Math.floor((c.h - ih) / 2);
            ctx.drawImage(img, ix, iy, iw, ih);
            drawn = true;
          }
        }
        if (!drawn) {
          // Fallback – centraliza o nome
          ctx.fillStyle = '#00315E';
          ctx.font = '20px Arial';
          const texto = c.face.nome || c.face.texto || '...';
          const metrics = ctx.measureText(texto);
          const tx = c.x + Math.floor((c.w - metrics.width) / 2);
          const ty = c.y + Math.floor(c.h / 2) + 6;
          ctx.fillText(texto, tx, ty);
        }
      } else {
        // String simples
        ctx.fillStyle = '#00315E';
        ctx.font = '20px Arial';
        wrapText(ctx, c.face, c.x + 16, c.y + 32, c.w - 32, 24);
      }
    }

    if (typeof criarHitArea === 'function') {
      criarHitArea(c.x, c.y, c.w, c.h, () => flipMemCard(ps, c.id));
    } else {
      criarBotao(ctx, c.x, c.y, c.w, c.h, '', () => flipMemCard(ps, c.id));
    }
  });

  if (ps.feedback) {
    // Posiciona a pílula acima da base inferior para não colidir com cartas
    const centerX = canvas.width / 2;
    const pillY = canvas.height - 120; // elevação para não grudar no rodapé
    drawPillFeedback(ctx, ps.feedback, centerX, pillY, {
      bg: 'rgba(255,255,255,0.95)',
      border: ps.feedbackColor || PUZZLE_THEME.outline,
      color: (ps.feedbackColor === '#008f5a') ? '#064e3b' : PUZZLE_THEME.primaryDark
    });
  }
  if (ps.mem.matchedCount === ps.mem.cartas.length) {
    // Já atingiu pontuação durante o jogo; apenas finaliza
    ps.etapa += 1;
    finalizarPuzzle();
  }
}

function flipMemCard(ps, id) {
  if (ps.modo !== 'memoria') return;
  const mem = ps.mem;
  if (mem.lock) return;
  const card = mem.cartas.find(c => c.id === id);
  if (!card || card.matched || card.open) return;
  // Marca se esta carta já foi aberta anteriormente (para controle de penalidade)
  if (!card.seenBefore) {
    card.seenBefore = true;
    if (ps.curso === 'Psicologia') {
      mem.totalSeen += 1;
      if (!mem.penaltyActive && mem.totalSeen === mem.cartas.length) {
        mem.penaltyActive = true;
        mem.justActivatedPenalty = true; // evita penalizar no mesmo par de ativação
        ps.feedback = 'Todas as cartas já foram vistas. Agora erros futuros descontam -5.';
        ps.feedbackColor = '#FDB515';
      }
    }
  }
  card.open = true;
  mem.flipped.push(card);
  if (mem.flipped.length === 2) {
    mem.lock = true;
    // Conta quantos pares já foram tentados (erros ou acertos)
    mem.paresVirados = (mem.paresVirados || 0) + 1;
    const [a, b] = mem.flipped;
    if (a.pair === b.pair) {
      a.matched = b.matched = true;
      mem.matchedCount += 2;
      ps.score = Math.min(80, ps.score + 20); // acerto +20
      ps.feedback = '+20 pontos (Par: ' + (a.face.nome || a.face) + ')';
      ps.feedbackColor = '#008f5a';
      mem.flipped = [];
      mem.lock = false;
    } else {
      // Exibe mensagem de "-5 pontos" apenas se realmente houver desconto
      const prevScore = ps.score;
      if (ps.curso === 'Psicologia') {
        if (mem.penaltyActive && !mem.justActivatedPenalty) {
          ps.score = Math.max(0, ps.score - 5);
        }
        // Após processar o primeiro par depois da ativação, limpa a flag
        if (mem.justActivatedPenalty) mem.justActivatedPenalty = false;
      } else {
        // Cursos de memória não-psicologia seguem com penalidade padrão
        ps.score = Math.max(0, ps.score - 5);
      }
      const penalizou = ps.score < prevScore;
      ps.feedback = penalizou ? '-5 pontos (Não combinam)' : 'Não combinam';
      ps.feedbackColor = '#b00020';
      setTimeout(() => {
        a.open = false; b.open = false;
        mem.flipped = [];
        mem.lock = false;
      }, 600);
    }
  }
  // Não perde ponto ao virar o primeiro cartão
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function finalizarPuzzle() {
  const ps = window.puzzleState;
  ps.ativo = false;
  ps.finalizado = true; // impede reinicialização automática antes da cena fim
  // Garante que nenhum GIF (overlay) fique visível após o término
  try { if (typeof hideMediaOverlay === 'function') hideMediaOverlay(); } catch (e) { }
  const coletaveisScore = window.globalScore || 0;
  // Score do puzzle nunca passa de 80
  const puzzleScore = Math.min(80, ps.score);
  const totalScore = Math.min(100, puzzleScore + coletaveisScore);
  try { salvarRelatorioBackend(ps.curso, puzzleScore, { scoreColetaveis: coletaveisScore, scoreTotal: totalScore, finishedAt: Date.now() }); } catch (e) { console.error(e); }
  window.puzzleState.lastScore = puzzleScore;
  changeScene('fim');
}

// ===== VALIDAÇÃO (Engenharia de Software) =====
// Jogo de Engenharia de Software: validação (se trocar o modo para 'validacao')
function prepararValidacao(ps) {
  // Enunciado padrão (estilo Administração)
  ps.enunciado = 'Marque os códigos de matrícula válidos conforme as regras (EDU, 7 chars, 5º = 5)';
  ps.valid = {
    regras: [
      'R1: começa com EDU',
      'R2: tem 7 caracteres',
      'R3: 5º caractere é 5'
    ],
    codigos: [
      { id: 1, code: 'EDU523', marcado: false },
      { id: 2, code: 'EDUA5B9', marcado: false },
      { id: 3, code: 'ED5UA42', marcado: false },
      { id: 4, code: 'EDU051A', marcado: false }
    ]
  };
}

function drawPuzzleValidacao(ctx, ps) {
  // Título padrão (estilo Administração)
  drawTitle(ctx, ps.enunciado || 'Valide os códigos conforme as regras', 100, 150, 1000);
  botoes = [];
  // Regras
  ctx.font = '16px Arial';
  ps.valid.regras.forEach((r, i) => {
    ctx.fillText(r, 100, 200 + i * 22);
  });
  // Lista de códigos com checkbox
  const startY = 280;
  ps.valid.codigos.forEach((c, i) => {
    const y = startY + i * 50;
    // checkbox
    const cbX = 100, cbY = y - 16, cbW = 24, cbH = 24;
    ctx.strokeStyle = '#0053A0';
    ctx.lineWidth = 3;
    ctx.strokeRect(cbX, cbY, cbW, cbH);
    if (c.marcado) {
      ctx.fillStyle = '#0053A0';
      ctx.fillRect(cbX + 4, cbY + 4, cbW - 8, cbH - 8);
    }
    if (typeof criarHitArea === 'function') criarHitArea(cbX, cbY, cbW, cbH, () => c.marcado = !c.marcado);
    else criarBotao(ctx, cbX, cbY, cbW, cbH, '', () => c.marcado = !c.marcado);
    // código
    ctx.fillStyle = '#00315E';
    ctx.font = '20px Arial';
    ctx.fillText(`${c.id}) ${c.code}`, cbX + 40, y);
  });
  // Validar
  criarBotao(ctx, 100, canvas.height - 140, 200, 50, 'Validar', () => {
    const isValido = (s) => s.startsWith('EDU') && s.length === 7 && s[4] === '5';
    let erros = 0;
    ps.valid.codigos.forEach(c => {
      const esperado = isValido(c.code);
      c.error = (c.marcado !== esperado);
      if (c.error) erros++;
    });
    if (erros === 0) {
      ps.feedback = 'Correto! Validação concluída.';
      ps.feedbackColor = '#008f5a';
    } else {
      ps.score = Math.max(0, ps.score - 20 * erros);
      ps.feedback = `Há ${erros} erro(s). Itens incorretos destacados em vermelho.`;
      ps.feedbackColor = '#b00020';
    }
    setTimeout(() => finalizarPuzzle(), 700);
  });
}
// Puzzles por curso com pontuação
window.puzzleState = { ativo: false, finalizado: false, curso: null, score: 0, etapa: 0, modo: null, objetos: [], alvos: [], draggingId: null, offset: { x: 0, y: 0 }, feedback: "", feedbackColor: '#00315E', anim: null, mem: null };

function iniciarPuzzle(curso) {
  const modo = selecionarModoPorCurso(curso);
  // Pontuação do puzzle agora SEM incluir moedas coletadas (evita somar duas vezes)
  // As moedas permanecem apenas em window.globalScore e serão somadas no final em finalizarPuzzle.
  const scoreInicial = 0;
  window.puzzleState = { ativo: true, finalizado: false, curso, score: scoreInicial, etapa: 0, modo, objetos: [], alvos: [], draggingId: null, offset: { x: 0, y: 0 }, feedback: '', feedbackColor: '#00315E' };
  prepararPuzzleInicial();
}

function renderPuzzle(ctx, canvas, changeScene) {
  if (!window.puzzleState.ativo && !window.puzzleState.finalizado) {
    iniciarPuzzle(window.currentCursoName || 'Curso');
  }
  desenharPuzzle(ctx, canvas, changeScene);
}

function desenharPuzzle(ctx, canvas, changeScene) {
  const ps = window.puzzleState;
  const azulEscuro = '#00315E';
  const azul = '#0053A0';
  const branco = '#ffffff';
  const dourado = '#FDB515';

  // Garante que não haja GIF sobreposto de frames anteriores; quem precisar (Ed. Física) liga de novo depois
  if (typeof hideMediaOverlay === 'function') hideMediaOverlay();

  // Fundo
  ctx.fillStyle = azulEscuro;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Card
  ctx.fillStyle = branco;
  ctx.fillRect(80, 80, canvas.width - 160, canvas.height - 160);
  // HUD
  if (typeof drawHUD === 'function') {
    const totalScore = Math.min(100, (window.globalScore || 0) + ps.score);
    drawHUD(ctx, ps.curso, totalScore);
  }

  // Título
  ctx.fillStyle = azul;
  ctx.font = '24px Arial';
  ctx.fillText('Puzzle', 100, 120);

  botoes = [];

  if (ps.modo === 'ordem') {
    drawPuzzleOrdem(ctx, ps);
  } else if (ps.modo === 'associacao') {
    drawPuzzleAssociacao(ctx, ps);
  } else if (ps.modo === 'memoria') {
    drawPuzzleMemoria(ctx, ps);
  } else if (ps.modo === 'formas') {
    drawPuzzleFormas(ctx, ps);
  } else if (ps.modo === 'validacao') {
    drawPuzzleValidacao(ctx, ps);
  } else {
    drawPuzzleQuiz(ctx, ps);
  }

  // Finalização ocorre por validação direta de cada modo
}

function prepararPuzzleInicial() {
  const ps = window.puzzleState;
  ps.etapa = 0;
  if (ps.modo === 'ordem') prepararOrdem(ps);
  else if (ps.modo === 'associacao') prepararAssociacao(ps);
  else if (ps.modo === 'formas') prepararFormas(ps);
  else if (ps.modo === 'memoria') prepararMemoria(ps);
  else if (ps.modo === 'validacao') prepararValidacao(ps);
  else prepararQuiz(ps);
}

function selecionarModoPorCurso(curso) {
  return COURSE_MODE[curso] || 'quiz';
}

// ===== BANCO DE PERGUNTAS POR CURSO (usado no quiz) =====
function obterPerguntasPorCurso(curso) {
  const mapas = {
    'Administração': [
      {
        pergunta: 'O que é fluxo de caixa?',
        opcoes: [
          'Entrada e saída de dinheiro',
          'Plano de marketing',
          'Inventário de produtos',
          'Controle de funcionários'
        ],
        correta: 0
      },
      {
        pergunta: 'Meta SMART significa?',
        opcoes: [
          'Simples, Moderna, Ágil, Rápida, Tecnológica',
          'Específica, Mensurável, Atingível, Relevante, Temporal',
          'Segura, Modular, Acurada, Robusta, Testável',
          'Sustentável, Motivadora, Adaptável, Realista, Tangível'
        ],
        correta: 1
      },
      {
        pergunta: 'Qual área é ligada a pessoas?',
        opcoes: [
          'Recursos Humanos',
          'Fiscal',
          'TI',
          'Logística'
        ],
        correta: 0
      },
      {
        pergunta: 'O que é empreendedorismo?',
        opcoes: [
          'Abrir um negócio próprio',
          'Investir na bolsa de valores',
          'Comprar produtos importados',
          'Gerenciar uma equipe de vendas'
        ],
        correta: 0
      }
    ],
    'Direito': [
      {
        pergunta: 'Roubar é crime segundo a lei?',
        opcoes: [
          'Sim',
          'Não',
          'Depende do valor',
          'Só se for reincidente'
        ],
        correta: 0
      },
      {
        pergunta: 'Processo civil trata de conflitos entre:',
        opcoes: [
          'Particulares',
          'Empresas públicas',
          'Estados',
          'Polícia e réu'
        ],
        correta: 0
      },
      {
        pergunta: 'Habeas corpus protege:',
        opcoes: [
          'Propriedade privada',
          'Liberdade de locomoção',
          'Direito de voto',
          'Sigilo bancário'
        ],
        correta: 1
      },
      {
        pergunta: 'O que é Constituição?',
        opcoes: [
          'Lei de Trânsito',
          'Contrato entre empresas',
          'Regulamento escolar',
          'Lei máxima do país'
        ],
        correta: 3
      }
    ],
    'Publicidade': [
      {
        pergunta: 'Qual slogan é mais chamativo para um energético?',
        opcoes: [
          'Acorde sua energia',
          'Beba líquido vermelho',
          'É uma bebida',
          'Compre já'
        ],
        correta: 0
      },
      {
        pergunta: 'Briefing é:',
        opcoes: [
          'Logo da empresa',
          'Storyboard',
          'Documento de requisitos',
          'Plano de mídia'
        ],
        correta: 2
      },
      {
        pergunta: 'KPI mede:',
        opcoes: [
          'Desempenho',
          'Orçamento',
          'Fornecedor',
          'Tempo de campanha'
        ],
        correta: 0
      },
      {
        pergunta: 'O que é público-alvo?',
        opcoes: [
          'Equipe de vendas',
          'Grupo de pessoas que se deseja atingir',
          'Concorrentes',
          'Parceiros comerciais'
        ],
        correta: 1
      }
    ],
    'Ciências Contábeis': [
      {
        pergunta: 'Se você tem R$1000 e gasta R$250, quanto sobra?',
        opcoes: [
          'R$750',
          'R$800',
          'R$650',
          'R$1000'
        ],
        correta: 0
      },
      {
        pergunta: 'Ativo é:',
        opcoes: [
          'Obrigação',
          'Bem ou direito',
          'Despesa',
          'Receita'
        ],
        correta: 1
      },
      {
        pergunta: 'DRE apresenta:',
        opcoes: [
          'Resultado do período',
          'Balanço patrimonial',
          'Fluxo de caixa',
          'Inventário'
        ],
        correta: 0
      },
      {
        pergunta: 'Quando a empresa paga a conta de energia, isso é um(a):',
        opcoes: [
          'Receita',
          'Despesa',
          'Ativo',
          'Investimento'
        ],
        correta: 1
      }
    ],
    'Biomedicina': [
      {
        pergunta: 'Qual organela produz energia na célula?',
        opcoes: [
          'Ribossomo',
          'Complexo de Golgi',
          'Mitocôndria',
          'Lisossomo'
        ],
        correta: 2
      },
      {
        pergunta: 'Hemograma avalia:',
        opcoes: [
          'Sangue',
          'Rim',
          'Cérebro',
          'Pulmão'
        ],
        correta: 0
      },
      {
        pergunta: 'Qual é a unidade fundamental da vida?',
        opcoes: [
          'Glicose',
          'Célula',
          'Potássio',
          'Tecido'
        ],
        correta: 1
      },
      {
        pergunta: 'O que é vacina?',
        opcoes: [
          'Proteção contra doenças',
          'Remédio para dor',
          'Exame de sangue',
          'Tipo de bactéria'
        ],
        correta: 0
      }
    ],
    'Educação Física': [
      {
        pergunta: 'Qual exercício é aeróbico?',
        opcoes: [
          'Corrida',
          'Flexão de braço',
          'Supino reto',
          'Agachamento'
        ],
        correta: 0
      },
      {
        pergunta: 'Qual sistema leva oxigênio aos músculos?',
        opcoes: [
          'Digestivo',
          'Nervoso',
          'Respiratório',
          'Urinário'
        ],
        correta: 2
      },
      {
        pergunta: 'Treino HIIT é:',
        opcoes: [
          'Alta intensidade',
          'Baixa intensidade',
          'Alongamento',
          'Yoga'
        ],
        correta: 0
      },
      {
        pergunta: 'O que é aquecimento?',
        opcoes: [
          'Exercício de força',
          'Treino de velocidade',
          'Preparação para atividade física',
          'Descanso pós-treino'
        ],
        correta: 2
      }
    ],
    'Fisioterapia': [
      {
        pergunta: 'O que a fisioterapia ajuda a melhorar no dia a dia?',
        opcoes: [
          'Movimento e alívio da dor',
          'Som de TV',
          'Receitas de cozinha',
          'Velocidade do Wi‑Fi'
        ],
        correta: 0
      },
      {
        pergunta: 'Se você está com dor nas costas por muito tempo, o que é uma boa atitude?',
        opcoes: [
          'Ignorar para ver se passa',
          'Ficar parado sempre',
          'Procurar um profissional e fazer exercícios orientados',
          'Carregar peso sem cuidado'
        ],
        correta: 2
      },
      {
        pergunta: 'Qual hábito simples ajuda na postura ao usar o computador?',
        opcoes: [
          'Curvar as costas para frente',
          'Ajustar a altura da cadeira e apoiar os pés',
          'Deitar no sofá com o notebook no colo por horas',
          'Olhar para baixo o tempo todo'
        ],
        correta: 1
      },
      {
        pergunta: 'Após uma torção leve no tornozelo, qual cuidado inicial é mais indicado?',
        opcoes: [
          'Descanso e gelo nos primeiros dias',
          'Massagem forte imediatamente',
          'Correr para “esquentar”',
          'Ignorar e continuar atividades intensas'
        ],
        correta: 0
      }
    ],
    'Enfermagem': [
      {
        pergunta: 'Qual primeiro passo em um corte?',
        opcoes: [
          'Ignorar o ferimento',
          'Cobrir sem limpar',
          'Higienizar/limpar o ferimento',
          'Colocar curativo sem lavar'
        ],
        correta: 2
      },
      {
        pergunta: 'Sinais vitais incluem:',
        opcoes: [
          'Pressão, pulso, respiração e temperatura',
          'Massa corporal',
          'Colesterol e gordura',
          'Peso, altura'
        ],
        correta: 0
      },
      {
        pergunta: 'Antissepsia é:',
        opcoes: [
          'Reduzir microrganismos',
          'Aumentar flora',
          'Tintura',
          'Aplicar curativo'
        ],
        correta: 0
      },
      {
        pergunta: 'O que é enfermagem?',
        opcoes: [
          'Administração de empresas',
          'Cuidado com a saúde',
          'Construção civil',
          'Educação física'
        ],
        correta: 1
      }
    ],
    'Radiologia': [
      {
        pergunta: 'Qual parte do corpo aparece nesta radiografia?',
        opcoes: [
          'Pé',
          'Tórax',
          'Mão',
          'Coluna'
        ],
        correta: 2
      },
      {
        pergunta: 'Raio-X usa:',
        opcoes: [
          'Radiação ionizante',
          'Luz visível',
          'Ultrassom',
          'Micro-ondas'
        ],
        correta: 0
      },
      {
        pergunta: 'Tomografia é:',
        opcoes: [
          'Eco',
          'Endoscopia',
          'Cortes seccionais',
          'Raio laser'
        ],
        correta: 2
      },
      {
        pergunta: 'O que é contraste?',
        opcoes: [
          'Substância para destacar estruturas',
          'Tipo de exame de sangue',
          'Medicamento para dor',
          'Equipamento de imagem'
        ],
        correta: 0
      }
    ],
    'Nutrição': [
      {
        pergunta: 'Qual grupo alimentar é principal fonte de energia rápida?',
        opcoes: [
          'Proteínas',
          'Vitaminas',
          'Carboidratos',
          'Fibras'
        ],
        correta: 2
      },
      {
        pergunta: 'Proteínas são importantes para:',
        opcoes: [
          'Construção e reparo de tecidos',
          'Principal fonte de energia imediata',
          'Hidratação celular direta',
          'Transporte de oxigênio no ar'
        ],
        correta: 0
      },
      {
        pergunta: 'Vitaminas e minerais atuam como:',
        opcoes: [
          'Geradores diretos de gordura',
          'Principais componentes dos ossos',
          'Substitutos de proteínas',
          'Reguladores do metabolismo'
        ],
        correta: 3
      },
      {
        pergunta: 'Fibras alimentares auxiliam principalmente na:',
        opcoes: [
          'Saúde intestinal',
          'Produção de hormônios',
          'Contração muscular rápida',
          'Transmissão nervosa elétrica'
        ],
        correta: 0
      }
    ],
    'Engenharia de Software': [
      {
        pergunta: 'O que um programa de computador faz?',
        opcoes: [
          'Executa tarefas automaticamente',
          'Desenha imagens na parede',
          'Faz comida',
          'Constrói prédios'
        ],
        correta: 0
      },
      {
        pergunta: 'Para que serve o mouse e o teclado?',
        opcoes: [
          'Para interagir com o computador',
          'Para decorar a mesa',
          'Para guardar arquivos',
          'Para imprimir documentos'
        ],
        correta: 0
      },
      {
        pergunta: 'O que é um arquivo digital?',
        opcoes: [
          'Um documento guardado no computador',
          'Uma folha de papel',
          'Uma caixa de ferramentas',
          'Um livro físico'
        ],
        correta: 0
      },
      {
        pergunta: 'Qual destas opções é um exemplo de programa?',
        opcoes: [
          'Calculadora do Windows',
          'Caneta',
          'Caderno',
          'Mesa'
        ],
        correta: 0
      }
    ],
    'Design de Interiores': [
      {
        pergunta: 'Qual cor ajuda o ambiente a parecer maior e mais iluminado?',
        opcoes: [
          'Cores claras',
          'Cores muito escuras',
          'Somente vermelho',
          'Apenas preto'
        ],
        correta: 0
      },
      {
        pergunta: 'Para um cantinho de leitura confortável, o que mais ajuda?',
        opcoes: [
          'Som alto e luz forte',
          'Luz suave, poltrona e apoio para os pés',
          'Cadeira dura e sem iluminação',
          'Piso escorregadio'
        ],
        correta: 1
      },
      {
        pergunta: 'Qual item simples traz sensação de vida e bem-estar ao ambiente?',
        opcoes: [
          'Lâmpada que pisca',
          'Paredes vazias e sem cor',
          'Janelas sempre fechadas',
          'Plantas naturais ou artificiais'
        ],
        correta: 3
      },
      {
        pergunta: 'Em espaços pequenos, qual móvel é mais versátil?',
        opcoes: [
          'Móvel multifuncional (ex.: sofá-cama, mesa dobrável)',
          'Armário gigante que ocupa a parede toda',
          'Mesa que não cabe na sala',
          'Cama sem espaço para circulação'
        ],
        correta: 0
      }
    ],
    'Estética e Cosmética': [
      {
        pergunta: 'Pele oleosa: qual produto é mais adequado?',
        opcoes: [
          'Hidratante oil free',
          'Óleo mineral',
          'Manteiga corporal',
          'Sabonete comum'
        ],
        correta: 0
      },
      {
        pergunta: 'FPS se refere a:',
        opcoes: [
          'Proteção solar',
          'Quadros por segundo',
          'Frequência cardíaca',
          'Peso corporal'
        ],
        correta: 0
      },
      {
        pergunta: 'Esfoliação remove:',
        opcoes: [
          'Células mortas',
          'Massa muscular',
          'Tártaro',
          'Gordura corporal'
        ],
        correta: 0
      },
      {
        pergunta: 'O que é cosmético?',
        opcoes: [
          'Produto para cuidados pessoais',
          'Remédio para dor',
          'Alimento funcional',
          'Equipamento médico'
        ],
        correta: 0
      }
    ]
  };
  return mapas[curso] || [];
}

