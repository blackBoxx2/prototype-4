
import { DatabaseLib } from "./database";
import * as $ from "jquery";
import { Models } from "./Models";

$(function() {
    const selected = localStorage.getItem('selectedNcrId');
    if(selected){
        var db = DatabaseLib.Database.get();
        db.ReSeed();
        console.log(db.tables.Users);
        const selectedID = Number(selected)
        //only show selected ncrlog
        var selectedEng: Models.Engineering | null = null;
        var selectedPurch: Models.Purchasing | null = null;
        const selectedNCR = db.GetNCRByNumber(selectedID);
        const selectedQA = db.GetQAByID(Number(selectedNCR.QualityAssuranceID));
        if(selectedNCR.EngineeringID != undefined && selectedNCR.EngineeringID != null)
            selectedEng = db.GetENGByID(Number(selectedNCR.EngineeringID));
        if(selectedNCR.PurchasingID != undefined && selectedNCR.PurchasingID != null)
            selectedPurch = db.GetPURByID(Number(selectedNCR.PurchasingID));
        const supplierName = db.GetSupplierByID(Number(selectedQA.SupplierID));
        console.log(selectedNCR);
        //get all fields
        const fields = { 
            ncrNumberField: document.getElementById("ncrNumber") as HTMLTitleElement,
            processApplicable: document.getElementById("ipa") as HTMLParagraphElement,
            descriptionProduct: document.getElementById("descriptionProduct") as HTMLParagraphElement,
            supplierName: document.getElementById("supplierName") as HTMLParagraphElement,
            productNum: document.getElementById("productNum") as HTMLParagraphElement,
            salesOrderNum: document.getElementById("salesOrderNum") as HTMLParagraphElement,
            quantityRec: document.getElementById("quantityRec") as HTMLParagraphElement,
            quantityDef: document.getElementById("quantityDef") as HTMLParagraphElement,
            descriptionDefect: document.getElementById("descriptionDefect") as HTMLParagraphElement,
            chkNonconforming: document.getElementById("chkNonconforming") as HTMLParagraphElement,
            qaName: document.getElementById("qaName") as HTMLParagraphElement,
            qaDate: document.getElementById("qaDate") as HTMLParagraphElement,
            qaPhoto: document.getElementById("photo") as HTMLParagraphElement,
            //engineering
            selReview: document.getElementById("selReview") as HTMLParagraphElement,
            disposition: document.getElementById("disposition") as HTMLParagraphElement,
            requireNotification: document.getElementById("requireNotification") as HTMLParagraphElement,
            requireUpdating: document.getElementById("requireUpdating") as HTMLParagraphElement,
            originalRevNum: document.getElementById("originalRevNum") as HTMLParagraphElement,
            updatedRevNum: document.getElementById("updatedRevNum") as HTMLParagraphElement,
            nameOfEngineer: document.getElementById("nameOfEngineer") as HTMLParagraphElement,
            revisionDate: document.getElementById("revisionDate") as HTMLParagraphElement,
            engineering: document.getElementById("engineering") as HTMLParagraphElement,
            engineeringDate: document.getElementById("engineeringDate") as HTMLParagraphElement,
                  //purchasing
            decision: document.getElementById("decision") as HTMLParagraphElement,
            carRaised: document.getElementById("carRaised") as HTMLParagraphElement,
            carNo: document.getElementById("carNo") as HTMLParagraphElement,
            followUpRequired: document.getElementById("followUpRequired") as HTMLParagraphElement,
            followUpType: document.getElementById("followUpType") as HTMLParagraphElement,
            signedBy: document.getElementById("signedBy") as HTMLParagraphElement,
            dateSigned: document.getElementById("dateSigned") as HTMLParagraphElement,
            reInspectAcceptable: document.getElementById("reInspectAcceptable") as HTMLParagraphElement,
            newNCRNumber: document.getElementById("newNCRNumber") as HTMLParagraphElement,
            qualityDept: document.getElementById("qualityDept") as HTMLParagraphElement,
            signedByUser: document.getElementById("signedByUser") as HTMLParagraphElement
        };
        //set all fields
        if(selectedNCR){
            fields.ncrNumberField.innerHTML = "Viewing NCR #" + String(selectedNCR.NCRNumber);
            fields.processApplicable.innerHTML = String(selectedQA.Process);
            fields.descriptionProduct.innerHTML = String(selectedQA.ItemDescription);
            fields.supplierName.innerHTML = supplierName.Name;
            fields.productNum.innerHTML = String(selectedQA.ProductNo);
            fields.salesOrderNum.innerHTML = String(selectedQA.OrderNo);
            fields.quantityRec.innerHTML = String(selectedQA.QuantityReceived);
            fields.quantityDef.innerHTML = String(selectedQA.QuantityDefective);
            fields.descriptionDefect.innerHTML = String(selectedQA.DefectDescription);
            fields.chkNonconforming.innerHTML = "True";
            fields.qaName.innerHTML = String(selectedQA.SignedByUser);
            fields.qaDate.innerHTML = String(selectedQA.DateSigned);
            // fields.qaPhoto?.innerHTML = String(selectedQA.);
            if(selectedEng != null){
                fields.selReview.innerHTML = String(selectedEng.Review);
                fields.disposition.innerHTML = String(selectedEng.Disposition);
                fields.requireNotification.innerHTML = String(selectedEng.NotifyCustomer);
                fields.requireUpdating.innerHTML = String(selectedEng.UpdateDrawing);
                fields.originalRevNum.innerHTML = String(selectedEng.OriginalRevNumber);
                fields.updatedRevNum.innerHTML = String(selectedEng.LatestRevNumber);
                fields.nameOfEngineer.innerHTML = String(selectedEng.SignedByUser);
                fields.revisionDate.innerHTML = String(selectedEng.DateSigned);
                fields.engineering.innerHTML = String(selectedEng.ID); //???
                fields.engineeringDate.innerHTML = String(selectedEng.DateSigned);
            }
            if(selectedPurch != null){
                fields.decision.innerHTML = String(selectedPurch.Decision);
                fields.carRaised.innerHTML = String(selectedPurch.CARRaised);
                fields.carNo.innerHTML = String(selectedPurch.CARNo);
                fields.followUpRequired.innerHTML = String(selectedPurch.FollowUpRequired);
                fields.followUpType.innerHTML = String(selectedPurch.FollowUpType);
                fields.signedBy.innerHTML = String(selectedPurch.SignedByUser);
                fields.dateSigned.innerHTML = String(selectedPurch.DateSigned);
                fields.reInspectAcceptable.innerHTML = String(selectedPurch.ReInspectAcceptable);
                fields.newNCRNumber.innerHTML = String(selectedPurch.NewNCRNumber);
                fields.qualityDept.innerHTML = String(selectedPurch.QualityDept);
                fields.signedByUser.innerHTML = String(selectedPurch.SignedByUser);
                
            }

        } 
    }
    else{
        console.log("Error: no selected ncr id")
    }
})