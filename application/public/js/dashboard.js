import { TableFormWrapper } from "./tableFormWrapper.js";

const jobColumns = {
  "Job_ID": "Type",
  "Client_ID": "Client",
  "Job_Date": "Date",
  "Job_Time": "Time",
  "Job_City": "City",
  "Job_Address": "Address",
  "Job_Profit": "Profit/Quote",
};

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

const meetingColumns = {
  "Meeting_ID": "Type",
  "Client_ID": "Client_ID",
  "Meeting_Date": "Date",
  "Meeting_Time": "Time",
  "Meeting_City": "City",
  "Meeting_Address": "Address",
  "Quote": "Quote",
};

const meetingElementIDs = [
  "Client_ID_Meeting",
  "CMJ_Type_ID_Meeting",
  "MJ_Status_ID_Meeting",
  "Meeting_Date",
  "Meeting_Time",
  "Meeting_Address",
  "Meeting_City",
  "Meeting_Zip",
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

const meetingEditableDropdowns = {"meetingStatus": "MJ_Status"};
const jobEditableDropdowns = {"jobStatus": "MJ_Status", "jobDescription": "Job_Description"};

const meetingRoute = "/dashboard/meeting";
const jobRoute = "/dashboard/job";

const MeetingPage = new TableFormWrapper(
  meetingColumns,
  meetingRoute,
  meetingElementIDs,
  meetingModularIDs,
  meetingEditableDropdowns,
  "meetingFormModal",
);
const JobPage = new TableFormWrapper(
  jobColumns,
  jobRoute,
  jobElementIDs,
  jobModularIDs,
  jobEditableDropdowns,
  "jobFormModal",
);

document.addEventListener("DOMContentLoaded", () => {
  JobPage.constructTable();
  MeetingPage.constructTable(false);
  MeetingPage.createDropdownListeners();
  JobPage.createDropdownListeners();
});

document
  .getElementById("search-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const search = document.getElementById("search").value;
    MeetingPage.refreshTable();
    JobPage.refreshTable();
    MeetingPage.search(search);
    JobPage.search(search, false);
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
    MeetingPage.refreshTable();
    JobPage.refreshTable();
    MeetingPage.updateRow();
    JobPage.updateRow();
    JobPage.redrawTable();
    MeetingPage.redrawTable(false);
  });
});

document.querySelectorAll(".delete-btn").forEach((button) => {
  button.addEventListener("click", async function () {
    MeetingPage.refreshTable();
    JobPage.refreshTable();
    MeetingPage.deleteRow();
    JobPage.deleteRow();
    JobPage.redrawTable();
    MeetingPage.redrawTable(false);
  });
});
