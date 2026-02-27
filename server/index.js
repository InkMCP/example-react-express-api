const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from client build in production
app.use(express.static(path.join(__dirname, '../client/dist')));

// In-memory items store
const items = [
  { id: 1, name: 'First item', createdAt: new Date().toISOString() },
  { id: 2, name: 'Second item', createdAt: new Date().toISOString() }
];
let nextId = 3;

// API routes
app.get('/api/items', (req, res) => {
  res.json(items);
});

app.post('/api/items', (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const item = { id: nextId++, name: name.trim(), createdAt: new Date().toISOString() };
  items.push(item);
  res.status(201).json(item);
});

app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  items.splice(index, 1);
  res.json({ ok: true });
});

// Catch-all: serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
