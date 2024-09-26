// Load node modules
const express = require('express');
const path = require('path');
const ejs = require('ejs');

// Init express
const app = express();

// Include route files
const dashboardRoute = require('./routes/dashboard.js');
const clientsRoute = require('./routes/clients.js');

// Rendering static files
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/')));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('pages/login');
});
app.use('/dashboard', dashboardRoute);
app.use('/clients', clientsRoute);

app.listen(8080);
