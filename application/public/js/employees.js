import { TableFormWrapper } from "./tableFormWrapper.js";

const columns = {
  "Employee_FName": "First Name",
  "Employee_LName": "Last Name",
  "Employee_Email": "Email",
  "Employee_Address": "Address",
  "Employee_Cell_Phone": "Cell Phone",
  "Employee_Status_ID": "Status",
  "Employee_Type_ID": "Type",
};

const elementIDs = [
  "Employee_Status_ID",
  "Employee_Type_ID",
  "employeeFirstName",
  "employeeLastName",
  "employeeEmail",
  "employeeCellPhone",
  "employeeAddress",
  "employeeCity",
  "employeeZip",
  "Country_ID",
  "State_ID",
  "dateAdded",
  "notes",
];

const modularIDs = [
  "Employee_Status_ID",
  "Employee_Type_ID",
  "Country_ID",
  "State_ID",
];

const editableDropdowns = {
  employeeStatus: "Employee_Status",
  employeeType: "Employee_Type",
};

const route = "employees/employee";

const Page = new TableFormWrapper(
  columns,
  route,
  elementIDs,
  modularIDs,
  editableDropdowns,
  "employeeFormModal",
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
  .getElementById("openEmployeeFormButton")
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

