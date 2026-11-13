const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

// ---- Datos en memoria (demo) ----
let items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
];

// ---- Endpoints ----
app.get('/', (req, res) => res.redirect('/docs'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/items', (req, res) => res.json(items));

app.get('/api/items/:id', (req, res) => {
  const item = items.find((i) => i.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

app.post('/api/items', (req, res) => {
  const { name } = req.body || {};
  if (!name) return res.status(400).json({ error: 'name requerido' });
  const item = { id: items.length ? items[items.length - 1].id + 1 : 1, name };
  items.push(item);
  res.status(201).json(item);
});

// ---- Documentacion Scalar ----
app.get('/openapi.json', (req, res) =>
  res.sendFile(path.join(__dirname, 'openapi.json'))
);

app.get('/docs', (req, res) => {
  res.type('html').send(`<!doctype html>
<html>
  <head>
    <title>GreenPlus API</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <script id="api-reference" data-url="/openapi.json"></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`);
});

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Hostinger (Passenger) inyecta PORT / socket; local usa 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API escuchando en ${PORT}`);
  console.log(`Docs:   http://localhost:${PORT}/docs`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
});
