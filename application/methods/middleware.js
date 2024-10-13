const session = require("express-session");

const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect("/");
  }
};

module.exports = isAuthenticated;
