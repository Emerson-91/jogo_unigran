// Cursos e NPCs
function cursoLoop(curso) {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  //ctx.fillText('Você está no curso: ' + curso, 50, 50);
  ctx.fillText('Fale com o Coordenador para iniciar o puzzle!', 50, 100);
}

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
  'Administração': 'Administração: aqui você aprende a organizar empresas, pessoas e recursos para alcançar resultados.',
  'Direito': 'Direito: área que estuda leis, justiça e cidadania para garantir direitos e deveres.',
  'Psicologia': 'Psicologia: ciência que investiga o comportamento humano e os processos mentais.',
  'Publicidade': 'Publicidade: comunicação criativa para promover marcas, produtos e ideias.',
  'Arquitetura e Urbanismo': 'Arquitetura: projeta espaços, edifícios e cidades para melhorar a vida das pessoas.',
  'Ciências Contábeis': 'Contábeis: controla e analisa as finanças das organizações.',
  'Design de Interiores': 'Design de Interiores: transforma ambientes internos para conforto, beleza e funcionalidade.',
  'Engenharia de Software': 'Engenharia de Software: desenvolve sistemas e programas para resolver problemas reais.',
  'Estética e Cosmética': 'Estética: cuida da beleza, saúde da pele e bem-estar.',
  'Biomedicina': 'Biomedicina: pesquisa e atua na prevenção, diagnóstico e tratamento de doenças.',
  'Educação Física': 'Educação Física: promove saúde e qualidade de vida através do movimento.',
  'Enfermagem': 'Enfermagem: cuida da saúde das pessoas em hospitais, clínicas e comunidades.',
  'Fisioterapia': 'Fisioterapia: reabilita e previne lesões, melhorando a mobilidade.',
  'Nutrição': 'Nutrição: estuda alimentos e dietas para promover saúde.',
  'Radiologia': 'Radiologia: utiliza imagens para diagnóstico médico.'
};

const EXPLICACOES_COORDENADOR = {
  'Administração': 'Bem-vindo à Administração! Prepare-se para organizar processos, liderar equipes e tomar decisões estratégicas. Vamos para o desafio?',
  'Direito': 'Bem-vindo ao Direito! Aqui você vai interpretar leis e resolver casos jurídicos. Pronto para o puzzle?',
  'Psicologia': 'Bem-vindo à Psicologia! Observe comportamentos e descubra padrões. Vamos ao desafio?',
  'Publicidade': 'Bem-vindo à Publicidade! Use criatividade para comunicar ideias e impactar pessoas. Pronto para o puzzle?',
  'Arquitetura e Urbanismo': 'Bem-vindo à Arquitetura! Projete e encaixe formas para criar espaços incríveis. Vamos ao desafio?',
  'Ciências Contábeis': 'Bem-vindo às Contábeis! Calcule, analise e controle as finanças. Pronto para o puzzle?',
  'Design de Interiores': 'Bem-vindo ao Design de Interiores! Associe elementos para criar ambientes harmoniosos. Vamos ao desafio?',
  'Engenharia de Software': 'Bem-vindo à Engenharia de Software! Organize códigos e resolva problemas lógicos. Pronto para o puzzle?',
  'Estética e Cosmética': 'Bem-vindo à Estética! Descubra os cuidados ideais para beleza e saúde. Vamos ao desafio?',
  'Biomedicina': 'Bem-vindo à Biomedicina! Analise exames e encontre respostas para a saúde. Pronto para o puzzle?',
  'Educação Física': 'Bem-vindo à Educação Física! Teste seus conhecimentos sobre exercícios e saúde. Vamos ao desafio?',
  'Enfermagem': 'Bem-vindo à Enfermagem! Cuide de pacientes e tome decisões rápidas. Pronto para o puzzle?',
  'Fisioterapia': 'Bem-vindo à Fisioterapia! Associe exercícios e técnicas para reabilitação. Vamos ao desafio?',
  'Nutrição': 'Bem-vindo à Nutrição! Associe alimentos e benefícios para uma vida saudável. Pronto para o puzzle?',
  'Radiologia': 'Bem-vindo à Radiologia! Analise imagens e faça diagnósticos precisos. Vamos ao desafio?'
};
