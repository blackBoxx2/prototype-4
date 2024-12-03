/*
import {DatabaseLib} from "./Database";
import jsPDF from "jspdf";

async function fetchData() : Promise<any[]>{
    try{
       if(DatabaseLib.fetchRecords) 
       
    }catch(e){
        console.error('Error loading the data from the database', e)
        throw new Error('Failed to load data')
    }
}           

function createPDF(data: any[]) : void{
    try{
        const pdf = new jsPDF();

        pdf.setFontSize(14);
        pdf.text('NCR Document', 12, 12)
        
        let y = 30;
        data.forEach((t, i) => {
            pdf.text(`${i + 1}. NCR No. ${i.}`)
        })
    }
}
    */