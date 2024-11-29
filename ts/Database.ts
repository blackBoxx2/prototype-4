import {Models} from "./Models";
import {DataLib} from "./DataLib";
import { Helpers } from "./Helpers";

export namespace DatabaseLib {
  interface ValidationPayload {
    valid: boolean;
    validate(): void;
  }
  function ValidatePayload(payload: ValidationPayload): boolean {
    for (var key in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        if (payload[key] === true && key !== "valid") {
          return false;
        }
      }
    }
    return true;
  }
  class QAValidationPayload implements ValidationPayload {
    valid: boolean;
    process: boolean;
    productNo: boolean;
    orderNo: boolean;
    itemDescription: boolean;
    defectDescription: boolean;
    quantityReceived: boolean;
    quantityDefective: boolean;
    signedBy: boolean;
    dateSigned: boolean;
    validate(): void {
      this.valid = ValidatePayload(this);
    }

    getMessage(): string {
      var msg = "";
      for (var key in this) {
        if (Object.prototype.hasOwnProperty.call(this, key)) {
          if (this[key] && key != "valid") {
            msg += `${key} is required\n`;
          }
        }
      }
      if (msg == "") {
        msg = "Validation successful";
      }
      return msg;
    }
  }
  
  export class Database {
    public tables: Helpers.DatabaseBase;
    private static Instance: Database;
    
    private constructor() {
      // read data into localStorage
      var dbPayload = DataLib.ReadDataFromLocalStorage(); // seed data occurs in this function if necessary
      if (dbPayload.Success) {
        this.tables = dbPayload.Data!;
      } else {
        throw ("DATABASE CREATION FAILED");
      }
    }

    public static get(): Database {
      if (!this.Instance) {
        console.log("Creating new Database instance, attempting read from localStorage");
        Database.Instance = new Database();
      }
      return Database.Instance;
    }

    public ReSeed(): void {
      localStorage.removeItem("Database");
      var dbPayload = DataLib.ReadDataFromLocalStorage(); // seed data occurs in this function if necessary
      if (dbPayload.Success) {
        this.tables = dbPayload.Data!;
        console.log("DATABASE RESEEDED SUCCESSFULLY");
      } else {
        throw ("DATABASE RESEED FAILED");
      }
    }
    

    public ValidateQA(qa: Models.QualityAssurance): QAValidationPayload {
      var payload: QAValidationPayload = new QAValidationPayload();
      if (qa.Process == null) {
        payload.process = true;
      }
      if (qa.ProductNo == null || qa.ProductNo == "") {
        payload.productNo = true;
      }
      if (qa.OrderNo == null || qa.OrderNo == "") {
        payload.orderNo = true;
      }
      if (qa.ItemDescription == null || qa.ItemDescription == "") {
        payload.itemDescription = true;
      }
      if (qa.DefectDescription == null || qa.DefectDescription == "") {
        payload.defectDescription = true;
      }
      if (qa.QuantityReceived == null || qa.QuantityReceived < 0) {
        payload.quantityReceived = true;
      }
      if (qa.QuantityDefective == null || qa.QuantityDefective < 0) {
        payload.quantityDefective = true;
      }
      if (qa.SignedBy == null || qa.SignedBy == "") {
        payload.signedBy = true;
      }
      if (qa.DateSigned == null) {
        payload.dateSigned = true;
      }
      payload.validate();
      return payload;
    }

    public SaveChanges(): void {
      localStorage.setItem("Database", JSON.stringify(Database.Instance.tables));
    }

    public GetQAByID(ID: number): number {
      return Database.Instance.tables.QualityAssurances.findIndex((item: Models.QualityAssurance) => {
        if (item.ID == ID) {
          return true;
        }
          return false;
        }
      );
    }

    public InsertQA(qa: Models.QualityAssurance): void {
      var validationResult = this.ValidateQA(qa);
      if (!validationResult.valid) {
        var msg = "VALIDATION ERROR\n\n" + validationResult.getMessage();
        console.log(validationResult.getMessage());
        throw msg;
      }
      qa.ID = Database.Instance.tables.QualityAssurances.length + 1;
      Database.Instance.tables.QualityAssurances.push(qa);
    }

    public RemoveQA(ID: number): boolean {
      var db = Database.Instance;
      var items = db.tables.QualityAssurances.filter((item: Models.QualityAssurance) => {
        if (item.ID != ID) {
          return true;
        }
          return false;
        }
      );
      if (items.length == db.tables.QualityAssurances.length) {
        throw "DELETE ERROR\n\n Item not found";
      } // if there was not an item removed
      if (items.length != db.tables.QualityAssurances.length - 1) { // if there was more than 1 item removed
        throw "DELETE ERROR\n\n Too many matches found";
      }
      db.tables.QualityAssurances = items;
      return true;
    }

    public UpdateQA(qa: Models.QualityAssurance): void {
      var db = Database.Instance;
      var index = this.GetQAByID(qa.ID);
      db.tables.QualityAssurances[index] = qa;
    }

    public InsertEng(eng: Models.Engineering): void {

    }
    public UpdateEng(eng: Models.Engineering): void {

    }
    public RemoveEng(ID: number): void {

    }
    public InsertPurch(purch: Models.Purchasing): void {

    }
    public UpdatePurch(purch: Models.Purchasing): void {

    }
    public RemovePurch(ID: number): void {

    }
    public InsertNCR(ncr: Models.NCRLog): void {

    }
    public UpdateNCR(ncr: Models.NCRLog): void {

    }
    public RemoveNCR(ID: number): void {
    }
  }
}

