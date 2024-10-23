// Load node modules
const express = require("express");
const session = require("express-session");

const path = require("path");
const bodyParser = require("body-parser");

const cors = require("cors");

// .env secret management
require("dotenv").config();
const key = process.env.SESSION_KEY;

// Set port to host website on
const PORT = 8080;

// Init express
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing urlencoded
app.use(express.json()); // for parsing json
app.use(
  session({
    secret: key,
    resave: false,
    saveUninitialized: true,
  }),
);

// Include route files
const dashboardRoute = require("./routes/dashboard.js");
const employeesRoute = require("./routes/employees.js");
const reportsRoute = require("./routes/reports.js");
const suppliersRoute = require("./routes/suppliers.js");
const clientsRoute = require("./routes/clients.js");
const loginRoute = require("./routes/login.js");
const httpRequestsRoute = require("./routes/httpRequests.js");

// Rendering static files
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.use("/dashboard", dashboardRoute);
app.use("/employees", employeesRoute);
app.use("/reports", reportsRoute);
app.use("/suppliers", suppliersRoute);
app.use("/clients", clientsRoute);
app.use("/", httpRequestsRoute);
app.use("/", loginRoute);

app.listen(PORT, () => {
  console.log(`Server is running on all interfaces at port ${PORT}`);
});
