import { Form } from "./form.js";
import { Table } from "./table.js";

export class TableFormWrapper {
  constructor(columns, route, elementIDs, modularIDs, editableDropdowns = {}, formName = "formModal") {
    this.columns = columns;
    this.route = route;
    this.elementIDs = elementIDs;
    this.modularIDs = modularIDs;
    this.formName = formName;

    this.searchTerm = "";

    this.form = new Form(this.elementIDs, this.modularIDs, this.route, editableDropdowns, this.formName);
  }

  // PUBLIC METHODS

  async search(search, header = true) {
    this.searchTerm = search;
    // this.#refreshTable();
    await this.table.constructTable(this.searchTerm, header);
  }

  createDropdownListeners() {
    this.form.createDropdownListeners();
  }

  updateDropdowns(input) {
    this.form.updateDropdowns(input);
  }

  openForm() {
    this.form.openNewForm();
  }

  closeForm() {
    this.form.closeForm();
  }

  updateRow() {
    this.form.updateRow();
    // this.#refreshTable();
  }

  deleteRow() {
    this.form.deleteRow();
    // this.#refreshTable();
  }

  constructTable(includeHeader = true) {
    this.table = new Table(
      this.columns,
      this.route,
      this.elementIDs,
      this.modularIDs,
      this.form,
    );
    this.table.constructTable(this.searchTerm, includeHeader);
  }

  redrawTable(header = true) {
    this.table.constructTable(this.searchTerm, header);
  }

  // PRIVATE METHODS
  refreshTable() {
    if (this.table) {
      this.table.clearTable();
    }
  }
}
