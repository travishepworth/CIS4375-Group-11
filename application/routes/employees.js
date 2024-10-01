const express = require('express');
const router = express.Router();

// Define a middleware function
const myMiddleware = (req, res, next) => {
  next();
};

router.use(myMiddleware);

router.get('/', (req, res) => {
  res.render('pages/employees', { currentRoute: 'employees' });
  // the route for localhost:3000/dashboard
});

module.exports = router;
