import { TableFormWrapper } from "./tableFormWrapper.js";

const columns = [
  "Supplier_ID",
  "Supplier_FName",
  "Supplier_LName",
  "Supplier_Email",
  "Supplier_Address",
  "Supplier_Cell_Phone",
];

const route = "suppliers";

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
