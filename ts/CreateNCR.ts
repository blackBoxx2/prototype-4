import { DatabaseLib } from "./database";
import * as $ from "jquery"
import { Models } from "./Models.js";
import * as Toastify from "toastify-js";

//Toast notifactions
function showToast(message: string, type: "success" | "error" | "info", redirect?: string): void{
    if(redirect){
        localStorage.setItem('toastMessage', message);
        localStorage.setItem('toastType', type);
    }
    else{
        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "right",
            //if success then green, error then red, otherwise blue
            backgroundColor: type === "success"
            ? "green" : type === "error" ? "red"
            : "blue",
            close: true,
        }).showToast();
    }
}

$(function() { 
    var btnSubmit = document.querySelector("#btn-submit");
    var btnSave = this.documentElement.querySelector("#btn-save");

    var btnCancel = document.querySelector("#btnCancel");
    btnCancel?.addEventListener('click', function(e) {
        e.preventDefault();

        showToast("Canceled successfully.", "error", "/NCRLog/index.html");
    })
    //run validation
    var db = DatabaseLib.Database.get();
    //get data
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
    if(btnSave){ //save no validate
        btnSave.addEventListener("click", function(e) {
        e.preventDefault();
        console.log("Attempting Save");
        const selectedProcessText = fields.processApplicable.options[fields.processApplicable.selectedIndex].text;
        const supplier = db.GetSupplierByID(fields.supplierName.selectedIndex);
        //set selcted supplier
        let selectedProcessValue: Models.Process = Models.Process.WIP;
        if (selectedProcessText === "Supplier / Rec. Insp.") {
            selectedProcessValue = Models.Process.SupplierOrRecInsp;
        } else if (selectedProcessText === "WIP (Production Order)") {
            selectedProcessValue = Models.Process.WIP;
        }
        let qaDate = new Date(fields.qaDate.value);
        let reviewValue: Models.Review;
        const selectedReview = fields.selReview.value
        if (selectedReview) { //easily set selected descision to an enum
            reviewValue = Models.Review[selectedReview as keyof typeof Models.Review];
        }

        var qa: Models.QualityAssurance = {
            ID: (db.tables.QualityAssurances.length + 1),
            Process: selectedProcessValue,
            SupplierID: supplier.ID,
            ProductNo: String(fields.productNum?.value),
            OrderNo: String(fields.salesOrderNum?.value),
            ItemDescription: String(fields.descriptionProduct?.innerHTML),
            DefectDescription: String(fields.descriptionDefect?.value),
            QuantityReceived: Number(fields.quantityRec?.value),
            QuantityDefective: Number(fields.quantityDef?.value),
            SignedByUser: 2, //update
            DateSigned: new Date(qaDate)
        }
        var eng: Models.Engineering = {
            ID: ((db.tables.Engineerings.length + 1)),
            Review: selectedReview as Models.Review,
            NotifyCustomer: Boolean(fields?.requireNotification.checked),
            Disposition: String(fields.disposition?.value),
            UpdateDrawing: Boolean(fields.requireUpdating?.checked),
            OriginalRevNumber: String(fields.originalRevNum?.value),
            LatestRevNumber: String(fields.updatedRevNum?.value),
            SignedByUser: Number(fields.nameOfEngineer?.value), //update
            DateSigned: new Date(fields.engineeringDate?.value)
        }
        var purch: Models.Purchasing = {
            ID: Number(db.tables.Purchasings.length + 1),
            Decision: Models.Decision[fields?.decision.selectedIndex],
            CARRaised: Boolean(fields?.carRaised.checked),
            CARNo: String(fields?.carNo.value),
            FollowUpRequired: Boolean(fields?.followUpRequired.checked),
            FollowUpType: String(fields?.followUpType.value),
            SignedByUser: Models.User[fields?.signedByUser.value], //change
            DateSigned: new Date(fields?.dateSigned.value),
            ReInspectAcceptable: Boolean(fields.reInspectAcceptable?.checked),
            NewNCRNumber: Number(fields.newNCRNumber?.value),
            QualityDept: String(fields.signedByUser?.value)
        };
        //Create qa, eng, and purch
        
        var msg = db.SaveQA(qa);
        var msg1 = db.SaveEng(eng);
        var msg2 = db.SavePurch(purch);
        var ncrLog: Models.NCRLog = {
            ID: Number(db.tables.NCRLogs.length + 1),
            NCRNumber: Number(db.tables.NCRLogs.length + 1),
            QualityAssuranceID: qa.ID,
            EngineeringID: eng.ID,
            PurchasingID: purch.ID,
            Status: Models.Status.Purchasing //update
        };
        
        var msg3 = db.SaveNCR(ncrLog);
        console.log(msg);
        console.log(msg1);
        console.log(msg2);
        console.log(msg3);
        db.SaveChanges();
        showToast("Successfully created new NCR!", "success");
        console.log(db.tables);
    })
}
    if(btnSubmit){
        btnSubmit.addEventListener("click", function(e) {
            console.log("Attempting SUBMIT");
            e.preventDefault();
            const selectedProcessText = fields.processApplicable.options[fields.processApplicable.selectedIndex].text;
            const supplier = db.GetSupplierByID(fields.supplierName.selectedIndex);
            let selectedProcessValue: Models.Process = Models.Process.WIP;
            if (selectedProcessText === "Supplier / Rec. Insp.") {
                selectedProcessValue = Models.Process.SupplierOrRecInsp;
            } else if (selectedProcessText === "WIP (Production Order)") {
                selectedProcessValue = Models.Process.WIP;
            }
            let qaDate = new Date(fields.qaDate.value);
            
            let reviewValue: Models.Review;
            const selectedReview = fields.selReview.value
            if (selectedReview) { //easily set selected descision to an enum
                reviewValue = Models.Review[selectedReview as keyof typeof Models.Review];
            }
        
            var qa: Models.QualityAssurance = {
                ID: (db.tables.QualityAssurances.length + 1),
                Process: selectedProcessValue,
                SupplierID: supplier.ID,
                ProductNo: String(fields.productNum?.value),
                OrderNo: String(fields.salesOrderNum?.value),
                ItemDescription: String(fields.descriptionProduct?.innerHTML),
                DefectDescription: String(fields.descriptionDefect?.value),
                QuantityReceived: Number(fields.quantityRec?.value),
                QuantityDefective: Number(fields.quantityDef?.value),
                SignedByUser: 2, //update
                DateSigned: new Date(qaDate)
            }
            var eng: Models.Engineering = {
                ID: ((db.tables.Engineerings.length + 1)),
                Review: selectedReview as Models.Review,
                NotifyCustomer: Boolean(fields?.requireNotification.checked),
                Disposition: String(fields.disposition?.value),
                UpdateDrawing: Boolean(fields.requireUpdating?.checked),
                OriginalRevNumber: String(fields.originalRevNum?.value),
                LatestRevNumber: String(fields.updatedRevNum?.value),
                SignedByUser: Number(fields.nameOfEngineer?.value), //update
                DateSigned: new Date(fields.engineeringDate?.value)
            }
            var purch: Models.Purchasing = {
                ID: Number(db.tables.Purchasings.length + 1),
                Decision: Models.Decision[fields?.decision.selectedIndex],
                CARRaised: Boolean(fields?.carRaised.checked),
                CARNo: String(fields?.carNo.value),
                FollowUpRequired: Boolean(fields?.followUpRequired.checked),
                FollowUpType: String(fields?.followUpType.value),
                SignedByUser: Models.User[fields?.signedByUser.value], //change
                DateSigned: new Date(fields?.dateSigned.value),
                ReInspectAcceptable: Boolean(fields.reInspectAcceptable?.checked),
                NewNCRNumber: Number(fields.newNCRNumber?.value),
                QualityDept: String(fields.signedByUser?.value)
            };
               //Create qa, eng, and purch
        
            var msg = db.SaveQA(qa);
            var msg1 = db.SaveEng(eng);
            var msg2 = db.SavePurch(purch);
            var ncrLog: Models.NCRLog = {
                ID: Number(db.tables.NCRLogs.length + 1),
                NCRNumber: Number(db.tables.NCRLogs.length + 1),
                QualityAssuranceID: qa.ID,
                EngineeringID: eng.ID,
                PurchasingID: purch.ID,
                Status: Models.Status.Purchasing //update
            };
            
            var msg3 = db.SaveNCR(ncrLog);
            console.log(msg);
            console.log(msg1);
            console.log(msg2);
            console.log(msg3);
            db.SaveChanges();
            showToast("Successfully created NCR!", "success", "/NCRLog/index.html");
        })
    }
    
})