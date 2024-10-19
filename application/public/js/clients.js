import { TableFormWrapper } from "./tableFormWrapper.js";

const columns = [
  "Client_ID",
  "Client_FName",
  "Client_LName",
  "Client_Email",
  "Client_Cell_Phone",
];

const elementIds = [
  "clientLead",
  "clientType",
  "clientStatus",
  "firstName",
  "lastName",
  "email",
  "cellPhone",
  "workPhone",
  "address",
  "city",
  "zipCode",
  "country",
  "state",
  "dateAcquired",
  "notes",
  "acquisitionMethod",
];

const modularIDs = [
  "clientLead",
  "clientType",
  "clientStatus",
  "acquisitionMethod",
  "country",
  "state",
];

const route = "clients";

const Page = new TableFormWrapper(columns, route, elementIds, modularIDs);

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

document
  .getElementById("btn-close")
  .addEventListener("click", async function () {
    Page.closeForm();
  });

// Handle the "+" button click event to open the modal
document
  .getElementById("openClientFormButton")
  .addEventListener("click", function () {
    Page.openForm();
  });

document
  .getElementById("updateButton")
  .addEventListener("click", async function () {
    Page.updateRow();
  });

document
  .getElementById("deleteButton")
  .addEventListener("click", async function () {
    Page.deleteRow();
  });
