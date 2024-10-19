import { fetchClientData } from "./search.js";

const columns = [
  "Emp_ID",
  "Emp_FName",
  "Emp_LName",
  "Emp_Email",
  "Emp_Address",
  "Emp_Cell_Phone",
];

const route = "/employees/search";

document.addEventListener("DOMContentLoaded", () => {
  fetchClientData("", columns, route); // load all clients when page is loaded
});

document
  .getElementById("search-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const search = document.getElementById("search").value;
    fetchClientData(search, columns, "/employees/search");
  });
