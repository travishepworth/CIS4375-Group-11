// Load node modules
const express = require('express');
const ejs = require('ejs');
// Init express
const app = express();
// Rendering static files
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('public/demo');
});

app.listen(8080);
