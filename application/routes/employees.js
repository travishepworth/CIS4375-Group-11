const express = require("express");
const router = express.Router();

// import created api/crud functions
const api = require("../methods/api.js");

const connection = require("../db-connection.js");
const hasAuth = require("../methods/middleware.js");

// Define a middleware function
const myMiddleware = (req, res, next) => {
  next();
};

router.use(hasAuth);

router.get("/", (req, res) => {
  res.render("pages/employees", { currentRoute: "employees" });
  // the route for localhost:3000/dashboard
});

module.exports = router;
