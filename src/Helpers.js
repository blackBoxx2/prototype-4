"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helpers = void 0;
var Helpers;
(function (Helpers) {
    var DatabaseBase = /** @class */ (function () {
        function DatabaseBase() {
            this.QualityAssurances = [];
            this.Engineerings = [];
            this.Purchasings = [];
            this.NCRLogs = [];
            this.Users = [];
            this.Suppliers = [];
        }
        return DatabaseBase;
    }());
    Helpers.DatabaseBase = DatabaseBase;
})(Helpers || (exports.Helpers = Helpers = {}));
