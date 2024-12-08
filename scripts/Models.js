"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Models = void 0;
var Models;
(function (Models) {
    var Process;
    (function (Process) {
        Process["SupplierOrRecInsp"] = "Supplier / Rec. Insp.";
        Process["WIP"] = "WIP (Production Order)";
    })(Process = Models.Process || (Models.Process = {}));
    var Supplier = /** @class */ (function () {
        function Supplier() {
        }
        return Supplier;
    }());
    Models.Supplier = Supplier;
    var Role;
    (function (Role) {
        Role[Role["QualityAssurance"] = 1] = "QualityAssurance";
        Role[Role["Engineer"] = 2] = "Engineer";
        Role[Role["Purchasing"] = 3] = "Purchasing";
        Role[Role["Admin"] = 4] = "Admin";
    })(Role = Models.Role || (Models.Role = {}));
    var User = /** @class */ (function () {
        function User() {
        }
        return User;
    }());
    Models.User = User;
    var RoleClaim = /** @class */ (function () {
        function RoleClaim(isQA, isEngineer, isPurchasing, isAdmin) {
            this.QA = isQA;
            this.Engineer = isEngineer;
            this.Purchasing = isPurchasing;
            this.Admin = isAdmin;
        }
        return RoleClaim;
    }());
    Models.RoleClaim = RoleClaim;
    var QualityAssurance = /** @class */ (function () {
        function QualityAssurance(process, productNo, orderNo, supplierID, itemDescription, defectDescription, quantityReceived, quantityDefective, signedByUser, dateSigned) {
            this.ID = 0;
            this.Process = process;
            this.ProductNo = productNo;
            this.OrderNo = orderNo;
            this.SupplierID = supplierID;
            this.ItemDescription = itemDescription;
            this.DefectDescription = defectDescription;
            this.QuantityReceived = quantityReceived;
            this.QuantityDefective = quantityDefective;
            this.SignedByUser = signedByUser;
            this.DateSigned = dateSigned;
        }
        return QualityAssurance;
    }());
    Models.QualityAssurance = QualityAssurance;
    var Review;
    (function (Review) {
        Review["UseAsIs"] = "Use as Is";
        Review["Repair"] = "Repair";
        Review["Rework"] = "Rework";
        Review["Scrap"] = "Scrap";
    })(Review = Models.Review || (Models.Review = {}));
    var Engineering = /** @class */ (function () {
        function Engineering(review, notifyCustomer, disposition, updateDrawing, originalRevNumber, latestRevNumber, signedByUser, dateSigned) {
            this.ID = 0;
            this.Review = review;
            this.NotifyCustomer = notifyCustomer;
            this.Disposition = disposition;
            this.UpdateDrawing = updateDrawing;
            this.OriginalRevNumber = originalRevNumber;
            this.LatestRevNumber = latestRevNumber;
            this.SignedByUser = signedByUser;
            this.DateSigned = dateSigned;
        }
        return Engineering;
    }());
    Models.Engineering = Engineering;
    var Decision;
    (function (Decision) {
        Decision["ReturnToSupplier"] = "Return to Supplier";
        Decision["ReworkInHouse"] = "Rework In-House";
        Decision["ScrapInHouse"] = "Scrap In-House";
        Decision["DeferToEng"] = "Defer to Engineering";
    })(Decision = Models.Decision || (Models.Decision = {}));
    var Purchasing = /** @class */ (function () {
        function Purchasing(decision, carRaised, carNo, followUpRequired, followUpType, reInspectAcceptable, newNCRNumber, qualityDept, signedByUser, dateSigned) {
            this.ID = 0;
            this.Decision = decision;
            this.CARRaised = carRaised;
            this.CARNo = carNo;
            this.FollowUpRequired = followUpRequired;
            this.FollowUpType = followUpType;
            this.ReInspectAcceptable = reInspectAcceptable;
            this.NewNCRNumber = newNCRNumber;
            this.QualityDept = qualityDept;
            this.SignedByUser = signedByUser;
            this.DateSigned = dateSigned;
        }
        return Purchasing;
    }());
    Models.Purchasing = Purchasing;
    var Status;
    (function (Status) {
        Status[Status["Engineering"] = 0] = "Engineering";
        Status[Status["Purchasing"] = 1] = "Purchasing";
        Status[Status["Closed"] = 2] = "Closed";
    })(Status = Models.Status || (Models.Status = {}));
    var NCRLog = /** @class */ (function () {
        function NCRLog(ncrNumber, qualityAssuranceID, engineeringID, purchasingID, status) {
            this.ID = 0;
            this.NCRNumber = ncrNumber;
            this.QualityAssuranceID = qualityAssuranceID;
            this.EngineeringID = engineeringID;
            this.PurchasingID = purchasingID;
            this.Status = status;
        }
        return NCRLog;
    }());
    Models.NCRLog = NCRLog;
})(Models || (exports.Models = Models = {}));
