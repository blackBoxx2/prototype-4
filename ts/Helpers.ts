import {Models} from "./Models";

export namespace Helpers {
  export class DatabaseBase {
    public QualityAssurances: Models.QualityAssurance[];
    public Engineerings: Models.Engineering[];
    public Purchasings: Models.Purchasing[];
    public NCRLogs: Models.NCRLog[];
    public Users: Models.User[];
    public Suppliers: Models.Supplier[];
    constructor() {
      this.QualityAssurances = [];
      this.Engineerings = [];
      this.Purchasings = [];
      this.NCRLogs = [];
      this.Users = [];
      this.Suppliers = [];
    }
  }
}