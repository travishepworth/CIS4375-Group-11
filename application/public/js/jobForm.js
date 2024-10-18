document
  .getElementById("openJobFormButton")
  .addEventListener("click", function () {
    var jobFormModal = new bootstrap.Modal(
      document.getElementById("JobFormModal")
    );
    jobFormModal.show();
  });

  document.getElementById("jobMeeting").addEventListener("change", function () {
    var selectedForm = this.value;

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
