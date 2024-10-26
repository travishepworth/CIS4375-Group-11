import { TableFormWrapper } from "./tableFormWrapper.js";

const columns = [
  "Employee_ID",
  "Employee_FName",
  "Employee_LName",
  "Employee_Email",
  "Employee_Address",
  "Employee_Cell_Phone",
  "Employee_Type_ID",
];

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
  });

document
  .getElementById("updateButton")
  .addEventListener("click", async function () {
    Page.updateRow();
  });

document
  .getElementById("btn-close")
  .addEventListener("click", async function () {
    Page.closeForm();
  });

