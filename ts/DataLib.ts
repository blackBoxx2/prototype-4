import { Helpers } from "./Helpers";
import {Models} from "./Models";

export namespace DataLib {
  const signatures = [
    "John Doe",
    "Jane Doe",
    "Frank Smith",
    "Carl Davis",
    "Sue Johnson",
    "Mike Abernacle",
    "Linda Smith",
    "Tommy Bobbert",
    "Sally McNichols",
    "Jill Hildon",
    "Bobby Shmurda",
    "Kurt Kristie",
    "Cathy Karl"
  ]
  // identical to the tables present in Database.ts
  class TableSet extends Helpers.DatabaseBase {
    constructor() {
      super();
    }
  }

  export class DBPayload {
    public Success: boolean;
    public Data: TableSet | null;

    public static Failure(): DBPayload {
      return {Success: false, Data: null};
    }

    public static Success(data: TableSet): DBPayload {
      return {Success: true, Data: data};
    }

  }

  function CheckMissing(): DBPayload {
    var db = localStorage.getItem("Database");
    if (db == null) {
      return DBPayload.Failure();
    };
    return DBPayload.Success(JSON.parse(db) as TableSet);
  }

  function SeedQA(): Models.QualityAssurance[] {
    var defects = [
      "Scratched",
      "Dented",
      "Cracked",
      "Missing Part",
      "Discoloration",
      "Misalignment",
      "Incorrect Part",
      "Poor paint quality",
      "Poor weld quality",
      "Poor assembly quality",
      "Poor machining quality",
      "Poor casting quality",
    ]
    var itemDescs  = {
      "1020-1881": "20mm screw",
      "1102-1837":"30mm screw",
      "4842-2582":"10mm nail",
      "9472-8482":"30mm nail",
      "3741-4723":"30mm bolt",
      "8562-7452":"10mm nut",
      "8668-1642":"sheet metal",
      "7154-1648":"aluminum plate",
      "7528-1746":"steel plate",
      "7751-7741":"plastic casing",
      "8122-1354":"metal casing",
      "9834-7525":"metal bracket",
      "2983-3372":"2x4 wood",
      "4563-9382":"2x6 wood",
      "7562-3558":"4x8 wood",
      "8172-3847":"4x10 wood",
      "9281-3842":"plywood",
      "9182-9931":"mdf board",
      "7562-1826":"particle board"
    }

    var OrderNos = [
      "12342817",
      "23455436",
      "34563432",
      "14562172",
      "25122678",
      "86788389",
      "72314890",
      "89045136",
      "90010682",
      "02981233",
      "12312948",
      "23434789",
      "34561890",
      "45678901",
      "56789012",
      "02746357",
      "31375413",
      "89129741",
      "90129256",
      "22234567",
      "14647571",
      "09356743",
      "02083273",
      "12746367",
      "30182732",
      "31234574",
      "29841621",
    ];
    var qas: Models.QualityAssurance[] = [];
    var startDate = new Date("2020-01-01");
    for (var i = 0; i < OrderNos.length; i++) {
      var qa = new Models.QualityAssurance();
      if (Math.random() > 0.50) {
        qa.Process = Models.Process.SupplierOrRecInsp;
      } else {
        qa.Process = Models.Process.WIP;
      }
      var choice = Math.floor(Math.random() * Object.keys(itemDescs).length);
      qa.ID = i+1;
      qa.ProductNo = Object.keys(itemDescs)[choice];
      qa.OrderNo = OrderNos[i];
      qa.ItemDescription = itemDescs[qa.ProductNo];
      qa.DefectDescription = defects[Math.floor(Math.random() *defects.length)];
      qa.QuantityReceived = Math.floor(Math.random() * 100);
      qa.QuantityDefective = Math.floor(Math.random() * qa.QuantityReceived);
      qa.SignedBy = signatures[Math.floor(Math.random() * signatures.length)];
      qa.DateSigned = startDate;
      startDate.setDate(startDate.getDate() + 8);
      qas.push(qa);
    } 
    return qas;
  }

  function SeedEng() : Models.Engineering[] | null {
    var qas_raw = localStorage.getItem("QA");
    if (qas_raw == null) { // should never happen
      console.log("WTF!");
      return null;
    }
    var qas: Models.QualityAssurance[] = JSON.parse(qas_raw);
    var engs: Models.Engineering[] = [];
    var eng = new Models.Engineering();
    for (var i = 0; i < Math.floor(qas.length / 2); i++) {
      var choice = Math.random();
      if (choice > 0.75) {
        eng.Review = Models.Review.UseAsIs;

      } else if (choice > 0.5) {
        eng.Review = Models.Review.Repair;

      } else if (choice > 0.25) {
        eng.Review = Models.Review.Rework;

      } else {
        eng.Review = Models.Review.Scrap;

      }
      var choice2 = Math.random();
      if (choice2 > 0.5) {
        eng.NotifyCustomer = false;
      } else {
        eng.NotifyCustomer = true;
      }
      var lipsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
      var choice3 = Math.floor(Math.random() * lipsum.length);
      eng.Disposition = lipsum.slice(0, choice3);
      var choice4 = Math.random();
      if (choice4 > 0.5) {
        eng.UpdateDrawing = true;
      } else {
        eng.UpdateDrawing = false;
      }
      eng.OriginalRevNumber = "1";
      eng.LatestRevNumber = "1";
      eng.SignedBy = signatures[Math.floor(Math.random() * signatures.length)];
      eng.DateSigned = new Date(qas[i].DateSigned);
      eng.DateSigned.setDate(eng.DateSigned.getDate() + 1);
      engs.push(eng);
    }
    return engs;
  }
  function SeedPurch(): Models.Purchasing[] | null {
    var engs: Models.Engineering[] = JSON.parse(localStorage.getItem("Engineering") || "[]");
    if (engs.length == 0) {
      console.log("WTF!");
      return null;
    }
    var purchs: Models.Purchasing[] = [];
    for (var i = 0; i < Math.floor(engs.length / 2); i++) {
      var purch = new Models.Purchasing();
      purch.CARNo = "CAR-" + Math.floor(Math.random() * 1000);
      purch.CARRaised = true;
      var choice = Math.random();
      if (choice > 0.75) {
        purch.Decision = Models.Decision.ReturnToSupplier;
      } else if (choice > 0.5) {
        purch.Decision = Models.Decision.ReworkInHouse;
      } else if (choice > 0.25) {
        purch.Decision = Models.Decision.ScrapInHouse;
      } else {
        purch.Decision = Models.Decision.DeferToEng;
      }
      var choice2 = Math.random();
      if (choice2 > 0.5) {
        purch.FollowUpRequired = false;
      } else {
        purch.FollowUpRequired = true;
      }
      if (purch.FollowUpRequired) {
        var choice3 = Math.random();
        if (choice3 > 0.75) {
          purch.FollowUpType = "Inquiry";
        } else if (choice3 > 0.5) {
          purch.FollowUpType = "Correction";
        } else if (choice3 > 0.25) {
          purch.FollowUpType = "Verification";
        } else {
          purch.FollowUpType = "Other";
        }
      }
      purch.SignedBy = signatures[Math.floor(Math.random() * signatures.length)];
      purch.DateSigned = new Date(engs[i].DateSigned);
      purch.DateSigned.setDate(purch.DateSigned.getDate() + 1);
      purchs.push(purch);
    }
    return purchs;
  }

  function SeedNCR() {
    var qas = JSON.parse(localStorage.getItem("QA") || "[]");
    var engs = JSON.parse(localStorage.getItem("Engineering") || "[]");
    var purchs = JSON.parse(localStorage.getItem("Purchasing") || "[]");
    var ncrs: Models.NCRLog[] = [];
    if (qas.length == 0 || engs.length == 0 || purchs.length == 0) {
      console.log("WTF!");
      return null;
    }
    for (var i = 0; i < qas.length; i++) {
      var ncr = new Models.NCRLog();
      ncr.NCRNumber = i+1;
      ncr.QualityAssurance = qas[i];
      ncr.Engineering = engs[i] || null;
      ncr.Purchasing = purchs[i] || null;
      if (ncr.Engineering == null) {
        ncr.Status = Models.Status.Engineering;
      } else if (ncr.Purchasing == null) {
        ncr.Status = Models.Status.Purchasing;
      } else {
        ncr.Status = Models.Status.Closed;
      }
      ncrs.push(ncr);
    }
    return ncrs;
  }

  // put seed data into localStorage if not there already
  export function ReadDataFromLocalStorage(): DBPayload {
    var dbPayload: DBPayload = CheckMissing();
    if (dbPayload.Success == false) { // missing DB in LocalStorage 
      console.log("SEEDING DATA. THIS MEANS THE DATABASE HAS BEEN DELETED OR IS MISSING.");
      dbPayload.Data = new TableSet();
      var qas = SeedQA();
      localStorage.setItem("QA", JSON.stringify(qas));
      console.log("QA Seeded");
      var engs = SeedEng();
      if (engs == null) {
        return DBPayload.Failure();
      }
      localStorage.setItem("Engineering", JSON.stringify(engs));
      console.log("Engineering Seeded");

      var purchs = SeedPurch();
      if (purchs == null) {
        return DBPayload.Failure();
      }
      localStorage.setItem("Purchasing", JSON.stringify(purchs));
      console.log("Purchasing Seeded");

      var ncrs = SeedNCR();
      if (ncrs == null) {
        return DBPayload.Failure();
      }
      console.log("NCRLog Seeded");

      dbPayload.Data.QualityAssurances = qas;
      dbPayload.Data.Engineerings = engs;
      dbPayload.Data.Purchasings = purchs;
      dbPayload.Data.NCRLogs = ncrs;
      localStorage.setItem("Database", JSON.stringify(dbPayload.Data)); 
      console.log("Database saved to LocalStorage");
    }
    dbPayload.Success = true;
    return dbPayload;
  }
}