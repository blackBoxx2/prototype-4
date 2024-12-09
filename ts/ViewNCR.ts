import { DatabaseLib } from "./database";
import * as $ from "jquery";
import { Models } from "./Models";
import * as Toastify from "toastify-js";


$(function() {

    //on page load check for toast notifications from previous pages
    const msg = localStorage.getItem('toastMessage');
    const type = localStorage.getItem('toastType') as "success" | "error" | "info" | null;
    //if a message and type exists
    if(msg && type != null){
        Toastify({
            text: msg,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: type === "success" ? "green" : type === "error" ? "red" : "blue",
            close: true,
        }).showToast();
    }
    //clear local storage to avoid duplicate notifs
    localStorage.removeItem('toastMessage');
    localStorage.removeItem('toastType');
    //reset selected ncr to 0
    localStorage.setItem('selectedNcrId', "0");
    const tableBody = document.querySelector("#ncr-table tbody") as HTMLTableSectionElement;
    var db = DatabaseLib.Database.get();

    const allQa = db.tables.QualityAssurances;
    const ncrLogs = db.tables.NCRLogs;
    var arrayNCRs: any[] = [];
    if(allQa.length == 0){
        console.log("No QA's to display.")
    }

    if(tableBody){
        tableBody.innerHTML = ``;
        ncrLogs.forEach((ncr: any) => {
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
            arrayNCRs.push({
                NCRNumber: ncr.NCRNumber,
                Supplier: supplierName.Name,
                DateSigned: date,
                Status: status
            });
            tableBody.innerHTML += row;
    });
}
        /* Filtering - Owen and Carter */
        function applyFilter(): void {
            //get filter options
            const ncrNumber: number | null = Number((document.getElementById("ncr-number") as HTMLInputElement).value);
            const supplier: string | null = (document.getElementById("supplier") as HTMLInputElement).value;
            const fromDate: string | null = (document.getElementById("from-date") as HTMLInputElement).value;
            const toDate: string | null = (document.getElementById("to-date") as HTMLInputElement).value;
            const status: string | null = (document.getElementById("status") as HTMLInputElement).value;
        
            //get table
    
            const tableBody = document.querySelector("#ncr-table tbody") as HTMLTableSectionElement;
            
            const filteredRows = arrayNCRs.filter(item => {
                const date = new Date(item.DateSigned);
                return (
                    (!ncrNumber || item.NCRNumber === ncrNumber) &&
                    (!supplier || item.Supplier === supplier) &&
                    (!fromDate || date >= new Date(fromDate)) &&
                    (!toDate || date <= new Date(toDate)) &&
                    (!status || item.Status === status)
                );
            });
            if(filteredRows.length > 0){
                tableBody.innerHTML = ``;
                tableBody.innerHTML = filteredRows.map(item => 
                `<tr>
                    <td>${item.NCRNumber}</td>
                    <td>${item.Supplier}</td>
                    <td>${item.DateSigned}</td>
                    <td>${item.Status}</td>
                    <td class="action"><button data-id="${item.NCRNumber}" 
                        onclick="location.href='/NCRLog/Details.html'" 
                        class="viewNCR">
                        Details
                        </button>
                        |
                        <button 
                            data-id="${item.NCRNumber}" 
                            onclick="location.href='/NCRLog/edit.html'" 
                            class="editNCR">
                            Edit
                        </button></td>
                                    <tr>`).join("");
            }

            if (filteredRows.length === 0) {
                alert("No rows match the filter criteria.");
            } else {
                alert(`${filteredRows.length} row(s) found matching the filter criteria.`);
            }
        }
        
        // Add event listener to the filter button
        const filterButton = document.getElementById("filter-button") as HTMLButtonElement;
        filterButton.addEventListener("click", applyFilter);

        //clear all fields with button click
        const clearButton = document.getElementById("clear-button") as HTMLButtonElement;
        clearButton.addEventListener('click', () => {
            const ncrNumber = document.getElementById("ncr-number") as HTMLInputElement;
            const supplier = (document.getElementById("supplier") as HTMLInputElement);
            const fromDate = (document.getElementById("from-date") as HTMLInputElement);
            const toDate = (document.getElementById("to-date") as HTMLInputElement);
            const status = (document.getElementById("status") as HTMLInputElement);

            ncrNumber.value = "";
            supplier.value = "";
            fromDate.valueAsDate = new Date("yyyy-mm-dd");
            toDate.valueAsDate = new Date("yyyy-mm-dd");
            status.value = "";
            applyFilter();
        })
    tableBody.addEventListener('click', function(n) {
        //.target: gets the element where the event occured, then we can determine if they want
        //to edit, view or delete
        const clickedType = n.target as HTMLElement;
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