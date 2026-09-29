// server.js
// A minimal full-stack backend: Express (web server + API) + SQLite (database).
// Serves the frontend files in /public AND an API the frontend talks to.

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Database setup ---
// Opens (or creates, if missing) a file called data.db in this folder.
// SQLite stores the whole database as one file — nothing else to install or run.
const db = new sqlite3.Database(path.join(__dirname, 'data.db'));

db.run(`
  CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// --- Middleware ---
app.use(express.json());               // lets the server read JSON sent from the frontend
app.use(express.static('public'));     // serves index.html, style.css, etc. directly

// --- API routes ---

// GET all requests — the frontend calls this to fill the list
app.get('/api/requests', (req, res) => {
  db.all('SELECT * FROM requests ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST a new request — the frontend calls this when the form is submitted
app.post('/api/requests', (req, res) => {
  const { name, phone, message } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required.' });
  }
  db.run(
    'INSERT INTO requests (name, phone, message) VALUES (?, ?, ?)',
    [name, phone, message || ''],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, name, phone, message });
    }
  );
});

// DELETE a request by id — used by the "remove" button in the demo list
app.delete('/api/requests/:id', (req, res) => {
  db.run('DELETE FROM requests WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
