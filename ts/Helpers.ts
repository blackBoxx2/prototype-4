import {Models} from "./Models";

export namespace Helpers {
  export class DatabaseBase {
    public QualityAssurances: Models.QualityAssurance[];
    public Engineerings: Models.Engineering[];
    public Purchasings: Models.Purchasing[];
    public NCRLogs: Models.NCRLog[];

    constructor() {
      this.QualityAssurances = [];
      this.Engineerings = [];
      this.Purchasings = [];
      this.NCRLogs = [];
    }
  }
}