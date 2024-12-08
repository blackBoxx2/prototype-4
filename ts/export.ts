//This is just testing propose
//NCRLog tiene todos los ncr necesarios para cada uno de los ncr necesarios entonces solo necesito una tabla en general para accesar a esto

import { DatabaseLib } from "./database";
import * as $ from "../src/jquery.js";
import { Models } from "./Models.js";
import jsPDF from "jspdf";
import { error } from "jquery";
const selected = localStorage.getItem('selectedNcrId');

document.addEventListener('DOMContentLoaded', function() {
    const btnDownload = document.querySelector('.btn-download');
    if (btnDownload) {
        //Download the pdf
        btnDownload.addEventListener('click', () => {
            console.log('Button encontrado');
            createPDF();      
        });
    } else {
        console.error('El botón de descarga no se encuentra');
    };
    //To Fix: Probablemente el numero de documento ya que quiero que cada que sea descargado ssea el mismo numero
    //Las paginas es importante cambiarlas para que cuente las paginas bien y que de todo caso sea posible que las paginas se agreguen perfectamente
   const usedNumbers = new Set<number>();
   function randomNumber(min: number, max: number): number {
    
    if(usedNumbers.size >= max - min + 1){
        throw new Error('No more unique numbers avaliable');
    }
    let num;
    do{
        num = Math.floor(Math.random() * (max - min + 1)) + min;
    }while(usedNumbers.has(num));

    usedNumbers.add(num);
    return num;
    
   }
   
     //create the pdf
    function createPDF() {
        if (selected) {
            var db = DatabaseLib.Database.get();
            const selectedID = Number(selected);
            const selectedNCR = db.GetNCRByNumber(selectedID);
            const selectedQA = db.GetQAByID(Number(selectedNCR.QualityAssuranceID));
            const selectedEng = db.GetENGByID(Number(selectedNCR.EngineeringID));
            const selectedPur = db.GetPURByID(Number(selectedNCR.PurchasingID));
            const modelStatus = Models.Status[selectedNCR.Status];
            const Status = db.GetSupplierByID(Number(selectedNCR.Status));
            //create a textbox
            function checkbox( x, y, length, width) {
                pdf.rect(x, y, length, width);
                pdf.line(x, y, x + length, y + width);
                pdf.line(x, y + length, x + width, y);
            }
    
            if (!selectedNCR || !selectedQA) {
                console.error('No se pudo obtener datos para el NCR o QA');
                return;
            }
            const pdf = new jsPDF('p', 'mm', 'a4');

            let pages = pdf.getNumberOfPages();
            
             // Estilo del encabezado
            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0); // Color negro para el texto
            pdf.setFontSize(14);

            
            pdf.text('CrossFire Canada', 12, 12);
            pdf.text('Internal process document', 130, 12);
            pdf.setFontSize(10);
            pdf.text(`Doocument No. 0000${selectedNCR.ID}`, 12, 25);
            pdf.text('Document Title: Non-Conformance Report', 70,25)
            pdf.text(`Pages:${pages}`,160,25);
            pdf.text('Identify Process Applicable:',12, 32)
            pdf.text('Quality Portion:', 12, 38)
            pdf.text(`Supplier Name: ${Status.Name}`,12, 44)
            pdf.text(`NCR Number: ${selectedNCR.NCRNumber}`, 154, 38);
            pdf.text(`Description of Item: ${selectedQA.ItemDescription}`,12, 50 );
            pdf.text(`Description of Defect: ${selectedQA.DefectDescription} `, 12, 56);
            pdf.text(`PO or Prod No.: ${selectedQA.ProductNo}`, 154, 44);
            pdf.text(`Sales Order No.: ${selectedQA.OrderNo}`, 154, 50);
            pdf.text(`Quantity Recived: ${selectedQA.QuantityReceived}`, 154, 62);
            pdf.text(`Quantity Defective: ${selectedQA.QuantityDefective}`, 154, 56);
            pdf.text('Item Marked Nonconforming:', 12, 62);
            pdf.text('Yes', 60, 62)
            pdf.text(`Quality Representative's Name: ${selectedQA.SignedByUser}`,70,74);
            pdf.text(`Date: ${selectedQA.DateSigned}`, 154, 74)
            pdf.text('Engineering:', 12, 82);
            pdf.text(`Review By CF Engineering: ${selectedEng.Review}`, 12, 88);
            pdf.text(`Does Customer require notification of NCR: ${selectedEng.NotifyCustomer}`,12, 94);
            pdf.text('Disposition', 12, 104);
            pdf.text(`The Drawing require update: ${selectedEng.UpdateDrawing}`, 12, 110);
            pdf.text(`Original Rev. Number: ${selectedEng.OriginalRevNumber}`, 12, 116);
            pdf.text(`Updated Rev. Number: ${selectedEng.LatestRevNumber}`,70, 116);
            pdf.text(`Revision Date: ${selectedEng.DateSigned}`, 70, 124);
            pdf.text(`Engineering: ${selectedEng.SignedByUser}`, 70, 130);
            pdf.text(`Name of Engineering: ${selectedEng.ID}`, 12, 122);
            pdf.text(`Date: ${selectedEng.DateSigned}`, 154, 124);
            pdf.text('Purcharsing:', 12, 138);
            pdf.text(`Purchasing's Preliminary Decision: ${selectedPur.Decision}`, 12, 144);
            pdf.text(`Was a CAR raised?: ${selectedPur.CARRaised}`,12, 150);
            pdf.text(`Follow-up Required? ${selectedPur.CARRaised}`,12,156);
            pdf.text(`Operations Manager: ${selectedPur.SignedByUser}`, 70, 162);
            pdf.text(`Re-Inspected Acceptable: ${selectedPur.ReInspectAcceptable}`,12,168);
            pdf.text(`New NCR Number: ${selectedPur.NewNCRNumber}`, 12, 174);
            pdf.text(`Inspector's  Name: ${selectedPur.SignedByUser}`,70, 174);
            pdf.text(`NCR Closed: ${modelStatus}`, 12, 180);
            pdf.text(`Quality Department ${selectedPur.QualityDept}`,70, 186)
            pdf.text(`Date: ${selectedPur.DateSigned}`,154,186);


            // Agrega más campos de la misma manera según tus necesidades
    
            pdf.save(`ncr_report_0000${selectedNCR.ID}.pdf`); // Guarda el archivo PDF con el nombre que prefieras
        } else {
            console.error('No hay un NCR seleccionado');
        }
    }

 })
 
  