"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataLib = void 0;
var Helpers_1 = require("./Helpers");
var Models_1 = require("./Models");
var DataLib;
(function (DataLib) {
    // identical to the tables present in Database.ts
    var TableSet = /** @class */ (function (_super) {
        __extends(TableSet, _super);
        function TableSet() {
            return _super.call(this) || this;
        }
        return TableSet;
    }(Helpers_1.Helpers.DatabaseBase));
    var DBPayload = /** @class */ (function () {
        function DBPayload() {
        }
        DBPayload.Failure = function () {
            return { Success: false, Data: null };
        };
        DBPayload.Success = function (data) {
            return { Success: true, Data: data };
        };
        return DBPayload;
    }());
    DataLib.DBPayload = DBPayload;
    function CheckMissing() {
        var db = localStorage.getItem("Database");
        if (db == null) {
            return DBPayload.Failure();
        }
        ;
        return DBPayload.Success(JSON.parse(db));
    }
    function SeedQA() {
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
        ];
        var itemDescs = {
            "1020-1881": "20mm screw",
            "1102-1837": "30mm screw",
            "4842-2582": "10mm nail",
            "9472-8482": "30mm nail",
            "3741-4723": "30mm bolt",
            "8562-7452": "10mm nut",
            "8668-1642": "sheet metal",
            "7154-1648": "aluminum plate",
            "7528-1746": "steel plate",
            "7751-7741": "plastic casing",
            "8122-1354": "metal casing",
            "9834-7525": "metal bracket",
            "2983-3372": "2x4 wood",
            "4563-9382": "2x6 wood",
            "7562-3558": "4x8 wood",
            "8172-3847": "4x10 wood",
            "9281-3842": "plywood",
            "9182-9931": "mdf board",
            "7562-1826": "particle board"
        };
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
        var users = JSON.parse(sessionStorage.getItem("UsersTemp") || "[]");
        if (users.length == 0) {
            throw ("SEEDING FAILURE\n\nUsers not seeded before QA");
        }
        // only allow QA to sign these
        users = users.filter(function (user) {
            return user.Roles.QA;
        });
        if (users.length == 0) {
            throw ("SEEDING FAILURE\n\nNo members of QA");
        }
        var suppliers = JSON.parse(sessionStorage.getItem("SuppliersTemp") || "[]");
        var qas = [];
        var startDate = new Date("2020-01-01");
        for (var i = 0; i < OrderNos.length; i++) {
            var proc = void 0;
            if (Math.random() > 0.50) {
                proc = Models_1.Models.Process.SupplierOrRecInsp;
            }
            else {
                proc = Models_1.Models.Process.WIP;
            }
            var choice = Math.floor(Math.random() * Object.keys(itemDescs).length);
            var productNo = Object.keys(itemDescs)[choice];
            var orderNo = OrderNos[i];
            var supplierID = suppliers[Math.floor(Math.random() * suppliers.length)].ID;
            var itemDescription = itemDescs[productNo];
            var defectDescription = defects[Math.floor(Math.random() * defects.length)];
            var quantityReceived = Math.floor(Math.random() * 100);
            var quantityDefective = Math.floor(Math.random() * quantityReceived);
            var signedByUser = users[Math.floor(Math.random() * users.length)].ID;
            var dateSigned = startDate;
            var qa = new Models_1.Models.QualityAssurance(proc, productNo, orderNo, supplierID, itemDescription, defectDescription, quantityReceived, quantityDefective, signedByUser, dateSigned);
            qa.ID = i + 1; // would be handled by Insert otherwise
            var newDate = new Date(startDate);
            newDate.setDate(startDate.getDate() + 8);
            startDate = newDate;
            qas.push(qa);
        }
        return qas;
    }
    function SeedEng() {
        var qas_raw = sessionStorage.getItem("QA");
        if (qas_raw == null) { // should never happen
            console.log("WTF!");
            return null;
        }
        var users = JSON.parse(sessionStorage.getItem("UsersTemp") || "[]");
        if (users.length == 0) {
            throw ("SEEDING FAILURE\n\nUsers not seeded before ENG");
        }
        users = users.filter(function (user) {
            return user.Roles.Engineer;
        });
        if (users.length == 0) {
            throw ("SEEDING FAILURE\n\nNo members of ENG");
        }
        var qas = JSON.parse(qas_raw);
        var engs = [];
        for (var i = 0; i < Math.floor(qas.length / 2); i++) {
            var review = void 0;
            var choice = Math.random();
            if (choice > 0.75) {
                review = Models_1.Models.Review.UseAsIs;
            }
            else if (choice > 0.5) {
                review = Models_1.Models.Review.Repair;
            }
            else if (choice > 0.25) {
                review = Models_1.Models.Review.Rework;
            }
            else {
                review = Models_1.Models.Review.Scrap;
            }
            var notifyCustomer = void 0;
            var choice2 = Math.random();
            if (choice2 > 0.5) {
                notifyCustomer = false;
            }
            else {
                notifyCustomer = true;
            }
            var lipsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
            var choice3 = Math.floor(Math.random() * lipsum.length);
            var disposition = lipsum.slice(0, choice3);
            var choice4 = Math.random();
            var updateDrawing = void 0;
            if (choice4 > 0.5) {
                updateDrawing = true;
            }
            else {
                updateDrawing = false;
            }
            var originalRevNumber = "1";
            var latestRevNumber = "1";
            var signedByUser = users[Math.floor(Math.random() * users.length)].ID;
            var dateSigned = new Date(qas[i].DateSigned);
            dateSigned.setDate(dateSigned.getDate() + 1);
            var eng = new Models_1.Models.Engineering(review, notifyCustomer, disposition, updateDrawing, originalRevNumber, latestRevNumber, signedByUser, dateSigned);
            eng.ID = i + 1;
            engs.push(eng);
        }
        return engs;
    }
    function SeedPurch() {
        var engs = JSON.parse(sessionStorage.getItem("Engineering") || "[]");
        if (engs.length == 0) {
            console.log("WTF!");
            return null;
        }
        var users = JSON.parse(sessionStorage.getItem("UsersTemp") || "[]");
        if (users.length == 0) {
            throw ("SEEDING FAILURE\n\nUsers not seeded before PUR");
        }
        users = users.filter(function (user) {
            return user.Roles.Purchasing;
        });
        if (users.length == 0) {
            throw ("SEEDING FAILURE\n\nNo members of PUR");
        }
        var purchs = [];
        for (var i = 0; i < Math.floor(engs.length / 2); i++) {
            var carRaisedChoice = Math.random();
            var carRaised = false;
            if (carRaisedChoice > 0.5) {
                carRaised = true;
            }
            var carNo = null;
            if (carRaised) {
                carNo = "CAR-" + Math.floor(Math.random() * 1000);
            }
            var choice = Math.random();
            var decision = void 0;
            if (choice > 0.75) {
                decision = Models_1.Models.Decision.ReturnToSupplier;
            }
            else if (choice > 0.5) {
                decision = Models_1.Models.Decision.ReworkInHouse;
            }
            else if (choice > 0.25) {
                decision = Models_1.Models.Decision.ScrapInHouse;
            }
            else {
                decision = Models_1.Models.Decision.DeferToEng;
            }
            var choice2 = Math.random();
            var followUpRequired = void 0;
            if (choice2 > 0.5) {
                followUpRequired = false;
            }
            else {
                followUpRequired = true;
            }
            var followUpType = "";
            if (followUpRequired) {
                var choice3 = Math.random();
                if (choice3 > 0.75) {
                    followUpType = "Inquiry";
                }
                else if (choice3 > 0.5) {
                    followUpType = "Correction";
                }
                else if (choice3 > 0.25) {
                    followUpType = "Verification";
                }
                else {
                    followUpType = "Other";
                }
            }
            var reInspectAcceptable = true; // to save us headache of new ncr number
            var newNCRNumber = null;
            if (!reInspectAcceptable) {
                newNCRNumber = JSON.parse(sessionStorage.getItem("QA") || "[]").length + 1;
            }
            var qualityDept = "Purchasing";
            var signedByUser = users[Math.floor(Math.random() * users.length)].ID;
            var dateSigned = new Date(engs[i].DateSigned);
            dateSigned.setDate(dateSigned.getDate() + 1);
            var purch = new Models_1.Models.Purchasing(decision, carRaised, carNo, followUpRequired, followUpType, reInspectAcceptable, newNCRNumber, qualityDept, signedByUser, dateSigned);
            purch.ID = i + 1;
            purchs.push(purch);
        }
        return purchs;
    }
    function SeedNCR() {
        var qas = JSON.parse(sessionStorage.getItem("QA") || "[]");
        var engs = JSON.parse(sessionStorage.getItem("Engineering") || "[]");
        var purchs = JSON.parse(sessionStorage.getItem("Purchasing") || "[]");
        var ncrs = [];
        if (qas.length == 0 || engs.length == 0 || purchs.length == 0) {
            console.log("WTF!");
            return null;
        }
        for (var i = 0; i < qas.length; i++) {
            var ncrNumber = i + 1;
            var qualityAssuranceID = qas[i].ID;
            var engineeringID = engs[i] == null ? null : engs[i].ID;
            var purchasingID = purchs[i] == null ? null : purchs[i].ID;
            var status_1 = void 0;
            if (engineeringID == null) {
                status_1 = Models_1.Models.Status.Engineering;
            }
            else if (purchasingID == null) {
                status_1 = Models_1.Models.Status.Purchasing;
            }
            else {
                status_1 = Models_1.Models.Status.Closed;
            }
            var ncr = new Models_1.Models.NCRLog(ncrNumber, qualityAssuranceID, engineeringID, purchasingID, status_1);
            ncr.ID = i + 1;
            ncrs.push(ncr);
        }
        return ncrs;
    }
    function SeedSuppliers() {
        var names = [
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
        var id = 1;
        var suppliers = [];
        names.forEach(function (name) {
            var supplier = new Models_1.Models.Supplier();
            supplier.ID = id;
            supplier.Name = name;
            id++;
            suppliers.push(supplier);
        });
        return suppliers;
    }
    function SeedUsers() {
        var signatures = [
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
        ];
        var users = [];
        var id = 1;
        signatures.forEach(function (signature) {
            var user = new Models_1.Models.User();
            user.ID = id;
            user.DigitalSignature = signature;
            user.Email = signature.toLowerCase().replace(" ", "_") + "@email.com";
            var rolesToAdd = [];
            var roles = Math.random();
            var amtRoles = Math.random();
            // basic role distribution
            if (roles > 0.66) {
                rolesToAdd.push(Models_1.Models.Role.Purchasing);
            }
            else if (roles > 0.33) {
                rolesToAdd.push(Models_1.Models.Role.Engineer);
            }
            else {
                rolesToAdd.push(Models_1.Models.Role.QualityAssurance);
            }
            // additional roles distribution
            if (amtRoles > 0.90) {
                while (rolesToAdd.length < 3) {
                    var role = Math.floor(Math.random() * 3) + 1;
                    if (!rolesToAdd.includes(role)) {
                        rolesToAdd.push(role);
                    }
                }
            }
            else if (amtRoles > 0.80) {
                while (rolesToAdd.length < 2) {
                    var role = Math.floor(Math.random() * 3) + 1;
                    if (!rolesToAdd.includes(role)) {
                        rolesToAdd.push(role);
                    }
                }
            }
            // admin role distribution
            if (Math.random() > 0.95 || rolesToAdd.includes(Models_1.Models.Role.Admin)) {
                // overwrite other roles if admin
                rolesToAdd = [
                    Models_1.Models.Role.Admin,
                    Models_1.Models.Role.Engineer,
                    Models_1.Models.Role.Purchasing,
                    Models_1.Models.Role.QualityAssurance
                ];
            }
            user.Roles = new Models_1.Models.RoleClaim(rolesToAdd.includes(Models_1.Models.Role.QualityAssurance), rolesToAdd.includes(Models_1.Models.Role.Engineer), rolesToAdd.includes(Models_1.Models.Role.Purchasing), rolesToAdd.includes(Models_1.Models.Role.Admin));
            users.push(user);
            id++;
        });
        // ensure at least one of each role is created
        if (users.filter(function (user) { return user.Roles.QA; }).length == 0) {
            users[Math.floor(users.length * Math.random())].Roles.QA = true;
        }
        if (users.filter(function (user) { return user.Roles.Engineer; }).length == 0) {
            users[Math.floor(users.length * Math.random())].Roles.Engineer = true;
        }
        if (users.filter(function (user) { return user.Roles.Purchasing; }).length == 0) {
            users[Math.floor(users.length * Math.random())].Roles.Purchasing = true;
        }
        if (users.filter(function (user) { return user.Roles.Admin; }).length == 0) {
            users[Math.floor(users.length * Math.random())].Roles.Admin = true;
        }
        return users;
    }
    // put seed data into localStorage if not there already
    function ReadDataFromLocalStorage() {
        var dbPayload = CheckMissing();
        if (dbPayload.Success == false) { // missing DB in LocalStorage 
            console.log("SEEDING DATA. THIS MEANS THE DATABASE HAS BEEN DELETED OR IS MISSING.");
            dbPayload.Data = new TableSet();
            var users = SeedUsers(); // must come first as the other tables use the User table
            if (users == null) {
                return DBPayload.Failure();
            }
            sessionStorage.setItem("UsersTemp", JSON.stringify(users));
            console.log("Users seeded");
            var suppliers = SeedSuppliers(); // must come before QA because they use suppliers
            if (suppliers == null) {
                return DBPayload.Failure();
            }
            sessionStorage.setItem("SuppliersTemp", JSON.stringify(suppliers));
            console.log("Suppliers seeded");
            var qas = SeedQA();
            sessionStorage.setItem("QA", JSON.stringify(qas));
            console.log("QA Seeded");
            var engs = SeedEng();
            if (engs == null) {
                return DBPayload.Failure();
            }
            sessionStorage.setItem("Engineering", JSON.stringify(engs));
            console.log("Engineering Seeded");
            var purchs = SeedPurch();
            if (purchs == null) {
                return DBPayload.Failure();
            }
            sessionStorage.setItem("Purchasing", JSON.stringify(purchs));
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
            dbPayload.Data.Users = users;
            dbPayload.Data.Suppliers = suppliers;
            localStorage.setItem("Database", JSON.stringify(dbPayload.Data));
            console.log("Database saved to LocalStorage");
        }
        dbPayload.Success = true;
        return dbPayload;
    }
    DataLib.ReadDataFromLocalStorage = ReadDataFromLocalStorage;
})(DataLib || (exports.DataLib = DataLib = {}));
