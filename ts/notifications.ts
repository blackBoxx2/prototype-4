import { DatabaseLib } from "./database";
import * as $ from "jquery"
import { Models } from "./Models.js"; 
$(function() {
    const db = DatabaseLib.Database.get();
    const recentNCR = db.tables.NCRLogs;
    const users = db.tables.Users;
    //which user is logged in
    const loggedInID = Number(localStorage.getItem('userID'));
    //get user by local storage id
    const loggedInAs = db.GetUserByID(loggedInID);
    //convert their last login (localStorage) to a date
    const logInDate: Date = new Date(String(localStorage.getItem('logInDate')));
    //what role are they
    const loggedInRole = localStorage.getItem('userRole');    
    const tableBody = document.querySelector("#lst-notifs") as HTMLTableSectionElement;
    const numberOfNotifs = document.querySelector('#numberOfNotifs') as HTMLParagraphElement;
    const notifsDiv = document.querySelector('#div-notif') as HTMLDivElement;

    var newNCRs: Models.NCRLog[] = [];
    if(loggedInRole == "Engineer") {
        //find the most recent ncrs 
        recentNCR.forEach((ncr: any) =>{
            //get qa portion for all ncrs
            const selQA = db.GetQAByID(ncr.QualityAssuranceID);
            //get qa date and see if its older then login date
            const date: Date = new Date(selQA.DateSigned);
            var selectedEng: Models.Engineering;
            if(logInDate.getDate() < date.getDate()){
                //only add unseen NCRs that they have to complete
                if(ncr.EngineeringID == null){
                    newNCRs.push(ncr);
                    console.log("Unseen ncr found!");
                }
                
            }
        });
        if(newNCRs.length > 0){
            notifsDiv.style.display = "block";
            numberOfNotifs.innerHTML = "You have " + newNCRs.length + " new NCRs to complete";
            newNCRs.forEach((ncr: any) =>{
                const selQA = db.GetQAByID(ncr.QualityAssuranceID);
                const supplierName = db.GetSupplierByID(selQA.SupplierID);
                const date = new Date(selQA.DateSigned).toLocaleDateString();
                const status = Models.Status[ncr.Status];
                const row = `
                <tr>
                    <td>${ncr.NCRNumber}</td>
                    <td>${selQA.DefectDescription}</td>
                    <td>${date}</td>
                    <td>${supplierName.Name}</td>
                    <td class="action"><button data-id="${ncr.NCRNumber}" 
                    onclick="location.href='/NCRLog/Details.html'" 
                    class="viewNCR">
                    Details
                    </button>
                    |
                    <button 
                        data-id="${ncr.NCRNumber}" 
                        onclick="location.href='/NCRLog/edit.html'" 
                        class="editNCR">
                        Edit
                    </button></td>
                                <tr>`;
                tableBody.innerHTML += row;
            })
            console.log("Ncr list: ");
            console.log(newNCRs);
        };
    }
    else if(loggedInRole == "Purchasing"){
        recentNCR.forEach((ncr: any) => {
            const selEng = db.GetENGByID(ncr.EngineeringID);

            const date: Date = new Date(selEng.DateSigned);
            if(logInDate.getDate() < date.getDate()){
                //only add unseen NCRs that they have to complete
                if(ncr.PurchasingID == null){
                    newNCRs.push(ncr);
                    console.log("Unseen ncr found!");
                }
            }
        })
        console.log("Ncr list: ");
        console.log(newNCRs);
    }
});

