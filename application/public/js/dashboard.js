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
);
const JobPage = new TableFormWrapper(
  jobColumns,
  jobRoute,
  jobElementIDs,
  jobModularIDs,
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
  .getElementById("btn-close")
  .addEventListener("click", async function () {
    JobPage.closeForm();
    MeetingPage.closeForm();
  });

document
  .getElementById("openJobFormButton")
  .addEventListener("click", function () {
    document.getElementById("jobMeeting").value = "meeting";
    MeetingPage.openForm();
    document.getElementById("jobMeeting").addEventListener("change", function () {
      if (this.value === "job") {
        JobPage.openForm();
        MeetingPage.closeForm();
      } else if (this.value === "meeting") {
        MeetingPage.openForm();
        JobPage.closeForm();
      } });
  });

document
  .getElementById("updateButton")
  .addEventListener("click", async function () {
    const jobMeetingSelect = document.getElementById("jobMeeting");
    if (jobMeetingSelect.value === "job") {
      JobPage.updateRow();
    } else if (jobMeetingSelect.value === "meeting") {
      MeetingPage.updateRow();
    }
  });

document
  .getElementById("deleteButton")
  .addEventListener("click", async function () {
    const jobMeetingSelect = document.getElementById("jobMeeting");
    if (jobMeetingSelect.value === "job") {
      console.log("Job delete");
      JobPage.deleteRow();
    } else if (jobMeetingSelect.value === "meeting") {
      console.log("Meeting delete");
      MeetingPage.deleteRow();
    }
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
