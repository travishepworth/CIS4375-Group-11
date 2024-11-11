export class Table {
  constructor(columns, route, elementIDs, modularIDs, form) {
    this.columns = columns;
    this.route = route;
    this.elementIDs = elementIDs;
    this.modularIDs = modularIDs;
    this.form = form;
  }

  // PUBLIC METHODS

  async createReportTable(results) {
    const resultsTableHeader = document.getElementById("results-table-header");
    const resultsTableBody = document.getElementById("results-table-body");

    // clear previous results
    resultsTableHeader.innerHTML = "";
    resultsTableBody.innerHTML = "";

    for (const row in results.results) {
      const workingObject = results.results[row];
      const keysArray = Object.keys(workingObject);
      const newRow = resultsTableBody.insertRow();
      if (row === "0") {
        const newHeader = resultsTableHeader.insertRow();
        for (const key in keysArray) {
          const newHeaderCell = newHeader.insertCell();
          newHeaderCell.innerHTML = keysArray[key]
            .replace(/_/g, " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        }
      }
      for (const key in keysArray) {
        // format date on date added cell
        if (
          keysArray[key].toLowerCase().includes("date") &&
          workingObject[keysArray[key]] !== null
        ) {
          workingObject[keysArray[key]] = new Date(
            workingObject[keysArray[key]],
          ).toLocaleDateString();
        }
        const newCell = newRow.insertCell();
        // if to create the header if it is the first row
        newCell.innerHTML = workingObject[keysArray[key]];
      }
    }
  }

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

  async constructBody(result, isEventTable) {
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
        if (!isEventTable) {
          withinWeek = await this.#checkDate(row);
        }
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
        const newCell = newRow.insertCell();
        switch (true) {
          case key === "Job_ID" || key === "Meeting_ID":
            newCell.innerHTML =
              this.form.formName
                .replace("FormModal", "")
                .charAt(0)
                .toUpperCase() +
              this.form.formName.replace("FormModal", "").slice(1);
            break;

          case key === "Client_ID" && jobMeetingTable:
            const clientName = clientNames.find(
              (client) => client.Client_ID === row[key],
            );
            newCell.innerHTML = `${clientName.Client_FName} ${clientName.Client_LName}`;
            break;

          case key.includes("Date"):
            newCell.innerHTML = this.#formatDate(new Date(row[key]));
            break;

          case key.includes("Time"):
            newCell.innerHTML = this.#formatTime(row[key]);
            break;

          case key.includes("Employee_Type_ID"):
            const employeeTypes = await this.#lookupTable("Type", "Employee");
            const employeeType = employeeTypes.find(
              (type) => type.Employee_Type_ID === row[key],
            );
            newCell.innerHTML = employeeType.Employee_Type;
            break;

          case key.includes("Employee_Status_ID"):
            const employeeStatuses = await this.#lookupTable("Status", "Employee");
            const employeeStatus = employeeStatuses.find(
              (status) => status.Emp_Status_ID === row[key],
            );
            newCell.innerHTML = employeeStatus.Employee_Status;
            break;

          case key.includes("Supp_Type_ID"):
            const supplierTypes = await this.#lookupTable("Type", "Supplier");
            const supplierType = supplierTypes.find(
              (type) => type.Supp_Type_ID === row[key],
            );
            newCell.innerHTML = supplierType.Supplier_Type;
            break;

          case key.includes("Supplier_Status_ID"):
            const supplierStatuses = await this.#lookupTable("Status", "Supplier");
            const supplierStatus = supplierStatuses.find(
              (status) => status.Supplier_Status_ID === row[key],
            );
            newCell.innerHTML = supplierStatus.Supplier_Status;
            break;

          case key.includes("Client_Type_ID"):
            const clientTypes = await this.#lookupTable("Type", "Client");
            const clientType = clientTypes.find(
              (type) => type.Client_Type_ID === row[key],
            );
            newCell.innerHTML = clientType.Client_Type;
            break;

          case key.includes("Client_Status_ID"):
            const clientStatuses = await this.#lookupTable("Status", "Client");
            const clientStatus = clientStatuses.find(
              (status) => status.Client_Status_ID === row[key],
            );
            newCell.innerHTML = clientStatus.Client_Status;
            break;

          case (key === "Quote" || key === "Job_Profit") && jobMeetingTable:
            if (this.form.formName.includes("meeting")) {
              const quote = row[key];
              const charge = row["Est_Cost"];
              newCell.innerHTML = quote - charge;
            } else if (this.form.formName.includes("job")) {
              const charge = row["Charge"];
              const jobCost = row["Job_Cost"];
              const deposit = row["Prev_Deposit"];
              newCell.innerHTML = deposit + charge - jobCost;
            }
            break;

          default:
            console.log("row[key]: ", row);
            newCell.innerHTML = row[key];
            break;
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

  async constructTable(search = "", includeHeader = true, allEvents = false) {
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
        this.constructHeader(true);
      }

      // get data from post request
      const result = await response.json();

      // construct body for the table
      this.constructBody(result, allEvents);
    } catch (error) {
      console.error("error: ", error);
    }
  }

  // PRIVATE METHODS

  #formatTime(time) {
    const hours = parseInt(time.slice(0, 2));
    const minutes = time.slice(3, 5);
    if (hours >= 12) {
      if (hours === 12) {
        return `12:${minutes} PM`;
      }
      return `${hours - 12}:${minutes} PM`;
    } else {
      if (hours === 0) {
        return `12:${minutes} AM`;
      }
      return `${hours}:${minutes} AM`;
    }
  }

  #formatDate(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }

  async #lookupTable(type, route) {
    try {
      const response = await fetch(`/dashboard/${route}/lookupTable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: type }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("error: ", error);
    }
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
