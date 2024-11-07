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
  convertToMilltaryString(search,Timeregex) {
    const match = search.match(Timeregex);
    // Extract the hour, minute, and period (AM/PM)
    let hour = parseInt(match[1], 10);
    const minute = match[2] || "00";
    const period = match[3];   
    // Convert hour based on AM/PM
    if ((period === "PM" || period === "pm") && hour !== 12) {
        hour += 12;
    } else if ((period === "AM" || period === "am") && hour === 12) {
        hour = 0;
    }
    // Format time to milltary exluding AM or PM
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  }

  convertDateString(search,Dateregex) {
    const match = search.match(Dateregex);
    // Extracts month and day
    let month = match[1];
    let day = match[2];
    // Adds a 0 if needed to both month and day
    if (month.length === 1){
      month = `0${month}`
    }
    if (day.length === 1){
      day = `0${day}`
    }
    //returns string output
    
    return `${month}-${day}`;
    // return `${month}-${day}-${match[3]}`; !! Full return when year is working in the application
  }
  
  async search(search, header = true, allEvents = false) {
    const Timeregex = /^(0?[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM|am|pm)$/;
    const Dateregex = /^(0?[1-9]|1[0-2])-(0?[1-9]|1[0-9]|2[0-9]|3[01])$/;
    // const Dateregex = /^(0?[1-9]|1[0-2])-(0?[1-9]|1[0-9]|2[0-9]|3[01])-(\d{4})$/; !! Full dateregex when year is working in the application
    if (Timeregex.test(search) == true){
      search = this.convertToMilltaryString(search,Timeregex)
    }
    if (Dateregex.test(search)){
      search = this.convertDateString(search,Dateregex)
    }
    this.searchTerm = search;
    await this.table.constructTable(this.searchTerm, header, allEvents);
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
  
  sortTableByDate() {
    this.table.sortTableByDate();
  }

  async constructTable(includeHeader = true, allEvents = false) {
    this.table = new Table(
      this.columns,
      this.route,
      this.elementIDs,
      this.modularIDs,
      this.form,
    );
    await this.table.constructTable(this.searchTerm, includeHeader, allEvents);
  }

  async redrawTable(header = true, allEvents = false) {
    await this.table.constructTable(this.searchTerm, header, allEvents);
  }

  // PRIVATE METHODS
  refreshTable() {
    if (this.table) {
      this.table.clearTable();
    }
  }
}
