import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "../../assets/svg/SearchIcon.svg";
import downloadIcon from "../../assets/svg/downloadIcon.svg";
import EditIcon from "../../assets/svg/EditIcon.svg";
import EyeopenIcon from "../../assets/svg/EyeopenIcon.svg";
import blockIcon from "../../assets/svg/blockIcon.svg";
import EditAccess from "./EditAccess";
import { getAllUser } from "../../services/userServices";
import ViewActivity from "./ViewActivity";
import BlockUserModal from "./BlockUserModel";
import { useNavigate } from "react-router-dom";

function Users() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [blockUser, setBlockUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalUsers: 0,
  });

  useEffect(() => {
    if (!hasFetched.current) {
      fetchUsers();
      hasFetched.current = true;
    }
  }, [pagination.page, searchQuery]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUser({ page: pagination.page, pageSize: pagination.pageSize });
      setUsers(response?.data?.users || []);
      setPagination((prev) => ({
        ...prev,
        totalUsers: response?.data?.totalUsers || 0,
      }));
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.mobileNumber?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="text-[#464646]">
      {viewUser ? (
        <ViewActivity viewUser={viewUser} setViewUser={setViewUser} />
      ) : selectedUser ? (
        <EditAccess
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      ) : (
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-3">
            <div>
              <h1 className="text-[32px] font-bold">User Management</h1>
              <p className="text-[#656565] pt-1">Manage all your users</p>
            </div>
            <button className="bg-[#EA7913] flex items-center space-x-2 hover:bg-[#F39C2C] text-white px-6 py-3 rounded-full">
              <img src={downloadIcon} alt="Download Icon" />
              <span>Download user details</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 mb-6 gap-4 px-3">
            <p className="text-xl font-semibold text-[#656565]">All Users</p>
            <div className="relative w-full md:w-72 lg:w-90 xl:w-[451px]">
              <span className="absolute inset-y-0 left-3 flex items-center text-[#EA7913]">
                <img src={SearchIcon} alt="search" className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="Search User by Name/ Mobile no./ Email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 md:py-3 rounded-full bg-[#FCEAC9] text-[#656565] placeholder-[#656565] border-2 border-[#FEF8EC] focus:outline-none focus:ring-0 focus:border-[#F3E9D6]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto px-3">
            <table className="w-full table-auto">
              <thead>
                <tr className="grid grid-cols-6 md:w-[300%] lg:w-[200%] xl:w-[120%] 2xl:w-full bg-[#FCEAC9] text-left text-base font-medium text-[#111111] rounded-t-2xl">
                  <th className='px-4 py-3'>Name</th>
                  <th className='px-4 py-3'>Email</th>
                  <th className='px-4 py-3'>Mobile Number</th>
                  <th className='px-4 py-3'>Aadhar Card</th>
                  <th className='px-4 py-3'>Address</th>
                  <th className='px-4 py-3'>Actions</th>
                </tr>
              </thead >

              <tbody className="flex flex-col justify-center md:w-[300%] lg:w-[200%] xl:w-[120%] 2xl:w-full bg-[#FCEAC9] rounded-b-2xl overflow-hidden">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="flex justify-center py-6">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers?.map((user, index) => {
                      const isFirst = index === 0;
                      const isLast = index === users.length - 1;
                      return (
                        <tr
                          key={index}
                          className={`grid grid-cols-6 items-center bg-white mt-[1px] text-sm ${isFirst ? 'rounded-t-xl border-t border-[#DCDCDC] shadow-[0_-2px_4px_rgba(0,0,0,0.05)]' : ''} ${isLast ? 'rounded-b-xl border-b-0' : ''}`}
                        >
                          <td className="whitespace-pre-wrap px-4 py-7">{user.name}</td>
                          <td className="whitespace-pre-wrap px-4 py-7">{user.email}</td>
                          <td className="whitespace-pre-wrap px-4 py-7">{user.mobileNumber}</td>
                          <td className="whitespace-pre-wrap px-4 py-7">{user.adharCardNumber}</td>
                          <td className="whitespace-pre-wrap px-4 py-7">
                            {user?.address
                              ? `${user.address.street}, ${user.address.city}, ${user.address.state}, ${user.address.pincode}, ${user.address.country}`
                              : "-"}
                          </td>
                          <td className="flex gap-1 items-center flex-wrap mt-2 md:mt-0">
                            <button onClick={() => {
                              setSelectedUser(user)
                              navigate(`?selectedUserId=${user._id}`);
                            }} className="flex items-center gap-1 p-3 bg-[#FEF8EC] text-[#EA7913] border border-[#F9D38E] rounded-full text-sm hover:bg-[#FCEAC9] cursor-pointer">
                              <img src={EditIcon} alt='Download Icon' className='w-5 h-5' /><span>Edit Access</span>
                            </button>
                            <button onClick={() => setViewUser(user)} className="p-3 rounded-full bg-[#E8F1FF] border border-[#B3CCFF] hover:bg-[#cdddff] cursor-pointer">
                              <img src={EyeopenIcon} alt='Download Icon' className='w-5 h-5' />
                            </button>
                            <button onClick={() => setBlockUser(user)} className="p-3 rounded-full bg-[#FEF2F2] border border-[#FECACA] hover:bg-[#fee3e3] cursor-pointer">
                              <img src={blockIcon} alt='Download Icon' className='w-5 h-5' />
                            </button>
                          </td>
                        </tr>
                      )
                    })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end items-center gap-4 py-6 px-3">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-[#fceac9] text-[#111] rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-[#656565] font-medium">
              Page {pagination.page} of {Math.ceil(pagination.totalUsers / pagination.pageSize)}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page >= Math.ceil(pagination.totalUsers / pagination.pageSize)}
              className="px-4 py-2 bg-[#fceac9] text-[#111] rounded disabled:opacity-50"
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

