import { Copy, Pencil, Trash } from "lucide-react";
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
        <Pencil
          onClick={() => handleEdit(row.original)} 
          className="cursor-pointer text-black h-5 w-5 hover:text-gray-500  rounded-full"
          size={20} // Set the size of the icon
        />
        <Trash
          onClick={() => handleDelete(row.original._id)} 
          className="cursor-pointer text-red-500 h-5 w-5 hover:text-red-700  rounded-full"
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
            <Copy
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
                  <Pencil
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleEdit(row.original);
                    }}
                    className="cursor-pointer text-black h-8 w-8 hover:text-gray-500 p-2 rounded-full"
                    size={20}
                  />
                  <Trash
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

export const ApprovalData = (
  triggerAlertDialog,
  HandledeleteApproval,
  userRole,
  approvals,
  handleEditClick,
  showActions
) => {
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

  if (showActions === false) {
    columns.push({
      header: "Actions",
      cell: ({ row }) => {
        const status = row.original.status; // Access the status of the row

        return (
          <div className="flex gap-2">
            {status !== "received" && (
              <>
              
                <Trash
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    HandledeleteApproval(row.original._id);
                  }}
                  className="cursor-pointer text-red-500 h-8 w-8 hover:text-red-700 p-2 rounded-full"
                  size={20}
                />
              </>
            )}
              <Pencil
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleEditClick(row.original._id);
                  }}
                  className="cursor-pointer text-black h-8 w-8 hover:text-gray-500 p-2 rounded-full"
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
  }

  return columns;
};