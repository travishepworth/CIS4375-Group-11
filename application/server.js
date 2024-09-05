// Load node modules
const express = require('express');
const path = require('path');
const ejs = require('ejs');
// Init express
const app = express();
// Rendering static files
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('demo');
});

app.listen(8080);
