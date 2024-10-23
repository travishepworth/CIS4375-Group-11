const router = require("express").Router();

const api = require("../methods/api.js");
const connection = require("../db-connection.js");

const hasAuth = require("../methods/middleware.js");

const myMiddleware = (req, res, next) => {
  next();
};

router.use(myMiddleware);

router.post("/:route/:type/tableKeys", (req, res) => {
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
    client: [
      "SELECT * FROM Client_Type;",
      "SELECT * FROM CMJ_Type;",
      "SELECT * FROM Client_Status;",
      "SELECT * FROM Acquire_Type;",
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

router.post("/:route/:type/update/add", async (req, res) => {
  const { route, type } = req.params;

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

    client: `INSERT INTO Client
    (Client_Type_ID, CMJ_TYPE_ID, Client_Status_ID,
    Client_FName, Client_LName, Client_Email, Client_Cell_Phone, Client_Work_Phone,
    Client_Address, Client_City, Client_Zip, Country_ID, State_ID, Date_Added,
    Notes, Acquire_Type_ID)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  };
  const query = queriesMap[type];
  console.log("query: ", query);

  try {
    const results = await api.databaseUpdate(query, connection, req);
    res.json({ message: "Job added successfully" });
  } catch (err) {
    console.error("error: ", err);
  }
});

router.post("/:route/:type/update/edit", async (req, res) => {
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
    WHERE Meet_ID = ?`,

    client: `UPDATE Client
    SET Client_Type_ID = ?, CMJ_TYPE_ID = ?, Client_Status_ID = ?,
    Client_FName = ?, Client_LName = ?, Client_Email = ?, Client_Cell_Phone = ?, Client_Work_Phone = ?,
    Client_Address = ?, Client_City = ?, Client_Zip = ?, Country_ID = ?, State_ID = ?, Date_Added = ?,
    Notes = ?, Acquire_Type_ID = ?
    WHERE Client_ID = ?`,
  }
  const query = queriesMap[type];
  try {
    const result = await api.databaseUpdate(query, connection, req);
    res.json({ message: "working (probably)" });
  } catch (err) {
    console.error("error ", err);
  }
});



router.post("/:route/:type/update/delete", async (req, res) => {
  const { route, type } = req.params;
  console.log("route: ", route);
  console.log("type: ", type);

  let subType = type.charAt(0).toUpperCase() + type.slice(1);
  if (subType === "Meeting") {
    subType = "Meet";
  }
  queryType = type.charAt(0).toUpperCase() + type.slice(1);

  const query = `DELETE FROM ${type.charAt(0).toUpperCase() + type.slice(1)}
    WHERE ${subType}_ID = ?`;
  try {
    const results = await api.databaseUpdate(query, connection, req);
    res.json(results);
  } catch (err) {
    console.error("error: ", err);
  }
});

router.post("/:route/:type/search", async (req, res) => {
  const { route, type } = req.params;

  let subType = type.charAt(0).toUpperCase() + type.slice(1);
  queryType = type.charAt(0).toUpperCase() + type.slice(1);

  if (subType === "Meeting") {
    subType = "Meet";
  } else if (subType === "Employee") {
    subType = "Emp";
  }

  let query = `SELECT * FROM ${queryType} WHERE ${subType}_ID LIKE ?`;

  // Add fields for job and meeting specific searching
  if (type === "job" || type === "meeting") {
    query += ` OR ${subType}_Date LIKE ?`;
    query += ` OR ${subType}_Time LIKE ?`;
    query += ` OR ${subType}_City LIKE ?`;
    query += ` OR ${subType}_Address LIKE ?`;
  }
  // Add fields for client/employee/suppliers specific searching
  if (type === "client" || type === "employee" || type === "supplier") {
    query += ` OR ${subType}_FName LIKE ?`;
    query += ` OR ${subType}_LName LIKE ?`;
    query += ` OR ${subType}_Email LIKE ?`;
    query += ` OR ${subType}_Cell_Phone LIKE ?`;
  }

  try {
    const results = await api.tableQuery(query, connection, req);
    res.json(results);
  } catch (err) {
    console.error("error: ", err);
  }
});

router.post("/:route/:type/fill", async (req, res) => {
  const { route, type } = req.params;
  console.log("route: ", route);
  console.log("type: ", type);

  let subType = type.charAt(0).toUpperCase() + type.slice(1);
  if (subType === "Meeting") {
    subType = "Meet";
  }

  const query = `SELECT * FROM ${type.charAt(0).toUpperCase() + type.slice(1)}
    WHERE ${subType}_ID = ?`;
  try {
    const results = await api.idSearch(query, connection, req);
    console.log("results: ", results);
    res.json(results);
  } catch (err) {
    console.error("error: ", err);
  }
});

module.exports = router;
