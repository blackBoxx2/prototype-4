
import { DatabaseLib } from "./database";
import * as $ from "jquery";
import { Models } from "./Models";

$(function() {
    const selected = localStorage.getItem('selectedNcrId');
    if(selected){
        var db = DatabaseLib.Database.get();
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
        };
        //set all fields
        if(selectedNCR){
            let qa = db.GetUserByID(selectedQA.SignedByUser);
            fields.ncrNumberField.innerHTML = "Viewing NCR #" + String(selectedNCR.NCRNumber) || "???";
            fields.processApplicable.innerHTML = String(selectedQA.Process) || "N/A";
            fields.descriptionProduct.innerHTML = selectedQA.ItemDescription || "N/A";
            fields.supplierName.innerHTML = supplierName.Name || "N/A";
            fields.productNum.innerHTML = selectedQA.ProductNo || "N/A";
            fields.salesOrderNum.innerHTML = selectedQA.OrderNo || "N/A";
            fields.quantityRec.innerHTML = String(selectedQA.QuantityReceived) || "Unknown";
            fields.quantityDef.innerHTML = String(selectedQA.QuantityDefective) || "Unknown";
            fields.descriptionDefect.innerHTML = selectedQA.DefectDescription || "N/A";
            fields.chkNonconforming.innerHTML = "Yes";
            fields.qaName.innerHTML = `${qa.DigitalSignature} (emp. #${qa.ID})`;
            fields.qaDate.innerHTML = String(selectedQA.DateSigned).slice(0, 10);
            // fields.qaPhoto?.innerHTML = String(selectedQA.);
            if(selectedEng != null){
                let eng = db.GetUserByID(selectedEng.SignedByUser);
                fields.selReview.innerHTML = String(selectedEng.Review) || "N/A";
                fields.disposition.innerHTML = String(selectedEng.Disposition)|| "N/A";
                fields.requireNotification.innerHTML = selectedEng.NotifyCustomer ? "Yes" : "No";
                fields.requireUpdating.innerHTML = selectedEng.UpdateDrawing ? "Yes" : "No";
                fields.originalRevNum.innerHTML = String(selectedEng.OriginalRevNumber) || "1";
                fields.updatedRevNum.innerHTML = String(selectedEng.LatestRevNumber) || "N/A";
                fields.nameOfEngineer.innerHTML = `${eng.DigitalSignature} (emp. #${eng.ID})` || "N/A";
                fields.revisionDate.innerHTML = String(selectedEng.DateSigned).slice(0, 10) || "N/A";
            }
            if(selectedPurch != null){
                let purch = db.GetUserByID(selectedPurch.SignedByUser)
                fields.decision.innerHTML = String(selectedPurch.Decision) || "N/A";
                let cr = selectedPurch.CARRaised;
                fields.carRaised.innerHTML = cr == null ? "N/A" : (cr ? "Yes" : "No")
                fields.carNo.innerHTML = selectedPurch.CARNo || "N/A";
                fields.followUpRequired.innerHTML = selectedPurch.FollowUpRequired ? "Yes" : "No";
                fields.followUpType.innerHTML = selectedPurch.FollowUpType || "N/A";
                fields.signedBy.innerHTML = `${purch.DigitalSignature} (emp. #${purch.ID})` || "N/A";
                fields.dateSigned.innerHTML = String(selectedPurch.DateSigned).slice(0, 10) || "N/A";
                fields.reInspectAcceptable.innerHTML = selectedPurch.ReInspectAcceptable ? "Yes" : "No";
                fields.newNCRNumber.innerHTML = selectedPurch.NewNCRNumber == null ? "N/A" : String(selectedPurch.NewNCRNumber);
                fields.qualityDept.innerHTML = selectedPurch.QualityDept || "N/A";
                
            }

        } 
    }
    else{
        console.log("Error: no selected ncr id")
        this.location.href = "/NCRLog"
    }
})