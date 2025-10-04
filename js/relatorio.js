// Relatório no backend via POST
async function salvarRelatorioBackend(curso, scoreCurso, extra) {
  const scoreColetaveis = (window.globalScore || 0);
  const scoreTotal = Math.min(100, scoreColetaveis + (scoreCurso || 0));
  const modo = (window.puzzleState && window.puzzleState.modo) || null;
  const payload = Object.assign({
    curso,
    scoreCurso: Number(scoreCurso) || 0,
    scoreColetaveis: Number(scoreColetaveis) || 0,
    scoreTotal,
    modo,
    ts: Date.now()
  }, extra || {});

  await fetch('/api/relatorio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}
