const express = require("express");
const router = express.Router();

// import created api/crud functions
const api = require("../methods/api.js");

// Import database connections
const connection = require("../db-connection.js");
const hasAuth = require("../methods/middleware.js");

// Define a middleware function
const myMiddleware = (req, res, next) => {
  next();
};

router.use(hasAuth);

router.get("/", (req, res) => {
  const query = "SELECT * FROM Client where Client_ID = 1";

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Database query error: ", err);
      return res.json({ message: "Internal server error" });
    }

    res.render("pages/clients", { currentRoute: "clients", data: results });
  });
});

module.exports = router;
