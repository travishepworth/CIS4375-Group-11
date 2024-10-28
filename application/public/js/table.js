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

  async constructBody(result) {
    const resultsTableBody = document.getElementById("results-table-body");
    const clientNames = await this.#lookupClientName();
    result.forEach(async (row) => {
      let newRow = resultsTableBody;

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

      if (withinWeek) {
        // insert rows if the date is within the next week or if the table is not a job/meeting table
        newRow = newRow.insertRow();
        // make each row clickable
        newRow.addEventListener("click", () => {
          this.form.updateID(row[Object.keys(row)[0]]);
          this.form.openExistingForm();
        });
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
          const clientName = clientNames.find(
            (client) => client.Client_ID === row[key],
          );
          newCell.innerHTML = `${clientName.Client_FName} ${clientName.Client_LName}`;
        } else if (key.includes("Date")) {
          // case to format date
          const newCell = newRow.insertCell();
          const contents = this.#formatDate(new Date(row[key]));
          // newCell.innerHTML = new Date(row[key]).toLocaleDateString();
          newCell.innerHTML = contents;
        } else if (key.includes("Time")) {
          // case to format time for AM/PM
          const newCell = newRow.insertCell();
          const contents = this.#formatTime(row[key]);
          newCell.innerHTML = contents;
        } else {
          // default case
          const newCell = newRow.insertCell();
          newCell.innerHTML = row[key];
        }
      }
    });
  }

  // sort the table by date and time - kinda scuffed but im over doing all the work so
  async sortTableByDate() {
    const table = document.getElementById("results-table-body");
    const rows = Array.from(table.rows);
    rows.sort((a, b) => {
      const dateA = new Date(`${a.cells[2].innerText} ${a.cells[3].innerText}`);
      const dateB = new Date(`${b.cells[2].innerText} ${b.cells[3].innerText}`);
      return dateA - dateB;
    });
    table.innerHTML = "";
    rows.forEach((row) => table.appendChild(row));
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
      await this.constructBody(result);
    } catch (error) {
      console.error("error: ", error);
    }
  }

  // PRIVATE METHODS
  
  #formatTime(time) {
    const hours = parseInt(time.slice(0, 2));
    const minutes = time.slice(3, 5);
    if (hours > 12) {
      return `${hours - 12}:${minutes} PM`;
    } else {
      return `${hours}:${minutes} AM`;
    }
  }
  
  #formatDate(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }

  async #lookupClientName() {
    try {
      const response = await fetch(`/dashboard/clientID`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("error: ", error);
    }
  }

  async #checkDate(row) {
    for (let key in row) {
      if (key.includes("Date")) {
        // check if the date is in the next week
        const date = new Date(row[key]);
        const today = new Date();
        const yesterday = new Date(today.setDate(today.getDate() - 1));
        if (
          date > yesterday &&
          date < new Date(today.setDate(today.getDate() + 8))
        ) {
          // return true if the date is within the next week
          return true;
        }
      }
    }
    // return false otherwise
    return false;
  }
}
