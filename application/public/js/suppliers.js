import { fetchClientData } from "./search.js";

const columns = [
  "Supplier_ID",
  "Supplier_FName",
  "Supplier_LName",
  "Supplier_Email",
  "Supplier_Address",
  "Supplier_Cell_Phone",
];

const route = "/suppliers/search";

document.addEventListener("DOMContentLoaded", () => {
  fetchClientData("", columns, route); // load all clients when page is loaded
});

document
  .getElementById("search-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const search = document.getElementById("search").value;
    fetchClientData(search, columns, route);
  });
