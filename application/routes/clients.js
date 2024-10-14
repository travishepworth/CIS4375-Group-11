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

router.post("/tableKeys", (req, res) => {
  const querries = [
    "SELECT * FROM Client_Type;",
    "SELECT * FROM CMJ_Type;",
    "SELECT * FROM Client_Status;",
    "SELECT * FROM Acquire_Type;",
    "SELECT * FROM Country;",
    "SELECT * FROM State;",
  ];

  Promise.all(
    querries.map((query) => {
      return new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
          if (err) {
            console.error("Database Query Error: ", err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    }),
  )
    .then((resultsArray) => {
      res.json(resultsArray);
    })
    .catch((err) => {
      console.error("Error executing queries: ", err);
      res.status(500).json({ message: "Internal server error" });
    });
});

router.post("/search", async (req, res) => {
  const query = `SELECT * FROM Client WHERE Client_FName LIKE ? 
    OR Client_LName LIKE ? 
    OR Client_Email LIKE ?
    OR Client_Cell_Phone LIKE ?`;
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
