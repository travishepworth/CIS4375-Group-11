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
  "Client_ID_Job",
  "CMJ_Type_ID_Job",
  "MJ_Status_ID_Job",
  "Job_Description_ID",
  "Job_Date",
  "Job_Time",
  "Job_Address",
  "Job_City",
  "Job_Zip",
  "Country_ID_Job",
  "State_ID_Job",
  "Charge",
  "Prev_Deposit",
  "Job_Cost",
  "Job_Cost_Notes",
  "Job_Profit",
  "Job_Notes",
];

const jobModularIDs = [
  "Client_ID_Job",
  "CMJ_Type_ID_Job",
  "MJ_Status_ID_Job",
  "Job_Description_ID",
  "Country_ID_Job",
  "State_ID_Job",
];

const meetingColumns = [
  "Meet_ID",
  "Client_ID",
  "Meet_Date",
  "Meet_Time",
  "Meet_City",
  "Meet_Address",
  "Quote",
];

const meetingElementIDs = [
  "Client_ID_Meeting",
  "CMJ_Type_ID_Meeting",
  "MJ_Status_ID_Meeting",
  "Meet_Date",
  "Meet_Time",
  "Meet_Address",
  "Meet_City",
  "Meet_Zip",
  "Country_ID_Meeting",
  "State_ID_Meeting",
  "Quote",
  "Deposit_Collect",
  "Est_Cost",
  "Est_Cost_Notes",
  "Est_Profit",
  "Meeting_Notes",
];

const meetingModularIDs = [
  "Client_ID_Meeting",
  "CMJ_Type_ID_Meeting",
  "MJ_Status_ID_Meeting",
  "Country_ID_Meeting",
  "State_ID_Meeting",
];

const meetingRoute = "/dashboard/meeting";
const jobRoute = "/dashboard/job";

const MeetingPage = new TableFormWrapper(
  meetingColumns,
  meetingRoute,
  meetingElementIDs,
  meetingModularIDs,
  "meetingFormModal",
);
const JobPage = new TableFormWrapper(
  jobColumns,
  jobRoute,
  jobElementIDs,
  jobModularIDs,
  "jobFormModal",
);

document.addEventListener("DOMContentLoaded", () => {
  MeetingPage.constructTable();
});

document
  .getElementById("search-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const search = document.getElementById("search").value;
    MeetingPage.search(search);
  });

document
  .getElementById("openJobFormButton")
  .addEventListener("click", function () {
    JobPage.openForm();
  });

document
  .getElementById("openMeetingFormButton")
  .addEventListener("click", function () {
    MeetingPage.openForm();
  });

document.querySelectorAll(".btn-close").forEach((button) => {
  button.addEventListener("click", async function () {
    JobPage.closeForm();
    MeetingPage.closeForm();
  });
});

document.querySelectorAll(".update-btn").forEach((button) => {
  button.addEventListener("click", async function () {
    MeetingPage.updateRow();
    JobPage.updateRow();
  });
});

document.querySelectorAll(".delete-btn").forEach((button) => {
  button.addEventListener("click", async function () {
    MeetingPage.deleteRow();
    JobPage.deleteRow();
  });
});
