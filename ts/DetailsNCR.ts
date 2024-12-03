import { DatabaseLib } from "./Database";
import * as $ from "../src/jquery.js";
import { Models } from "./Models.js";

$(document).ready(function() {
    const selected = localStorage.getItem('selectedNcrId');
    if(selected){
        var db = DatabaseLib.Database.get();
        const selectedID = Number(selected)
        //only show selected ncrlog
        const selectedNCR = db.GetNCRByNumber(selectedID);

        console.log(selectedNCR);
        //get all fields
        const fields = { 
            ncrNumberField: document.getElementById("ncrNumber") as HTMLParagraphElement,
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
            engineeringDate: document.getElementById("engineeringDate") as HTMLParagraphElement
        };
        //set all fields
        if(selectedNCR){
            fields.ncrNumberField.innerHTML = String(selectedNCR.NCRNumber);
            fields.processApplicable.innerHTML = String(selectedNCR.QualityAssurance.Process);
            fields.descriptionProduct.innerHTML = String(selectedNCR.QualityAssurance.ItemDescription);
            fields.supplierName.innerHTML = String(selectedNCR.QualityAssurance.Process);
            fields.productNum.innerHTML = String(selectedNCR.QualityAssurance.ProductNo);
            fields.salesOrderNum.innerHTML = String(selectedNCR.QualityAssurance.OrderNo);
            fields.quantityRec.innerHTML = String(selectedNCR.QualityAssurance.QuantityReceived);
            fields.quantityDef.innerHTML = String(selectedNCR.QualityAssurance.QuantityDefective);
            fields.descriptionDefect.innerHTML = String(selectedNCR.QualityAssurance.DefectDescription);
            fields.chkNonconforming.innerHTML = "True";
            fields.qaName.innerHTML = String(selectedNCR.QualityAssurance.SignedBy);
            fields.qaDate.innerHTML = String(selectedNCR.QualityAssurance.DateSigned);
            // fields.qaPhoto?.innerHTML = String(selectedNCR.QualityAssurance.);
            fields.selReview.innerHTML = String(selectedNCR.Engineering?.Review);
            fields.disposition.innerHTML = String(selectedNCR.Engineering?.Disposition);
            fields.requireNotification.innerHTML = String(selectedNCR.Engineering?.NotifyCustomer);
            fields.requireUpdating.innerHTML = String(selectedNCR.Engineering?.UpdateDrawing);
            fields.originalRevNum.innerHTML = String(selectedNCR.Engineering?.OriginalRevNumber);
            fields.updatedRevNum.innerHTML = String(selectedNCR.Engineering?.LatestRevNumber);
            fields.nameOfEngineer.innerHTML = String(selectedNCR.Engineering?.SignedBy);
            fields.revisionDate.innerHTML = String(selectedNCR.Engineering?.DateSigned);
            fields.engineering.innerHTML = String(selectedNCR.Engineering?.ID); //???
            fields.engineeringDate.innerHTML = String(selectedNCR.Engineering?.DateSigned);
        } 
    }
    else{
        console.log("Error: no selected ncr id")
    }
})