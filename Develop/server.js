const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// JSON/ urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Starts server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

// API Routes
const dbPath = path.join(__dirname, 'db/db.json');

app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = Date.now().toString(); // Add a unique id
  const notes = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  notes.push(newNote);
  fs.writeFileSync(dbPath, JSON.stringify(notes));
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  let notes = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  notes = notes.filter((note) => note.id !== noteId);
  fs.writeFileSync(dbPath, JSON.stringify(notes));
  res.json({ success: true });
});
