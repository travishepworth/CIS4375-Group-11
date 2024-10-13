import { fetchClientData } from "./search.js";

const columns = [
  "Client_ID",
  "Client_FName",
  "Client_LName",
  "Client_Email",
  "Client_Cell_Phone",
];

const route = "/clients/search"

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
