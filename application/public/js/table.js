export class Table {
  constructor(columns, route, elementIDs, modularIDs, form) {
    this.columns = columns;
    this.route = route;
    this.elementIDs = elementIDs;
    this.modularIDs = modularIDs;
    this.form = form;
  }

  // PUBLIC METHODS

  async constructTable(search = "") {
    try {
      const response = await fetch(`${this.route}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search }),
      });

      // Construct table header
      const resultsTableHeader = document.getElementById(
        "results-table-header",
      );
      resultsTableHeader.innerHTML = "";
      const newRow = resultsTableHeader.insertRow();
      this.columns.forEach((data) => {
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
        const emptyColumns = this.columns.length;
        resultsTableBody.innerHTML = `<tr><td colspan="${emptyColumns}" class="text-center">No data found.</td></tr>`;
      } else {
        // Construct the table based on data
        let totalRows = 0;
        result.forEach((row) => {
          // Limit the number of rows to 20
          if (totalRows > 19) {
            return;
          }
          const newRow = resultsTableBody.insertRow();
          // make each row clickable
          newRow.addEventListener("click", () => {
            // currentClientID = row.Client_ID;
            this.form.updateID(row.Client_ID);
            // CHANGE THIS ---------------->
            this.form.openExistingForm();
          });
          this.columns.forEach((data) => {
            const newCell = newRow.insertCell();
            newCell.innerHTML = row[data];
          });
          totalRows++;
        });
      }
    } catch (error) {
      console.error("error: ", error);
    }
  }

  // PRIVATE METHODS
}
