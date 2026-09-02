const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');

const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data.sqlite');
const PLANT_PASSWORD = process.env.PLANT_PASSWORD || 'marcilla2026';

const db = new Database(DB_PATH);
db.exec(`
  CREATE TABLE IF NOT EXISTS kv (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

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
const getStmt = db.prepare('SELECT value FROM kv WHERE key = ?');
const setStmt = db.prepare(`
  INSERT INTO kv (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
  ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
`);
const delStmt = db.prepare('DELETE FROM kv WHERE key = ?');

app.get('/api/kv/:key', (req, res) => {
  const row = getStmt.get(req.params.key);
  if (!row) return res.status(404).json({ error: 'not_found' });
  res.json({ key: req.params.key, value: row.value });
});

app.put('/api/kv/:key', (req, res) => {
  const { value } = req.body || {};
  if (typeof value !== 'string') return res.status(400).json({ error: 'value_must_be_string' });
  setStmt.run(req.params.key, value);
  res.json({ ok: true });
});

app.delete('/api/kv/:key', (req, res) => {
  delStmt.run(req.params.key);
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
