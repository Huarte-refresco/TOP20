const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data.json');
const PLANT_PASSWORD = process.env.PLANT_PASSWORD || 'marcilla2026';

function loadDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch (e) {
    return {};
  }
}
function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db));
}
let db = loadDB();

const app = express();
app.use(express.json({ limit: '10mb' }));

// --- Contraseña compartida muy simple (Basic Auth) ---
function checkAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, encoded] = header.split(' ');
  if (scheme === 'Basic' && encoded) {
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    const idx = decoded.indexOf(':');
    const pass = idx >= 0 ? decoded.slice(idx + 1) : decoded;
    if (pass === PLANT_PASSWORD) return next();
  }
  res.set('WWW-Authenticate', 'Basic realm="Acta TOP 20 Marcilla"');
  res.status(401).send('Autenticación requerida');
}
app.use(checkAuth);

// --- API clave-valor ---
app.get('/api/kv/:key', (req, res) => {
  const value = db[req.params.key];
  if (value === undefined) return res.status(404).json({ error: 'not_found' });
  res.json({ key: req.params.key, value });
});

app.put('/api/kv/:key', (req, res) => {
  const { value } = req.body || {};
  if (typeof value !== 'string') return res.status(400).json({ error: 'value_must_be_string' });
  db[req.params.key] = value;
  saveDB(db);
  res.json({ ok: true });
});

app.delete('/api/kv/:key', (req, res) => {
  delete db[req.params.key];
  saveDB(db);
  res.json({ ok: true });
});

// --- Frontend estático ---
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Acta TOP 20 escuchando en el puerto ${PORT}`);
});
