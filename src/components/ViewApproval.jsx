import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { Button } from "./ui/button";

const ViewNotificationTemplate = ({ refetchData }) => {
  console.log("this is refecth data", refetchData);

  const downloadPDF = () => {
    setTimeout(() => {
      const input = document.getElementById("pdf-content");

      html2canvas(input, {
        scale: 8, // Higher scale for better resolution
        useCORS: true, // Handle CORS issues for images
        backgroundColor: null, // Preserve background transparency
        logging: false,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const imgWidth = 200; // Fit within A4 width
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const padding = 10;

        pdf.addImage(imgData, "PNG", padding, padding, imgWidth, imgHeight, "", "FAST");
        pdf.save("notification.pdf");
      });
    }, 500);
  };

  if (!refetchData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 relative">
      <h2 className="text-2xl font-bold mb-4 absolute -top-5">View Approval</h2>
      <div id="pdf-content">
        {/* Header Section */}
        <div className="flex justify-center gap-3 items-center">
          <div className="mt-5">
            <img
              src="/UET.jpeg"
              alt="UET Mardan Logo"
              className="w-24 mx-auto rounded-full"
            />
            <p className="text-sm mt-2 font-semibold cursor-pointer">
              {refetchData.registrarOffice}
            </p>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold uppercase">
              University of Engineering and Technology, Mardan
            </h1>
            <p className="text-sm cursor-pointer">{refetchData.phoneFax}</p>
            <p className="text-sm cursor-pointer">{refetchData.email}</p>
          </div>
        </div>
        <div className="flex flex-col justify-start items-end mt-4 mr-4">
          <p className="cursor-pointer">
            <strong>Ref No:</strong> {refetchData.refNo}
          </p>
          <p className="cursor-pointer">
            <strong>Dated:</strong> {refetchData.date}
          </p>
        </div>
        <hr className="my-4" />

        {/* Notification Title */}
        <div className="text-center my-6">
          <h2 className="text-3xl font-bold underline">NOTIFICATION</h2>
        </div>

        {/* Notification Body */}
        <div className="p-5 " dangerouslySetInnerHTML={{ __html: refetchData.bodyText }} />
      </div>

      <Button onClick={downloadPDF} className="mt-8 rounded-full">
        Download PDF
      </Button>
    </div>
  );
};

export default ViewNotificationTemplate;