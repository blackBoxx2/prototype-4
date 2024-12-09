import { DatabaseLib } from "./database";
import * as $ from "jquery";
import { Models } from "./Models";

$(function() {

    const db = DatabaseLib.Database.get();
    const ncrLogs = db.tables.NCRLogs;
    const userRole = localStorage.getItem('userRole');

    if (!userRole) {
        alert("No user role found. Redirecting to login.");
        window.location.href = '/login.html';
        return;
    }

    const roleActions: { [key: string]: { name: string; link: string }[] } = {
        QA: [
            { name: 'Create New', link: '/NCRLog/create.html' },
            { name: 'View Logs', link: '/NCRLog/index.html' }
        ],
        Engineer: [
            { name: 'Filtered Logs', link: 'no-filtered-logs' },
            { name: 'View Logs', link: '/NCRLog/index.html' }
        ],
        Purchasing: [
            { name: 'View Reports', link: 'no-reports-page' },
            { name: 'View Logs', link: '/NCRLog/index.html' }
        ],
        Admin: [
            { name: 'View Reports', link: 'no-reports-page' },
            { name: 'View Logs', link: '/NCRLog/index.html' }
        ]
    };

    // Load buttons based on the role
    const roleButtons = document.getElementById('role-buttons');
    if (roleActions[userRole]) {
        roleActions[userRole].forEach(action => {
            const button = document.createElement('button');
            button.className = 'cta-btn role-action-btn';
            button.textContent = action.name;
            button.addEventListener('click', () => {
                window.location.href = action.link;
            });
            roleButtons?.appendChild(button);
        });
    } else {
        roleButtons!.textContent = "No actions available for your role.";
    }

    const recentNCRs: Models.NCRLog[] = [];
    // Fill array with ncr logs
    ncrLogs.forEach((ncr: any) => {
        recentNCRs.push(ncr);
    });

    // Sort by DateSigned
    recentNCRs.sort((a, b) => {
        const selQA1 = db.GetQAByID(a.QualityAssuranceID);
        const selQA2 = db.GetQAByID(b.QualityAssuranceID);

        const date1 = new Date(selQA1.DateSigned);
        const date2 = new Date(selQA2.DateSigned);
        return date2.getTime() - date1.getTime();
    });

    // Select 5 most recent
    const fiveRecentNCR = recentNCRs.slice(0, 5);

    const tableBody = document.querySelector('#ncr-table tbody')!;
    fiveRecentNCR.forEach((ncr: any) => {
        const selQA = db.GetQAByID(ncr.QualityAssuranceID);
        const supplierName = db.GetSupplierByID(selQA.SupplierID);
        const date = new Date(selQA.DateSigned).toLocaleDateString();
        const status = Models.Status[ncr.Status];
        
        const row = `
        <tr>
            <td>${ncr.NCRNumber}</td>
            <td>${supplierName.Name}</td>
            <td>${date}</td>
            <td>${status}</td>
            <td class="action">
                <button data-id="${ncr.NCRNumber}" onclick="location.href='/NCRLog/Details.html'" class="viewNCR">Details</button> |
                <button data-id="${ncr.NCRNumber}" onclick="location.href='/NCRLog/edit.html'" class="editNCR">Edit</button>
            </td>
        </tr>`;
        
        tableBody.innerHTML += row;
    });
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