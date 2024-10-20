import { Form } from "./form.js";
import { Table } from "./table.js";

export class TableFormWrapper {
  constructor(columns, route, elementIDs, modularIDs) {
    this.columns = columns;
    this.route = route;
    this.elementIDs = elementIDs;
    this.modularIDs = modularIDs;

    this.searchTerm = "";

    this.form = new Form(this.elementIDs, this.modularIDs, this.route);
  }

  // PUBLIC METHODS

  async search(search) {
    this.searchTerm = search;
    await this.table.constructTable(this.searchTerm);
  }

  openForm() {
    this.form.openNewForm();
  }

  closeForm() {
    this.form.closeForm();
  }

  updateRow() {
    this.form.updateRow();
    this.#refreshTable();
  }

  deleteRow() {
    this.form.deleteRow();
    this.#refreshTable();
  }

  constructTable() {
    this.table = new Table(
      this.columns,
      this.route,
      this.elementIDs,
      this.modularIDs,
      this.form,
    );
    this.table.constructTable();
  }

  // PRIVATE METHODS
  #refreshTable() {
    if (this.table) {
      this.table.constructTable(this.searchTerm);
    }
  }
}
