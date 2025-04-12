import React, { createContext, useContext, useEffect, useState } from "react";

const ApprovalAccessContext = createContext();

const base_URL = import.meta.env.VITE_APP_API_URL;

export const ApprovalAccessProvider = ({ children }) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [userRole, setUserRole] = useState("");

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
      const approvalAccess = data.data.approvalAccess
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
    <ApprovalAccessContext.Provider value={{ hasAccess, userRole }}>
      {children}
    </ApprovalAccessContext.Provider>
  );
};

export const useApprovalAccess = () => useContext(ApprovalAccessContext);
