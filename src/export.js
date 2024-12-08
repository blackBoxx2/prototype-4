"use strict";
//This is just testing propose
//NCRLog tiene todos los ncr necesarios para cada uno de los ncr necesarios entonces solo necesito una tabla en general para accesar a esto
Object.defineProperty(exports, "__esModule", { value: true });
var database_1 = require("./database");
var Models_js_1 = require("./Models.js");
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
    //create the pdf
    function createPDF() {
        if (selected) {
            var db = database_1.DatabaseLib.Database.get();
            var selectedID = Number(selected);
            var selectedNCR = db.GetNCRByNumber(selectedID);
            var selectedQA = db.GetQAByID(Number(selectedNCR.QualityAssuranceID));
            var selectedEng = db.GetENGByID(Number(selectedNCR.EngineeringID));
            var selectedPur = db.GetPURByID(Number(selectedNCR.PurchasingID));
            var modelStatus = Models_js_1.Models.Status[selectedNCR.Status];
            var Status = db.GetSupplierByID(Number(selectedNCR.Status));
            //create a textbox
            function checkbox(x, y, length, width) {
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
            // Estilo del encabezado
            pdf_1.setFontSize(12);
            pdf_1.setTextColor(0, 0, 0); // Color negro para el texto
            pdf_1.setFontSize(14);
            pdf_1.text('CrossFire Canada', 12, 12);
            pdf_1.text('Internal process document', 130, 12);
            pdf_1.setFontSize(10);
            pdf_1.text("Doocument No. 0000".concat(selectedNCR.ID), 12, 25);
            pdf_1.text('Document Title: Non-Conformance Report', 70, 25);
            pdf_1.text("Pages:".concat(pages), 160, 25);
            pdf_1.text('Identify Process Applicable:', 12, 32);
            pdf_1.text('Quality Portion:', 12, 38);
            pdf_1.text("Supplier Name: ".concat(Status.Name), 12, 44);
            pdf_1.text("NCR Number: ".concat(selectedNCR.NCRNumber), 154, 38);
            pdf_1.text("Description of Item: ".concat(selectedQA.ItemDescription), 12, 50);
            pdf_1.text("Description of Defect: ".concat(selectedQA.DefectDescription, " "), 12, 56);
            pdf_1.text("PO or Prod No.: ".concat(selectedQA.ProductNo), 154, 44);
            pdf_1.text("Sales Order No.: ".concat(selectedQA.OrderNo), 154, 50);
            pdf_1.text("Quantity Recived: ".concat(selectedQA.QuantityReceived), 154, 62);
            pdf_1.text("Quantity Defective: ".concat(selectedQA.QuantityDefective), 154, 56);
            pdf_1.text('Item Marked Nonconforming:', 12, 62);
            pdf_1.text('Yes', 60, 62);
            pdf_1.text("Quality Representative's Name: ".concat(selectedQA.SignedByUser), 70, 74);
            pdf_1.text("Date: ".concat(selectedQA.DateSigned), 154, 74);
            pdf_1.text('Engineering:', 12, 82);
            pdf_1.text("Review By CF Engineering: ".concat(selectedEng.Review), 12, 88);
            pdf_1.text("Does Customer require notification of NCR: ".concat(selectedEng.NotifyCustomer), 12, 94);
            pdf_1.text('Disposition', 12, 104);
            pdf_1.text("The Drawing require update: ".concat(selectedEng.UpdateDrawing), 12, 110);
            pdf_1.text("Original Rev. Number: ".concat(selectedEng.OriginalRevNumber), 12, 116);
            pdf_1.text("Updated Rev. Number: ".concat(selectedEng.LatestRevNumber), 70, 116);
            pdf_1.text("Revision Date: ".concat(selectedEng.DateSigned), 70, 124);
            pdf_1.text("Engineering: ".concat(selectedEng.SignedByUser), 70, 130);
            pdf_1.text("Name of Engineering: ".concat(selectedEng.ID), 12, 122);
            pdf_1.text("Date: ".concat(selectedEng.DateSigned), 154, 124);
            pdf_1.text('Purcharsing:', 12, 138);
            pdf_1.text("Purchasing's Preliminary Decision: ".concat(selectedPur.Decision), 12, 144);
            pdf_1.text("Was a CAR raised?: ".concat(selectedPur.CARRaised), 12, 150);
            pdf_1.text("Follow-up Required? ".concat(selectedPur.CARRaised), 12, 156);
            pdf_1.text("Operations Manager: ".concat(selectedPur.SignedByUser), 70, 162);
            pdf_1.text("Re-Inspected Acceptable: ".concat(selectedPur.ReInspectAcceptable), 12, 168);
            pdf_1.text("New NCR Number: ".concat(selectedPur.NewNCRNumber), 12, 174);
            pdf_1.text("Inspector's  Name: ".concat(selectedPur.SignedByUser), 70, 174);
            pdf_1.text("NCR Closed: ".concat(modelStatus), 12, 180);
            pdf_1.text("Quality Department ".concat(selectedPur.QualityDept), 70, 186);
            pdf_1.text("Date: ".concat(selectedPur.DateSigned), 154, 186);
            // Agrega más campos de la misma manera según tus necesidades
            pdf_1.save("ncr_report_0000".concat(selectedNCR.ID, ".pdf")); // Guarda el archivo PDF con el nombre que prefieras
        }
        else {
            console.error('No hay un NCR seleccionado');
        }
    }
});
