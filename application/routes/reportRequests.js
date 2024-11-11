const router = require("express").Router();

const api = require("../methods/api.js");
const connection = require("../db-connection.js");

const hasAuth = require("../methods/middleware.js");

const myMiddleware = (req, res, next) => {
  next();
};

router.use(myMiddleware);

router.post("/:route/generate/:type", (req, res) => {
  const { type } = req.params;
  const { startDate, endDate } = req.body;

  // MASSIVE STRING BLOCKS
  const queries = {
    leadsWithinTimeframe: `
      SELECT 
          Client.Client_ID,
          Client.Client_FName,
          Client.Client_LName,
          Client.Client_Email,
          Client.Client_Cell_Phone,
          Client.Client_Work_Phone,
          Client.Client_Address,
          Client.Client_City,
          Client.Client_Zip,
          State.State AS State,
          Country.Country AS Country,
          Client_Type.Client_Type AS Client_Type,
          CMJ_Type.CMJ_Type AS CMJ_Type,
          Client_Status.Client_Status AS Client_Status,
          Acquire_Type.Acquire_Type AS Acquire_Type,
          Client.Date_Added,
          Client.Notes
      FROM Client
      JOIN State ON Client.State_ID = State.State_ID
      JOIN Country ON Client.Country_ID = Country.Country_ID
      JOIN Client_Type ON Client.Client_Type_ID = Client_Type.Client_Type_ID
      JOIN CMJ_Type ON Client.CMJ_Type_ID = CMJ_Type.CMJ_Type_ID
      JOIN Client_Status ON Client.Client_Status_ID = Client_Status.Client_Status_ID
      JOIN Acquire_Type ON Client.Acquire_Type_ID = Acquire_Type.Acquire_Type_ID
      WHERE Client.Client_Type_ID = (SELECT Client_Type_ID FROM Client_Type WHERE Client_Type = 'Lead')
        AND Client.Date_Added BETWEEN '${startDate}' AND '${endDate}';`,
    leadsBecomingClients: `
      SELECT 
          Client.Client_ID,
          Client.Client_FName,
          Client.Client_LName,
          Client.Client_Email,
          Client.Client_Cell_Phone,
          Client.Client_Work_Phone,
          Client.Client_Address,
          Client.Client_City,
          Client.Client_Zip,
          State.State AS State,
          Country.Country AS Country,
          Client_Type.Client_Type AS Client_Type,
          CMJ_Type.CMJ_Type AS CMJ_Type,
          Client_Status.Client_Status AS Client_Status,
          Acquire_Type.Acquire_Type AS Acquire_Type,
          Client.Date_Added,
          Client.leads_to_client_date,
          Client.Notes
      FROM Client
      JOIN State ON Client.State_ID = State.State_ID
      JOIN Country ON Client.Country_ID = Country.Country_ID
      JOIN Client_Type ON Client.Client_Type_ID = Client_Type.Client_Type_ID
      JOIN CMJ_Type ON Client.CMJ_Type_ID = CMJ_Type.CMJ_Type_ID
      JOIN Client_Status ON Client.Client_Status_ID = Client_Status.Client_Status_ID
      JOIN Acquire_Type ON Client.Acquire_Type_ID = Acquire_Type.Acquire_Type_ID
      WHERE Client.leads_to_client_date IS NOT NULL
          AND Client.leads_to_client_date BETWEEN '${startDate}' AND '${endDate}';`,
    estimatedSales: `
      SELECT 
          Client.Client_FName AS First_Name,
          Client.Client_LName AS Last_Name,
          Client.Client_Cell_Phone AS Phone_Number,
          Meeting.Meeting_Date AS Date,
          Meeting.Meeting_Time AS Time,
          Meeting.Meeting_Address AS Address,
          MJ_Status.MJ_Status AS Status,
          Meeting.Quote AS Estimated_Sales
      FROM Meeting
      JOIN Client ON Meeting.Client_ID = Client.Client_ID
      JOIN MJ_Status ON Meeting.MJ_Status_ID = MJ_Status.MJ_Status_ID
      WHERE Meeting.Meeting_Date BETWEEN '${startDate}' AND '${endDate}'

      UNION ALL

      SELECT 
          NULL AS First_Name,
          NULL AS Last_Name,
          NULL AS Phone_Number,
          NULL AS Date,
          NULL AS Time,
          'Total Estimated Sales:' AS Address,
          NULL AS Status,
          SUM(Meeting.Quote) AS Estimated_Sales
      FROM Meeting
      JOIN Client ON Meeting.Client_ID = Client.Client_ID
      JOIN MJ_Status ON Meeting.MJ_Status_ID = MJ_Status.MJ_Status_ID
      WHERE Meeting.Meeting_Date BETWEEN '${startDate}' AND '${endDate}';`,
    actualSales: `
      SELECT 
          Client.Client_FName AS First_Name,
          Client.Client_LName AS Last_Name,
          Client.Client_Cell_Phone AS Phone_Number,
          Job.Job_Date AS Date,
          Job.Job_Time AS Time,
          Job.Job_Address AS Address,
          Job.Job_Profit AS Actual_Sales
      FROM Job
      JOIN Client ON Job.Client_ID = Client.Client_ID
      WHERE Job.MJ_Status_ID = 2
          AND Job.Job_Date BETWEEN '${startDate}' AND '${endDate}'

      UNION ALL

      SELECT 
          NULL AS First_Name,
          NULL AS Last_Name,
          NULL AS Phone_Number,
          NULL AS Date,
          NULL AS Time,
          'Total Actual Sales:' AS Address,
          SUM(Job.Job_Profit) AS Actual_Sales
      FROM Job
      JOIN Client ON Job.Client_ID = Client.Client_ID
      WHERE Job.MJ_Status_ID = 2
          AND Job.Job_Date BETWEEN '${startDate}' AND '${endDate}';`,
    percentageCompleteofJobs: `
      -- Main Query: Job listing with client information, job description, and job status
      (
          SELECT 
              Client.Client_FName AS First_Name,
              Client.Client_LName AS Last_Name,
              Client.Client_Cell_Phone AS Phone_Number,
              Job.Job_Date AS Date,
              Job.Job_Time AS Time,
              Job.Job_Address AS Address,
              Job_Description.Job_Description AS Job_Description,
              MJ_Status.MJ_Status AS Job_Status
          FROM Job
          JOIN Client ON Job.Client_ID = Client.Client_ID
          JOIN MJ_Status ON Job.MJ_Status_ID = MJ_Status.MJ_Status_ID
          JOIN Job_Description ON Job.Job_Description_ID = Job_Description.Job_Description_ID
          WHERE Job.Job_Date BETWEEN '${startDate}' AND '${endDate}'
      )

      -- UNION to add percentage completed at the bottom
      UNION ALL

      -- Percentage of completed jobs
      (
          SELECT 
              NULL AS First_Name,
              NULL AS Last_Name,
              NULL AS Phone_Number,
              NULL AS Date,
              NULL AS Time,
              NULL AS Address,
              NULL AS Job_Description,
              CONCAT(
                  'Percentage Completed: ', 
                  ROUND((SUM(CASE WHEN Job.MJ_Status_ID = 2 THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2), 
                  '%'
              ) AS Job_Status
          FROM Job
          WHERE Job.Job_Date BETWEEN '${startDate}' AND '${endDate}'
      )

      -- Wrap the UNION query in a subquery to perform the ORDER BY
      ORDER BY 
          CASE WHEN FIELD(Job_Status, 'Completed', 'In-Progress', 'Upcoming') > 0 THEN 0 ELSE 1 END,
          FIELD(Job_Status, 'Completed', 'In-Progress', 'Upcoming'), -- Sort by job status order
          Date, Time;`
    // `
    //   -- Main Query: Job listing with client information, job description, and job status
    //   (
    //       SELECT 
    //           Client.Client_FName AS First_Name,
    //           Client.Client_LName AS Last_Name,
    //           Client.Client_Cell_Phone AS Phone_Number,
    //           Job.Job_Date AS Date,
    //           Job.Job_Time AS Time,
    //           Job.Job_Address AS Address,
    //           Job_Description.Job_Description AS Job_Description,
    //           MJ_Status.MJ_Status AS Job_Status,
    //           Job.MJ_Status_ID
    //       FROM Job
    //       JOIN Client ON Job.Client_ID = Client.Client_ID
    //       JOIN MJ_Status ON Job.MJ_Status_ID = MJ_Status.MJ_Status_ID
    //       JOIN Job_Description ON Job.Job_Description_ID = Job_Description.Job_Description_ID
    //       WHERE Job.Job_Date BETWEEN '${startDate}' AND '${endDate}'
    //   )
    //
    //   -- UNION to add percentage completed at the bottom
    //   UNION ALL
    //
    //   -- Percentage of completed jobs
    //   (
    //       SELECT 
    //           NULL AS First_Name,
    //           NULL AS Last_Name,
    //           NULL AS Phone_Number,
    //           NULL AS Date,
    //           NULL AS Time,
    //           NULL AS Address,
    //           NULL AS Job_Description,
    //           CONCAT(
    //               'Percentage Completed: ', 
    //               ROUND((SUM(CASE WHEN Job.MJ_Status_ID = 2 THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2), 
    //               '%'
    //           ) AS Job_Status,
    //           NULL AS MJ_Status_ID
    //       FROM Job
    //       WHERE Job.Job_Date BETWEEN '${startDate}' AND '${endDate}'
    //   )
    //
    //   -- Final ORDER BY for sorting by MJ_Status_ID and date/time
    //   ORDER BY 
    //       CASE WHEN MJ_STATUS_ID IS NULL THEN 1 ELSE 0 END,
    //       FIELD(MJ_Status_ID, 2, 16, 15), -- Sort by MJ_Status_ID order (2 = Completed, 16 = In-Progress, 15 = Upcoming)
    //       Date, Time;`,
  };

  const query = queries[type];
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Database Query Error: ", err);
      res.status(500).json({ message: "Internal server error" });
    } else {
      res.json({ results });
    }
  });
});

module.exports = router;
