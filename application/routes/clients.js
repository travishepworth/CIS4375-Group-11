const express = require("express");
const router = express.Router();

// Import database connections
const connection = require("../db-connection.js");
const hasAuth = require("./middleware.js");

// Define a middleware function
const myMiddleware = (req, res, next) => {
  next();
};

router.use(myMiddleware);

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

router.post("/search", (req, res) => {
  const search = req.body.search;
  const searchTerm = `%${search}%`;

  const query =
    "SELECT * FROM Client WHERE Client_FName LIKE ? OR Client_LName LIKE ? OR Client_Email LIKE ? OR Client_Cell_Phone LIKE ?";
  connection.query(
    query,
    [searchTerm, searchTerm, searchTerm, searchTerm],
    (err, results) => {
      if (err) {
        console.error("Database query error: ", err);
        return res.json({ message: "Internal server error" });
      }
      res.json(results);
    },
  );
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
