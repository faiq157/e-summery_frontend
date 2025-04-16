import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { FaDownload } from "react-icons/fa";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { IoCreate } from "react-icons/io5";
import axiosInstance from "@/utils/http";
import CommentsApproval from "./CommentsApproval";
import PdfGenerator from "./PdfGenerator";
import { useApprovalAccess } from "@/context/ApprovalAccessContext";

const NotificationTemplate = ({ closeModal, existingData }) => {
  const base_URL = import.meta.env.VITE_APP_API_URL;
  const [bodyText, setBodyText] = useState(existingData?.bodyText);
  const storedUser = localStorage.getItem("user");
  const userObject = storedUser ? JSON.parse(storedUser) : null;
      const { hasAccess ,userRole } = useApprovalAccess();
      const userId = userObject?._id;
  

  const [fields, setFields] = useState({
    title: existingData?.title || "Approval Title",
    registrarOffice: existingData?.registrarOffice || "Office of the Registrar",
    phoneFax: existingData?.phoneFax || " 0937-9230205,  0937-9230296",
    email: existingData?.email || " registrar@uetmardan.edu.pk",
    refNo: existingData?.refNo || "17835/13/2025/UETM-R",
    date: existingData?.date || "24/02/2025",
  });

  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [isEditing, setIsEditing] = useState(true);

  const handleFieldInteraction = (field, value = null) => {
    switch (true) {
      case value === null: // Click to Edit
        setEditingField(field);
        setTempValue(fields[field]);
        break;
      default: // Save the Edited Value
        if (value.trim() === "") {
          alert("Field cannot be empty");
          return;
        }
        setFields((prev) => ({ ...prev, [field]: value }));
        setEditingField(null);
        break;
    }
  };

  const handleInputChange = (e) => {
    setTempValue(e.target.value);
  };

  const handleBlur = (field) => {
    handleFieldInteraction(field, tempValue);
  };
  
  
  const createOrUpdateApprovalData = () => {
    const data = {
      title: fields.title,
      registrarOffice: fields.registrarOffice,
      phoneFax: fields.phoneFax,
      email: fields.email,
      refNo: fields.refNo,
      date: fields.date,
      bodyText: bodyText,
      userId:userId
    };
    const request = existingData
      ? axiosInstance.put(`${base_URL}/approval/${existingData?._id}`, data, {
          headers: {
            'Content-Type': 'application/json',
          }
        })
      : axiosInstance.post(`${base_URL}/approval`, data, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

    request
      .then(response => {
        console.log('Success:', response.data);
        closeModal();
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const renderInputField = (field) => (
    <Input 
      type="text" 
      value={tempValue} 
      onChange={handleInputChange}
      onBlur={() => handleBlur(field)}
      autoFocus
      className="border p-1 rounded w-full"
    />
  );

  return (
    <div className="w-full mx-auto p-6 relative ">
      <h2 className="text-2xl font-bold mb-4 absolute -top-5">
        {existingData ? "Edit Approval" : "Create Approval"}
      </h2>
      <div id="pdf-content">
        {/* Header Section */}
        <div className="flex justify-center gap-3 items-center">
          <div className="mt-5">
            <img
              src="/UET.png"
              alt="UET Mardan Logo"
              className="w-24 mx-auto rounded-full"
            />
            <p 
              className="text-sm mt-2 font-semibold cursor-pointer"
              onClick={() => handleFieldInteraction("registrarOffice")}
            >
              {editingField === "registrarOffice" ? renderInputField("registrarOffice") : fields.registrarOffice}
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
              {editingField === "phoneFax" ? renderInputField("phoneFax") : fields.phoneFax}
            </p>
            <p 
              className="text-sm cursor-pointer"
              onClick={() => handleFieldInteraction("email")}
            >
              {editingField === "email" ? renderInputField("email") : fields.email}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-start items-end mt-4 mr-3">
          <p 
            className="cursor-pointer"
            onClick={() => handleFieldInteraction("refNo")}
          >
            <strong>Ref No:</strong> 
            {editingField === "refNo" ? renderInputField("refNo") : ` ${fields.refNo}`}
          </p>
          <p 
            className="cursor-pointer"
            onClick={() => handleFieldInteraction("date")}
          >
            <strong>Dated:</strong> 
            {editingField === "date" ? renderInputField("date") : ` ${fields.date}`}
          </p>
        </div>
        <hr className="my-4" />

        {/* Notification Title */}
        <div className="text-center my-6">
          <h2 className="text-3xl font-bold underline">NOTIFICATION</h2>
          <h3 
            className="text-sm cursor-pointer"
            onClick={() => handleFieldInteraction("title")}
          >
            {editingField === "title" ? renderInputField("title") : fields.title}
          </h3>
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
                ["bold", "italic", "underline", "strike"], 
                [{ color: [] }, { background: [] }], 
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
      <div className="flex justify-between mt-4">
  <PdfGenerator 
    fields={fields} 
    bodyText={bodyText} 
    disabled={!bodyText || bodyText.trim() === ""} // Disable PdfGenerator if bodyText is empty
  />
  <Button 
    onClick={createOrUpdateApprovalData} 
    className={`mt-4 px-4 ml-3 py-2 rounded-full ${
      !bodyText || bodyText.trim() === "" ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 text-white"
    }`}
    disabled={!bodyText || bodyText.trim() === ""} // Disable button if bodyText is empty
  >
    <IoCreate /> {existingData ? "Update" : "Create"}
  </Button>
</div>
      {existingData && hasAccess && (
        <CommentsApproval existingData={existingData} userRole={userRole} />
      )}
    </div>
  );
};

export default NotificationTemplate;