import { DatabaseLib } from "./database";
import * as $ from "jquery";
import { Models } from "./Models";

$(function() {
    const selected = localStorage.getItem('selectedNcrId');
    const btnSubmit = document.querySelector("#btnSubmit");
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
        var selectedEng: Models.Engineering | null = null;
        var selectedPurch: Models.Purchasing | null = null;
        const selectedNCR = db.GetNCRByNumber(selectedID);
        const selectedQA = db.GetQAByID(Number(selectedNCR.QualityAssuranceID));
        if(selectedNCR.EngineeringID != undefined && selectedNCR.EngineeringID != null)
            selectedEng = db.GetENGByID(Number(selectedNCR.EngineeringID));
        if(selectedNCR.PurchasingID != undefined && selectedNCR.PurchasingID != null)
            selectedPurch = db.GetPURByID(Number(selectedNCR.PurchasingID));
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
            //set fields
            fields.ncrNumberField.innerHTML = "Editing NCR #" + String(selectedNCR.NCRNumber);
            fields.processApplicable.value = selectedQA.Process;
            fields.descriptionProduct.value = selectedQA.ItemDescription;
            fields.supplierName.selectedIndex = Number(selectedQA.SupplierID);
            fields.productNum.value = selectedQA.ProductNo;
            fields.salesOrderNum.value = String(selectedQA.OrderNo);
            fields.quantityRec.value = String(selectedQA.QuantityReceived);
            fields.quantityDef.value = String(selectedQA.QuantityDefective);
            fields.descriptionDefect.value = String(selectedQA.DefectDescription);
            fields.chkNonconforming.value = "True";
            fields.qaName.value = String(selectedQA.SignedByUser);
            fields.qaDate.value = formatDateString(String(selectedQA.DateSigned));
            // fields.qaPhoto?.value = String(selectedQA.);
            if(selectedEng){
                fields.selReview.value = Models.Review[selectedEng.Review];
                fields.disposition.value = String(selectedEng.Disposition);
                fields.requireNotification.value = String(selectedEng.NotifyCustomer);
                fields.requireUpdating.value = String(selectedEng.UpdateDrawing);
                fields.originalRevNum.value = String(selectedEng.OriginalRevNumber);
                fields.updatedRevNum.value = String(selectedEng.LatestRevNumber);
                fields.nameOfEngineer.value = String(selectedEng.SignedByUser);
                fields.revisionDate.value = formatDateString(String(selectedEng.DateSigned));
                fields.engineering.value = String(selectedEng.ID); //???
                fields.engineeringDate.value = formatDateString(String(selectedEng.DateSigned));
            }
            if(selectedPurch){
                fields.decision.value = selectedPurch.Decision;
                fields.carRaised.value = String(selectedPurch.CARRaised);
                fields.carNo.value = String(selectedPurch.CARNo);
                fields.followUpRequired.value = String(selectedPurch.FollowUpRequired);
                fields.followUpType.value = String(selectedPurch.FollowUpType);
                fields.signedBy.value = String(selectedPurch.SignedByUser);
                fields.dateSigned.value = formatDateString(String(selectedPurch.DateSigned));
                fields.reInspectAcceptable.value = String(selectedPurch.ReInspectAcceptable);
                fields.newNCRNumber.value = "Update NCR Number?";
                fields.qualityDept.value = String(selectedPurch.QualityDept);
                fields.signedByUser.value = String(selectedPurch.SignedByUser);
            }
            if(btnSubmit){
                btnSubmit.addEventListener('click', function(e) {
                    //get updated fields

                    const updatedQA: Models.QualityAssurance = {
                        ID: selectedQA.ID,
                        Process: Models.Process[fields.processApplicable.selectedIndex],
                        ItemDescription: fields.descriptionProduct.value,
                        SupplierID: Number(fields.supplierName.options[fields.supplierName.selectedIndex]),
                        ProductNo: String(fields.productNum.value),
                        OrderNo: fields.salesOrderNum.value,
                        QuantityReceived: Number(fields.quantityRec.value),
                        QuantityDefective: Number(fields.quantityDef.value),
                        DefectDescription: fields.descriptionDefect.value,
                        //Nonconforming: fields.chkNonconforming.value === "True",
                        SignedByUser: Models.User[fields.qaName.value],
                        DateSigned: new Date(fields.qaDate.value)
                    };
                    if(selectedEng){ //if they are editing the engineering portion (eng already exists)
                        const updatedEng: Models.Engineering = {
                            ID: selectedEng.ID,
                            Review: Models.Review[fields.selReview.selectedIndex],
                            Disposition: fields.disposition.value,
                            NotifyCustomer: fields.requireNotification.value === "True",
                            UpdateDrawing: fields.requireUpdating.value === "True",
                            OriginalRevNumber: fields.originalRevNum.value,
                            LatestRevNumber: fields.updatedRevNum.value,
                            SignedByUser: Models.User[fields.nameOfEngineer.value],
                            DateSigned: new Date(fields.revisionDate.value),
                        }
                        const msg = db.UpdateEng(updatedEng);
                        console.log("ENG: " + msg);
                    }
                    else{ //if they are editing an uncompleted ncr (eng adding their portion, purch ect)
                        const newEng: Models.Engineering = {
                            ID: (db.tables.Engineerings.length + 1),
                            Review: Models.Review[fields.selReview.selectedIndex],
                            Disposition: fields.disposition.value,
                            NotifyCustomer: fields.requireNotification.value === "True",
                            UpdateDrawing: fields.requireUpdating.value === "True",
                            OriginalRevNumber: fields.originalRevNum.value,
                            LatestRevNumber: fields.updatedRevNum.value,
                            SignedByUser: Models.User[fields.nameOfEngineer.value],
                            DateSigned: new Date(fields.revisionDate.value),
                        }
                        const msg = db.InsertEng(newEng);
                        console.log("NEW ENG: " + msg);
                    }
                    if(selectedPurch){
                        const updatedPurch: Models.Purchasing ={
                            ID: selectedPurch.ID,
                            Decision: Models.Decision[fields.decision.selectedIndex],
                            CARRaised: Boolean(fields.carRaised.checked),
                            CARNo: fields.carNo.value,
                            FollowUpRequired: fields.followUpRequired.checked,
                            FollowUpType: fields.followUpType.value,
                            SignedByUser: Models.User[fields.signedBy.value],
                            DateSigned: new Date(fields.dateSigned.value),
                            ReInspectAcceptable: fields.reInspectAcceptable.checked,
                            NewNCRNumber: Number(fields.newNCRNumber.value),
                            QualityDept: fields.qualityDept.value,
                        };
                        const msg = db.UpdatePurch(updatedPurch);
                        console.log("PURCH: " + msg);
                    }
                    else{
                        //are the fields null?
                        if(fields.decision.selectedIndex == 0 || fields.signedBy.value == null || fields.newNCRNumber.value == null || fields.newNCRNumber.value == ""){
                            return; //then they dont want to add purchasing
                        }
                        else{ //if fields are filled, add a new purch
                            const newPurch: Models.Purchasing ={
                                ID: (db.tables.Purchasings.length + 1),
                                Decision: Models.Decision[fields.decision.selectedIndex],
                                CARRaised: Boolean(fields.carRaised.checked),
                                CARNo: fields.carNo.value,
                                FollowUpRequired: fields.followUpRequired.checked,
                                FollowUpType: fields.followUpType.value,
                                SignedByUser: Models.User[fields.signedBy.value],
                                DateSigned: new Date(fields.dateSigned.value),
                                ReInspectAcceptable: fields.reInspectAcceptable.checked,
                                NewNCRNumber: Number(fields.newNCRNumber.value),
                                QualityDept: fields.qualityDept.value,
                            };
                            const msg = db.InsertPurch(newPurch);
                            console.log("NEW PURCH: " + msg);
                        }
                    }
                    //update qa
                    const msg = db.UpdateQA(updatedQA);
                    console.log(msg);
                    
                    db.SaveChanges();
                    
                })
            }
        } 
        
    }
    else{
        console.log("Error: no selected ncr id")
    }

    
})
