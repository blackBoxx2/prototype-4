export namespace Models {
  export interface ModelBase {
    ID: number;
  }

  export enum Process {
    SupplierOrRecInsp = "Supplier / Rec. Insp.",
    WIP = "WIP (Production Order)"
  }

  export class Supplier implements ModelBase {
    public ID: number;
    public Name: string;
  }

  export enum Role {
    QualityAssurance = 1,
    Engineer = 2,
    Purchasing = 3,
    Admin = 4
  }
  export class User implements ModelBase {
    public ID: number;
    public DigitalSignature: string;
    public Email: string;
    public Roles: RoleClaim;
  }
  export class RoleClaim {
    public QA: boolean;
    public Engineer: boolean;
    public Purchasing: boolean;
    public Admin: boolean;

    constructor(
      isQA: boolean,
      isEngineer: boolean,
      isPurchasing: boolean,
      isAdmin: boolean
    ) {
      this.QA = isQA;
      this.Engineer = isEngineer;
      this.Purchasing = isPurchasing;
      this.Admin = isAdmin;
    }
  }
  
  export class QualityAssurance implements ModelBase {
    public ID: number;
    public Process: Process;
    public ProductNo: string;
    public OrderNo: string;
    public SupplierID: number;
    public ItemDescription: string;
    public DefectDescription: string;
    public QuantityReceived: number;
    public QuantityDefective: number;
    public SignedByUser: number;
    public DateSigned: Date;

    constructor(
      process: Process, 
      productNo: string, 
      orderNo: string, 
      supplierID: number, 
      itemDescription: string, 
      defectDescription: string, 
      quantityReceived: number, 
      quantityDefective: number, 
      signedByUser: number, 
      dateSigned: Date
    ) {
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
  }

  export enum Review {
    UseAsIs = "Use as Is",
    Repair = "Repair",
    Rework = "Rework",
    Scrap = "Scrap"
  }

  export class Engineering implements ModelBase {
    public ID: number;
    public Review: Review;
    public NotifyCustomer: boolean;
    public Disposition: string;
    public UpdateDrawing: boolean;
    public OriginalRevNumber: string;
    public LatestRevNumber: string | null;
    public SignedByUser: number;
    public DateSigned: Date;

    constructor(
      review: Review,
      notifyCustomer: boolean,
      disposition: string,
      updateDrawing: boolean,
      originalRevNumber: string,
      latestRevNumber: string | null,
      signedByUser: number,
      dateSigned: Date
    ) {
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
  }

  export enum Decision {
    ReturnToSupplier = "Return to Supplier",
    ReworkInHouse = "Rework In-House",
    ScrapInHouse = "Scrap In-House",
    DeferToEng = "Defer to Engineering"
  }

  export class Purchasing implements ModelBase {
    public ID: number;
    public Decision: Decision;
    public CARRaised: boolean;
    public CARNo: string | null;
    public FollowUpRequired: boolean;
    public FollowUpType: string | null;
    public ReInspectApplicable: boolean;
    public NewNCRNumber: number | null;
    public QualityDept: string;
    public SignedByUser: number;
    public DateSigned: Date;

    constructor(
      decision: Decision, 
      carRaised: boolean, 
      carNo: string | null, 
      followUpRequired: boolean, 
      followUpType: string | null, 
      reInspectApplicable: boolean,
      newNCRNumber: number | null,
      qualityDept: string,
      signedByUser: number, 
      dateSigned: Date) 
      {
      this.ID = 0;
      this.Decision = decision;
      this.CARRaised = carRaised;
      this.CARNo = carNo;
      this.FollowUpRequired = followUpRequired;
      this.FollowUpType = followUpType;
      this.ReInspectApplicable = reInspectApplicable;
      this.NewNCRNumber = newNCRNumber;
      this.QualityDept = qualityDept;
      this.SignedByUser = signedByUser;
      this.DateSigned = dateSigned;
    }
  }

  export enum Status {
    Engineering,
    Purchasing,
    Closed
  }

  export class NCRLog implements ModelBase {
    public ID: number;
    public NCRNumber: number;
    public QualityAssuranceID: number;
    public EngineeringID: number | null;
    public PurchasingID: number | null;
    public Status: Status;

    constructor(
      ncrNumber: number,
      qualityAssuranceID: number,
      engineeringID: number | null,
      purchasingID: number | null,
      status: Status
    ) {
      this.ID = 0;
      this.NCRNumber = ncrNumber;
      this.QualityAssuranceID = qualityAssuranceID;
      this.EngineeringID = engineeringID;
      this.PurchasingID = purchasingID;
      this.Status = status;
    }
  }
}
