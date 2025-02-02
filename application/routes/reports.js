const express = require("express");
const router = express.Router();

const hasAuth = require("../methods/middleware.js");

// Define a middleware function
const myMiddleware = (req, res, next) => {
  next();
};

router.use(hasAuth);

router.get("/", (req, res) => {
  res.render("pages/reports", { currentRoute: "reports" });
  // the route for localhost:3000/dashboard
});

module.exports = router;
