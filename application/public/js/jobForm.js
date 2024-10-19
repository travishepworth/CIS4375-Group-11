import { fetchClientData } from "./search.js";

const columns = [
  "Job_ID",
  "Client_ID",
  "Job_Date",
  "Job_Time",
  "Job_City",
  "Job_Address",
];

const route = "/dashboard/search";

document.addEventListener("DOMContentLoaded", () => {
  fetchClientData("", columns, route);
});

document
  .getElementById("openJobFormButton")
  .addEventListener("click", function () {
    let jobFormModal = new bootstrap.Modal(
      document.getElementById("JobFormModal"),
    );
    jobFormModal.show();
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
