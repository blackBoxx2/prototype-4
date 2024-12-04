import { DatabaseLib } from "./database";
import * as $ from "jquery";
import { Models } from "./Models";

$(function() {
    const selected = localStorage.getItem('selectedNcrId');
    //Setup dropdown lists:
    const descProductOptions = document.querySelector("descriptionProduct") as HTMLSelectElement;
    var db = DatabaseLib.Database.get();
    function formatDateString(dateString: string): string {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; //yyyy-MM-dd format
      }
    if(selected){
        const selectedID = Number(selected)
        //only show selected ncrlog
        const selectedNCR = db.GetNCRByNumber(selectedID);
        const selectedQA = db.GetQAByID(Number(selectedNCR.QualityAssuranceID));
        const selectedEng = db.GetENGByID(Number(selectedNCR.EngineeringID));
        const selectedPurch = db.GetPURByID(Number(selectedNCR.PurchasingID));
        //get all fields
        const fields = { 
            ncrNumberField: document.getElementById("edit-title") as HTMLHeadingElement,
            processApplicable: document.getElementById("ipa") as HTMLSelectElement,
            descriptionProduct: document.getElementById("descriptionProduct") as HTMLSelectElement,
            supplierName: document.getElementById("supplierName") as HTMLSelectElement,
            productNum: document.getElementById("productNum") as HTMLInputElement,
            salesOrderNum: document.getElementById("salesOrderNum") as HTMLInputElement,
            quantityRec: document.getElementById("quantityRec") as HTMLInputElement,
            quantityDef: document.getElementById("quantityDef") as HTMLInputElement,
            descriptionDefect: document.getElementById("descriptionDefect") as HTMLTextAreaElement,
            chkNonconforming: document.getElementById("chkNonconforming") as HTMLInputElement,
            qaName: document.getElementById("qaName") as HTMLInputElement,
            qaDate: document.getElementById("qaDate") as HTMLInputElement,
            qaPhoto: document.getElementById("photo") as HTMLInputElement,
            //engineering
            selReview: document.getElementById("selReview") as HTMLSelectElement,
            disposition: document.getElementById("disposition") as HTMLTextAreaElement,
            requireNotification: document.getElementById("requireNotification") as HTMLInputElement,
            requireUpdating: document.getElementById("requireUpdating") as HTMLInputElement,
            originalRevNum: document.getElementById("originalRevNum") as HTMLInputElement,
            updatedRevNum: document.getElementById("updatedRevNum") as HTMLInputElement,
            nameOfEngineer: document.getElementById("nameOfEngineer") as HTMLInputElement,
            revisionDate: document.getElementById("revisionDate") as HTMLInputElement,
            engineering: document.getElementById("engineering") as HTMLInputElement,
            engineeringDate: document.getElementById("engineeringDate") as HTMLInputElement,
             //purchasing
            decision: document.getElementById("decision") as HTMLSelectElement,
            carRaised: document.getElementById("carRaised") as HTMLInputElement,
            carNo: document.getElementById("carNo") as HTMLInputElement,
            followUpRequired: document.getElementById("followUpRequired") as HTMLInputElement,
            followUpType: document.getElementById("followUpType") as HTMLInputElement,
            signedBy: document.getElementById("signedBy") as HTMLInputElement,
            dateSigned: document.getElementById("dateSigned") as HTMLInputElement,
            reInspectAcceptable: document.getElementById("reInspectAcceptable") as HTMLInputElement,
            newNCRNumber: document.getElementById("newNCRNumber") as HTMLInputElement,
            qualityDept: document.getElementById("qualityDept") as HTMLInputElement,
            signedByUser: document.getElementById("signedByUser") as HTMLInputElement
        };
        //set all fields
        if(selectedNCR){
            //Helper method to format the dates the way html wants it
            const selectedProcessText = fields.processApplicable.options[fields.processApplicable.selectedIndex].text;

            let selectedProcessValue = fields.processApplicable;
            let optionValue: number = -1; //default "select" index
            if (selectedProcessText === "Supplier / Rec. Insp.") {
                optionValue = 0;
            } else if (selectedProcessText === "WIP (Production Order)") {
                optionValue = 1;
            }
            
            

            //set fields
            fields.ncrNumberField.innerHTML = String(selectedNCR.NCRNumber);
            fields.processApplicable.selectedIndex = optionValue;
            fields.descriptionProduct.value = selectedQA.ItemDescription;
            fields.supplierName.selectedIndex = Number(selectedQA.SupplierID);
            fields.productNum.value = String(Number(selectedQA.ProductNo));
            fields.salesOrderNum.value = String(selectedQA.OrderNo);
            fields.quantityRec.value = String(selectedQA.QuantityReceived);
            fields.quantityDef.value = String(selectedQA.QuantityDefective);
            fields.descriptionDefect.value = String(selectedQA.DefectDescription);
            fields.chkNonconforming.value = "True";
            fields.qaName.value = String(selectedQA.SignedByUser);
            fields.qaDate.value = formatDateString(String(selectedQA.DateSigned));
            // fields.qaPhoto?.value = String(selectedQA.);

            fields.selReview.selectedIndex = Models.Review[selectedEng.Review];
            fields.disposition.value = String(selectedEng.Disposition);
            fields.requireNotification.value = String(selectedEng.NotifyCustomer);
            fields.requireUpdating.value = String(selectedEng.UpdateDrawing);
            fields.originalRevNum.value = String(selectedEng.OriginalRevNumber);
            fields.updatedRevNum.value = String(selectedEng.LatestRevNumber);
            fields.nameOfEngineer.value = String(selectedEng.SignedByUser);
            fields.revisionDate.value = formatDateString(String(selectedEng.DateSigned));
            fields.engineering.value = String(selectedEng.ID); //???
            fields.engineeringDate.value = formatDateString(String(selectedEng.DateSigned));
            if(selectedPurch){
                fields.decision.selectedIndex = Models.Decision[selectedPurch.Decision];
                fields.carRaised.value = String(selectedPurch.CARRaised);
                fields.carNo.value = String(selectedPurch.CARNo);
                fields.followUpRequired.value = String(selectedPurch.FollowUpRequired);
                fields.followUpType.value = String(selectedPurch.FollowUpType);
                fields.signedBy.value = String(selectedPurch.SignedByUser);
                fields.dateSigned.value = formatDateString(String(selectedPurch.DateSigned));
                fields.reInspectAcceptable.value = String(selectedPurch.ReInspectAcceptable);
                fields.newNCRNumber.value = String(selectedPurch.NewNCRNumber);
                fields.qualityDept.value = String(selectedPurch.QualityDept);
                fields.signedByUser.value = String(selectedPurch.SignedByUser);
            }
            
        } 
    }
    else{
        console.log("Error: no selected ncr id")
    }
})
