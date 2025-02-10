import React, { useState, useEffect, useContext } from "react";
import {
  AiOutlineSearch,
  AiOutlineUserAdd,
  AiOutlineFilter,
} from "react-icons/ai";
import { MdEdit, MdDelete } from "react-icons/md";
import Title from "../Component/Title";
import axios from "axios";
import { UserContext } from "../Context/UserContext";
import { format } from "date-fns";
import AddUser from "../Component/AddUser";
import { toast } from "react-toastify";
import ConfirmPasswordModal from "../Component/ConfirmPasswordModal";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserOrigin, setSelectedUserOrigin] = useState(null);
  const { BASE_URL, userData } = useContext(UserContext);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchUsersAndAdmins = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/api/auth/fetch-all`);
      const usersWithOrigin = response.data.users.map((user) => ({
        ...user,
        origin: "User",
      }));
      const adminsWithOrigin = response.data.admins.map((admin) => ({
        ...admin,
        origin: "Admin",
      }));

      setUsers([...usersWithOrigin, ...adminsWithOrigin]);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndAdmins();
  }, [BASE_URL]);

  const handleEditUser = (user) => {
    setUserToEdit(user);
    setShowAddUser(true);
  };

  const handleDeleteUser = (userId, origin) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setSelectedUserId(userId);
    setSelectedUserOrigin(origin);
    setShowPasswordModal(true);
  };

  const confirmDeleteUser = async (password) => {
    setShowPasswordModal(false);

    try {
      // Verify action password
      const verifyResponse = await axios.post(
        `${BASE_URL}/api/auth/verify-action-password`,
        {
          adminId: userData.id,
          actionPassword: password,
        }
      );

      if (verifyResponse.status === 200) {
        const endpoint =
          selectedUserOrigin === "Admin"
            ? `/api/auth/deleteAdmin/${selectedUserId}`
            : `/api/auth/delete/${selectedUserId}`;

        const response = await axios.delete(`${BASE_URL}${endpoint}`);
        setUsers(users.filter((user) => user._id !== selectedUserId));
        toast.success(response.data.message || "Operation successful");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete user.");
    }
  };
  const refreshUsers = () => {
    fetchUsersAndAdmins();
  };

  // Filter users based on search term and selected role
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedRole ? user.role === selectedRole : true)
  );

  // Paginate users
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Pagination Controls
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 min-h-screen">
      <div className="text-3xl mb-3">
        <Title text1="ADMIN" text2="USERS" />
      </div>

      {/* Actions Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-gray-900 shadow-lg p-4 rounded-md mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center w-full sm:w-auto space-x-4">
          {/* Search Input */}
          <div className="flex items-center">
            <AiOutlineSearch className="text-gray-600 dark:text-gray-300 mr-2" />
            <input
              type="text"
              placeholder="Search by Name"
              className="p-2 border rounded-md w-full sm:w-auto dark:bg-gray-700 dark:text-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Role Filter */}
          <div className="flex items-center">
            <AiOutlineFilter className="text-gray-600 dark:text-gray-300 mr-2" />
            <select
              className="p-2 border rounded-md dark:bg-gray-700 dark:text-gray-300"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>
        </div>
        {/* Add User Button */}
        {!showAddUser ? (
          <button
            onClick={() => setShowAddUser(true)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg hover:bg-blue-600"
          >
            <AiOutlineUserAdd />
            Add User
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddUser(false)}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Close
          </button>
        )}
      </div>

      {/* Users Table */}
      {showAddUser ? (
        <AddUser
          onClose={() => {
            setShowAddUser(false);
            setUserToEdit(null);
          }}
          refreshUsers={refreshUsers}
          userToEdit={userToEdit}
        />
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg">
          {isLoading ? (
            <div className="text-center py-6 text-gray-600 dark:text-gray-300">
              Loading users...
            </div>
          ) : error ? (
            <div className="text-center py-6 text-red-600">Error: {error}</div>
          ) : (
            <>
              <ConfirmPasswordModal
                isVisible={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                onConfirm={confirmDeleteUser}
              />
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-800">
                    <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                      Role
                    </th>
                    <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                      Date Added
                    </th>
                    <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b dark:border-gray-700"
                      >
                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                          {user.name}
                        </td>
                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                          {user.email}
                        </td>
                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                          {user.role} ({user.origin})
                        </td>
                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                          {format(new Date(user.createdAt), "MMM dd, yyyy")}
                        </td>
                        <td className="px-4 py-2 flex items-center space-x-2">
                          <button
                            className="text-yellow-500 hover:text-yellow-600"
                            onClick={() => handleEditUser(user)}
                          >
                            <MdEdit size={20} />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-600"
                            onClick={() =>
                              handleDeleteUser(user._id, user.origin)
                            }
                          >
                            <MdDelete size={20} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-2 text-center text-gray-500 dark:text-gray-400"
                      >
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    className={`px-4 py-2 ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    } rounded-md`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Users;
