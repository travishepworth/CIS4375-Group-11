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

router.post("/acquisition", (req, res) => {
  // query for current acquisition methods
  const query = "SELECT * FROM Acquire_Type;";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.json({ message: "Internal server error" });
    }
    console.log(results);
    res.json(results);
  });
});

const query = `SELECT * FROM Client WHERE Client_FName LIKE ? 
    OR Client_LName LIKE ? 
    OR Client_Email LIKE ?
    OR Client_Cell_Phone LIKE ?`;

router.post("/search", async (req, res) => {
  try {
    const results = await api.tableQuery(query, connection, req);
    res.json(results);
  } catch (err) {
    console.log("error: ", err);
  }
});

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
