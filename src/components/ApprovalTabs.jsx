import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import Loader from "./Loader";
import { DataTable } from "./DataTable/Data-Table";
import { ApprovalData } from "./DataTable/columns";

const ApprovalTabs = ({ approvals, loading, error, handleRowClick, triggerAlertDialog, HandledeleteApproval, userRole, handleEditClick }) => {
    const defaultTab = userRole.toLowerCase() === "registrar" ? "received" : "new";
    const [selectedTab, setSelectedTab] = useState(defaultTab);
    const filteredApprovals = (status, userRole = null) => {
        if (status === "received" && !userRole) {
            throw new Error("userRole is required for 'received' status");
        }
        return approvals.filter((approval) => 
            approval.status === status && (userRole ? approval.selectedRole === userRole : true)
        );
    };
    return (
        <Tabs defaultValue={selectedTab} className="w-full">
            <TabsList>
                {userRole.toLowerCase() === "establishment" && (
                    <TabsTrigger value="new" onClick={() => setSelectedTab("new")}>New</TabsTrigger>
                )}

                <TabsTrigger value="received" onClick={() => setSelectedTab("received")}>Received</TabsTrigger>
                <TabsTrigger value="completed" onClick={() => setSelectedTab("completed")}>Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="new">
                {loading ? (
                    <Loader width={500} height={500} />
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : (
                    <DataTable
                        columns={ApprovalData(triggerAlertDialog, HandledeleteApproval, userRole, approvals, handleEditClick,false)}
                        data={filteredApprovals("new")}
                        onRowClick={handleRowClick}
                    />
                )}
            </TabsContent>

            <TabsContent value="received">
                {loading ? (
                    <Loader width={500} height={500} />
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : (
                    <DataTable
                        columns={ApprovalData(triggerAlertDialog, HandledeleteApproval, userRole, approvals, handleEditClick,false)}
                        data={filteredApprovals("received", userRole)}
                        onRowClick={handleRowClick}
                    />
                )}
            </TabsContent>
            <TabsContent value="completed">
                {loading ? (
                    <Loader width={500} height={500} />
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : (
                    <DataTable
                        columns={ApprovalData(triggerAlertDialog, HandledeleteApproval, userRole, approvals, handleEditClick,true)}
                        data={filteredApprovals("completed")}
                        onRowClick={handleRowClick}
                    />
                )}
            </TabsContent>
        </Tabs>
    );
};

export default ApprovalTabs;