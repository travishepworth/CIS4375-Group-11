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

router.post("/:type/tableKeys", (req, res) => {
  const { type } = req.params;

  const queriesMap = {
    job: [
      "SELECT * FROM Client;",
      "SELECT * FROM CMJ_Type;",
      "SELECT * FROM MJ_Status;",
      "SELECT * FROM Job_Description;",
      "SELECT * FROM Country;",
      "SELECT * FROM State;",
    ],
    meeting: [
      "SELECT * FROM Client;",
      "SELECT * FROM CMJ_Type;",
      "SELECT * FROM MJ_Status;",
      "SELECT * FROM Country;",
      "SELECT * FROM State;",
    ],
  };

  const queries = queriesMap[type];

  Promise.all(
    queries.map((query) => {
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

router.post("/:type/search", async (req, res) => {
  const { type } = req.params;

  queryType = type.charAt(0).toUpperCase() + type.slice(1);
  const subType = type === "job" ? "Job" : "Meet";

  const query = `SELECT * FROM ${queryType} WHERE ${subType}_ID LIKE ? 
    OR Client_ID LIKE ? 
    OR ${subType}_Date LIKE ?
    OR ${subType}_Time LIKE ?
    OR ${subType}_City LIKE ?
    OR ${subType}_Address LIKE ?`;
  try {
    const results = await api.tableQuery(query, connection, req);
    res.json(results);
  } catch (err) {
    console.error("error: ", err);
  }
});

router.post("/:type/update/delete", async (req, res) => {
  const { type } = req.params;

  const subType = type === "job" ? "Job" : "Meet";

  const query = `DELETE FROM ${type.charAt(0).toUpperCase() + type.slice(1)}
    WHERE ${subType}_ID = ?`;
  try {
    const results = await api.databaseUpdate(query, connection, req);
    res.json(results);
  } catch (err) {
    console.error("error: ", err);
  }
});

router.post("/:type/update/add", async (req, res) => {
  const { type } = req.params;

  const queriesMap = {
    job: `INSERT INTO Job
    (Client_ID, CMJ_Type_ID, MJ_Status_ID,
    Job_Description_ID, Job_Date, Job_Time,
    Job_Address, Job_City, Job_Zip, Country_ID, State_ID,
    Charge, Prev_Deposit, Job_Cost, Job_Cost_Notes, Job_Profit, Job_Notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

    meeting: `INSERT INTO Meeting
    (Client_ID, CMJ_Type_ID, MJ_Status_ID,
    Meet_Date, Meet_Time, Meet_Address, Meet_City, Meet_Zip, Country_ID, State_ID,
    Quote, Deposit_Collect, Est_Cost, Est_Cost_Notes, Est_Profit, Meeting_Notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  };

  const query = queriesMap[type];

  try {
    const results = await api.databaseUpdate(query, connection, req);
    res.json({ message: "Job added successfully" });
  } catch (err) {
    console.error("error: ", err);
  }
});

router.post("/:type/update/edit", async (req, res) => {
  const { type } = req.params;

  const queriesMap = {
    job: `UPDATE Job
    SET Client_ID = ?, CMJ_Type_ID = ?, MJ_Status_ID = ?, Job_Description_ID = ?, 
    Job_Date = ?, Job_Time = ?, Job_Address = ?, Job_City = ?, Job_Zip = ?, 
    Country_ID = ?, State_ID = ?, Charge = ?, Prev_Deposit = ?, Job_Cost = ?, 
    Job_Cost_Notes = ?, Job_Profit = ?, Job_Notes = ?
    WHERE Job_ID = ?`,

    meeting: `UPDATE Meeting
    SET Client_ID = ?, CMJ_Type_ID = ?, MJ_Status_ID = ?,
    Meet_Date = ?, Meet_Time = ?, Meet_Address = ?, Meet_City = ?, Meet_Zip = ?,
    Country_ID = ?, State_ID = ?, Quote = ?, Deposit_Collect = ?, Est_Cost = ?,
    Est_Cost_Notes = ?, Est_Profit = ?, Meeting_Notes = ?
    WHERE Meet_ID = ?`
  }
  const query = queriesMap[type];
  try {
    const result = await api.databaseUpdate(query, connection, req);
    res.json({ message: "working (probably)" });
  } catch (err) {
    console.error("error ", err);
  }
});

router.post("/:type/fill", async (req, res) => {
  const { type } = req.params;

  const subType = type === "job" ? "Job" : "Meet";

  const query = `SELECT * FROM ${type.charAt(0).toUpperCase() + type.slice(1)}
    WHERE ${subType}_ID = ?`;
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
