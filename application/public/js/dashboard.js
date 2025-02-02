import { TableFormWrapper } from "./tableFormWrapper.js";

const jobColumns = {
  Job_ID: "Type",
  Client_ID: "Client",
  Job_Date: "Date",
  Job_Time: "Time",
  Job_City: "City",
  Job_Address: "Address",
  Job_Profit: "Profit / Estimated Profit",
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
  Meeting_ID: "Type",
  Client_ID: "Client_ID",
  Meeting_Date: "Date",
  Meeting_Time: "Time",
  Meeting_City: "City",
  Meeting_Address: "Address",
  Quote: "Quote",
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

const meetingEditableDropdowns = { meetingStatus: "MJ_Status" };
const jobEditableDropdowns = {
  jobStatus: "MJ_Status",
  jobDescription: "Job_Description",
};

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

let allEventsSelected = false;

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("withinSevenDays").classList.add("active");
  await JobPage.constructTable();
  await MeetingPage.constructTable(false);
  MeetingPage.createDropdownListeners();
  JobPage.createDropdownListeners();
  JobPage.sortTableByDate();
});

document
  .getElementById("withinSevenDays")
  .addEventListener("click", async () => {
    MeetingPage.refreshTable();
    JobPage.refreshTable();
    await JobPage.constructTable();
    await MeetingPage.constructTable(false);
    JobPage.sortTableByDate();
    document.getElementById("withinSevenDays").classList.add("active");
    document.getElementById("allEvents").classList.remove("active");
    allEventsSelected = false;
  });

document.getElementById("allEvents").addEventListener("click", async () => {
  allEventsSelected = true;
  MeetingPage.refreshTable();
  JobPage.refreshTable();
  await JobPage.constructTable(true, allEventsSelected);
  await MeetingPage.constructTable(false, allEventsSelected);
  // MeetingPage.refreshTable();
  // JobPage.refreshTable();
  // await JobPage.search("");
  // await MeetingPage.search("", false);
  // JobPage.sortTableByDate();
  document.getElementById("allEvents").classList.add("active");
  document.getElementById("withinSevenDays").classList.remove("active");
});

document
  .getElementById("search-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const search = document.getElementById("search").value;
    MeetingPage.refreshTable();
    JobPage.refreshTable();
    await JobPage.search(search, true, allEventsSelected);
    await MeetingPage.search(search, false, allEventsSelected);
    if (!allEventsSelected) {
      JobPage.sortTableByDate();
    }
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
    await JobPage.redrawTable(true, allEventsSelected);
    await MeetingPage.redrawTable(false, allEventsSelected);
    if (!allEventsSelected) {
      JobPage.sortTableByDate();
    }
  });
});

document.querySelectorAll(".delete-btn").forEach((button) => {
  button.addEventListener("click", async function () {
    MeetingPage.refreshTable();
    JobPage.refreshTable();
    MeetingPage.deleteRow();
    JobPage.deleteRow();
    await JobPage.redrawTable(true, allEventsSelected);
    await MeetingPage.redrawTable(false, allEventsSelected);
    if (!allEventsSelected) {
      JobPage.sortTableByDate();
    }
  });
});
