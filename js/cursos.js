// Cursos e NPCs
/*
function cursoLoop(curso) {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.font = '22px Arial';
  //ctx.fillText('Você está no curso: ' + curso, 50, 50);
  //ctx.fillText('Fale com a Coordenação para iniciar o puzzle!', 50, 100);
}
*/
function drawHUD(ctx, curso, score) {
  const azul = '#0053A0';
  const dourado = '#FDB515';
  ctx.fillStyle = azul;
  ctx.fillRect(0, 0, canvas.width, 48);
  ctx.fillStyle = '#ffffff';
  ctx.font = '18px Arial';
  ctx.fillText('Curso: ' + (curso || '-'), 20, 30);
  ctx.fillText('Pontuação: ' + (score ?? 0) + '/100', canvas.width - 220, 30);
  // linha inferior
  ctx.strokeStyle = dourado;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 48);
  ctx.lineTo(canvas.width, 48);
  ctx.stroke();
}

const EXPLICACOES_PORTAL = {
  'Administração': 'Aqui a gente aprende a liderar pessoas, organizar processos e tomar boas decisões para os resultados da empresa.',
  'Direito': 'Falamos sobre leis e justiça no dia a dia, sempre com olhar crítico e foco nos direitos de todos.',
  'Psicologia': 'Estudamos comportamento e emoções para cuidar da saúde mental e do bem-estar das pessoas.',
  'Publicidade': 'Criamos campanhas que conectam marcas e pessoas — com estratégia, pesquisa e muita criatividade.',
  'Arquitetura e Urbanismo': 'Desenhamos espaços e cidades mais bonitas, funcionais e sustentáveis para quem vive nelas.',
  'Ciências Contábeis': 'Cuidamos das contas, auditoria e impostos para apoiar decisões seguras nas organizações.',
  'Design de Interiores': 'Transformamos ambientes unindo conforto, estética, iluminação e uso inteligente do espaço.',
  'Engenharia de Software': 'Planejamos e construímos softwares de qualidade — do levantamento de requisitos aos testes.',
  'Estética e Cosmética': 'Cuidamos da pele e do bem-estar com técnicas seguras e tecnologia a favor da autoestima.',
  'Biomedicina': 'Pesquisamos e realizamos análises que ajudam a prevenir, diagnosticar e tratar doenças.',
  'Educação Física': 'Promovemos saúde e desempenho por meio de exercícios, hábitos e acompanhamento próximo.',
  'Enfermagem': 'Cuidamos das pessoas em diferentes momentos da vida — com técnica, empatia e responsabilidade.',
  'Fisioterapia': 'Ajudamos na prevenção e reabilitação do movimento para devolver autonomia e qualidade de vida.',
  'Nutrição': 'Trabalhamos com alimentação equilibrada para saúde, esporte, clínica e políticas públicas.',
  'Radiologia': 'Usamos imagens (raio X, tomografia, ressonância) para apoiar diagnósticos com segurança.'
};

const EXPLICACOES_COORDENADOR = {
  'Administração': 'Que bom te ver por aqui! Vou te mostrar rapidinho como a gestão faz diferença no dia a dia.',
  'Direito': 'Seja bem-vindo! A ideia é aproximar o Direito da sua rotina, de um jeito leve e direto.',
  'Psicologia': 'Olá! Vamos conversar sobre pessoas, emoções e cuidados com a mente — tudo com carinho e ciência.',
  'Publicidade': 'Bem-vindo! Aqui você vai ver como criatividade e estratégia caminham juntas.',
  'Arquitetura e Urbanismo': 'Oi! Quero te mostrar como a gente pensa espaços bonitos, úteis e responsáveis.',
  'Ciências Contábeis': 'Olá! Contabilidade também fala de decisões melhores e futuro das empresas — bora ver?',
  'Design de Interiores': 'Seja bem-vindo! Vamos falar de conforto, estética e bem-estar dentro dos ambientes.',
  'Engenharia de Software': 'Olá! Aqui nosso foco é formar engenheiros de software para a era da inteligência artificial com criatividade,',
  'Estética e Cosmética': 'Olá! Vou te contar como o cuidado com a pele e o bem-estar caminham juntos.',
  'Biomedicina': 'Bem-vindo! Por trás dos exames tem muita ciência e curiosidade — deixa eu te mostrar.',
  'Educação Física': 'Olá! Saúde e movimento são para todo mundo — vamos nessa?',
  'Enfermagem': 'Seja bem-vindo! Cuidar é técnica, empatia e presença — vou te apresentar um pouco.',
  'Fisioterapia': 'Olá! Nosso foco é devolver autonomia com cuidado e orientação.',
  'Nutrição': 'Bem-vindo! Comer bem é sobre equilíbrio e escolhas possíveis — vamos conversar?',
  'Radiologia': 'Oi! Imagens contam histórias do corpo — e a gente aprende a interpretá-las com segurança.'
};
