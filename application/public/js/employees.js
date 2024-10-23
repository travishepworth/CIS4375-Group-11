import { TableFormWrapper } from "./tableFormWrapper.js";

const columns = [
  "Emp_ID",
  "Emp_FName",
  "Emp_LName",
  "Emp_Email",
  "Emp_Address",
  "Emp_Cell_Phone",
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
