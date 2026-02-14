// server.js (corrigido)
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(bodyParser.json());

// Serve arquivos estáticos que estarão na pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// API: salvar um registro simples (ex: formulário de register.html)
app.post('/api/register', async (req, res) => {
  try {
    const payload = req.body;
    // lê DB atual
    let db = { users: [] };
    try {
      const raw = await fs.readFile(DB_FILE, 'utf8');
      db = JSON.parse(raw || '{}');
      if (!Array.isArray(db.users)) db.users = [];
    } catch (err) {
      // arquivo pode não existir ainda — tudo bem
      db = { users: [] };
    }

    // adicionar id simples e timestamp
    const id = Date.now();
    const record = { id, createdAt: new Date().toISOString(), ...payload };
    db.users.push(record);

    await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), 'utf8');

    return res.status(201).json({ ok: true, record });
  } catch (err) {
    console.error('Erro /api/register:', err);
    return res.status(500).json({ ok: false, error: 'Erro no servidor' });
  }
});

// health check
app.get('/health', (req, res) => res.json({ ok: true, uptime: process.uptime() }));

// fallback: serve index (single page apps) — opcional
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const HOST = process.env.HOST || '::'; 
app.listen(PORT, HOST, () => {
  console.log(`Server rodando em http://${HOST}:${PORT}`);
});

