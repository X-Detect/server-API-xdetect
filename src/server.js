const express = require('express');
const routes = require('./routes');
require('dotenv').config();

const app = express();
const port = 8080;

app.use(express.json({ limit: '10mb' }));

// app.use(routes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server berjalan pada http://localhost:${port}`);
});
