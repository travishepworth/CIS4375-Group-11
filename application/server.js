// Load node modules
const express = require('express');
const path = require('path');
const ejs = require('ejs');
// const bootstrap = require('bootstrap');
// import "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
// import 'bootstrap';
// Init express
const app = express();
// Rendering static files
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/')));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('pages/login');
});

app.listen(8080);
