import { FaCopy, FaPaperPlane, FaPen, FaTrashAlt } from "react-icons/fa";
// columns.js or columns.jsx
export const userColumns = (handleEdit, handleDelete) => [
  {
    accessorKey: "email", // Column for email
    header: "Email",
  },
  {
    accessorKey: "role", // Column for role
    header: "Role",
  },
  {
    accessorKey: "department",
    header: "Department",
  },

  {
    header: "Actions",
    // Custom column for edit and delete icons
    cell: ({ row }) => (
      <div className="flex gap-2">
        <FaPen
          onClick={() => handleEdit(row.original)} 
          className="cursor-pointer text-black h-8 w-8 hover:text-gray-500 p-2 rounded-full"
          size={20} // Set the size of the icon
        />
        <FaTrashAlt
          onClick={() => handleDelete(row.original._id)} 
          className="cursor-pointer text-red-500 h-8 w-8 hover:text-red-700 p-2 rounded-full"
          size={20} // Set the size of the icon
        />
      </div>
    ),
  },
];

export const NotesheetData = (handleEdit, handleDelete, notesheets,handleCopy) => {
  const hasNewStatus = notesheets.some(sheet => sheet.workflow?.[sheet.workflow.length - 1]?.status === "New");
console.log(hasNewStatus)
  return [
    {
      accessorKey: "subject",
      header: "Subject",
    },
    {
      accessorKey: "userName",
      header: "User Name",
    },
    {
     
      header: "Tracking ID",
      cell: ({ row }) => {
        const trackingId = row.original.trackingId;
        console.log(trackingId)
        return (
          <div className="flex justify-start items-center gap-2">
            <span>{trackingId}</span>
            <FaCopy
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleCopy(trackingId);
              }}
              className="cursor-po"
              size={15}
            />
          </div>
        )
      },

    },
    {
      accessorKey: "userEmail",
      header: "User Email",
    },
    ...(hasNewStatus
      ? [
          {
            header: "Actions",
            cell: ({ row }) => {
              const latestStatus = row.original.workflow?.[row.original.workflow.length - 1]?.status;
              if (latestStatus !== "New") return null; // Hide actions for non-new status

              return (
                <div className="flex gap-2">
                  <FaPen
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleEdit(row.original);
                    }}
                    className="cursor-pointer text-black h-8 w-8 hover:text-gray-500 p-2 rounded-full"
                    size={20}
                  />
                  <FaTrashAlt
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleDelete(row.original._id);
                    }}
                    className="cursor-pointer text-red-500 h-8 w-8 hover:text-red-700 p-2 rounded-full"
                    size={20}
                  />
                </div>
              );
            },
          },
        ]
      : []),
  ];
};

export const ApprovalData = (triggerAlertDialog, HandledeleteApproval, userRole, approvals, handleEditClick, showActions) => {
  console.log("this is approval", handleEditClick);
console.log("showActions", showActions)
  const columns = [
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "title",
      header: "Title",
    },
  ];

  if (showActions===false) { 
    if (userRole.toLowerCase() === "establishment") {
      columns.push({
        header: "Actions",
        cell: ({ row }) => {
        
          return (
            <div className="flex gap-2">
              <FaPen
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleEditClick(row.original._id);
                }}
                className="cursor-pointer text-black h-8 w-8 hover:text-gray-500 p-2 rounded-full"
                size={20}
              />
              <FaTrashAlt
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  HandledeleteApproval(row.original._id);
                }}
                className="cursor-pointer text-red-500 h-8 w-8 hover:text-red-700 p-2 rounded-full"
                size={20}
              />
              <FaPaperPlane
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  triggerAlertDialog(row.original._id);
                }}
                className="cursor-pointer text-blue-500 h-8 w-8 hover:text-blue-700 p-2 rounded-full"
                size={20}
              />
            </div>
          );
        },
      });
    } else if (userRole.toLowerCase() === "registrar") {
      columns.push({
        header: "Actions",
        cell: ({ row }) => {
          return (
            <div className="flex gap-2">
              <FaPaperPlane
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  triggerAlertDialog(row.original._id);
                }}
                className="cursor-pointer text-blue-500 h-8 w-8 hover:text-blue-700 p-2 rounded-full"
                size={20}
              />
            </div>
          );
        },
      });
    }
  }

  return columns;
};
