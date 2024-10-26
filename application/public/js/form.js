// Form delcaration module

export class Form {
  constructor(
    elementIDs,
    modularIDs,
    route,
    editableDropdowns = {},
    formName = "formModal",
  ) {
    this.elementIDs = elementIDs;
    this.modularIDs = modularIDs;
    this.route = route;
    this.id = -1;
    this.formName = formName;
    this.editableDropdowns = editableDropdowns;

    this.formModal = new bootstrap.Modal(
      document.getElementById(`${formName}`),
    );
  }

  // PUBLIC METHODS

  async openNewForm() {
    this.resetID();
    this.#clearForm();
    await this.#fetchTableKeys();

    this.formModal.show();
  }

  createDropdownListeners() {
    if (Object.keys(this.editableDropdowns).length === 0) {
      return;
    }
    for (const key in this.editableDropdowns) {
      document
        .getElementById(
          `add${key.charAt(0).toUpperCase() + key.slice(1)}Button`,
        )
        .addEventListener("click", async () => {
          const newDropdown = document.getElementById(
            `add${key.charAt(0).toUpperCase() + key.slice(1)}`,
          ).value;
          document.getElementById(
            `add${key.charAt(0).toUpperCase() + key.slice(1)}`,
          ).value = "";
          await this.#updateDropdowns(this.editableDropdowns[key], newDropdown);
          await this.#fetchTableKeys();
        });
      document
        .getElementById(
          `remove${key.charAt(0).toUpperCase() + key.slice(1)}Button`,
        )
        .addEventListener("click", async () => {
          if (confirm("Are you sure you want to delete this item?")) {
            // moderatly spagetti code to remove the dropdown
            const tableToEdit = this.editableDropdowns[key];
            let elementToRemove = this.editableDropdowns[key] + "_ID";
            if (!this.editableDropdowns[key].includes("Job")) {
              if (
                this.formName === "meetingFormModal" ||
                this.formName === "jobFormModal"
              ) {
                // extract the name from the formName
                const index = this.formName.indexOf("Form");
                if (index !== -1) {
                  elementToRemove += "_";
                  elementToRemove +=
                    this.formName.substring(0, index).charAt(0).toUpperCase() +
                    this.formName.substring(0, index).slice(1);
                }
              }
            }
            const selectedElement = document.getElementById(
              `${elementToRemove}`,
            );
            const removeDropdown =
              selectedElement.options[selectedElement.selectedIndex].text;
            await this.#deleteDropdowns(tableToEdit, removeDropdown);
            await this.#fetchTableKeys(); // update the dropdowns
          }
        });
    }
  }

  closeForm() {
    this.resetID();
    this.formModal.hide();
  }

  async openExistingForm() {
    try {
      const response = await fetch(`${this.route}/fill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: this.id }),
      });

      const result = await response.json();
      // open the modal and fill the form with result
      await this.#fetchTableKeys();
      this.formModal.show();

      await this.#fillForm(result);
    } catch (error) {
      console.error("error: ", error);
    }
  }

  async updateRow() {
    const elements = this.elementIDs.map(
      (id) => document.getElementById(id).value,
    );

    if (this.id === -1) {
      await this.#executeQuery("add", elements);
    } else {
      elements.push(this.id);
      await this.#executeQuery("edit", elements);
    }
    this.closeForm();
  }

  async deleteRow() {
    if (document.getElementById(this.formName).classList.contains("show")) {
      if (confirm("Are you sure you want to delete this client?")) {
        // Perform delete action here
        const elements = [this.id];
        await this.#executeQuery("delete", elements);
        this.closeForm();
      }
    }
  }

  updateID(id) {
    this.id = id;
  }

  resetID() {
    this.id = -1;
  }

  // PRIVATE METHODS

  async #updateDropdowns(table, input) {
    try {
      const response = await fetch(`${this.route}/addDropdown`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ table: table, value: input }),
      });
    } catch (error) {
      console.error("error: ", error);
    }
  }

  async #deleteDropdowns(table, input) {
    try {
      const response = await fetch(`${this.route}/deleteDropdown`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ table: table, value: input }),
      });
      if (!response.ok) {
        alert("Cannot delete this item, it is in use");
      }
    } catch (error) {
      console.error("error: ", error);
    }
  }

  async #executeQuery(type, elements) {
    try {
      const response = await fetch(`${this.route}/update/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ elements }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("error: ", error);
    }
  }

  async #fillForm(result) {
    // auto fill the form with data from result
    this.#clearForm();
    const primaryKeys = ["Client_ID", "Employee_ID", "Supplier_ID"];
    let index = 0;
    let jobMeetIdExists = false;
    for (const key in result[0]) {
      if (key === "Job_ID" || key === "Meeting_ID") {
        jobMeetIdExists = true;
        continue;
      } else if (primaryKeys.includes(key) && !jobMeetIdExists) {
        continue;
      }
      const element = document.getElementById(this.elementIDs[index]);
      if (element.tagName === "SELECT") {
        const options = element.options;

        for (let i = 0; i < options.length; i++) {
          if (parseInt(options[i].value) === result[0][key]) {
            element.selectedIndex = i;
            break;
          }
        }
      } else if (element.type === "date") {
        element.value = result[0][key].slice(0, 10);
      } else {
        element.value = result[0][key];
      }
      index++;
    }
  }

  #clearForm() {
    this.elementIDs.forEach((id) => {
      const element = document.getElementById(id);
      if (element.tagName === "SELECT") {
        element.selectedIndex = 0;
      } else {
        element.value = "";
      }
    });
  }

  async #mapIDtoKey(result, element) {
    if (result.length === 0) {
    } else {
      result.forEach((type) => {
        const option = document.createElement("option");
        const keys = Object.keys(type);
        option.value = type[keys[0]];
        if (element.id.includes("Client_ID")) {
          option.text = `${type[keys[4]]} ${type[keys[5]]}`;
        } else {
          option.text = type[keys[1]];
        }
        element.appendChild(option);
      });
    }
  }

  async #fetchTableKeys() {
    try {
      // the returns a two level deep array.
      // The first level contains all of the queries
      // The second level contains each queries objects
      // Technically the objects each contain stuff for a third
      // level too
      const response = await fetch(`${this.route}/tableKeys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // grab result from the array
      const result = await response.json();

      // modular form filling to create all boxes
      let resultsIndex = 0;
      // loop through every id that needs to be changed
      this.modularIDs.forEach((id) => {
        // grab document reference and set to blank
        const documentID = document.getElementById(id);
        documentID.innerHTML = "";

        // call map function to fill the boxes and increment results index
        this.#mapIDtoKey(result[resultsIndex], documentID);
        resultsIndex++;
      });
    } catch (error) {
      console.error("error: ", error);
    }
  }
}
