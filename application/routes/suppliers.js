const express = require('express');
const router = express.Router();

const hasAuth = require('./middleware.js')

// Define a middleware function
const myMiddleware = (req, res, next) => {
  next();
};

router.use(hasAuth);

router.get('/', (req, res) => {
  res.render('pages/suppliers', { currentRoute: 'suppliers' });
  // the route for localhost:3000/dashboard
});

module.exports = router;
