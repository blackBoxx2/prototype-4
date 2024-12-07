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
   
    const generateDocNumber = randomNumber(1,100);
     //create the pdf
    function createPDF() {
        if (selected) {
            var db = DatabaseLib.Database.get();
            const selectedID = Number(selected);
            const selectedNCR = db.GetNCRByNumber(selectedID);
            const selectedQA = db.GetQAByID(Number(selectedNCR.QualityAssuranceID));
            const selectedEng = db.GetENGByID(Number(selectedNCR.EngineeringID));
            const selectedPur = db.GetPURByID(Number(selectedNCR.PurchasingID));
           // const selectedSupp = db.GetSupplierByID((Number(selectedNCR.EngineeringID)))
            const Status = db.GetSupplierByID(Number(selectedNCR.Status));
            //create a textbox
            function checkbox(value, x, y, length, width) {
                pdf.text(value, x, y);
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
            
            for(let i = 1; i <= 5; i++){
                pdf.text(`${i}`, 10,10);
                //pdf.text(`Page: ${i} of ${pages}`,10,280)
                if(i< 5) pdf.addPage();
            }
            for(let numberPage = 1; numberPage <= pages; numberPage++){
                pdf.setPage(numberPage);
                const lastText = `Page ${numberPage} of ${pages}`
                pdf.text(lastText, 10, 280)
            }
            let finalPages;
            pages = finalPages;
             // Estilo del encabezado
            pdf.setFillColor(192, 192, 192); // Color de fondo gris
            pdf.rect(10, 10, 190, 20, "F"); // Rectángulo del encabezado
            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0); // Color negro para el texto
            pdf.setFontSize(14);

            
            pdf.text('CrossFire Canada', 12, 18);
            pdf.text('Internal process document', 130, 18);
            pdf.setFontSize(10);
            pdf.text(`Doocument No. ${generateDocNumber}`, 12, 25);
            pdf.text('Document Title: Non-Conformance Report', 70,25)
            pdf.text(`Pages:${finalPages}`,170,25);
            pdf.text('Identify Process Applicable:',12, 32)
            pdf.text(`Supplier Name: ${Status.Name}`,70, 32)
            pdf.text(`NCR Number: $selectedNCR.NCRNumber`, 170, 32);
            pdf.text('Description: ' + selectedQA.DefectDescription, 10, 40);

            // Agrega más campos de la misma manera según tus necesidades
    
            pdf.save(`ncr_report${generateDocNumber}.pdf`); // Guarda el archivo PDF con el nombre que prefieras
        } else {
            console.error('No hay un NCR seleccionado');
        }
    }

 })
 
  