import { executeQuery, openNewForm, closeForm } from "./methods.js";
import { currentClientID, fetchClientData, refreshClientID } from "./search.js";

export let searchValue = "";

export const elementIds = [
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

export const modularIDs = [
  "clientLead",
  "clientType",
  "clientStatus",
  "acquisitionMethod",
  "country",
  "state",
];

export const columns = [
  "Client_ID",
  "Client_FName",
  "Client_LName",
  "Client_Email",
  "Client_Cell_Phone",
];

export const route = "/clients/search";

document.addEventListener("DOMContentLoaded", () => {
  fetchClientData("", columns, route); // load all clients when page is loaded
});

document
  .getElementById("search-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const search = document.getElementById("search").value;
    searchValue = search;
    fetchClientData(search, columns, route);
  });

document
  .getElementById("btn-close")
  .addEventListener("click", async function () {
    closeForm();
  });

// Handle the "+" button click event to open the modal
document
  .getElementById("openClientFormButton")
  .addEventListener("click", function () {
    refreshClientID();
    openNewForm();
  });

document
  .getElementById("updateButton")
  .addEventListener("click", async function () {
    const elements = elementIds.map((id) => document.getElementById(id).value);
    if (currentClientID === -1) {
      await executeQuery("clients/update/add", elements);
    } else {
      elements.push(currentClientID);
      await executeQuery("clients/update/edit", elements);
    }
    fetchClientData(searchValue, columns, route);
    closeForm();
  });

document
  .getElementById("deleteButton")
  .addEventListener("click", async function () {
    if (confirm("Are you sure you want to delete this client?")) {
      // Perform delete action here
      const elements = [currentClientID];
      await executeQuery("clients/update/delete", elements);
      // alert("Client deleted.");
      await fetchClientData(searchValue, columns, route);
      closeForm();
    }
  });
