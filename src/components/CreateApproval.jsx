import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { FaDownload } from "react-icons/fa";
import { Button } from "./ui/button";
import { IoCreate } from "react-icons/io5";
import axiosInstance from "@/utils/http";

const NotificationTemplate = ({closeModal,refetchData}) => {
  const base_URL = import.meta.env.VITE_APP_API_URL;
  const [bodyText, setBodyText] = useState(`
    <p>The Vice-Chancellor, University of Engineering & Technology, Mardan, is pleased
    to constitute the following committee to examine the surplus amount recorded
    as miscellaneous income and profit from the PSDP project titled 
    <strong>"Establishment and Upgrading of Core Engineering Departments at the University of Engineering & Technology, Mardan."</strong></p>
  `);

  const [fields, setFields] = useState({
    registrarOffice: "Office of the Registrar",
    phoneFax: " 0937-9230205,  0937-9230296",
    email: " registrar@uetmardan.edu.pk",
    refNo: "17835/13/2025/UETM-R",
    date: "24/02/2025",
  });

  const [editingField, setEditingField] = useState(null);
  const [isEditing, setIsEditing] = useState(true);

  // Single function to handle click & update logic using switch
  const handleFieldInteraction = (field, value = null) => {
    switch (true) {
      case value === null: // Click to Edit
        setEditingField(field);
        break;
      default: // Save the Edited Value
        setFields((prev) => ({ ...prev, [field]: value }));
        setEditingField(null);
        break;
    }
  };

  const downloadPDF = () => {
    setIsEditing(false);
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
        setIsEditing(true);
      });
    }, 500);
  };


  const createApprovalData = () => {
    const data = {
      title: "Approval Title",
      registrarOffice: fields.registrarOffice,
      phoneFax: fields.phoneFax,
      email: fields.email,
      refNo: fields.refNo,
      date: fields.date,
      bodyText: bodyText,
    };
    axiosInstance.post(`${base_URL}/approval`, data, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      console.log('Success:', response.data);
      closeModal();

      window.location.reload();
      
     
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <div className="w-full mx-auto p-6 relative ">
              <h2 className="text-2xl font-bold mb-4 absolute -top-5">Create Approval</h2>
      <div id="pdf-content">
        {/* Header Section */}
        <div className="flex justify-center gap-3 items-center">
          <div className="mt-5">
            <img
              src="/UET.jpeg"
              alt="UET Mardan Logo"
              className="w-24 mx-auto rounded-full"
            />
            <p 
              className="text-sm mt-2 font-semibold cursor-pointer"
              onClick={() => handleFieldInteraction("registrarOffice")}
            >
              {editingField === "registrarOffice" ? (
                <input 
                  type="text" 
                  value={fields.registrarOffice} 
                  onChange={(e) => handleFieldInteraction("registrarOffice", e.target.value)}
                  onBlur={() => handleFieldInteraction("registrarOffice", fields.registrarOffice)}
                  autoFocus
                  className="border p-1 rounded w-full"
                />
              ) : fields.registrarOffice}
            </p>
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold uppercase">
              University of Engineering and Technology, Mardan
            </h1>
            <p 
              className="text-sm cursor-pointer"
              onClick={() => handleFieldInteraction("phoneFax")}
            >
              {editingField === "phoneFax" ? (
                <input 
                  type="text" 
                  value={fields.phoneFax} 
                  onChange={(e) => handleFieldInteraction("phoneFax", e.target.value)}
                  onBlur={() => handleFieldInteraction("phoneFax", fields.phoneFax)}
                  autoFocus
                  className="border p-1 rounded w-full"
                />
              ) : fields.phoneFax}
            </p>
            <p 
              className="text-sm cursor-pointer"
              onClick={() => handleFieldInteraction("email")}
            >
              {editingField === "email" ? (
                <input 
                  type="text" 
                  value={fields.email} 
                  onChange={(e) => handleFieldInteraction("email", e.target.value)}
                  onBlur={() => handleFieldInteraction("email", fields.email)}
                  autoFocus
                  className="border p-1 rounded w-full"
                />
              ) : fields.email}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-start items-end mt-4 mr-3">
          <p 
            className="cursor-pointer"
            onClick={() => handleFieldInteraction("refNo")}
          >
            <strong>Ref No:</strong> 
            {editingField === "refNo" ? (
              <input 
                type="text" 
                value={fields.refNo} 
                onChange={(e) => handleFieldInteraction("refNo", e.target.value)}
                onBlur={() => handleFieldInteraction("refNo", fields.refNo)}
                autoFocus
                className="border p-1 ml-2"
              />
            ) : ` ${fields.refNo}`}
          </p>
          <p 
            className="cursor-pointer"
            onClick={() => handleFieldInteraction("date")}
          >
            <strong>Dated:</strong> 
            {editingField === "date" ? (
              <input 
                type="text" 
                value={fields.date} 
                onChange={(e) => handleFieldInteraction("date", e.target.value)}
                onBlur={() => handleFieldInteraction("date", fields.date)}
                autoFocus
                className="border p-1 rounded ml-2"
              />
            ) : ` ${fields.date}`}
          </p>
        </div>
        <hr className="my-4" />

        {/* Notification Title */}
        <div className="text-center my-6">
          <h2 className="text-3xl font-bold underline">NOTIFICATION</h2>
        </div>

        {/* Show Editor in Editing Mode, otherwise Display Formatted Text */}
        {isEditing ? (
          <ReactQuill
            value={bodyText}
            onChange={setBodyText}
            theme="snow"
            className="bg-white p-4"
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"],
              ],
            }}
          />
        ) : (
          <div className="p-4" dangerouslySetInnerHTML={{ __html: bodyText }} />
        )}
      </div>

      <Button onClick={downloadPDF} className="rounded-full">
        <FaDownload/> Download
      </Button>
      <Button onClick={createApprovalData} className="mt-4 px-4 ml-3 py-2 bg-green-500 text-white rounded-full">
       <IoCreate /> Create
      </Button>
    </div>
  );
};

export default NotificationTemplate;