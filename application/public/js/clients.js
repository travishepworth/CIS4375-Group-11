import { TableFormWrapper } from "./tableFormWrapper.js";

const columns = {
  "Client_FName": "First Name",
  "Client_LName": "Last Name",
  "Client_Email": "Email",
  "Client_Cell_Phone": "Cell Phone",
  "Client_Status_ID": "Status",
  "Client_Type_ID": "Type",
};

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
  "Acquire_Type_ID",
];

const modularIDs = [
  "clientLead",
  "clientType",
  "clientStatus",
  "Acquire_Type_ID",
  "country",
  "state",
];

const editableDropdowns = {"acquisitionMethod": "Acquire_Type"};

const route = "clients/client";

const Page = new TableFormWrapper(
  columns,
  route,
  elementIds,
  modularIDs,
  editableDropdowns,
  "clientFormModal",
);

document.addEventListener("DOMContentLoaded", () => {
  Page.constructTable();
  Page.createDropdownListeners();
});

document
  .getElementById("search-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const search = document.getElementById("search").value;
    Page.refreshTable();
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
    Page.refreshTable();
    Page.redrawTable();
  });

document
  .getElementById("deleteButton")
  .addEventListener("click", async function () {
    Page.deleteRow();
    Page.refreshTable();
    Page.redrawTable();
  });
