const session = require('express-session');

const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next()
  } else {
    console.log('NO AUTH');
    res.redirect('/');
  }
}

module.exports = isAuthenticated;
