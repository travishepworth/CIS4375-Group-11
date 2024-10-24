import { TableFormWrapper } from "./tableFormWrapper.js";

const columns = [
  "Employee_ID",
  "Employee_FName",
  "Employee_LName",
  "Employee_Email",
  "Employee_Address",
  "Employee_Cell_Phone",
];

const route = "employees/employee";

const Page = new TableFormWrapper(columns, route);

document.addEventListener("DOMContentLoaded", () => {
  Page.constructTable();
});

document
  .getElementById("search-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const search = document.getElementById("search").value;
    Page.search(search);
  });
