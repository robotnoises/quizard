const path = require('path');
const express = require('express');
const file = require('./lib/file');

const app = express();

/**
 * Middleware
 */

app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.PORT || 8888, () => {
  console.log('Server started');
});

app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: path.join(__dirname, 'public'),
  });
});

app.get('/api/getstepdata', (req, res) => {
  const step = req.query.step;

  file.loadStep(step)
    .then(response => res.json(response))
    .catch(err => res.status(500).json({ msg: 'error' }));
});