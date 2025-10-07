import React, { useEffect, useState } from "react";
import SearchIcon from "../../assets/svg/SearchIcon.svg";
import downloadIconGrey from "../../assets/svg/downloadIconGrey.svg";
import EditIcon from "../../assets/svg/EditIcon.svg";
import EyeopenIcon from "../../assets/svg/EyeopenIcon.svg";
import blockIcon from "../../assets/svg/blockIcon.svg";
import EditAccess from "./EditAccess";
import { getAllUser } from "../../services/userServices";
import ViewActivity from "./ViewActivity";
import BlockUserModal from "./BlockUserModel";
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';

function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [blockUser, setBlockUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalUsers: 0,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, debouncedSearch]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUser({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch?.trim() || undefined,
      });

      setUsers(response?.data || []);
      setPagination((prev) => ({
        ...prev,
        totalUsers: response?.data?.pagination?.total || 0,
      }));
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.users?.filter((user) => {
    const query = debouncedSearch.toLowerCase();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.mobileNumber?.toLowerCase().includes(query)
    );
  });
  const handleDownload = async () => {
    try {
      const response = await getAllUser({ page: 1, pageSize: 10000 });
      const allUsers = response?.data?.users || [];

      if (allUsers.length === 0) {
        alert("No users to download.");
        return;
      }

      const excelData = allUsers.map((user) => ({
        Name: user.name || "-",
        Email: user.email || "-",
        "Mobile Number": user.mobileNumber || "-",
        "Aadhar Card": user.adharCardNumber || "-",
        Address: user?.address
          ? `${user.address.street}, ${user.address.city}, ${user.address.state}, ${user.address.pincode}, ${user.address.country}`
          : "-",
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

      const columnWidths = Object.keys(excelData[0]).map((key) => ({
        wch: Math.max(...excelData.map((row) => (row[key]?.toString().length || 0)), key.length) + 2,
      }));
      worksheet["!cols"] = columnWidths;

      XLSX.writeFile(workbook, "User_Details.xlsx");
    } catch (err) {
      console.error("Failed to export user data", err);
      alert("Something went wrong while downloading user details.");
    }
  };

  return (
    <div className="text-[#464646]">
      {viewUser ? (
        <ViewActivity viewUser={viewUser} setViewUser={setViewUser} />
      ) : selectedUser ? (
        <EditAccess selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
      ) : (
        <div className="flex flex-col gap-2">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-3">
            <div>
              <h1 className="text-[32px] font-Raleway Raleway-medium">User Management</h1>
              <p className="text-[#656565] pt-1">Manage all your users</p>
            </div>
            <button
              onClick={handleDownload}
              className="h-12 bg-[#FEF8EC] border border-[#F9D38E] flex items-center space-x-2 hover:bg-[#FCEAC9] text-[#525252] px-6 py-3 cursor-pointer rounded-full"
            >
              <img src={downloadIconGrey} alt="Download Icon" />
              <span>Download user details</span>
            </button>
          </div>

          {/* Search */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-3">
            <p className="text-2xl font-Raleway Raleway-medium text-[#656565]">All Users List</p>
            <div className="relative w-full md:w-60 lg:w-76">
              <span className="absolute inset-y-0 left-3 px-1 flex items-center text-[#EA7913]">
                <img src={SearchIcon} alt="search" className="w-6 h-6" />
              </span>
              <input
                type="text"
                placeholder="Search User by Name/ Mobile no./ Email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-12 pr-4 py-2 rounded-full text-[#656565] placeholder-[#656565] border border-[#DCDCDC] focus:outline-none focus:ring-0 focus:border-[#F3E9D6]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white border border-[#BDBDBD] rounded-2xl mx-3">
            <table className="w-full border-collapse text-left text-[#464646] table-fixed">
              <thead className="bg-[#FFF8EE] text-sm text-[#09090B] border-b border-[#D4D4D8]">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Mobile Number</th>
                  <th className="px-4 py-3 font-medium">Aadhar Card</th>
                  <th className="px-4 py-3 font-medium">Address</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : filteredUsers?.length > 0 ? (
                  filteredUsers.map((Data, index) => (
                    <tr key={index} className="border-b border-[#D4D4D8] last:border-b-0 transition h-21">
                      <td className="px-4 whitespace-pre-wrap">{Data.name}</td>
                      <td className="px-4 w-32 break-words whitespace-normal">
                        {Data.email}
                      </td>
                      <td className="px-4 whitespace-pre-wrap">{Data.mobileNumber}</td>
                      <td className="px-4 whitespace-pre-wrap">{Data.adharCardNumber}</td>
                      <td className="px-4">
                        <div className="flex justify-center items-center">
                          <div className="line-clamp-2 lg:line-clamp-3">
                            {Data?.address
                              ? `${Data.address.street}, ${Data.address.city}, ${Data.address.state}, ${Data.address.pincode}, ${Data.address.country}`
                              : "-"}
                          </div>
                        </div>
                      </td>

                      <td className="px-4">
                        <div className={`flex ${Data.isActive ? "justify-center" : "justify-end"} gap-1 items-center`}>
                          {Data.isActive ? (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedUser(Data);
                                  navigate(`?selectedUserId=${Data._id}`);
                                }}
                                className="p-2 bg-[#FEF8EC] text-[#EA7913] border border-[#F9D38E] rounded-full hover:bg-[#FCEAC9] cursor-pointer"
                              >
                                <img src={EditIcon} alt="Edit" className="w-6 h-6" />
                              </button>

                              <button
                                onClick={() => setViewUser(Data)}
                                className="p-2 bg-[#E8F1FF] border border-[#B3CCFF] rounded-full hover:bg-[#cdddff] cursor-pointer"
                              >
                                <img src={EyeopenIcon} alt="View" className="w-6 h-6" />
                              </button>

                              <button
                                onClick={() => setBlockUser(Data)}
                                className="p-2 bg-[#FEF2F2] border border-[#FECACA] rounded-full hover:bg-[#fee3e3] cursor-pointer"
                              >
                                <img src={blockIcon} alt="Block" className="w-6 h-6" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setBlockUser(Data)}
                              className="px-4 py-2 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-base text-[#EF4444] hover:bg-[#fee3e3] cursor-pointer"
                            >
                              Unblock
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-[#9B9B9B]">
                      No Users Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-end items-center text-[#464646] gap-4 py-6 px-3">
            <button
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-[#fceac9] rounded disabled:opacity-50 cursor-pointer"
            >
              Previous
            </button>
            <span className="font-medium">
              Page {pagination.page} of {Math.ceil(pagination.totalUsers / pagination.pageSize) || 1}
            </span>
            <button
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page >= Math.ceil(pagination.totalUsers / pagination.pageSize)}
              className="px-4 py-2 bg-[#fceac9] rounded disabled:opacity-50 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {blockUser && (
        <BlockUserModal
          blockUser={blockUser}
          onClose={() => setBlockUser(null)}
          onConfirm={() => {
            console.log("Blocked:", blockUser.name);
            setBlockUser(null);
          }}
          fetchUsers={fetchUsers}
        />
      )}
    </div>
  );
}

export default Users;
