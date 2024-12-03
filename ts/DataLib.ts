import { Helpers } from "./Helpers";
import {Models} from "./Models";

export namespace DataLib {
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
    let db = localStorage.getItem("Database");
    if (db == null) {
      return DBPayload.Failure();
    };
    return DBPayload.Success(JSON.parse(db) as TableSet);
  }

  function SeedQA(): Models.QualityAssurance[] {
    let defects = [
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
    let itemDescs  = {
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

    let OrderNos = [
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
    let users: Models.User[] = JSON.parse(sessionStorage.getItem("UsersTemp") || "[]");
    if (users.length == 0) {
      throw ("SEEDING FAILURE\n\nUsers not seeded before QA");
    }
    // only allow QA to sign these
    users = users.filter((user: Models.User) => {
      return user.Roles.QA;
    });
    if (users.length == 0) {
      throw ("SEEDING FAILURE\n\nNo members of QA");
    }
    let suppliers: Models.Supplier[] = JSON.parse(sessionStorage.getItem("SuppliersTemp") || "[]");
    let qas: Models.QualityAssurance[] = [];
    let startDate = new Date("2020-01-01");
    for (let i = 0; i < OrderNos.length; i++) {
      let proc;
      if (Math.random() > 0.50) {
        proc = Models.Process.SupplierOrRecInsp;
      } else {
        proc = Models.Process.WIP;
      }
      let choice = Math.floor(Math.random() * Object.keys(itemDescs).length);
      let productNo = Object.keys(itemDescs)[choice];
      let orderNo = OrderNos[i]; 
      let supplierID = suppliers[Math.floor(Math.random() * suppliers.length)].ID;
      let itemDescription = itemDescs[productNo];
      let defectDescription = defects[Math.floor(Math.random() *defects.length)];
      let quantityReceived = Math.floor(Math.random() * 100);
      let quantityDefective = Math.floor(Math.random() * quantityReceived);
      let signedByUser = (users[Math.floor(Math.random() * users.length)] as Models.User).ID;
      let dateSigned = startDate;
      let qa = new Models.QualityAssurance(
        proc, productNo, orderNo, 
        supplierID, itemDescription, defectDescription, 
        quantityReceived, quantityDefective, signedByUser, 
        dateSigned
      );
      qa.ID = i+1; // would be handled by Insert otherwise
      let newDate = new Date(startDate);
      newDate.setDate(startDate.getDate() + 8);
      startDate = newDate;
      qas.push(qa);
    } 
    return qas;
  }

  function SeedEng() : Models.Engineering[] | null {
    let qas_raw = sessionStorage.getItem("QA");
    if (qas_raw == null) { // should never happen
      console.log("WTF!");
      return null;
    }
    let users: Models.User[] = JSON.parse(sessionStorage.getItem("UsersTemp") || "[]");
    if (users.length == 0) {
      throw ("SEEDING FAILURE\n\nUsers not seeded before ENG");
    }
    users = users.filter((user: Models.User) => {
      return user.Roles.Engineer;
    });
    if (users.length == 0) {
      throw ("SEEDING FAILURE\n\nNo members of ENG");
    }
    let qas: Models.QualityAssurance[] = JSON.parse(qas_raw);
    let engs: Models.Engineering[] = [];
    for (let i = 0; i < Math.floor(qas.length / 2); i++) {
      let review: Models.Review;
      let choice = Math.random();
      if (choice > 0.75) {
        review = Models.Review.UseAsIs;

      } else if (choice > 0.5) {
        review = Models.Review.Repair;

      } else if (choice > 0.25) {
        review = Models.Review.Rework;

      } else {
        review = Models.Review.Scrap;
      }
      let notifyCustomer: boolean;
      let choice2 = Math.random();
      if (choice2 > 0.5) {
        notifyCustomer = false;
      } else {
        notifyCustomer = true;
      }
      let lipsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
      let choice3 = Math.floor(Math.random() * lipsum.length);
      let disposition = lipsum.slice(0, choice3);
      let choice4 = Math.random();
      let updateDrawing: boolean;
      if (choice4 > 0.5) {
        updateDrawing = true;
      } else {
        updateDrawing = false;
      }
      let originalRevNumber = "1";
      let latestRevNumber = "1";
      let signedByUser = (users[Math.floor(Math.random() * users.length)] as Models.User).ID;
      let dateSigned = new Date(qas[i].DateSigned);
      dateSigned.setDate(dateSigned.getDate() + 1);
      let eng = new Models.Engineering(
        review, 
        notifyCustomer, 
        disposition, 
        updateDrawing, 
        originalRevNumber, 
        latestRevNumber, 
        signedByUser, 
        dateSigned
      );
      eng.ID = i+1;
      engs.push(eng);
    }
    return engs;
  }
  function SeedPurch(): Models.Purchasing[] | null {
    let engs: Models.Engineering[] = JSON.parse(sessionStorage.getItem("Engineering") || "[]");
    if (engs.length == 0) {
      console.log("WTF!");
      return null;
    }
    let users: Models.User[] = JSON.parse(sessionStorage.getItem("UsersTemp") || "[]");
    if (users.length == 0) {
      throw ("SEEDING FAILURE\n\nUsers not seeded before PUR");
    }
    users = users.filter((user: Models.User) => {
      return user.Roles.Purchasing;
    });
    if (users.length == 0) {
      throw ("SEEDING FAILURE\n\nNo members of PUR");
    }
    let purchs: Models.Purchasing[] = [];
    for (let i = 0; i < Math.floor(engs.length / 2); i++) {
      let carRaisedChoice = Math.random();
      let carRaised: boolean = false;
      if (carRaisedChoice > 0.5) {
        carRaised = true;
      }
      let carNo: string | null = null;
      if (carRaised) {
        carNo = "CAR-" + Math.floor(Math.random() * 1000);
      }
      let choice = Math.random();
      let decision: Models.Decision;
      if (choice > 0.75) {
        decision = Models.Decision.ReturnToSupplier;
      } else if (choice > 0.5) {
        decision = Models.Decision.ReworkInHouse;
      } else if (choice > 0.25) {
        decision = Models.Decision.ScrapInHouse;
      } else {
        decision = Models.Decision.DeferToEng;
      }
      let choice2 = Math.random();
      let followUpRequired: boolean;
      if (choice2 > 0.5) {
        followUpRequired = false;
      } else {
        followUpRequired = true;
      }
      let followUpType = "";
      if (followUpRequired) {
        let choice3 = Math.random();
        if (choice3 > 0.75) {
          followUpType = "Inquiry";
        } else if (choice3 > 0.5) {
          followUpType = "Correction";
        } else if (choice3 > 0.25) {
          followUpType = "Verification";
        } else {
          followUpType = "Other";
        }
      }
      let reInspectAcceptable = true; // to save us headache of new ncr number

      let newNCRNumber = null;
      if (!reInspectAcceptable) {
        newNCRNumber = JSON.parse(sessionStorage.getItem("QA") || "[]").length + 1;
      }
      let qualityDept = "Purchasing";
      let signedByUser = (users[Math.floor(Math.random() * users.length)] as Models.User).ID;
      let dateSigned = new Date(engs[i].DateSigned);
      dateSigned.setDate(dateSigned.getDate() + 1);
      let purch = new Models.Purchasing(
        decision, 
        carRaised, 
        carNo, 
        followUpRequired, 
        followUpType, 
        reInspectAcceptable,
        newNCRNumber,
        qualityDept,
        signedByUser, 
        dateSigned
      );
      purch.ID = i+1;
      purchs.push(purch);
    }
    return purchs;
  }

  function SeedNCR() {
    let qas: Models.QualityAssurance[] = JSON.parse(sessionStorage.getItem("QA") || "[]");
    let engs: Models.Engineering[] = JSON.parse(sessionStorage.getItem("Engineering") || "[]");
    let purchs: Models.Purchasing[] = JSON.parse(sessionStorage.getItem("Purchasing") || "[]");
    let ncrs: Models.NCRLog[] = [];
    if (qas.length == 0 || engs.length == 0 || purchs.length == 0) {
      console.log("WTF!");
      return null;
    }
    for (let i = 0; i < qas.length; i++) {
      let ncrNumber = i+1;
      let qualityAssuranceID = qas[i].ID;
      let engineeringID = engs[i] == null ? null : engs[i].ID;
      let purchasingID = purchs[i] == null ? null : purchs[i].ID;
      let status: Models.Status;
      if (engineeringID == null) {
        status = Models.Status.Engineering;
      } else if (purchasingID == null) {
        status = Models.Status.Purchasing;
      } else {
        status = Models.Status.Closed;
      }
      let ncr = new Models.NCRLog(
        ncrNumber, 
        qualityAssuranceID, 
        engineeringID, 
        purchasingID,
        status);
      ncr.ID = i+1;
      ncrs.push(ncr);
    }
    return ncrs;
  }

  function SeedSuppliers() {
    let names = [
      "Green Supply Logistics",
      "Lumberjack Supply Co.",
      "Metalworks Inc.",
      "Plastic Parts Co.",
      "Screws and Bolts Inc.",
      "Nails and Rivets Co.",
      "Bolt Makers Ltd.",
      "John & Dale's Warehouse",
      "Damien's Hardware"
    ];
    let id = 1;
    let suppliers: Models.Supplier[] = [];
    names.forEach((name) => {
      let supplier = new Models.Supplier();
      supplier.ID = id;
      supplier.Name = name;
      id++; 
      suppliers.push(supplier);
    });
    return suppliers;
  }

  function SeedUsers() {
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
      "Cathy Karl",
      "Richard James",
      "Marty McFly",
      "Doc Brown",
      "James Bond",
      "Jason Bourne",
      "Clark Kent",
      "Bruce Wayne",
      "Peter Parker",
      "Tony Stark",
      "Steve Rogers",
      "Natasha Romanoff",
      "Bruce Banner",
      "Fred Flintstone",
      "Barney Rubble",
      "George Jetson",
      "Homer Simpson",
      "Marge Simpson",
      "Bart Simpson",
      "Lisa Simpson",
      "Peter Griffin",
      "Lois Griffin",
      "Meg Griffin",
      "Chris Griffin"
    ]
    let users: Models.User[] = [];
    let id = 1;
    signatures.forEach((signature) => {
      let user = new Models.User();
      user.ID = id;
      user.DigitalSignature = signature;
      user.Email = signature.toLowerCase().replace(" ", "_") + "@email.com";
      let rolesToAdd: number[] = [];
      let roles = Math.random();
      let amtRoles = Math.random();

      // basic role distribution
      if (roles > 0.66) {
        rolesToAdd.push(Models.Role.Purchasing);
      } else if (roles > 0.33) {
        rolesToAdd.push(Models.Role.Engineer);
      } else {
        rolesToAdd.push(Models.Role.QualityAssurance);
      }
      // additional roles distribution
      if (amtRoles > 0.90) {
        while (rolesToAdd.length < 3) {
          let role = Math.floor(Math.random() * 3) + 1;
          if (!rolesToAdd.includes(role)) {
            rolesToAdd.push(role);
          }
        }
      } else if (amtRoles > 0.80) {
        while (rolesToAdd.length < 2) {
          let role = Math.floor(Math.random() * 3) + 1;
          if (!rolesToAdd.includes(role)) {
            rolesToAdd.push(role);
          }
        }
      }
      
      // admin role distribution
      if (Math.random() > 0.95 || rolesToAdd.includes(Models.Role.Admin)) {
        // overwrite other roles if admin
        rolesToAdd = [
          Models.Role.Admin, 
          Models.Role.Engineer, 
          Models.Role.Purchasing, 
          Models.Role.QualityAssurance
        ];
      }
      user.Roles = new Models.RoleClaim(
        rolesToAdd.includes(Models.Role.QualityAssurance),
        rolesToAdd.includes(Models.Role.Engineer),
        rolesToAdd.includes(Models.Role.Purchasing),
        rolesToAdd.includes(Models.Role.Admin)
      );
      users.push(user);
      id++;
    });
    // ensure at least one of each role is created
    if (users.filter((user) => user.Roles.QA).length == 0) {
      users[Math.floor(users.length * Math.random())].Roles.QA = true;
    }
    if (users.filter((user) => user.Roles.Engineer).length == 0) {
      users[Math.floor(users.length * Math.random())].Roles.Engineer = true;
    }
    if (users.filter((user) => user.Roles.Purchasing).length == 0) {
      users[Math.floor(users.length * Math.random())].Roles.Purchasing = true;
    }
    if (users.filter((user) => user.Roles.Admin).length == 0) {
      users[Math.floor(users.length * Math.random())].Roles.Admin = true;
    }
    return users;
  }

  // put seed data into localStorage if not there already
  export function ReadDataFromLocalStorage(): DBPayload {
    let dbPayload: DBPayload = CheckMissing();
    if (dbPayload.Success == false) { // missing DB in LocalStorage 
      console.log("SEEDING DATA. THIS MEANS THE DATABASE HAS BEEN DELETED OR IS MISSING.");
      dbPayload.Data = new TableSet();

      let users = SeedUsers(); // must come first as the other tables use the User table
      if (users == null) {
        return DBPayload.Failure();
      }
      sessionStorage.setItem("UsersTemp", JSON.stringify(users));
      console.log("Users seeded");

      let suppliers = SeedSuppliers(); // must come before QA because they use suppliers
      if (suppliers == null) {
        return DBPayload.Failure();
      }
      sessionStorage.setItem("SuppliersTemp", JSON.stringify(suppliers));
      console.log("Suppliers seeded");

      let qas: Models.QualityAssurance[] = SeedQA();
      sessionStorage.setItem("QA", JSON.stringify(qas));
      console.log("QA Seeded");

      let engs: Models.Engineering[] | null = SeedEng();
      if (engs == null) {
        return DBPayload.Failure();
      }
      sessionStorage.setItem("Engineering", JSON.stringify(engs));
      console.log("Engineering Seeded");

      let purchs: Models.Purchasing[] | null = SeedPurch();
      if (purchs == null) {
        return DBPayload.Failure();
      }
      sessionStorage.setItem("Purchasing", JSON.stringify(purchs));
      console.log("Purchasing Seeded");

      let ncrs = SeedNCR();
      if (ncrs == null) {
        return DBPayload.Failure();
      }
      console.log("NCRLog Seeded");
      dbPayload.Data.QualityAssurances = qas;
      dbPayload.Data.Engineerings = engs;
      dbPayload.Data.Purchasings = purchs;
      dbPayload.Data.NCRLogs = ncrs;
      dbPayload.Data.Users = users;
      dbPayload.Data.Suppliers = suppliers;
      localStorage.setItem("Database", JSON.stringify(dbPayload.Data)); 
      console.log("Database saved to LocalStorage");
    }
    dbPayload.Success = true;
    return dbPayload;
  }
}