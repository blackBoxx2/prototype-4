export namespace Models {
  export interface ModelBase {
    ID: number;
  }
  export enum Process {
    SupplierOrRecInsp = "Supplier / Rec. Insp.",
    WIP = "WIP (Production Order)"
  }
  
  export class QualityAssurance implements ModelBase {
    public ID: number;
    public Process: Process;
    public ProductNo: string;
    public OrderNo: string;
    public ItemDescription: string;
    public DefectDescription: string;
    public QuantityReceived: number;
    public QuantityDefective: number;
    public SignedBy: string;
    public DateSigned: Date;
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
    public SignedBy: string;
    public DateSigned: Date;
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
    public SignedBy: string;
    public DateSigned: Date;
  }

  export enum Status {
    Engineering,
    Purchasing,
    Closed
  }

  export class NCRLog implements ModelBase {
    public ID: number;
    public NCRNumber: number;
    public QualityAssurance: QualityAssurance;
    public Engineering: Engineering | null;
    public Purchasing: Purchasing | null;
    public Status: Status;
  }
}
