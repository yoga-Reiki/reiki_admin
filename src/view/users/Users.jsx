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

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [blockUser, setBlockUser] = useState(null);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchUsers();
      hasFetched.current = true;
    }
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUser({ page: 1, pageSize: 10 });

      console.log("response", response);
      setUsers(response?.data?.users || []);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

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
                className="w-full pl-10 pr-4 py-2 md:py-3 rounded-full bg-[#FCEAC9] text-[#656565] placeholder-[#656565] border-2 border-[#FEF8EC] focus:outline-none focus:ring-0 focus:border-[#F3E9D6]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto px-3">
            <table className="w-full table-auto">
              <thead className="grid grid-cols-6 bg-[#FCEAC9] text-left text-base font-medium text-[#111111] rounded-t-2xl">
                <th className='px-4 py-3'>Name</th>
                <th className='px-4 py-3'>Email</th>
                <th className='px-4 py-3'>Mobile Number</th>
                <th className='px-4 py-3'>Aadhar Card</th>
                <th className='px-4 py-3'>Address</th>
                <th className='px-4 py-3'>Actions</th>
              </thead >

              <tbody className="flex flex-col justify-center bg-[#FCEAC9] rounded-b-2xl overflow-hidden">
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
                ) : users.length > 0 ? (
                  users.map((user, index) => {
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
                          <button onClick={() => setSelectedUser(user)} className="flex items-center gap-1 p-3 bg-[#FEF8EC] text-[#EA7913] border border-[#F9D38E] rounded-full text-sm hover:bg-[#FCEAC9] cursor-pointer">
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
        />
      )}
    </div>
  );
}

export default Users;

