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

router.post("/job/tableKeys", (req, res) => {
  const querries = [
    "SELECT * FROM Client;",
    "SELECT * FROM CMJ_Type;",
    "SELECT * FROM MJ_Status;",
    "SELECT * FROM Job_Description;",
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

router.post("/job/search", async (req, res) => {
  const query = `SELECT * FROM Job WHERE Job_ID LIKE ? 
    OR Client_ID LIKE ? 
    OR Job_Date LIKE ?
    OR Job_Time LIKE ?
    OR Job_City LIKE ?
    OR Job_Address LIKE ?`;
  try {
    const results = await api.tableQuery(query, connection, req);
    res.json(results);
  } catch (err) {
    console.error("error: ", err);
  }
});

router.post("/job/update/delete", async (req, res) => {
  const query = `DELETE FROM Job WHERE Job_ID = ?`;
  try {
    const results = await api.databaseUpdate(query, connection, req);
    res.json(results);
  } catch (err) {
    console.error("error: ", err);
  }
});

router.post("/job/update/add", async (req, res) => {
  const query = `INSERT INTO Job 
    (Client_ID, CMJ_Type_ID, MJ_Status_ID, 
    Job_Description_ID, Job_Date, Job_Time, 
    Job_Address, Job_City, Job_Zip, Country_ID, State_ID, 
    Charge, Prev_Deposit, Job_Cost, Job_Cost_Notes, Job_Profit, Job_Notes) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  try {
    const results = await api.databaseUpdate(query, connection, req);
    res.json({ message: "Job added successfully" });
  } catch (err) {
    console.error("error: ", err);
  }
});

router.post("/job/update/edit", async (req, res) => {
  const query = `UPDATE Job
    SET Client_ID = ?, CMJ_Type_ID = ?, MJ_Status_ID = ?, Job_Description_ID = ?, 
    Job_Date = ?, Job_Time = ?, Job_Address = ?, Job_City = ?, Job_Zip = ?, 
    Country_ID = ?, State_ID = ?, Charge = ?, Prev_Deposit = ?, Job_Cost = ?, 
    Job_Cost_Notes = ?, Job_Profit = ?, Job_Notes = ?
    WHERE Job_ID = ?`;
  try {
    const result = await api.databaseUpdate(query, connection, req);
    res.json({ message: "working (probably)" });
  } catch (err) {
    console.error("error ", err);
  }
});

router.post("/job/fill", async (req, res) => {
  const query = `SELECT * FROM Job WHERE Job_ID = ?`;
  try {
    const results = await api.idSearch(query, connection, req);
    res.json(results);
  } catch (err) {
    console.error("error: ", err);
  }
});

router.get("/", (req, res) => {
  res.render("pages/dashboard", { currentRoute: "dashboard" });
  // the route for localhost:3000/dashboard
});

module.exports = router;
