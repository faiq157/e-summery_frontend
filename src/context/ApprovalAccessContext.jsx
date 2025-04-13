import React, { createContext, useContext, useEffect, useState } from "react";

const ApprovalAccessContext = createContext();

const base_URL = import.meta.env.VITE_APP_API_URL;

export const ApprovalAccessProvider = ({ children }) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [approvalAccessData, setApprovalAccessData] = useState([]); // New state for storing approval access data

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userObject = JSON.parse(storedUser);
      const role = userObject?.role || "";
      setUserRole(role);

      if (role) {
        fetchApprovalAccess(role);
      }
    }
  }, []);

  const fetchApprovalAccess = async (role) => {
    try {
      const response = await fetch(`${base_URL}/get-approval-access`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      const approvalAccess = data.data.approvalAccess;
      setApprovalAccessData(approvalAccess); // Store the fetched data in state
      console.log(approvalAccess, "approval selected ");
      if (Array.isArray(approvalAccess) && approvalAccess.includes(role)) {
        setHasAccess(true);
      } else {
        console.log("User does not have access:", role);
        setHasAccess(false);
      }
    } catch (error) {
      console.error("Error fetching approval access:", error);
      setHasAccess(false);
    }
  };

  return (
    <ApprovalAccessContext.Provider
      value={{ hasAccess, userRole, approvalAccessData }} // Provide the data via context
    >
      {children}
    </ApprovalAccessContext.Provider>
  );
};

export const useApprovalAccess = () => useContext(ApprovalAccessContext);