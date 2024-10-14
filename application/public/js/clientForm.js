import { fetchTableKeys, postNewClient } from "./methods.js";

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

document.getElementById("updateButton").addEventListener("click", function () {
  const elements = elementIds.map((id) => document.getElementById(id).value);
  postNewClient("clients/update/add", elements);
});

// Handle the "+" button click event to open the modal
document
  .getElementById("openClientFormButton")
  .addEventListener("click", function () {
    fetchTableKeys(modularIDs);
    var clientFormModal = new bootstrap.Modal(
      document.getElementById("clientFormModal"),
    );
    clientFormModal.show();
  });

document.getElementById("deleteButton").addEventListener("click", function () {
  if (confirm("Are you sure you want to delete this client?")) {
    // Perform delete action here
    alert("Client deleted.");
  }
});
