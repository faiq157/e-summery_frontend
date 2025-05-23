import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { Button } from "./ui/button";
import CommentsApproval from "./CommentsApproval";
import PdfGenerator from "./PdfGenerator";
import { useApprovalAccess } from "@/context/ApprovalAccessContext";

const ViewNotificationTemplate = ({ refetchData }) => {

    const storedUser = localStorage.getItem("user");
    const userObject = storedUser ? JSON.parse(storedUser) : null;
        const { hasAccess ,userRole } = useApprovalAccess();
      
    


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
              src="/UET.png"
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

      <PdfGenerator
    fields={refetchData} 
    bodyText={refetchData.bodyText} 
  />
      {hasAccess && (
        <CommentsApproval existingData={refetchData} userRole={userRole} />
      )}
   
    </div>
  );
};

export default ViewNotificationTemplate;