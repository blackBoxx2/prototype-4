import {Models} from "./Models";
import {DataLib} from "./DataLib";
import { Helpers } from "./Helpers";

export namespace DatabaseLib {
  class ValidationPayload {
    valid: boolean;
    
    validate(): boolean {
      for (let key in this) {
        if (Object.prototype.hasOwnProperty.call(this, key)) {
          if (this[key] === true && key !== "valid") {
            this.valid = false;
          }
        }
      }
      return true;
    }
    getMessage(): string {
      let msg = "";
      for (let key in this) {
        if (Object.prototype.hasOwnProperty.call(this, key)) {
          if (this[key] && key != "valid") {
            msg += `${key} is missing or invalid\n`;
          }
        }
      }
      if (msg == "") {
        msg = "Validation successful";
      }
      return msg;
    }
  }
  
  class QAValidationPayload extends ValidationPayload {
    public process: boolean;
    public productNo: boolean;
    public orderNo: boolean;
    public itemDescription: boolean;
    public defectDescription: boolean;
    public quantityReceived: boolean;
    public quantityDefective: boolean;
    public signedBy: boolean;
    public dateSigned: boolean;
  }

  class ENGValidationPayload extends ValidationPayload {
    public review: boolean;
    public notifyCustomer: boolean;
    public disposition: boolean;
    public updateDrawing: boolean;
    public originalRevNumber: boolean;
    public signedBy: boolean;
    public dateSigned: boolean;
  }

  class PURValidationPayload extends ValidationPayload {
    public decision: boolean;
    public carRaised: boolean;
    public carNo: boolean;
    public followUpRequired: boolean;
    public followUpType: boolean;
    public signedBy: boolean;
    public dateSigned: boolean;
  }
  
  class NCRValidationPayload extends ValidationPayload {
    public ncrNumber: boolean;
    public qualityAssurance: boolean;
    public status: boolean;
  }
  
  function isNullOrEmpty(v: any): boolean {
    return v == null || v == undefined || v == "";
  }

  export class Database {
    public tables: Helpers.DatabaseBase;
    private static Instance: Database;
    
    private constructor() {
      // read data into localStorage
      let dbPayload = DataLib.ReadDataFromLocalStorage(); // seed data occurs in this function if necessary
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
      let dbPayload = DataLib.ReadDataFromLocalStorage(); // seed data occurs in this function if necessary
      if (dbPayload.Success) {
        this.tables = dbPayload.Data!;
        console.log("DATABASE RESEEDED SUCCESSFULLY");
      } else {
        throw ("DATABASE RESEED FAILED");
      }
    }
    

    private ValidateQA(qa: Models.QualityAssurance): QAValidationPayload {
      let payload: QAValidationPayload = new QAValidationPayload();
      if (isNullOrEmpty(qa.Process)) {
        payload.process = true;
      }
      if (isNullOrEmpty(qa.ProductNo)) {
        payload.productNo = true;
      }
      if (isNullOrEmpty(qa.OrderNo)) {
        payload.orderNo = true;
      }
      if (isNullOrEmpty(qa.ItemDescription)) {
        payload.itemDescription = true;
      }
      if (isNullOrEmpty(qa.DefectDescription)) {
        payload.defectDescription = true;
      }
      if (qa.QuantityReceived == null || qa.QuantityReceived <= 0) {
        payload.quantityReceived = true;
      }
      if (qa.QuantityDefective == null || qa.QuantityDefective <= 0) {
        payload.quantityDefective = true;
      }
      if (isNullOrEmpty(qa.SignedByUser)) {
        payload.signedBy = true;
      }
      if (isNullOrEmpty(qa.DateSigned)) {
        payload.dateSigned = true;
      }
      payload.validate();
      return payload;
    }

    private ValidateENG(eng: Models.Engineering): ENGValidationPayload {
      let payload = new ENGValidationPayload();
      if (isNullOrEmpty(eng.Review)) {
        payload.review = true;
      }
      if (eng.NotifyCustomer == null) {
        payload.notifyCustomer = true;
      }
      if (isNullOrEmpty(eng.Disposition)) {
        payload.disposition = true;
      }
      if (eng.UpdateDrawing == null) {
        payload.updateDrawing = true;
      }
      if (isNullOrEmpty(eng.OriginalRevNumber)) {
        payload.originalRevNumber = true;
      }
      if (isNullOrEmpty(eng.SignedByUser)) {
        payload.signedBy = true;
      }
      if (isNullOrEmpty(eng.DateSigned)) {
        payload.dateSigned = true;
      }
      payload.validate();
      return payload;
    }

    private ValidatePUR(purch: Models.Purchasing): PURValidationPayload {
      let payload = new PURValidationPayload();
      if (isNullOrEmpty(purch.Decision)) {
        payload.decision = true;
      }
      if (purch.CARRaised == null) {
        payload.carRaised = true;
      }
      if (purch.CARRaised == true && isNullOrEmpty(purch.CARNo)) {
        payload.carNo = true;
      }
      if (purch.FollowUpRequired == null) {
        payload.followUpRequired = true;
      }
      if (purch.FollowUpRequired == true && isNullOrEmpty(purch.FollowUpType)) {
        payload.followUpType = true;
      }
      if (isNullOrEmpty(purch.SignedByUser)) {
        payload.signedBy = true;
      }
      if (isNullOrEmpty(purch.DateSigned)) {
        payload.dateSigned = true;
      }
      payload.validate();
      return payload;
    }
    private ValidateNCR(ncr: Models.NCRLog): NCRValidationPayload {
      let payload = new NCRValidationPayload();
      if (ncr.NCRNumber == null || ncr.NCRNumber <= 0) {
        payload.ncrNumber = true;
      }
      if (ncr.QualityAssuranceID == null) {
        payload.qualityAssurance = true;
      }
      if (ncr.Status == null) {
        payload.status = true;
      }
      payload.validate();
      return payload;
    }

    public SaveChanges(): void {
      localStorage.setItem("Database", JSON.stringify(Database.get().tables));
    }

    public GetQAByID(ID: number): Models.QualityAssurance {
      let item = Database.get().tables.QualityAssurances.find((item: Models.QualityAssurance) => {
        if (item.ID == ID) {
          return true;
        }
          return false;
        }
      );
      if (!item) {
        throw "GET ERROR\n\nQA not found";
      }
      return item;
    }
    public GetENGByID(ID: number): Models.Engineering {
      let item = Database.get().tables.Engineerings.find((item: Models.Engineering) => {
        if (item.ID == ID) {
          return true;
        }
          return false;
        }
      );
      if (!item) {
        throw "GET ERROR\n\nENG not found";
      }
      return item;
    }
    public GetPURByID(ID: number): Models.Purchasing {
      let item = Database.get().tables.Purchasings.find((item: Models.Purchasing) => {
        if (item.ID == ID) {
          return true;
        }
          return false;
        }
      );
      if (!item) {
        throw "GET ERROR\n\nPUR not found";
      }
      return item;
    }
    public GetNCRByID(ID: number): Models.NCRLog {
      let item = Database.get().tables.NCRLogs.find((item: Models.NCRLog) => {
        if (item.ID == ID) {
          return true;
        }
          return false;
        }
      );
      if (!item) {
        throw "GET ERROR\n\nNCR not found";
      }
      return item;
    }
    public GetNCRByNumber(ID: number): Models.NCRLog {
      let item = Database.get().tables.NCRLogs.find((item: Models.NCRLog) => {
        if (item.NCRNumber == ID) {
          return true;
        }
          return false;
        }
      );
      if (!item) {
        throw "GET ERROR\n\n Item not found";
      }
      return item;
    }
    public FindRow(obj: Models.ModelBase): number {
      return obj.ID-1;
    }

   

    public InsertQA(qa: Models.QualityAssurance): void {
      let validationResult = this.ValidateQA(qa);
      if (!validationResult.valid) {
        let msg = "VALIDATION ERROR\n\n" + validationResult.getMessage();
        console.log(validationResult.getMessage());
        throw msg;
      }
      qa.ID = Database.get().tables.QualityAssurances.length + 1; // IDs start at 1
      Database.get().tables.QualityAssurances.push(qa); // does not inherently save changes
      console.log("INSERT SUCCESSFUL");
    }

    public RemoveQA(ID: number): void {
      let db = Database.get();
      let items = db.tables.QualityAssurances.filter((item: Models.QualityAssurance) => {
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
      db.tables.QualityAssurances = items; // does not inherently save changes
      console.log("DELETE SUCCESSFUL");
    }

    public UpdateQA(qa: Models.QualityAssurance): void {
      let db = Database.get();
      db.tables.QualityAssurances[this.FindRow(qa)] = qa; // does not inherently save changes
      console.log("UPDATE SUCCESSFUL");
    }

    public InsertEng(eng: Models.Engineering): void {
      let validationResult = this.ValidateENG(eng);
      if (!validationResult.valid) {
        let msg = "VALIDATION ERROR\n\n" + validationResult.getMessage();
        console.log(validationResult.getMessage());
        throw msg;
      }
      eng.ID = Database.get().tables.QualityAssurances.length + 1; // IDs start at 1
      Database.get().tables.Engineerings.push(eng); // does not inherently save changes, call SaveChanges()
      console.log("INSERT SUCCESSFUL");
    }
    public UpdateEng(eng: Models.Engineering): void {
      let db = Database.get();
      db.tables.Engineerings[this.FindRow(eng)] = eng;
      console.log("UPDATE SUCCESSFUL");
    }
    public RemoveEng(ID: number): void {
      let db = Database.get();
      // get every item that does not match the ID
      let items = db.tables.Engineerings.filter((item: Models.Engineering) => {
        if (item.ID != ID) {
          return true;
        }
          return false;
        }
      );
      if (items.length == db.tables.Engineerings.length) {
        throw "DELETE ERROR\n\n Item not found";
      } // if there was not an item removed
      if (items.length != db.tables.Engineerings.length - 1) { // if there was more than 1 item removed
        throw "DELETE ERROR\n\n Too many matches found";
      }
      db.tables.Engineerings = items;
      console.log("DELETE SUCCESSFUL");
    }
    public InsertPurch(purch: Models.Purchasing): void {
      let validationResult = this.ValidatePUR(purch);
      if (!validationResult.valid) {
        let msg = "VALIDATION ERROR\n\n" + validationResult.getMessage();
        console.log(validationResult.getMessage());
        throw msg;
      }
      purch.ID = Database.get().tables.Purchasings.length + 1; // IDs start at 1
      Database.get().tables.Purchasings.push(purch); // does not inherently save changes, call SaveChanges()
      console.log("INSERT SUCCESSFUL");
    }
    public UpdatePurch(purch: Models.Purchasing): void {
      let db = Database.get();
      db.tables.Purchasings[this.FindRow(purch)] = purch;
      console.log("UPDATE SUCCESSFUL");
    }
    public RemovePurch(ID: number): void {
      let db = Database.get();
      // get every item that does not match the ID
      let items = db.tables.Purchasings.filter((item: Models.Purchasing) => {
        if (item.ID != ID) {
          return true;
        }
          return false;
        }
      );
      if (items.length == db.tables.Purchasings.length) {
        throw "DELETE ERROR\n\n Item not found";
      } // if there was not an item removed
      if (items.length != db.tables.Purchasings.length - 1) { // if there was more than 1 item removed
        throw "DELETE ERROR\n\n Too many matches found";
      }
      db.tables.Purchasings = items;
      console.log("DELETE SUCCESSFUL");
    }
    public InsertNCR(ncr: Models.NCRLog): void {
      let validationResult = this.ValidateNCR(ncr);
      if (!validationResult.valid) {
        let msg = "VALIDATION ERROR\n\n" + validationResult.getMessage();
        console.log(validationResult.getMessage());
        throw msg;
      }
      ncr.ID = Database.get().tables.NCRLogs.length + 1; // IDs start at 1
      Database.get().tables.NCRLogs.push(ncr); // does not inherently save changes, call SaveChanges()
      console.log("INSERT SUCCESSFUL");
    }
    public UpdateNCR(ncr: Models.NCRLog): void {
      let db = Database.get();
      db.tables.NCRLogs[this.FindRow(ncr)] = ncr;
      console.log("UPDATE SUCCESSFUL");
    }
    public RemoveNCR(ID: number): void {
      let db = Database.get();
      // get every item that does not match the ID
      let items = db.tables.NCRLogs.filter((item: Models.NCRLog) => {
        if (item.ID != ID) {
          return true;
        }
          return false;
        }
      );
      if (items.length == db.tables.NCRLogs.length) {
        throw "DELETE ERROR\n\n Item not found";
      } // if there was not an item removed
      if (items.length != db.tables.NCRLogs.length - 1) { // if there was more than 1 item removed
        throw "DELETE ERROR\n\n Too many matches found";
      }
      db.tables.NCRLogs = items;
      console.log("DELETE SUCCESSFUL");
    }
    public GetUsersInQA(): Models.User[] {
      return Database.get().tables.Users.filter((user: Models.User) => {
        return user.Roles.QA;
      });
    }
    public GetUsersInENG(): Models.User[] {
      return Database.get().tables.Users.filter((user: Models.User) => {
        return user.Roles.Engineer;
      });
    }
    public GetUsersInPUR(): Models.User[] {
      return Database.get().tables.Users.filter((user: Models.User) => {
        return user.Roles.Purchasing;
      });
    }
    public GetUsersInAdmin(): Models.User[] {
      return Database.get().tables.Users.filter((user: Models.User) => {
        return user.Roles.Admin;
      });
    }
    public GetSupplierByID(ID: number): Models.Supplier {
      let found = Database.get().tables.Suppliers.find((supplier: Models.Supplier) => {
        if (supplier.ID == ID) {
          return true;
        }
        return false;
      });
      if (!found) {
        throw ("GET ERROR\n\n Supplier not found");
      }
      return found;
    }
    public GetUserByID(ID: number): Models.User {
      let found = Database.get().tables.Users.find((user: Models.User) => {
        if (user.ID == ID) {
          return true;
        }
        return false;
      });
      if (!found) {
        throw ("GET ERROR\n\n User not found");
      }
      return found;
    }

  }
}

