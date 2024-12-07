"use strict";
//This is just testing propose
//NCRLog tiene todos los ncr necesarios para cada uno de los ncr necesarios entonces solo necesito una tabla en general para accesar a esto
Object.defineProperty(exports, "__esModule", { value: true });
var database_1 = require("./database");
var jspdf_1 = require("jspdf");
var selected = localStorage.getItem('selectedNcrId');
document.addEventListener('DOMContentLoaded', function () {
    var btnDownload = document.querySelector('.btn-download');
    if (btnDownload) {
        //Download the pdf
        btnDownload.addEventListener('click', function () {
            console.log('Button encontrado');
            createPDF();
        });
    }
    else {
        console.error('El botón de descarga no se encuentra');
    }
    ;
    //To Fix: Probablemente el numero de documento ya que quiero que cada que sea descargado ssea el mismo numero
    //Las paginas es importante cambiarlas para que cuente las paginas bien y que de todo caso sea posible que las paginas se agreguen perfectamente
    var usedNumbers = new Set();
    function randomNumber(min, max) {
        if (usedNumbers.size >= max - min + 1) {
            throw new Error('No more unique numbers avaliable');
        }
        var num;
        do {
            num = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (usedNumbers.has(num));
        usedNumbers.add(num);
        return num;
    }
    var generateDocNumber = randomNumber(1, 100);
    //create the pdf
    function createPDF() {
        if (selected) {
            var db = database_1.DatabaseLib.Database.get();
            var selectedID = Number(selected);
            var selectedNCR = db.GetNCRByNumber(selectedID);
            var selectedQA = db.GetQAByID(Number(selectedNCR.QualityAssuranceID));
            var selectedEng = db.GetENGByID(Number(selectedNCR.EngineeringID));
            var selectedPur = db.GetPURByID(Number(selectedNCR.PurchasingID));
            // const selectedSupp = db.GetSupplierByID((Number(selectedNCR.EngineeringID)))
            var Status = db.GetSupplierByID(Number(selectedNCR.Status));
            //create a textbox
            function checkbox(value, x, y, length, width) {
                pdf_1.text(value, x, y);
                pdf_1.rect(x, y, length, width);
                pdf_1.line(x, y, x + length, y + width);
                pdf_1.line(x, y + length, x + width, y);
            }
            if (!selectedNCR || !selectedQA) {
                console.error('No se pudo obtener datos para el NCR o QA');
                return;
            }
            var pdf_1 = new jspdf_1.default('p', 'mm', 'a4');
            var pages = pdf_1.getNumberOfPages();
            for (var i = 1; i <= 5; i++) {
                pdf_1.text("".concat(i), 10, 10);
                //pdf.text(`Page: ${i} of ${pages}`,10,280)
                if (i < 5)
                    pdf_1.addPage();
            }
            for (var numberPage = 1; numberPage <= pages; numberPage++) {
                pdf_1.setPage(numberPage);
                var lastText = "Page ".concat(numberPage, " of ").concat(pages);
                pdf_1.text(lastText, 10, 280);
            }
            var finalPages = void 0;
            pages = finalPages;
            // Estilo del encabezado
            pdf_1.setFillColor(192, 192, 192); // Color de fondo gris
            pdf_1.rect(10, 10, 190, 20, "F"); // Rectángulo del encabezado
            pdf_1.setFontSize(12);
            pdf_1.setTextColor(0, 0, 0); // Color negro para el texto
            pdf_1.setFontSize(14);
            pdf_1.text('CrossFire Canada', 12, 18);
            pdf_1.text('Internal process document', 130, 18);
            pdf_1.setFontSize(10);
            pdf_1.text("Doocument No. ".concat(generateDocNumber), 12, 25);
            pdf_1.text('Document Title: Non-Conformance Report', 70, 25);
            pdf_1.text("Pages:".concat(finalPages), 170, 25);
            pdf_1.text('Identify Process Applicable:', 12, 32);
            pdf_1.text("Supplier Name: ".concat(Status.Name), 70, 32);
            pdf_1.text("NCR Number: $selectedNCR.NCRNumber", 170, 32);
            pdf_1.text('Description: ' + selectedQA.DefectDescription, 10, 40);
            // Agrega más campos de la misma manera según tus necesidades
            pdf_1.save("ncr_report".concat(generateDocNumber, ".pdf")); // Guarda el archivo PDF con el nombre que prefieras
        }
        else {
            console.error('No hay un NCR seleccionado');
        }
    }
});
