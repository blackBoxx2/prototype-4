import { DatabaseLib } from "./Database";
import * as $ from "../src/jquery.js";
import { Models } from "./Models.js";

$(document).ready(function() {
    const selected = localStorage.getItem('selectedNcrId');
    //Setup dropdown lists:
    const descProductOptions = document.querySelector("descriptionProduct") as HTMLSelectElement;
    var db = DatabaseLib.Database.get();
    if(selected){
        const selectedID = Number(selected)
        //only show selected ncrlog
        const selectedNCR = db.GetNCRByNumber(selectedID);

        //get all fields
        const fields = { 
            ncrNumberField: document.getElementById("edit-title") as HTMLHeadingElement,
            processApplicable: document.getElementById("ipa") as HTMLInputElement,
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
            engineeringDate: document.getElementById("engineeringDate") as HTMLInputElement
        };
        //set all fields
        if(selectedNCR){
            fields.ncrNumberField.innerHTML = "Editing NCR: " + String(selectedNCR.NCRNumber);
            fields.processApplicable.value = String(selectedNCR.QualityAssurance.Process);
            fields.descriptionProduct.value = String(selectedNCR.QualityAssurance.ItemDescription);
            fields.supplierName.value = String(selectedNCR.QualityAssurance.Process);
            fields.productNum.valueAsNumber = Number(selectedNCR.QualityAssurance.ProductNo);
            fields.salesOrderNum.valueAsNumber = Number(selectedNCR.QualityAssurance.OrderNo);
            fields.quantityRec.valueAsNumber = Number(selectedNCR.QualityAssurance.QuantityReceived);
            fields.quantityDef.valueAsNumber = Number(selectedNCR.QualityAssurance.QuantityDefective);
            fields.descriptionDefect.value = String(selectedNCR.QualityAssurance.DefectDescription);
            fields.chkNonconforming.checked = true;
            fields.qaName.value = String(selectedNCR.QualityAssurance.SignedBy);
            fields.qaDate.valueAsDate = new Date(selectedNCR.QualityAssurance.DateSigned);
            // fields.qaPhoto?.innerHTML = String(selectedNCR.QualityAssurance.);
            fields.selReview.value = String(selectedNCR.Engineering?.Review);
            fields.disposition.value = String(selectedNCR.Engineering?.Disposition);
            fields.requireNotification.checked = Boolean(selectedNCR.Engineering?.NotifyCustomer);
            fields.requireUpdating.checked = Boolean(selectedNCR.Engineering?.UpdateDrawing);
            fields.originalRevNum.value = String(selectedNCR.Engineering?.OriginalRevNumber);
            fields.updatedRevNum.value = String(selectedNCR.Engineering?.LatestRevNumber);
            fields.nameOfEngineer.value = String(selectedNCR.Engineering?.SignedBy);
            fields.revisionDate.valueAsDate = new Date(String(selectedNCR.Engineering?.DateSigned));
            fields.engineering.value = String(selectedNCR.Engineering?.ID); //???
            fields.engineeringDate.valueAsDate = new Date(String(selectedNCR.Engineering?.DateSigned));
        } 
    }
    else{
        console.log("Error: no selected ncr id")
    }
})