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
            var selEng: Models.Engineering | null = null;
            //if the engineering portion was completed
            if(ncr.EngineeringID != undefined && ncr.EngineeringID != null)
                selEng = db.GetENGByID(ncr.EngineeringID);
            else //else engineering is not completed therefore do not add it to the list
                return;
            
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
        //Same as other list, except it compares Eng date to Purch log in date instead of QA to ENG log in date
        if(newNCRs.length > 0){
            notifsDiv.style.display = "block";
            numberOfNotifs.innerHTML = "You have " + newNCRs.length + " new NCRs to complete";
            newNCRs.forEach((ncr: any) =>{
                const selQA = db.GetQAByID(ncr.QualityAssuranceID);
                const selEng = db.GetENGByID(ncr.EngineeringID);
                const supplierName = db.GetSupplierByID(selQA.SupplierID);
                const date = new Date(selEng.DateSigned).toLocaleDateString();
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

    //Click event listener for "Action" buttons
    tableBody.addEventListener('click', function(n) {
        //.target: gets the element where the event occured, then we can determine if they want
        //to edit, view or delete
        const clickedType = n.target as HTMLElement;
        console.log("clicked event");
        if(clickedType && (clickedType.classList.contains('viewNCR') 
        || clickedType.classList.contains('editNCR') || clickedType.classList.contains('deleteNCR')))
        {
            //get the type - set in each data-id="" in the buttons
            const ncrId = clickedType.getAttribute('data-id');
            console.log("Clicked ID: " + ncrId);
            //if the button isnt null
            if(ncrId){
                //set the local storage selected id to the current selected ncr id
                localStorage.setItem('selectedNcrId', ncrId);
            }
            else{
                console.log("Error: ncrId is false");
            }
        }
    })
});

