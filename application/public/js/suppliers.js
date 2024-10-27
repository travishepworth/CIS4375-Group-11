import { TableFormWrapper } from "./tableFormWrapper.js";

const columns = {
  "Supplier_ID": "ID",
  "Supplier_FName": "First Name",
  "Supplier_LName": "Last Name",
  "Supplier_Email": "Email",
  "Supplier_Address": "Address",
  "Supplier_Cell_Phone": "Cell Phone",
};

const elementIDs = [
  "Supplier_Type_ID",
  "supplierFirstName",
  "supplierLastName",
  "supplierEmail",
  "supplierCellPhone",
  "supplierWorkPhone",
  "supplierAddress",
  "supplierCity",
  "supplierZip",
  "Country_ID",
  "State_ID",
  "dateAdded",
  "notes",
  "Supplier_Status_ID",
];

const modularIDs = [
  "Supplier_Type_ID",
  "Supplier_Status_ID",
  "Country_ID",
  "State_ID",
];

const editableDropdowns = {
  supplierStatus: "Supplier_Status",
  supplierType: "Supplier_Type",
};

const route = "suppliers/supplier";

const Page = new TableFormWrapper(
  columns,
  route,
  elementIDs,
  modularIDs,
  editableDropdowns,
  "supplierFormModal",
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
// Handle the "+" button click event to open the modal
document
  .getElementById("openSupplierFormButton")
  .addEventListener("click", function () {
    Page.openForm();
  });

document
  .getElementById("deleteButton")
  .addEventListener("click", async function () {
    Page.deleteRow();
    Page.refreshTable();
    Page.redrawTable();
  });

document
  .getElementById("updateButton")
  .addEventListener("click", async function () {
    Page.updateRow();
    Page.refreshTable();
    Page.redrawTable();
  });

document
  .getElementById("btn-close")
  .addEventListener("click", async function () {
    Page.closeForm();
  });

