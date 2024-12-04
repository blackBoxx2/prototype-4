import { DatabaseLib } from "./database";
<<<<<<< HEAD
import * as $ from "../src/jquery.js";
import { Models } from "./Models.js";
=======
import * as $ from "jquery";
import { Models } from "./Models";
>>>>>>> 7100feb83d9543cdea859f4eef1f95c483375d54

$(function() {
    //reset selected ncr to 0
    localStorage.setItem('selectedNcrId', "0");
    const tableBody = document.querySelector("#ncr-table") as HTMLTableSectionElement;
    var db = DatabaseLib.Database.get();

    const allQa = db.tables.QualityAssurances;
    const ncrLogs = db.tables.NCRLogs;
    if(allQa.length == 0){
        console.log("No QA's to display.")
    }

    if(tableBody){
        ncrLogs.forEach((ncr: any) => {
            const selQA = db.GetQAByID(ncr.QualityAssuranceID);
            console.log(selQA.DateSigned)
            const date = new Date(selQA.DateSigned).toLocaleDateString();
            const status = Models.Status[ncr.Status];
            const row = `
            <tr>
                <td>${selQA.DefectDescription}</td>
                <td>${date}</td>
                <td>${status}</td>
                <td class="action"><a data-id="${ncr.NCRNumber}" href="/NCRLog/Details.html" class="viewNCR">Details</a> | <a data-id="${ncr.NCRNumber}" id="btnEdit" href="/NCRLog/edit.html" class="editNCR">Edit</a></td>

            </tr>`;
            tableBody.innerHTML += row;
    });
    }
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