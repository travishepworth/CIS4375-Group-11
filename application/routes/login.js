// Import express router
const express = require('express');
const router = express.Router();

// Import the database connection
const connection = require('../db-connection.js');
const crypto = require('crypto');

const myMiddleware = (req, res, next) => {
  next();
};

router.use(myMiddleware);

router.get('/', (req, res) => {
  res.render('pages/login')
})

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log(username);
  console.log(password);

  const query = 'SELECT * FROM Users WHERE Username = ?';

  // query for users
  connection.query(query, [username], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Internal server error');
    }

    // Check if user exists
    if (results.length === 0) {
      return res.status(401).send('Invalid username or password');
    } 

    const user = results[0];

    if (user.Password === password) {
      console.log('success')
      // Successful login
      return res.redirect('/dashboard');
    } else {
      // Incorrect password
      return res.json({message: "Invalid Login"})
    }
  });
});

module.exports = router;
