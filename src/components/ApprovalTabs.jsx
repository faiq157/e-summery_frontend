import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import Loader from "./Loader";
import { DataTable } from "./DataTable/Data-Table";
import { ApprovalData } from "./DataTable/columns";

const ApprovalTabs = ({ approvals, loading, error, handleRowClick, triggerAlertDialog, HandledeleteApproval, userRole }) => {
    const defaultTab = userRole.toLowerCase() === "registrar" ? "received" : "new";
    const [selectedTab, setSelectedTab] = useState(defaultTab);
console.log("this is approval",approvals)
    const filteredApprovals = (status) => {
        return approvals.filter((approval) => approval.status === status);
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
                        columns={ApprovalData(triggerAlertDialog, HandledeleteApproval, userRole)}
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
                        columns={ApprovalData(triggerAlertDialog, HandledeleteApproval, userRole)}
                        data={filteredApprovals("received")}
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
                        columns={ApprovalData(triggerAlertDialog, HandledeleteApproval, userRole,approvals)}
                        data={filteredApprovals("completed")}
                        onRowClick={handleRowClick}
                    />
                )}
            </TabsContent>
        </Tabs>
    );
};

export default ApprovalTabs;