// ===== MAPEAMENTO DE MODOS POR CURSO =====
// Humanas: Administração (ordem), Direito (quiz), Psicologia (memória), Publicidade (quiz)
// Exatas: Arquitetura e Urbanismo (formas), Ciências Contábeis (quiz), Design de Interiores (associação), Engenharia de Software (memória)
// Biológicas: Estética e Cosmética (memória), Biomedicina (quiz), Educação Física (quiz), Enfermagem (quiz), Fisioterapia (associacao), Nutrição (associacao), Radiologia (quiz)
const COURSE_MODE = {
  'Administração': 'ordem',                // Jogo de Administração: ordem
  'Direito': 'quiz',                       // Jogo de Direito: quiz
  'Psicologia': 'memoria',                 // Jogo de Psicologia: memória
  'Publicidade': 'quiz',                   // Jogo de Publicidade: quiz
  'Arquitetura e Urbanismo': 'formas',     // Jogo de Arquitetura e Urbanismo: formas
  'Ciências Contábeis': 'quiz',            // Jogo de Ciências Contábeis: quiz
  'Design de Interiores': 'associacao',    // Jogo de Design de Interiores: associação
  'Engenharia de Software': 'memoria',     // Jogo de Engenharia de Software: memória
  'Estética e Cosmética': 'memoria',       // Jogo de Estética e Cosmética: memória
  'Biomedicina': 'quiz',                   // Jogo de Biomedicina: quiz
  'Educação Física': 'quiz',               // Jogo de Educação Física: quiz
  'Enfermagem': 'quiz',                    // Jogo de Enfermagem: quiz
  'Fisioterapia': 'associacao',            // Jogo de Fisioterapia: associação
  'Nutrição': 'associacao',                // Jogo de Nutrição: associação
  'Radiologia': 'quiz'                     // Jogo de Radiologia: quiz
};

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
      w: 180,
      h: 60,
      ...s
    }));
    ps.alvos = [0, 1, 2].map((ord, i) => ({
      id: 'slot' + i,
      tipo: 'slot',
      x: 380 + i * 200,
      y: 180,
      w: 180,
      h: 60,
      ordem: ord
    }));
    ps.enunciado = enunciado; // Salva o enunciado para usar no desenho
  }
}

function drawPuzzleOrdem(ctx, ps) {
  ctx.fillStyle = '#00315E';
  ctx.font = '20px Arial';
  ctx.fillText(ps.enunciado || 'Organize as etapas na ordem correta', 100, 160);

  // desenha slots
  ps.alvos.forEach(a => {
    ctx.strokeStyle = '#0053A0';
    ctx.lineWidth = 3;
    ctx.strokeRect(a.x, a.y, a.w, a.h);
  });
  // desenha cartões
  ps.objetos.forEach(o => {
    ctx.fillStyle = o.cor;
    ctx.fillRect(o.x, o.y, o.w, o.h);
    // Se tiver imagem, desenha; senão, mostra texto
    if (o.img) {
      const img = new Image();
      img.src = o.img;
      img.onload = () => {
        ctx.drawImage(img, o.x + 8, o.y + 8, o.w - 16, o.h - 32);
        ctx.fillStyle = '#00315E';
        ctx.font = '14px Arial';
        ctx.fillText(o.texto, o.x + 8, o.y + o.h - 10);
      };
      if (img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, o.x + 8, o.y + 8, o.w - 16, o.h - 32);
        ctx.fillStyle = '#00315E';
        ctx.font = '14px Arial';
        ctx.fillText(o.texto, o.x + 8, o.y + o.h - 10);
      } else {
        ctx.fillStyle = '#00315E';
        ctx.font = '16px Arial';
        ctx.fillText(o.texto, o.x + 12, o.y + 36);
      }
    } else {
      ctx.fillStyle = '#00315E';
      ctx.font = '16px Arial';
      ctx.fillText(o.texto, o.x + 12, o.y + 36);
    }
  });
  // feedback
  if (ps.feedback) {
    ctx.fillStyle = ps.feedbackColor || '#00315E';
    ctx.font = '18px Arial';
    wrapText(ctx, ps.feedback, 100, canvas.height - 200, canvas.width - 200, 24);
  }
  // botão validar
  criarBotao(ctx, 100, canvas.height - 140, 200, 50, 'Validar', () => {
    let corretos = 0;
    let erros = 0;
    ps.objetos.forEach(o => {
      const slot = ps.alvos.find(a => intersect(o, a));
      if (slot && slot.ordem === o.ordem) {
        corretos += 1;
      } else {
        erros += 1;
      }
    });

    if (corretos === ps.objetos.length) {
      ps.score += 20; // máximo por questão
      ps.feedback = 'Boa! Ordem correta.';
      ps.feedbackColor = '#008f5a';
    } else {
      ps.score = Math.max(0, ps.score - 5 * erros);
      ps.feedback = 'Tente ajustar os cartões.';
      ps.feedbackColor = '#b00020';
    }

    if (corretos === ps.objetos.length) {
      // Avança para próxima questão ou finaliza se for a última
      ps.etapa = (ps.etapa || 0) + 1;
      const totalQuestoes = 4;
      if (ps.etapa >= totalQuestoes) {
        setTimeout(() => finalizarPuzzle(), 700);
      } else {
        setTimeout(() => {
          prepararOrdem(ps);
          ps.feedback = '';
        }, 700);
      }
    }
  });
}

// ===== ASSOCIAÇÃO (Design de Interiores, Nutrição, Psicologia, Fisioterapia) =====
// Jogo de Design de Interiores: associação
// Jogo de Nutrição: associação
// Jogo de Psicologia: associação (se trocar o modo para 'associacao')
// Jogo de Fisioterapia: associação
function prepararAssociacao(ps) {
  const banco = {
    'Nutrição': [
      {
        itens: [
          { texto: 'Fruta', alvo: 'Vitaminas/Fibras', cor: '#e8ffe1', role: 'fruta', img: 'assets/nutricao/fruta.png' },
          { texto: 'Legume', alvo: 'Micronutrientes', cor: '#cfe8ff', role: 'legume', img: 'assets/nutricao/legume.png' },
          { texto: 'Proteína magra', alvo: 'Recupera/Sacia', cor: '#fff2cc', role: 'proteina', img: 'assets/nutricao/proteina.png' },
          { texto: 'Carboidrato', alvo: 'Energia', cor: '#ffe0e0', role: 'carbo', img: 'assets/nutricao/carbo.png' }
        ]
      },
      {
        itens: [
          { texto: 'Água', alvo: 'Hidratação', cor: '#cfe8ff', role: 'agua', img: 'assets/nutricao/agua.png' },
          { texto: 'Ferro', alvo: 'Transporte de oxigênio', cor: '#fff2cc', role: 'ferro', img: 'assets/nutricao/ferro.png' },
          { texto: 'Cálcio', alvo: 'Fortalece ossos', cor: '#e8ffe1', role: 'calcio', img: 'assets/nutricao/calcio.png' },
          { texto: 'Vitamina C', alvo: 'Imunidade', cor: '#ffe0e0', role: 'vitaminaC', img: 'assets/nutricao/vitaminaC.png' }
        ]
      },
      {
        itens: [
          { texto: 'Óleo vegetal', alvo: 'Gordura saudável', cor: '#fff2cc', role: 'oleo', img: 'assets/nutricao/oleo.png' },
          { texto: 'Aveia', alvo: 'Fibras', cor: '#e8ffe1', role: 'aveia', img: 'assets/nutricao/aveia.png' },
          { texto: 'Peixe', alvo: 'Ômega 3', cor: '#cfe8ff', role: 'peixe', img: 'assets/nutricao/peixe.png' },
          { texto: 'Iogurte', alvo: 'Probióticos', cor: '#ffe0e0', role: 'iogurte', img: 'assets/nutricao/iogurte.png' }
        ]
      },
      {
        itens: [
          { texto: 'Banana', alvo: 'Potássio', cor: '#e8ffe1', role: 'banana', img: 'assets/nutricao/banana.png' },
          { texto: 'Tomate', alvo: 'Licopeno', cor: '#cfe8ff', role: 'tomate', img: 'assets/nutricao/tomate.png' },
          { texto: 'Ovo', alvo: 'Proteína completa', cor: '#fff2cc', role: 'ovo', img: 'assets/nutricao/ovo.png' },
          { texto: 'Nozes', alvo: 'Gordura boa', cor: '#ffe0e0', role: 'nozes', img: 'assets/nutricao/nozes.png' }
        ]
      }
    ],
    'Design de Interiores': [
      {
        itens: [
          { texto: 'Parede azul', alvo: 'Móvel branco', cor: '#cfe8ff', role: 'azul', img: 'assets/design/azul.png' },
          { texto: 'Parede bege', alvo: 'Madeira clara', cor: '#fff2cc', role: 'bege', img: 'assets/design/bege.png' },
          { texto: 'Parede cinza', alvo: 'Metal/vidro', cor: '#e0e0e0', role: 'cinza', img: 'assets/design/cinza.png' },
          { texto: 'Parede branca', alvo: 'Planta verde', cor: '#e8ffe1', role: 'branca', img: 'assets/design/branca.png' }
        ]
      },
      {
        itens: [
          { texto: 'Tapete', alvo: 'Conforto térmico', cor: '#ffe0e0', role: 'tapete', img: 'assets/design/tapete.png' },
          { texto: 'Cortina', alvo: 'Controle de luz', cor: '#cfe8ff', role: 'cortina', img: 'assets/design/cortina.png' },
          { texto: 'Quadro', alvo: 'Decoração', cor: '#fff2cc', role: 'quadro', img: 'assets/design/quadro.png' },
          { texto: 'Sofá', alvo: 'Descanso', cor: '#e8ffe1', role: 'sofa', img: 'assets/design/sofa.png' }
        ]
      },
      {
        itens: [
          { texto: 'Luminária', alvo: 'Iluminação', cor: '#cfe8ff', role: 'luminaria', img: 'assets/design/luminaria.png' },
          { texto: 'Mesa', alvo: 'Refeição', cor: '#fff2cc', role: 'mesa', img: 'assets/design/mesa.png' },
          { texto: 'Poltrona', alvo: 'Conforto', cor: '#e8ffe1', role: 'poltrona', img: 'assets/design/poltrona.png' },
          { texto: 'Estante', alvo: 'Organização', cor: '#ffe0e0', role: 'estante', img: 'assets/design/estante.png' }
        ]
      },
      {
        itens: [
          { texto: 'Espelho', alvo: 'Amplitude', cor: '#cfe8ff', role: 'espelho', img: 'assets/design/espelho.png' },
          { texto: 'Planta', alvo: 'Natureza', cor: '#fff2cc', role: 'planta', img: 'assets/design/planta.png' },
          { texto: 'Puff', alvo: 'Assento extra', cor: '#e8ffe1', role: 'puff', img: 'assets/design/puff.png' },
          { texto: 'Cadeira', alvo: 'Sentar', cor: '#ffe0e0', role: 'cadeira', img: 'assets/design/cadeira.png' }
        ]
      }
    ],
    'Fisioterapia': [
      {
        itens: [
          { texto: 'Joelho', alvo: 'Alongamento', cor: '#e8ffe1', role: 'joelho', img: 'assets/fisioterapia/joelho.png' },
          { texto: 'Ombro', alvo: 'Rotação externa', cor: '#cfe8ff', role: 'ombro', img: 'assets/fisioterapia/ombro.png' },
          { texto: 'Coluna', alvo: 'Prancha', cor: '#ffe0e0', role: 'coluna', img: 'assets/fisioterapia/coluna.png' },
          { texto: 'Tornozelo', alvo: 'Fortalecimento', cor: '#fff2cc', role: 'tornozelo', img: 'assets/fisioterapia/tornozelo.png' }
        ]
      },
      {
        itens: [
          { texto: 'Quadril', alvo: 'Mobilidade', cor: '#cfe8ff', role: 'quadril', img: 'assets/fisioterapia/quadril.png' },
          { texto: 'Cotovelo', alvo: 'Flexão', cor: '#fff2cc', role: 'cotovelo', img: 'assets/fisioterapia/cotovelo.png' },
          { texto: 'Punho', alvo: 'Extensão', cor: '#e8ffe1', role: 'punho', img: 'assets/fisioterapia/punho.png' },
          { texto: 'Pescoço', alvo: 'Rotação', cor: '#ffe0e0', role: 'pescoco', img: 'assets/fisioterapia/pescoco.png' }
        ]
      },
      {
        itens: [
          { texto: 'Pé', alvo: 'Equilíbrio', cor: '#cfe8ff', role: 'pe', img: 'assets/fisioterapia/pe.png' },
          { texto: 'Mão', alvo: 'Preensão', cor: '#fff2cc', role: 'mao', img: 'assets/fisioterapia/mao.png' },
          { texto: 'Braço', alvo: 'Força', cor: '#e8ffe1', role: 'braco', img: 'assets/fisioterapia/braco.png' },
          { texto: 'Costas', alvo: 'Postura', cor: '#ffe0e0', role: 'costas', img: 'assets/fisioterapia/costas.png' }
        ]
      },
      {
        itens: [
          { texto: 'Coxa', alvo: 'Agachamento', cor: '#cfe8ff', role: 'coxa', img: 'assets/fisioterapia/coxa.png' },
          { texto: 'Panturrilha', alvo: 'Impulsão', cor: '#fff2cc', role: 'panturrilha', img: 'assets/fisioterapia/panturrilha.png' },
          { texto: 'Abdômen', alvo: 'Respiração', cor: '#e8ffe1', role: 'abdomen', img: 'assets/fisioterapia/abdomen.png' },
          { texto: 'Antebraço', alvo: 'Supinação', cor: '#ffe0e0', role: 'antebraco', img: 'assets/fisioterapia/antebraco.png' }
        ]
      }
    ],
    'Administração': [
      {
        itens: [
          { texto: 'Fluxo de caixa', alvo: 'Controle financeiro', cor: '#e8ffe1', role: 'fluxo', img: 'assets/administracao/fluxo.png' },
          { texto: 'Marketing', alvo: 'Promoção de vendas', cor: '#cfe8ff', role: 'marketing', img: 'assets/administracao/marketing.png' },
          { texto: 'Recursos Humanos', alvo: 'Gestão de pessoas', cor: '#fff2cc', role: 'rh', img: 'assets/administracao/rh.png' },
          { texto: 'Logística', alvo: 'Distribuição de produtos', cor: '#ffe0e0', role: 'logistica', img: 'assets/administracao/logistica.png' }
        ]
      },
      {
        itens: [
          { texto: 'Planejamento', alvo: 'Definir metas', cor: '#cfe8ff', role: 'planejamento', img: 'assets/administracao/planejamento.png' },
          { texto: 'Organização', alvo: 'Estruturar processos', cor: '#fff2cc', role: 'organizacao', img: 'assets/administracao/organizacao.png' },
          { texto: 'Direção', alvo: 'Liderar equipes', cor: '#e8ffe1', role: 'direcao', img: 'assets/administracao/direcao.png' },
          { texto: 'Controle', alvo: 'Avaliar resultados', cor: '#ffe0e0', role: 'controle', img: 'assets/administracao/controle.png' }
        ]
      },
      {
        itens: [
          { texto: 'Cliente', alvo: 'Consumidor final', cor: '#e8ffe1', role: 'cliente', img: 'assets/administracao/cliente.png' },
          { texto: 'Fornecedor', alvo: 'Entrega insumos', cor: '#cfe8ff', role: 'fornecedor', img: 'assets/administracao/fornecedor.png' },
          { texto: 'Concorrente', alvo: 'Disputa mercado', cor: '#fff2cc', role: 'concorrente', img: 'assets/administracao/concorrente.png' },
          { texto: 'Parceiro', alvo: 'Colabora em negócios', cor: '#ffe0e0', role: 'parceiro', img: 'assets/administracao/parceiro.png' }
        ]
      },
      {
        itens: [
          { texto: 'Nota fiscal', alvo: 'Documento de venda', cor: '#cfe8ff', role: 'nf', img: 'assets/administracao/nf.png' },
          { texto: 'Estoque', alvo: 'Armazenar produtos', cor: '#fff2cc', role: 'estoque', img: 'assets/administracao/estoque.png' },
          { texto: 'Investimento', alvo: 'Aplicar recursos', cor: '#e8ffe1', role: 'investimento', img: 'assets/administracao/investimento.png' },
          { texto: 'Lucro', alvo: 'Resultado positivo', cor: '#ffe0e0', role: 'lucro', img: 'assets/administracao/lucro.png' }
        ]
      }
    ]
  };
  // Seleciona a questão atual
  const questoes = banco[ps.curso] || [];
  const etapa = ps.etapa || 0;
  const q = questoes[etapa] || questoes[0];
  if (!q) return;

  // Embaralha os itens e alvos
  const itens = [...q.itens];
  const alvos = [...q.itens];
  shuffleArray(itens);
  shuffleArray(alvos);

  // Horizontal: distribui em linha
  const baseY = 200; // <-- AJUSTADO para subir os quadrados
  const gapX = 180, w = 120, h = 120;
  const itemY = baseY;
  const alvoY = baseY + h + 40;

  ps.objetos = itens.map((p, i) => ({
    id: 'item' + i,
    tipo: 'item',
    role: p.role,
    x: 120 + i * gapX,
    y: itemY,
    w,
    h,
    texto: p.texto,
    alvo: p.alvo,
    cor: p.cor,
    img: p.img
  }));
  ps.alvos = alvos.map((p, i) => ({
    id: 'alvo' + i,
    tipo: 'alvo',
    role: p.role,
    x: 120 + i * gapX,
    y: alvoY,
    w,
    h,
    etiqueta: p.alvo
  }));
}

function drawPuzzleAssociacao(ctx, ps) {
  ctx.fillStyle = '#00315E';
  ctx.font = '20px Arial';
  ctx.fillText('Arraste cada alimento até o seu benefício', 100, 160);

  // alvos
  ps.alvos.forEach(a => {
    ctx.strokeStyle = '#0053A0';
    ctx.lineWidth = 3;
    ctx.strokeRect(a.x, a.y, a.w, a.h);
    ctx.fillStyle = '#0053A0';
    ctx.font = '16px Arial';
    ctx.fillText(a.etiqueta, a.x + 6, a.y + a.h - 10);
  });

  // itens
  ps.objetos.forEach(o => {
    ctx.fillStyle = o.cor;
    ctx.fillRect(o.x, o.y, o.w, o.h);
    if (o.error) {
      ctx.strokeStyle = '#b00020';
      ctx.lineWidth = 4;
      ctx.strokeRect(o.x, o.y, o.w, o.h);
      ctx.lineWidth = 3;
    }
    // Se tiver imagem, desenha; senão, mostra texto
    if (o.img) {
      const img = new Image();
      img.src = o.img;
      img.onload = () => {
        ctx.drawImage(img, o.x + 10, o.y + 10, o.w - 20, o.h - 40);
        ctx.fillStyle = '#00315E';
        ctx.font = '16px Arial';
        ctx.fillText(o.texto, o.x + 12, o.y + o.h - 10);
      };
      if (img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, o.x + 10, o.y + 10, o.w - 20, o.h - 40);
        ctx.fillStyle = '#00315E';
        ctx.font = '16px Arial';
        ctx.fillText(o.texto, o.x + 12, o.y + o.h - 10);
      } else {
        ctx.fillStyle = '#00315E';
        ctx.font = '18px Arial';
        ctx.fillText(o.texto, o.x + 12, o.y + o.h / 2);
      }
    } else {
      ctx.fillStyle = '#00315E';
      ctx.font = '18px Arial';
      ctx.fillText(o.texto, o.x + 12, o.y + o.h / 2);
    }
  });

  criarBotao(ctx, 100, canvas.height - 140, 200, 50, 'Validar', () => {
    let corretos = 0;
    ps.objetos.forEach(o => {
      const alvo = ps.alvos.find(a => a.role === o.role && intersect(o, a));
      if (alvo) corretos += 1;
    });
    // marcar erros
    ps.objetos.forEach(o => {
      const alvo = ps.alvos.find(a => a.role === o.role && intersect(o, a));
      o.error = !alvo;
    });
    if (corretos === ps.objetos.length) {
      ps.score += 20;
      ps.feedback = 'Perfeito! Associação correta.';
      ps.feedbackColor = '#008f5a';
      setTimeout(() => {
        ps.etapa = (ps.etapa || 0) + 1;
        if (ps.etapa >= 4) {
          finalizarPuzzle();
        } else {
          prepararAssociacao(ps);
          ps.feedback = '';
        }
      }, 700);
    } else {
      const erros = ps.objetos.length - corretos;
      ps.score = Math.max(0, ps.score - 5 * erros); // <-- agora tira só 5 pontos por erro!
      ps.feedback = 'Ainda não está certo. Ajuste os alimentos nos benefícios corretos.';
      ps.feedbackColor = '#b00020';
      setTimeout(() => {
        ps.feedback = '';
      }, 700);
    }
  });
}

// ===== FORMAS (Arquitetura e Urbanismo) =====
// Jogo de Arquitetura e Urbanismo: formas
function prepararFormas(ps) {
  // Slots retangulares correspondentes às peças
  const alvoBase = { id: 'slotBase', tipo: 'slotForma', role: 'base', x: 520, y: 360, w: 220, h: 40 };
  const alvoLadoE = { id: 'slotLadoE', tipo: 'slotForma', role: 'ladoE', x: 520, y: 280, w: 100, h: 40 };
  const alvoLadoD = { id: 'slotLadoD', tipo: 'slotForma', role: 'ladoD', x: 640, y: 280, w: 100, h: 40 };
  ps.alvos = [alvoBase, alvoLadoE, alvoLadoD];

  // Peças com papeis definidos
  ps.objetos = [
    { id: 'pBase', tipo: 'formaPiece', role: 'base', x: 120, y: 220, w: 220, h: 40, cor: '#cfe8ff', label: 'Base' },
    { id: 'pLadoE', tipo: 'formaPiece', role: 'ladoE', x: 120, y: 300, w: 100, h: 40, cor: '#ffe0e0', label: 'Lado E' },
    { id: 'pLadoD', tipo: 'formaPiece', role: 'ladoD', x: 120, y: 380, w: 100, h: 40, cor: '#e8ffe1', label: 'Lado D' }
  ];
}

function drawPuzzleFormas(ctx, ps) {
  ctx.fillStyle = '#00315E';
  ctx.font = '20px Arial';
  ctx.fillText('Arraste as peças para os slots corretos e forme o triângulo', 100, 160);
  // Desenha uma sugestão de triângulo (base + lados) como gui
  ctx.strokeStyle = '#0053A0';
  ctx.lineWidth = 3;
  // slots
  ps.alvos.forEach(a => {
    ctx.strokeRect(a.x, a.y, a.w, a.h);
    ctx.font = '14px Arial';
    ctx.fillStyle = '#0053A0';
    ctx.fillText(a.role === 'base' ? 'Base' : (a.role === 'ladoE' ? 'Lado E' : 'Lado D'), a.x + 6, a.y - 6);
  });
  // peças
  ps.objetos.forEach(o => {
    ctx.fillStyle = o.cor;
    ctx.fillRect(o.x, o.y, o.w, o.h);
    ctx.strokeStyle = '#0053A0';
    ctx.strokeRect(o.x, o.y, o.w, o.h);
    if (o.error) { ctx.strokeStyle = '#b00020'; ctx.lineWidth = 4; ctx.strokeRect(o.x, o.y, o.w, o.h); ctx.lineWidth = 3; }
    ctx.fillStyle = '#00315E';
    ctx.font = '16px Arial';
    ctx.fillText(o.label, o.x + 8, o.y + 26);
  });
  criarBotao(ctx, 100, canvas.height - 140, 200, 50, 'Validar', () => {
    let corretas = 0;
    ps.objetos.forEach(o => {
      const slot = ps.alvos.find(a => a.role === o.role);
      if (slot && intersect(o, slot)) corretas += 1;
    });
    // marcar erros
    ps.objetos.forEach(o => { const slot = ps.alvos.find(a => a.role === o.role); o.error = !(slot && intersect(o, slot)); });
    if (corretas === ps.objetos.length) {
      ps.feedback = 'Perfeito! Triângulo montado.';
      ps.feedbackColor = '#008f5a';
      setTimeout(() => finalizarPuzzle(), 500);
    } else {
      const erros = ps.objetos.length - corretas;
      ps.score = Math.max(0, ps.score - 20 * erros);
      ps.feedback = 'Ainda não está certo. Ajuste as peças nos slots certos.';
      ps.feedbackColor = '#b00020';
      setTimeout(() => finalizarPuzzle(), 700);
    }
  });
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
  // nada a preparar por etapa, usamos banco de perguntas existente
}

function drawPuzzleQuiz(ctx, ps) {
  const perguntas = obterPerguntasPorCurso(ps.curso);
  const idx = Math.min(ps.etapa, perguntas.length - 1);
  const q = perguntas[idx];

  // Mapeamento de GIFs para Educação Física
  const gifsEducacaoFisica = [
    'assets/educacaofisica/corrida.gif',
    'assets/educacaofisica/vo2max.gif',
    'assets/educacaofisica/hiit.gif',
    'assets/educacaofisica/aquecimento.gif'
  ];

  // Layout em duas colunas se for Educação Física
  if (ps.curso === 'Educação Física') {
    // Coluna esquerda: perguntas
    ctx.fillStyle = '#00315E';
    ctx.font = '22px Arial';
    wrapText(ctx, q.pergunta, 80, 160, 380, 28);

    const baseY = 240;
    q.opcoes.forEach((op, i) => {
      const y = baseY + i * 70;
      criarBotao(ctx, 80, y, 340, 50, `${i + 1}) ${op}`, () => {
        if (i !== q.correta) {
          ps.quizHighlight = { wrongIndex: i, correctIndex: q.correta, baseY };
          ps.feedback = 'Resposta incorreta. Alternativa correta destacada em verde.';
          ps.feedbackColor = '#b00020';
        } else {
          ps.quizHighlight = { wrongIndex: null, correctIndex: q.correta, baseY };
          ps.feedback = 'Correto!';
          ps.feedbackColor = '#008f5a';
          ps.score += 20;
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
      const x = 80, w = 340, h = 50;
      if (ps.quizHighlight.correctIndex != null) {
        const y = baseY + ps.quizHighlight.correctIndex * 70;
        ctx.strokeStyle = '#008f5a'; ctx.lineWidth = 4; ctx.strokeRect(x, y, w, h); ctx.lineWidth = 3;
      }
      if (ps.quizHighlight.wrongIndex != null) {
        const y = baseY + ps.quizHighlight.wrongIndex * 70;
        ctx.strokeStyle = '#b00020'; ctx.lineWidth = 4; ctx.strokeRect(x, y, w, h); ctx.lineWidth = 3;
      }
    }

    // Coluna direita: GIF do exercício
    const gifSrc = gifsEducacaoFisica[idx] || '';
    if (gifSrc) {
      const img = new Image();
      img.src = gifSrc;
      img.onload = () => {
        ctx.drawImage(img, 500, 180, 400, 260);
      };
      if (img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 500, 180, 400, 260);
      } else {
        // Fallback: texto se não carregar
        ctx.fillStyle = '#00315E';
        ctx.font = '20px Arial';
        ctx.fillText('GIF do exercício', 650, 320);
      }
    }
  } else {
    // Layout padrão para outros cursos
    while (q.opcoes.length < 4) q.opcoes.push('—');
    ctx.fillStyle = '#00315E';
    ctx.font = '20px Arial';
    wrapText(ctx, q.pergunta, 100, 160, canvas.width - 200, 26);
    const baseY = 240;
    q.opcoes.forEach((op, i) => {
      const y = baseY + i * 70;
      criarBotao(ctx, 120, y, canvas.width - 240, 50, `${i + 1}) ${op}`, () => {
        if (i !== q.correta) {
          ps.quizHighlight = { wrongIndex: i, correctIndex: q.correta, baseY };
          ps.feedback = 'Resposta incorreta. Alternativa correta destacada em verde.';
          ps.feedbackColor = '#b00020';
        } else {
          ps.quizHighlight = { wrongIndex: null, correctIndex: q.correta, baseY };
          ps.feedback = 'Correto!';
          ps.feedbackColor = '#008f5a';
          ps.score += 20;
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
        ctx.strokeStyle = '#008f5a'; ctx.lineWidth = 4; ctx.strokeRect(x, y, w, h); ctx.lineWidth = 3;
      }
      if (ps.quizHighlight.wrongIndex != null) {
        const y = baseY + ps.quizHighlight.wrongIndex * 70;
        ctx.strokeStyle = '#b00020'; ctx.lineWidth = 4; ctx.strokeRect(x, y, w, h); ctx.lineWidth = 3;
      }
    }
  }
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
      { nome: 'Java', img: 'assets/java.png' },
      { nome: 'Python', img: 'assets/python.png' },
      { nome: 'HTML', img: 'assets/html.png' },
      { nome: 'JavaScript', img: 'assets/js.png' }
    ];
  } else if (ps.curso === 'Psicologia') {
    faces = ['Ansiedade', 'Depressão', 'Fobia', 'Resiliência'];
  } else {
    faces = ['Oil free', 'FPS', 'Esfoliação', 'Hidratante'];
  }
  const cartas = [];
  let id = 0;
  faces.forEach((face, idx) => {
    // Para Engenharia, face é objeto; para outros, é string
    cartas.push({ id: id++, pair: idx, face });
    cartas.push({ id: id++, pair: idx, face });
  });
  shuffleArray(cartas);
  const startX = 120, startY = 200, gapX = 220, gapY = 120, w = 200, h = 80;
  const pos = cartas.map((c, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    return { x: startX + col * gapX, y: startY + row * gapY, w, h };
  });
  ps.mem = {
    cartas: cartas.map((c, i) => ({ ...c, x: pos[i].x, y: pos[i].y, w: pos[i].w, h: pos[i].h, open: false, matched: false })),
    flipped: [],
    matchedCount: 0,
    lock: false,
    firstTry: true // Adiciona flag para controlar a primeira tentativa
  };
}

function drawPuzzleMemoria(ctx, ps) {
  ctx.fillStyle = '#00315E';
  ctx.font = '20px Arial';
  ctx.fillText('Memória: encontre dois cartões iguais', 100, 160);
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
      // Se for objeto com imagem
      if (typeof c.face === 'object' && c.face.img) {
        const img = new Image();
        img.src = c.face.img;
        img.onload = () => {
          ctx.drawImage(img, c.x + 20, c.y + 10, c.w - 40, c.h - 20);
          ctx.fillStyle = '#00315E';
          ctx.font = '16px Arial';
          ctx.fillText(c.face.nome || c.face.texto, c.x + 20, c.y + c.h - 10);
        };
        // Se já carregou, desenha imediatamente
        if (img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, c.x + 20, c.y + 10, c.w - 40, c.h - 20);
          ctx.fillStyle = '#00315E';
          ctx.font = '16px Arial';
          ctx.fillText(c.face.nome || c.face.texto, c.x + 20, c.y + c.h - 10);
        } else {
          // Fallback: mostra texto/nome se imagem não carregar
          ctx.fillStyle = '#00315E';
          ctx.font = '18px Arial';
          wrapText(ctx, c.face.nome || c.face.texto, c.x + 12, c.y + 28, c.w - 24, 22);
        }
      } else {
        // Se for string simples
        ctx.fillStyle = '#00315E';
        ctx.font = '18px Arial';
        wrapText(ctx, c.face, c.x + 12, c.y + 28, c.w - 24, 22);
      }
    }

    if (typeof criarHitArea === 'function') {
      criarHitArea(c.x, c.y, c.w, c.h, () => flipMemCard(ps, c.id));
    } else {
      criarBotao(ctx, c.x, c.y, c.w, c.h, '', () => flipMemCard(ps, c.id));
    }
  });

  if (ps.feedback) {
    ctx.fillStyle = ps.feedbackColor || '#00315E';
    ctx.font = '18px Arial';
    wrapText(ctx, ps.feedback, 100, canvas.height - 200, canvas.width - 200, 24);
  }
  if (ps.mem.matchedCount === ps.mem.cartas.length) {
    ps.score = Math.min(80, ps.score + 20);
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
      ps.feedback = 'Par perfeito!';
      ps.feedbackColor = '#008f5a';
      mem.flipped = [];
      mem.lock = false;
    } else {
      ps.feedback = 'Não é um par.';
      ps.feedbackColor = '#b00020';
      // Só perde ponto se já virou 4 pares ou mais
      if (mem.paresVirados >= 4) {
        ps.score = Math.max(0, ps.score - 5);
        ps.feedback += ' -5 pontos';
      }
      setTimeout(() => {
        a.open = false; b.open = false;
        mem.flipped = [];
        mem.lock = false;
      }, 500);
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
  ctx.fillStyle = '#00315E';
  ctx.font = '20px Arial';
  wrapText(ctx, 'Marque os códigos de matrícula válidos conforme as regras (EDU, 7 chars, 5º = 5)', 100, 160, canvas.width - 200, 24);
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
window.puzzleState = { ativo: false, curso: null, score: 0, etapa: 0, modo: null, objetos: [], alvos: [], draggingId: null, offset: { x: 0, y: 0 }, feedback: "", feedbackColor: '#00315E', anim: null, mem: null };

function iniciarPuzzle(curso) {
  const modo = selecionarModoPorCurso(curso);
  // Pontuação inicial: pontos coletados (exemplo: window.globalScore)
  const scoreInicial = window.globalScore || 0;
  window.puzzleState = { ativo: true, curso, score: scoreInicial, etapa: 0, modo, objetos: [], alvos: [], draggingId: null, offset: { x: 0, y: 0 } };
  prepararPuzzleInicial();
}

function renderPuzzle(ctx, canvas, changeScene) {
  if (!window.puzzleState.ativo) {
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
          'Liberdade de locomoção',
          'Propriedade privada',
          'Direito de voto',
          'Sigilo bancário'
        ],
        correta: 0
      },
      {
        pergunta: 'O que é Constituição?',
        opcoes: [
          'Lei máxima do país',
          'Contrato entre empresas',
          'Regulamento escolar',
          'Norma de trânsito'
        ],
        correta: 0
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
          'Documento de requisitos',
          'Logo da empresa',
          'Storyboard',
          'Plano de mídia'
        ],
        correta: 0
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
          'Grupo de pessoas que se deseja atingir',
          'Equipe de vendas',
          'Concorrentes',
          'Parceiros comerciais'
        ],
        correta: 0
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
          'Bem ou direito',
          'Obrigação',
          'Despesa',
          'Receita'
        ],
        correta: 0
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
        pergunta: 'O que é passivo?',
        opcoes: [
          'Obrigação da empresa',
          'Bem adquirido',
          'Lucro líquido',
          'Receita operacional'
        ],
        correta: 0
      }
    ],
    'Biomedicina': [
      {
        pergunta: 'Qual organela produz energia na célula?',
        opcoes: [
          'Mitocôndria',
          'Ribossomo',
          'Complexo de Golgi',
          'Lisossomo'
        ],
        correta: 0
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
        pergunta: 'PCR detecta:',
        opcoes: [
          'Material genético',
          'Glicose',
          'Potássio',
          'Proteína'
        ],
        correta: 0
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
        pergunta: 'VO2máx indica:',
        opcoes: [
          'Capacidade aeróbia',
          'Força máxima',
          'Velocidade',
          'Resistência muscular'
        ],
        correta: 0
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
          'Preparação para atividade física',
          'Exercício de força',
          'Treino de velocidade',
          'Descanso pós-treino'
        ],
        correta: 0
      }
    ],
    'Enfermagem': [
      {
        pergunta: 'Qual primeiro passo em um corte?',
        opcoes: [
          'Higienizar/limpar o ferimento',
          'Cobrir sem limpar',
          'Ignorar',
          'Colocar curativo sem lavar'
        ],
        correta: 0
      },
      {
        pergunta: 'Sinais vitais incluem:',
        opcoes: [
          'PA, FC, FR, T',
          'IMC, BF%',
          'CT, HDL',
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
          'Cuidado com a saúde',
          'Administração de empresas',
          'Construção civil',
          'Educação física'
        ],
        correta: 0
      }
    ],
    'Radiologia': [
      {
        pergunta: 'Identifique a imagem: radiografia de mão ou tórax?',
        opcoes: [
          'Mão',
          'Tórax',
          'Pé',
          'Coluna'
        ],
        correta: 0
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
          'Cortes seccionais',
          'Eco',
          'Endoscopia',
          'Raio laser'
        ],
        correta: 0
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
