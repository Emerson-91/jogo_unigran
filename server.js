const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Servir arquivos estáticos (html, css, js, imagens)
app.use(express.static(path.join(__dirname)));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Endpoint para salvar relatório
app.post("/api/relatorio", (req, res) => {
  const { curso, scoreCurso, scoreColetaveis, scoreTotal, modo, ts } = req.body || {};
  if (!curso) return res.status(400).json({ ok: false, error: "curso obrigatório" });

  const filePath = path.join(__dirname, "relatorio.json");
  const txtPath = path.join(__dirname, "relatorio.txt");
  let data = [];
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf8");
      data = JSON.parse(raw || "[]");
    }
  } catch (e) {
    // se arquivo estiver corrompido, reinicia
    data = [];
  }

  data.push({ curso, scoreCurso: Number(scoreCurso) || 0, scoreColetaveis: Number(scoreColetaveis) || 0, scoreTotal: Number(scoreTotal) || 0, modo: modo || null, ts: ts || Date.now() });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  // apende linha no TXT para auditoria rápida
  try {
    const line = `[${new Date(ts || Date.now()).toISOString()}] curso=${curso} total=${Number(scoreTotal) || 0} curso=${Number(scoreCurso) || 0} coletaveis=${Number(scoreColetaveis) || 0} modo=${modo || ''}\n`;
    fs.appendFileSync(txtPath, line, { encoding: 'utf8' });
  } catch (_) {}
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
