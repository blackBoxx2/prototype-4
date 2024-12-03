//This is just testing propose
//NCRLog tiene todos los ncr necesarios para cada uno de los ncr necesarios entonces solo necesito una tabla en general para accesar a esto

import { DatabaseLib } from "./database";
import * as $ from "../src/jquery.js";
import { Models } from "./Models.js";
import jsPDF from "jspdf";
const selected = localStorage.getItem('selectedNcrId');
if(selected){
    async function fetchData(table: string) : Promise<any[]>{
        try{
            
          const db = DatabaseLib.Database.get();
          db.ReSeed();
            
          const ncr = db.tables.NCRLogs;
          const selectedID = Number(selected)
          const selectedNCR = db.GetNCRByNumber(selectedID);
          } 
        catch(e){
            console.error('Error loading the data from the database', e)
            throw new Error('Failed to load data')
        }
    }           
    
    function createPDF(data: any[], table: string) : void{
        try{
            const pdf = new jsPDF('p', 'mm', 'a4');;
            
            pdf.setFontSize(14);
            pdf.text('CrossFire Canada', 12, 12);
            pdf.text('Internal process document', 12, 12);
            var doc = new jsPDF('p', 'mm', 'a4');

            function checkbox(x, y, length, width) {
            pdf.rect(x, y, length, width);
            pdf.line(x, y, x + length, y + width);
            pdf.line(x, y + length, x + width, y);
            }
            
            let y = 30;
            data.forEach((r, i) => {
                pdf.setFontSize(10);
                pdf.text('Document No.', 14, y);
                pdf.text(`${r.NCRNumber}`, 14, y);
                pdf.text('Document Title', 14, y);
                pdf.text('Page:',14, y);
                pdf.text('1 of 2:',14, y);
                pdf.text('Identify Process Applicable', 14, y);
                checkbox(10, 30, 2, 2);
                pdf.text('Supplier or Rec-Insp',28,10);
                pdf.text('WIP (Production Order)',28,10);
                if(r.productNo.isNullOrEmpty()){
                    pdf.text('Unchecked', 48, 10 )
                    pdf.rect(10, 50, 2, 2);
                    pdf.rect(20, 50, 4, 4);
                    pdf.rect(35, 50, 8, 8);
                    pdf.rect(55, 50, 12, 12);
                }else {
                    pdf.text('Checked', 48, 10 )
                    pdf.rect(10, 50, 2, 2);
                    pdf.rect(20, 50, 4, 4);
                    pdf.rect(35, 50, 8, 8);
                    pdf.rect(55, 50, 12, 12);
                }
                pdf.text('Supplier Name', 14, y);
                pdf.text(`${r.supplierName}`,14, y);
                pdf.text(`${i + 1}. NCR Number: ${r.ncrNumber || "N/A"}`, 14, y);
                pdf.text(`PO or Prod No. ${r.productNum}`, 14, y);
                pdf.text(`Sales Order No. ${r.salesOrderNum}`, 14, y);
                pdf.text(`Quantity recived ${r.QuantityReceived}`, 14, y);
                pdf.text(`Quantity Defective ${r.QuantityDefective}`, 14, y);
                pdf.text(`Description defect ${r.descriptionDefect}`, 14, y);
                pdf.text(`Item Marked Nonconforming`,14, y);
                if(r.Nonconforming.isNullOrEmpty()){
                    pdf.text('Unchecked', 48, 10 )
                    pdf.rect(10, 50, 2, 2);
                    pdf.rect(20, 50, 4, 4);
                    pdf.rect(35, 50, 8, 8);
                    pdf.rect(55, 50, 12, 12);
                }else{
                    pdf.text('Checked', 48, 10 )
                    pdf.rect(10, 50, 2, 2);
                    pdf.rect(20, 50, 4, 4);
                    pdf.rect(35, 50, 8, 8);
                    pdf.rect(55, 50, 12, 12);
                }
                pdf.text(`Quality Representatives Name: ${r.qaName} || "N/A"`, 14, y + 3);
                pdf.text(`Date: ${r.DateSigned} || "N/A"`, 14, y + 3);
                pdf.text('Review by CF  Enginiring', 14, y + 3);
                switch(r.Models.Review){
                    case 1:
                        r.Models.Review[0]
                        pdf.text('Checked', 48, 10 )
                        pdf.rect(10, 50, 2, 2);
                        pdf.rect(20, 50, 4, 4);
                        pdf.rect(35, 50, 8, 8);
                        pdf.rect(55, 50, 12, 12);
                    case 2: 
                        r.Models.Review[1]
                        pdf.text('Checked', 48, 10 )
                        pdf.rect(10, 50, 2, 2);
                        pdf.rect(20, 50, 4, 4);
                        pdf.rect(35, 50, 8, 8);
                        pdf.rect(55, 50, 12, 12);
                    case 3:
                        r.Models.Review[3]
                        pdf.text('Checked', 48, 10 )
                        pdf.rect(10, 50, 2, 2);
                        pdf.rect(20, 50, 4, 4);
                        pdf.rect(35, 50, 8, 8);
                        pdf.rect(55, 50, 12, 12);
                    case 4: 
                        r.Models.Review[4]
                        pdf.text('Checked', 48, 10 )
                        pdf.rect(10, 50, 2, 2);
                        pdf.rect(20, 50, 4, 4);
                        pdf.rect(35, 50, 8, 8);
                        pdf.rect(55, 50, 12, 12);
                }
                pdf.text('Does customer Require Notification of NCR', 14, y + 3);
                switch(r.Models.NotifyCustomer){
                    case 1: 
                        r.Models.NotifyCustomer[0];
                        pdf.text('Checked', 48, 10 )
                        pdf.rect(10, 50, 2, 2);
                        pdf.rect(20, 50, 4, 4);
                        pdf.rect(35, 50, 8, 8);
                        pdf.rect(55, 50, 12, 12);
                    case 2:
                        r.Models.NotifyCustomer[1];
                        pdf.text('Checked', 48, 10 )
                        pdf.rect(10, 50, 2, 2);
                        pdf.rect(20, 50, 4, 4);
                        pdf.rect(35, 50, 8, 8);
                        pdf.rect(55, 50, 12, 12);
                }
                pdf.text(`Name Of Enginering: ${r.nameOfEngineer}`, 14, y + 3);
                pdf.text(`Original Rev.Number: ${r.revisionDate} || "N/A"`, 14, y + 3);
                pdf.text(`Updated Rev: ${r.updatedRevNum} || "N/A"`, 14, y + 3);
                pdf.text(`Revision Date: ${r.LatestRevNumber} || "N/A"`, 14, y + 3);
                pdf.text(`Engineering: ${r.Engineering} || "N/A"`, 14, y + 3);
                pdf.text(`Date: ${r.Date} || "N/A"`, 14, y + 3);
                pdf.text(`Purcharsing Prelimenar Decision`, 14, y + 3);
                switch(r.Models.Prelimenar){
                    case 1: 
                        r.Models.Prelimenar[0];
                        pdf.text('Unchecked', 48, 10 )
                        pdf.rect(10, 50, 2, 2);
                        pdf.rect(20, 50, 4, 4);
                        pdf.rect(35, 50, 8, 8);
                        pdf.rect(55, 50, 12, 12);
                    case 2:
                        r.Models.Prelimenar[1];
                        pdf.text('Checked', 48, 10 )
                        pdf.rect(10, 50, 2, 2);
                        pdf.rect(20, 50, 4, 4);
                        pdf.rect(35, 50, 8, 8);
                        pdf.rect(55, 50, 12, 12);
                }
                switch(r.Models.){
                    
                }

            
            if(table === "NCRLogs"){
                pdf.text(`${i + 1}. NCR Number: ${r.NCRNumber || "N/A"}`, 14 , y);
            }else if(table === "Engineerings"){
                pdf.text(`${i + 1}. NCR Number: ${r.NCRNumber || "N/A"}`, 14, y);
            }
    
            y + 20;
            if(y > 280){
                pdf.addPage();
                y = 30;
            }
            });
            pdf.save(`${table}_Report.pdf`)
        }catch(e){
            console.error('Error in the creation of the pdf', e);
        }
    }
    async function GeneratePDF(table:string): Promise<void> {
        try{
            const loadData = await fetchData(table);
            createPDF(loadData, table);
        }catch(e){
            console.error('Error in the creation of the pdf', e);
        }
    }
    GeneratePDF("");
}
const btnDownload = document.querySelector('#btn-download');
btnDownload?.addEventListener('click', () =>{

});
