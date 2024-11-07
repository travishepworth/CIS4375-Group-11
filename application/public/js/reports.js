import { Table } from "./table.js";

document.addEventListener("DOMContentLoaded", async () => {});

// if there were more reports, we could create a class for reports
// but we can just build the functions directly in the table class
document
  .getElementById("generateReport")
  .addEventListener("click", async () => {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const reportType = document.getElementById("reportType").value;

    try {
      const response = await fetch(`/reports/generate/${reportType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startDate, endDate, reportType }),
      });
      const data = await response.json();
      new Table().createReportTable(data);
    } catch (error) {
      console.error("error: ", error);
    }
  });
