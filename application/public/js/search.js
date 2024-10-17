import { openExistingForm } from "./methods.js";

export let currentClientID = -1;

export function refreshClientID() {
  currentClientID = -1;
  return;
}

// Client side js to send post request and render table of results
export const fetchClientData = async (search = "", columns = [], route) => {
  // send a post request and wait for a response
  try {
    const response = await fetch(route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ search }),
    });

    // Construct table header
    const resultsTableHeader = document.getElementById("results-table-header");
    resultsTableHeader.innerHTML = '';
    const newRow = resultsTableHeader.insertRow();
    columns.forEach((data) => {
      data.replace("Client", "");
      const newCell = newRow.insertCell();
      newCell.innerHTML = data.replace(/^[^_]+_/, "").replace("_", " ");
    });

    // get data from post request
    const result = await response.json();

    // Select element and clear results
    const resultsTableBody = document.getElementById("results-table-body");
    resultsTableBody.innerHTML = ``; // Clear previous results

    if (result.length === 0) {
      // Set table if nothing is found
      const emptyColumns = columns.length;
      resultsTableBody.innerHTML = `<tr><td colspan="${emptyColumns}" class="text-center">No data found.</td></tr>`;
    } else {
      // Construct the table based on data
      result.forEach((row) => {
        const newRow = resultsTableBody.insertRow();
        // make each row clickable
        newRow.addEventListener("click", function () {
          currentClientID = row.Client_ID;
          openExistingForm("clients/fill", row.Client_ID);
        });
        columns.forEach((data) => {
          const newCell = newRow.insertCell();
          newCell.innerHTML = row[data];
        });
      });
    }
  } catch (error) {
    console.error("error: ", error);
  }
};
