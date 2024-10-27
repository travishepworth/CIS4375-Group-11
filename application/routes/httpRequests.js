const router = require("express").Router();

const api = require("../methods/api.js");
const connection = require("../db-connection.js");

const hasAuth = require("../methods/middleware.js");

const myMiddleware = (req, res, next) => {
  next();
};

router.use(myMiddleware);

router.post("/:route/:type/addDropdown", (req, res) => {
  const value = req.body.value;
  const table = req.body.table;

  const query = `INSERT INTO ${table} (${table}) VALUES (?)`;

  connection.query(query, [value], (err, results) => {
    if (err) {
      console.error("Database Query Error: ", err);
      res.status(500).json({ message: "Internal server error" });
    } else {
      res.json({ message: "Dropdown added successfully" });
    }
  });
});

router.post("/:route/:type/deleteDropdown", (req, res) => {
  const value = req.body.value;
  const table = req.body.table;

  const query = `DELETE FROM ${table} WHERE ${table} = ?`;

  connection.query(query, [value], (err, results) => {
    if (err) {
      console.error("Database Query Error: ", err);
      res.status(500).json({ message: "Foreign Key Restraint" });
    } else {
      res.json({ results });
    }
  });
});

// Route to get all the dropdown data from a table
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
    employee: [
      "SELECT * FROM Employee_Status;",
      "SELECT * FROM Employee_Type;",
      "SELECT * FROM Country;",
      "SELECT * FROM State;",
    ],
    supplier: [
      "SELECT * FROM Supplier_Type;",
      "SELECT * FROM Supplier_Status;",
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

// Route to add new data
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
    Meeting_Date, Meeting_Time, Meeting_Address, Meeting_City, Meeting_Zip, Country_ID, State_ID,
    Quote, Deposit_Collect, Est_Cost, Est_Cost_Notes, Est_Profit, Meeting_Notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

    client: `INSERT INTO Client
    (Client_Type_ID, CMJ_TYPE_ID, Client_Status_ID,
    Client_FName, Client_LName, Client_Email, Client_Cell_Phone, Client_Work_Phone,
    Client_Address, Client_City, Client_Zip, Country_ID, State_ID, Date_Added,
    Notes, Acquire_Type_ID)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

    employee: `INSERT INTO Employee
    (Employee_Status_ID, Employee_Type_ID, Employee_FName, Employee_LName,
    Employee_Email, Employee_Cell_Phone, Employee_Address,  Employee_City, Employee_Zip,
    Country_ID, State_ID, Date_Added, Employee_Notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

    supplier: `INSERT INTO Supplier
    (Supp_Type_ID, Supplier_FName, Supplier_LName,
    Supplier_Email, Supplier_Cell_Phone, Supplier_Work_Phone, Supplier_Address, Supplier_City,
    Supplier_Zip, Country_ID, State_ID, Date_Added, Notes, Supplier_Status_ID)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  };
  const query = queriesMap[type];

  try {
    const results = await api.databaseUpdate(query, connection, req);
    res.json({ message: "Job added successfully" });
  } catch (err) {
    console.error("error: ", err);
  }
});

// Route to edit existing data
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
    Meeting_Date = ?, Meeting_Time = ?, Meeting_Address = ?, Meeting_City = ?, Meeting_Zip = ?,
    Country_ID = ?, State_ID = ?, Quote = ?, Deposit_Collect = ?, Est_Cost = ?,
    Est_Cost_Notes = ?, Est_Profit = ?, Meeting_Notes = ?
    WHERE Meeting_ID = ?`,

    client: `UPDATE Client
    SET Client_Type_ID = ?, CMJ_TYPE_ID = ?, Client_Status_ID = ?,
    Client_FName = ?, Client_LName = ?, Client_Email = ?, Client_Cell_Phone = ?, Client_Work_Phone = ?,
    Client_Address = ?, Client_City = ?, Client_Zip = ?, Country_ID = ?, State_ID = ?, Date_Added = ?,
    Notes = ?, Acquire_Type_ID = ?
    WHERE Client_ID = ?`,

    employee: `UPDATE Employee
    SET Employee_Status_ID = ?, Employee_Type_ID = ?, Employee_FName = ?, Employee_LName = ?,
    Employee_Email = ?, Employee_Cell_Phone = ?, Employee_Address = ?, Employee_City = ?, Employee_Zip = ?,
    Country_ID = ?, State_ID = ?, Date_Added = ?, Employee_Notes = ?
    WHERE Employee_ID = ?`,

    supplier: `UPDATE Supplier
    SET Supp_Type_ID = ?, Supplier_FName = ?, Supplier_LName = ?,
    Supplier_Email = ?, Supplier_Cell_Phone = ?, Supplier_Work_Phone = ?, Supplier_Address = ?, Supplier_City = ?,
    Supplier_Zip = ?, Country_ID = ?, State_ID = ?, Date_Added = ?, Notes = ?, Supplier_Status_ID = ?
    WHERE Supplier_ID = ?`,
  };
  const query = queriesMap[type];
  try {
    const result = await api.databaseUpdate(query, connection, req);
    res.json({ message: "working (probably)" });
  } catch (err) {
    console.error("error ", err);
  }
});

// Route to delete data
router.post("/:route/:type/update/delete", async (req, res) => {
  const { route, type } = req.params;

  let subType = type.charAt(0).toUpperCase() + type.slice(1);
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

router.post("/:route/clientID", async (req, res) => {
  query = `SELECT Client_FName, Client_LName, Client_ID FROM Client`;
  try {
    const results = await api.returnAllClients(query, connection);
    res.json(results);
  } catch (err) {
    console.error("error: ", err);
  }
});

// Route to search for data
router.post("/:route/:type/search", async (req, res) => {
  const { route, type } = req.params;

  let subType = type.charAt(0).toUpperCase() + type.slice(1);
  queryType = type.charAt(0).toUpperCase() + type.slice(1);

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

//  Route to fill form with data
router.post("/:route/:type/fill", async (req, res) => {
  const { route, type } = req.params;

  let subType = type.charAt(0).toUpperCase() + type.slice(1);

  const query = `SELECT * FROM ${type.charAt(0).toUpperCase() + type.slice(1)}
    WHERE ${subType}_ID = ?`;
  try {
    const results = await api.idSearch(query, connection, req);
    res.json(results);
  } catch (err) {
    console.error("error: ", err);
  }
});

module.exports = router;
