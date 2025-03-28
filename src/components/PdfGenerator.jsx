import React from "react";
import jsPDF from "jspdf";
import { FaDownload } from "react-icons/fa";
import { Button } from "./ui/button";

const PdfGenerator = ({ fields, bodyText }) => {
  const downloadPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageHeight = 297;
    const marginBottom = 20;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("University of Engineering and Technology, Mardan", 105, 15, { align: "center" });

    pdf.setFontSize(12);
    pdf.addImage("/UET.png", "JPEG", 20, 20, 30, 30);
    pdf.text(fields.registrarOffice, 10, 55);
    pdf.text(`(Phone No: ${fields.phoneFax})`, 105, 25, { align: "center" });
    pdf.text(fields.email, 105, 30, { align: "center" });

    pdf.setFont("helvetica", "bold");
    pdf.text(`Ref No: ${fields.refNo}`, 140, 50);
    pdf.text(`Dated: ${fields.date}`, 140, 55);
    pdf.line(10, 60, 200, 60);

    pdf.setFontSize(18);
    pdf.text("NOTIFICATION", 105, 70, { align: "center" });

    const textWidth = pdf.getTextWidth("NOTIFICATION");
    const startX = 105 - textWidth / 2;
    const endX = 105 + textWidth / 2;
    pdf.line(startX, 73, endX, 73);

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    const splitBodyText = pdf.splitTextToSize(bodyText.replace(/<\/?[^>]+(>|$)/g, ""), 180);
    pdf.text(splitBodyText, 15, 80);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text("Registrar", 160, pageHeight - marginBottom);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text("University of Engineering &", 150, pageHeight - 15);
    pdf.text("Technology, Mardan", 150, pageHeight - 10);

    pdf.save("notification.pdf");
  };

  return (
    <Button 
    onClick={downloadPDF} 
    className={`rounded-full ${
      !bodyText || bodyText.trim() === "" ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white"
    }`}
    disabled={!bodyText || bodyText.trim() === ""} // Disable button if bodyText is empty
  >
    <FaDownload /> Download
  </Button>
  );
};

export default PdfGenerator;
