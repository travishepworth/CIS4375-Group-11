import { TableFormWrapper } from "./tableFormWrapper.js";

const jobColumns = [
  "Job_ID",
  "Client_ID",
  "Job_Date",
  "Job_Time",
  "Job_City",
  "Job_Address",
];

const jobElementIDs = [
  "Client_ID",
  "CMJ_Type_ID",
  "MJ_Status_ID",
  "Job_Description_ID",
  "Job_Date",
  "Job_Time",
  "Job_Address",
  "Job_City",
  "Job_Zip",
  "Country_ID",
  "State_ID",
  "Charge",
  "Prev_Deposit",
  "Job_Cost",
  "Job_Cost_Notes",
  "Job_Profit",
  "Job_Notes",
];

const jobModularIDs = [
  "Client_ID",
  "CMJ_Type_ID",
  "MJ_Status_ID",
  "Job_Description_ID",
  "Country_ID",
  "State_ID",
];

const jobRoute = "/dashboard/job";

const JobPage = new TableFormWrapper(jobColumns, jobRoute, jobElementIDs, jobModularIDs);

document.addEventListener("DOMContentLoaded", () => {
  JobPage.constructTable();
});

document
  .getElementById("search-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const search = document.getElementById("search").value;
    JobPage.search(search);
  });

document
  .getElementById("btn-close")
  .addEventListener("click", async function () {
    JobPage.closeForm();
  });

document
  .getElementById("openJobFormButton")
  .addEventListener("click", function () {
    JobPage.openForm();
  });

document
  .getElementById("updateButton")
  .addEventListener("click", async function () {
    JobPage.updateRow();
  });

document
  .getElementById("deleteButton")
  .addEventListener("click", async function () {
    JobPage.deleteRow();
  });

document.getElementById("jobMeeting").addEventListener("change", function () {
  let selectedForm = this.value;

  // Hide both forms initially
  document.getElementById("jobForm").style.display = "none";
  document.getElementById("meetingForm").style.display = "none";

  // Show the selected form
  if (selectedForm === "job") {
    document.getElementById("jobForm").style.display = "block";
  } else if (selectedForm === "meeting") {
    document.getElementById("meetingForm").style.display = "block";
  }
});

// Trigger initial form selection on modal open
document.getElementById("jobMeeting").dispatchEvent(new Event("change"));
