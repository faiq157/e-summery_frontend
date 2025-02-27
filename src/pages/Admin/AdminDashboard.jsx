import { useState, useEffect } from "react";
import { fetchUsers, deleteUser } from "@/constant/userAPI";
import AdminLayout from "@/layout/AdminLayout";
import Loader from "@/components/Loader";
import { DataTable } from "@/components/DataTable/Data-Table";
import { userColumns } from "@/components/DataTable/columns";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger, AlertDialogAction } from "@/components/ui/alert-dialog";
import EditUserModal from "@/components/EditUserModal ";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);



  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers(); // Fetch users from the API
        setUsers(usersData);
      } catch (err) {
        setError("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleUpdateUser = async (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === updatedUser._id ? updatedUser : user
      )
    );
    const usersData = await fetchUsers(); // Refetch users after update
    setUsers(usersData);
  };

  const handleDelete = async (userId) => {
    console.log(userId)
    setLoading(true);
    try {
      const deletedUserId = await deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== deletedUserId));
      setIsDialogOpen(false); // Close dialog after successful delete
    } catch (err) {
      setError("Failed to delete user", err);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (user) => {
    setUserToDelete(user); // Set the user to delete
    setIsDialogOpen(true); // Open the delete confirmation dialog
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
};

// Filter users based on the search query
const filteredUsers = users.filter((user) => {
    const fullname = user.fullname ? user.fullname.toLowerCase() : "";
    const email = user.email ? user.email.toLowerCase() : "";
    const role = user.role ? user.role.toLowerCase() : "";
    if (role === "admin") {
        return false;
    }
    return (
        fullname.includes(searchQuery.toLowerCase()) ||
        email.includes(searchQuery.toLowerCase()) ||
        role.includes(searchQuery.toLowerCase())
    );
});


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader width={500} height={500} />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <AdminLayout onSearchChange={handleSearchChange} searchQuery={searchQuery}>
        <div className="p-20">
        <DataTable
        columns={userColumns(openEditModal, openDeleteDialog)} 
        data={filteredUsers}
      />
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger />
        <AlertDialogContent>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this user? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex justify-end gap-4 ">
            <AlertDialogCancel
              className="px-4 py-2 rounded-full"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToDelete && handleDelete(userToDelete)}
              className="bg-red-600 text-white px-4 py-2 rounded-full"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      {isModalOpen && (
                <EditUserModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    user={selectedUser}
                    onUpdate={handleUpdateUser}
                />
            )}
        </div>
     

    </AdminLayout>
  );
};

export default AdminDashboard;
