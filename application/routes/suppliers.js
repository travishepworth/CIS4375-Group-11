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

const query = `SELECT * FROM Supplier WHERE Supplier_FName LIKE ? 
    OR Supplier_LName LIKE ? 
    OR Supplier_Email LIKE ?
    OR Supplier_Cell_Phone LIKE ?`;

router.post("/search", async (req, res) => {
  try {
    const results = await api.tableQuery(query, connection, req);
    res.json(results);
  } catch (err) {
    console.log("error: ", err);
  }
});

router.get("/", (req, res) => {
  res.render("pages/suppliers", { currentRoute: "suppliers" });
  // the route for localhost:3000/dashboard
});

module.exports = router;
