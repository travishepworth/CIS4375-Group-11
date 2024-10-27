export class Table {
  constructor(columns, route, elementIDs, modularIDs, form) {
    this.columns = columns;
    this.route = route;
    this.elementIDs = elementIDs;
    this.modularIDs = modularIDs;
    this.form = form;
  }

  // PUBLIC METHODS

  async clearTable() {
    const resultsTableBody = document.getElementById("results-table-body");
    const resultsTableHeader = document.getElementById("results-table-header");
    resultsTableHeader.innerHTML = ``; // Clear previous results
    resultsTableBody.innerHTML = ``; // Clear previous results
  }

  async constructHeader() {
    const resultsTableHeader = document.getElementById("results-table-header");
    const newRow = resultsTableHeader.insertRow();
    for (let key in this.columns) {
      const newCell = newRow.insertCell();
      newCell.innerHTML = this.columns[key];
    }
  }

  async #checkDate(row) {
    for (let key in row) {
      if (key.includes("Date")) {
        // check if the date is in the next week
        const date = new Date(row[key]);
        const today = new Date();
        if (
          date > today &&
          date < new Date(today.setDate(today.getDate() + 7))
        ) {
          // return true if the date is within the next week
          return true;
        }
      }
    }
    // return false otherwise
    return false;
  }

  async constructBody(result) {
    const resultsTableBody = document.getElementById("results-table-body");
    const clientNames = await this.#lookupClientName();
    result.forEach(async (row) => {
      // Limit the number of rows to 20
      const newRow = resultsTableBody.insertRow();
      // make each row clickable
      newRow.addEventListener("click", () => {
        this.form.updateID(row[Object.keys(row)[0]]);
        this.form.openExistingForm();
      });

      let jobMeetingTable = false;

      // default to true to stop breaking on non-job/meeting tables
      let withinWeek = true;
      if (
        this.form.formName.includes("meeting") ||
        this.form.formName.includes("job")
      ) {
        withinWeek = await this.#checkDate(row);
        jobMeetingTable = true;
      }

      // break if the date is not within the next week
      for (let key in this.columns) {
        if (!withinWeek) {
          break;
        }

        // construct the table body based on different cases
        if (key === "Job_ID" || key === "Meeting_ID") {
          // case to print Job or Meeting instead of ID
          const newCell = newRow.insertCell();
          newCell.innerHTML =
            this.form.formName
              .replace("FormModal", "")
              .charAt(0)
              .toUpperCase() +
            this.form.formName.replace("FormModal", "").slice(1);

        } else if (key === "Client_ID" && jobMeetingTable) {
          // Case to print client name instead of ID
          const newCell = newRow.insertCell();
          const clientName = clientNames.find(client => client.Client_ID === row[key]);
          newCell.innerHTML = `${clientName.Client_FName} ${clientName.Client_LName}`;

        } else if (key.includes("Date")) {
          // case to format date
          const newCell = newRow.insertCell();
          newCell.innerHTML = new Date(row[key]).toLocaleDateString();

        } else {
          // default case
          const newCell = newRow.insertCell();
          newCell.innerHTML = row[key];
        }
      }
    });
  }

  async constructTable(search = "", includeHeader = true) {
    try {
      const response = await fetch(`${this.route}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search }),
      });

      // construct header for the table
      if (includeHeader) {
        this.constructHeader();
      }

      // get data from post request
      const result = await response.json();

      // construct body for the table
      this.constructBody(result);
    } catch (error) {
      console.error("error: ", error);
    }
  }

  // PRIVATE METHODS
  
  async #lookupClientName() {
    try {
      const response = await fetch(`/dashboard/clientID`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      return result
    } catch (error) {
      console.error("error: ", error);
    }
  }
}
