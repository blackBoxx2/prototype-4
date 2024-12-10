import { DatabaseLib } from "./database";
import * as $ from "jquery";
import { Models } from "./Models";

$(function() {
    // moved to before the db load so we can potentially skip loading data if not necessary
    const userRole = localStorage.getItem('userRole');

    if (!userRole) {
        return; // user will be redirected to login by navbar
    }


    const db = DatabaseLib.Database.get();
    const ncrLogs = db.tables.NCRLogs;
    
    const roleActions: { [key: string]: { name: string; link: string, img: string}[] } = {
        QA: [
            { name: 'Create New', link: '/NCRLog/create.html', img: '/imgs/create-icon.png' },
            { name: 'View Logs', link: '/NCRLog/index.html', img: '/imgs/view-icon.png' }
        ],
        Engineer: [
            { name: 'Filtered Logs', link: 'no-filtered-logs', img: '/imgs/filter-icon.png' },
            { name: 'View Logs', link: '/NCRLog/index.html', img: '/imgs/view-icon.png' }
        ],
        Purchasing: [
            { name: 'View Reports', link: 'no-reports-page', img: '/imgs/view-icon.png' },
            { name: 'View Logs', link: '/NCRLog/index.html', img: '/imgs/view-icon.png' }
        ],
        Admin: [
            { name: 'View Reports', link: 'no-reports-page', img: '/imgs/view-icon.png' },
            { name: 'View Logs', link: '/NCRLog/index.html', img: '/imgs/view-icon.png' }
        ]
    };

    // Load buttons based on the role
    const roleButtons = document.getElementById('role-buttons');
    if (roleActions[userRole]) {
        roleActions[userRole].forEach(action => {
            const button = document.createElement('button');
            button.className = 'cta-btn role-action-btn';

            button.innerHTML = `
                        <img src="${action.img}" alt="${action.name}" class="button-icon"> ${action.name}
                    `;      
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
                <button data-id="${ncr.NCRNumber}" onclick="location.href='/NCRLog/Details'" class="viewNCR">
                    <img src="/imgs/details-icon.png" alt="Details" class="button-icon"> Details
                </button> 
                <span class="separator">|</span>
                <button data-id="${ncr.NCRNumber}" onclick="location.href='/NCRLog/Edit'" class="editNCR">
                    <img src="/imgs/edit-icon.png" alt="Edit" class="button-icon"> Edit
                </button>
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