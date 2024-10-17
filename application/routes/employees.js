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

const query = `SELECT * FROM Employee WHERE Emp_FName LIKE ? 
    OR Emp_LName LIKE ? 
    OR Emp_Email LIKE ?
    OR Emp_Cell_Phone LIKE ?`;

router.post("/search", async (req, res) => {
  try {
    const results = await api.tableQuery(query, connection, req);
    res.json(results);
  } catch (err) {
    console.error("error: ", err);
  }
});


router.get("/", (req, res) => {
  res.render("pages/employees", { currentRoute: "employees" });
  // the route for localhost:3000/dashboard
});

module.exports = router;
