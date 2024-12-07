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
exports.DatabaseLib = void 0;
var DataLib_1 = require("./DataLib");
var DatabaseLib;
(function (DatabaseLib) {
    var ValidationPayload = /** @class */ (function () {
        function ValidationPayload() {
        }
        ValidationPayload.prototype.validate = function () {
            this.valid = true;
            for (var key in this) {
                if (Object.prototype.hasOwnProperty.call(this, key)) {
                    if (key !== "valid" && this[key] === true) {
                        this.valid = false;
                        break;
                    }
                }
            }
            return this.valid;
        };
        ValidationPayload.prototype.getMessage = function () {
            var msg = "";
            for (var key in this) {
                if (Object.prototype.hasOwnProperty.call(this, key)) {
                    if (this[key] && key != "valid") {
                        msg += "".concat(key, " is missing or invalid\n");
                    }
                }
            }
            if (msg == "") {
                msg = "Validation successful";
            }
            return msg;
        };
        return ValidationPayload;
    }());
    var QAValidationPayload = /** @class */ (function (_super) {
        __extends(QAValidationPayload, _super);
        function QAValidationPayload() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return QAValidationPayload;
    }(ValidationPayload));
    var ENGValidationPayload = /** @class */ (function (_super) {
        __extends(ENGValidationPayload, _super);
        function ENGValidationPayload() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ENGValidationPayload;
    }(ValidationPayload));
    var PURValidationPayload = /** @class */ (function (_super) {
        __extends(PURValidationPayload, _super);
        function PURValidationPayload() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return PURValidationPayload;
    }(ValidationPayload));
    var NCRValidationPayload = /** @class */ (function (_super) {
        __extends(NCRValidationPayload, _super);
        function NCRValidationPayload() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return NCRValidationPayload;
    }(ValidationPayload));
    function isNullOrEmpty(v) {
        return v == null || v == undefined || v == "";
    }
    var Database = /** @class */ (function () {
        function Database() {
            // read data into localStorage
            var dbPayload = DataLib_1.DataLib.ReadDataFromLocalStorage(); // seed data occurs in this function if necessary
            if (dbPayload.Success) {
                this.tables = dbPayload.Data;
            }
            else {
                throw ("DATABASE CREATION FAILED");
            }
        }
        Database.get = function () {
            if (!this.Instance) {
                console.log("Creating new Database instance, attempting read from localStorage");
                Database.Instance = new Database();
            }
            return Database.Instance;
        };
        Database.prototype.ReSeed = function () {
            localStorage.removeItem("Database");
            var dbPayload = DataLib_1.DataLib.ReadDataFromLocalStorage(); // seed data occurs in this function if necessary
            if (dbPayload.Success) {
                this.tables = dbPayload.Data;
                console.log("DATABASE RESEEDED SUCCESSFULLY");
            }
            else {
                throw ("DATABASE RESEED FAILED");
            }
        };
        Database.prototype.ValidateQA = function (qa) {
            var payload = new QAValidationPayload();
            if (isNullOrEmpty(qa.Process)) {
                payload.process = true;
            }
            if (isNullOrEmpty(qa.ProductNo)) {
                payload.productNo = true;
            }
            if (isNullOrEmpty(qa.OrderNo)) {
                payload.orderNo = true;
            }
            if (isNullOrEmpty(qa.SupplierID)) {
                payload.supplierID = true;
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
        };
        Database.prototype.ValidateENG = function (eng) {
            var payload = new ENGValidationPayload();
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
        };
        Database.prototype.ValidatePUR = function (purch) {
            var payload = new PURValidationPayload();
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
            if (isNullOrEmpty(purch.ReInspectAcceptable)) {
                payload.reInspectAcceptable = true;
            }
            if (purch.ReInspectAcceptable == false && (purch.NewNCRNumber == null || purch.NewNCRNumber <= 0)) {
                payload.newNCRNumber = true;
            }
            if (isNullOrEmpty(purch.QualityDept)) {
                payload.qualityDept = true;
            }
            if (isNullOrEmpty(purch.SignedByUser)) {
                payload.signedBy = true;
            }
            if (isNullOrEmpty(purch.DateSigned)) {
                payload.dateSigned = true;
            }
            payload.validate();
            return payload;
        };
        Database.prototype.ValidateNCR = function (ncr) {
            var payload = new NCRValidationPayload();
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
        };
        Database.prototype.SaveChanges = function () {
            localStorage.setItem("Database", JSON.stringify(Database.get().tables));
        };
        Database.prototype.GetQAByID = function (ID) {
            var item = Database.get().tables.QualityAssurances.find(function (item) {
                if (item.ID == ID) {
                    return true;
                }
                return false;
            });
            if (!item) {
                throw "GET ERROR\n\nQA not found";
            }
            return item;
        };
        Database.prototype.GetENGByID = function (ID) {
            var item = Database.get().tables.Engineerings.find(function (item) {
                if (item.ID == ID) {
                    return true;
                }
                return false;
            });
            if (!item) {
                throw "GET ERROR\n\nENG not found";
            }
            return item;
        };
        Database.prototype.GetPURByID = function (ID) {
            var item = Database.get().tables.Purchasings.find(function (item) {
                if (item.ID == ID) {
                    return true;
                }
                return false;
            });
            if (!item) {
                throw "GET ERROR\n\nPUR not found";
            }
            return item;
        };
        Database.prototype.GetNCRByID = function (ID) {
            var item = Database.get().tables.NCRLogs.find(function (item) {
                if (item.ID == ID) {
                    return true;
                }
                return false;
            });
            if (!item) {
                throw "GET ERROR\n\nNCR not found";
            }
            return item;
        };
        Database.prototype.GetNCRByNumber = function (ID) {
            var item = Database.get().tables.NCRLogs.find(function (item) {
                if (item.NCRNumber == ID) {
                    return true;
                }
                return false;
            });
            if (!item) {
                throw "GET ERROR\n\n Item not found";
            }
            return item;
        };
        Database.prototype.FindRow = function (obj) {
            return obj.ID - 1;
        };
        Database.prototype.InsertQA = function (qa) {
            var validationResult = this.ValidateQA(qa);
            if (!validationResult.valid) {
                var msg = "VALIDATION ERROR\n\n" + validationResult.getMessage();
                console.error("Validation failed:", msg);
                throw msg;
            }
            qa.ID = Database.get().tables.QualityAssurances.length + 1; // IDs start at 1
            Database.get().tables.QualityAssurances.push(qa); // does not inherently save changes
            console.log("INSERT SUCCESSFUL");
        };
        Database.prototype.SaveQA = function (qa) {
            qa.ID = Database.get().tables.QualityAssurances.length + 1; // IDs start at 1
            Database.get().tables.QualityAssurances.push(qa); // does not inherently save changes
            console.log("INSERT SUCCESSFUL");
        };
        Database.prototype.RemoveQA = function (ID) {
            var db = Database.get();
            var items = db.tables.QualityAssurances.filter(function (item) {
                if (item.ID != ID) {
                    return true;
                }
                return false;
            });
            if (items.length == db.tables.QualityAssurances.length) {
                throw "DELETE ERROR\n\n Item not found";
            } // if there was not an item removed
            if (items.length != db.tables.QualityAssurances.length - 1) { // if there was more than 1 item removed
                throw "DELETE ERROR\n\n Too many matches found";
            }
            db.tables.QualityAssurances = items; // does not inherently save changes
            console.log("DELETE SUCCESSFUL");
        };
        Database.prototype.UpdateQA = function (qa) {
            var db = Database.get();
            db.tables.QualityAssurances[this.FindRow(qa)] = qa; // does not inherently save changes
            console.log("UPDATE SUCCESSFUL");
        };
        Database.prototype.InsertEng = function (eng) {
            var validationResult = this.ValidateENG(eng);
            if (!validationResult.valid) {
                var msg = "VALIDATION ERROR\n\n" + validationResult.getMessage();
                console.log(validationResult.getMessage());
                throw msg;
            }
            eng.ID = Database.get().tables.QualityAssurances.length + 1; // IDs start at 1
            Database.get().tables.Engineerings.push(eng); // does not inherently save changes, call SaveChanges()
            console.log("INSERT SUCCESSFUL");
        };
        Database.prototype.SaveEng = function (eng) {
            eng.ID = Database.get().tables.QualityAssurances.length + 1; // IDs start at 1
            Database.get().tables.Engineerings.push(eng); // does not inherently save changes, call SaveChanges()
            console.log("INSERT SUCCESSFUL");
        };
        Database.prototype.UpdateEng = function (eng) {
            var db = Database.get();
            db.tables.Engineerings[this.FindRow(eng)] = eng;
            console.log("UPDATE SUCCESSFUL");
        };
        Database.prototype.RemoveEng = function (ID) {
            var db = Database.get();
            // get every item that does not match the ID
            var items = db.tables.Engineerings.filter(function (item) {
                if (item.ID != ID) {
                    return true;
                }
                return false;
            });
            if (items.length == db.tables.Engineerings.length) {
                throw "DELETE ERROR\n\n Item not found";
            } // if there was not an item removed
            if (items.length != db.tables.Engineerings.length - 1) { // if there was more than 1 item removed
                throw "DELETE ERROR\n\n Too many matches found";
            }
            db.tables.Engineerings = items;
            console.log("DELETE SUCCESSFUL");
        };
        Database.prototype.InsertPurch = function (purch) {
            var validationResult = this.ValidatePUR(purch);
            if (!validationResult.valid) {
                var msg = "VALIDATION ERROR\n\n" + validationResult.getMessage();
                console.log(validationResult.getMessage());
                throw msg;
            }
            purch.ID = Database.get().tables.Purchasings.length + 1; // IDs start at 1
            Database.get().tables.Purchasings.push(purch); // does not inherently save changes, call SaveChanges()
            console.log("INSERT SUCCESSFUL");
        };
        Database.prototype.SavePurch = function (purch) {
            purch.ID = Database.get().tables.Purchasings.length + 1; // IDs start at 1
            Database.get().tables.Purchasings.push(purch); // does not inherently save changes, call SaveChanges()
            console.log("INSERT SUCCESSFUL");
        };
        Database.prototype.UpdatePurch = function (purch) {
            var db = Database.get();
            db.tables.Purchasings[this.FindRow(purch)] = purch;
            console.log("UPDATE SUCCESSFUL");
        };
        Database.prototype.RemovePurch = function (ID) {
            var db = Database.get();
            // get every item that does not match the ID
            var items = db.tables.Purchasings.filter(function (item) {
                if (item.ID != ID) {
                    return true;
                }
                return false;
            });
            if (items.length == db.tables.Purchasings.length) {
                throw "DELETE ERROR\n\n Item not found";
            } // if there was not an item removed
            if (items.length != db.tables.Purchasings.length - 1) { // if there was more than 1 item removed
                throw "DELETE ERROR\n\n Too many matches found";
            }
            db.tables.Purchasings = items;
            console.log("DELETE SUCCESSFUL");
        };
        Database.prototype.InsertNCR = function (ncr) {
            var validationResult = this.ValidateNCR(ncr);
            if (!validationResult.valid) {
                var msg = "VALIDATION ERROR\n\n" + validationResult.getMessage();
                console.log(validationResult.getMessage());
                throw msg;
            }
            ncr.ID = Database.get().tables.NCRLogs.length + 1; // IDs start at 1
            Database.get().tables.NCRLogs.push(ncr); // does not inherently save changes, call SaveChanges()
            console.log("INSERT SUCCESSFUL");
        };
        Database.prototype.SaveNCR = function (ncr) {
            ncr.ID = Database.get().tables.NCRLogs.length + 1; // IDs start at 1
            Database.get().tables.NCRLogs.push(ncr); // does not inherently save changes, call SaveChanges()
            console.log("INSERT SUCCESSFUL");
        };
        Database.prototype.UpdateNCR = function (ncr) {
            var db = Database.get();
            db.tables.NCRLogs[this.FindRow(ncr)] = ncr;
            console.log("UPDATE SUCCESSFUL");
        };
        Database.prototype.RemoveNCR = function (ID) {
            var db = Database.get();
            // get every item that does not match the ID
            var items = db.tables.NCRLogs.filter(function (item) {
                if (item.ID != ID) {
                    return true;
                }
                return false;
            });
            if (items.length == db.tables.NCRLogs.length) {
                throw "DELETE ERROR\n\n Item not found";
            } // if there was not an item removed
            if (items.length != db.tables.NCRLogs.length - 1) { // if there was more than 1 item removed
                throw "DELETE ERROR\n\n Too many matches found";
            }
            db.tables.NCRLogs = items;
            console.log("DELETE SUCCESSFUL");
        };
        Database.prototype.GetUsersInQA = function () {
            return Database.get().tables.Users.filter(function (user) {
                return user.Roles.QA;
            });
        };
        Database.prototype.GetUsersInENG = function () {
            return Database.get().tables.Users.filter(function (user) {
                return user.Roles.Engineer;
            });
        };
        Database.prototype.GetUsersInPUR = function () {
            return Database.get().tables.Users.filter(function (user) {
                return user.Roles.Purchasing;
            });
        };
        Database.prototype.GetUsersInAdmin = function () {
            return Database.get().tables.Users.filter(function (user) {
                return user.Roles.Admin;
            });
        };
        Database.prototype.GetSupplierByID = function (ID) {
            var found = Database.get().tables.Suppliers.find(function (supplier) {
                if (supplier.ID == ID) {
                    return true;
                }
                return false;
            });
            if (!found) {
                throw ("GET ERROR\n\n Supplier not found");
            }
            return found;
        };
        Database.prototype.GetUserByID = function (ID) {
            var found = Database.get().tables.Users.find(function (user) {
                if (user.ID == ID) {
                    return true;
                }
                return false;
            });
            if (!found) {
                throw ("GET ERROR\n\n User not found");
            }
            return found;
        };
        return Database;
    }());
    DatabaseLib.Database = Database;
})(DatabaseLib || (exports.DatabaseLib = DatabaseLib = {}));
