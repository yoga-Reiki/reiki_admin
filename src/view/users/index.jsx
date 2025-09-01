// import React, { useEffect, useRef, useState } from 'react';
// import { FiEdit, FiTrash2, FiXCircle } from 'react-icons/fi';
// import SearchIcon from "../../assets/svg/SearchIcon.svg";
// import { getAllUser } from '../../services/userServices';
// import downloadIcon from "../../assets/svg/downloadIcon.svg"

// function Users() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const hasFetched = useRef(false);

//   // useEffect(() => {
//   //   if (!hasFetched.current) {
//   //     fetchUsers();
//   //     hasFetched.current = true;
//   //   }
//   // }, []);

//   // const fetchUsers = async () => {
//   //   setLoading(true);
//   //   try {
//   //     const data = await getAllUser({ page: 1, pageSize: 10 });
//   //     setUsers(data?.users || []);
//   //   } catch (err) {
//   //     setError('Failed to fetch users');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const staticUsers = [
//     {
//       name: "Amit Sharma",
//       email: "amit.sharma@example.com",
//       mobile: "9876543210",
//       aadhar: "1234-5678-9012",
//       address: "Mumbai, Maharashtra"
//     },
//     {
//       name: "Priya Verma",
//       email: "priya.verma@example.com",
//       mobile: "9123456789",
//       aadhar: "2345-6789-0123",
//       address: "Delhi, India"
//     },
//     {
//       name: "Rajesh Patel",
//       email: "rajesh.patel@example.com",
//       mobile: "9988776655",
//       aadhar: "3456-7890-1234",
//       address: "Ahmedabad, Gujarat"
//     }
//   ];


//   return (
//     <div className="p-4 sm:p-6 text-[#464646]">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-2xl font-bold">User Management</h1>
//           <p className="text-[#656565] pt-1">Manage all your users</p>
//         </div>
//         <button className="bg-[#EA7913] flex items-center space-x-2 hover:bg-[#F39C2C] text-white px-6 py-3 rounded-full cursor-pointer">
//           <img src={downloadIcon} alt='Not Found Icon' />
//           <span>Download user details</span>
//         </button>
//       </div>

//       {/* Search + Title */}
//       <div className="flex flex-col md:flex-row justify-between items-center mt-6 mb-4 gap-4">
//         <p className="text-xl font-semibold text-[#656565]">All Users</p>
//         <div className="relative w-full md:w-[451px]">
//           <span className="absolute inset-y-0 left-3 flex items-center text-[#EA7913]">
//             <img src={SearchIcon} alt="search" className="w-5 h-5" />
//           </span>
//           <input
//             type="text"
//             placeholder="Search User by Name/ Mobile no./ Email"
//             className="w-full pl-10 pr-4 py-2 md:py-3 rounded-full bg-[#FCEAC9] text-[#656565] placeholder-[#656565] border-2 border-[#FEF8EC] focus:outline-none focus:ring-0 focus:border-[#F3E9D6]"
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto py-2">
//         <table className="min-w-full bg-[#fceac9] text-sm rounded-xl overflow-hidden">
//           <thead className="bg-[#FCEAC9] text-[#111111] text-base text-left">
//             <tr>
//               <th className="py-3 px-4 font-medium">Name</th>
//               <th className="py-3 px-4 font-medium">Email</th>
//               <th className="py-3 px-4 font-medium">Mobile Number</th>
//               <th className="py-3 px-4 font-medium">Aadhar Card</th>
//               <th className="py-3 px-4 font-medium">Address</th>
//               <th className="py-3 px-4 font-medium">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {/* {loading ? (
//               <tr>
//                 <td colSpan="6" className="text-center py-6">
//                   Loading users...
//                 </td>
//               </tr>
//             ) : error ? (
//               <tr>
//                 <td colSpan="6" className="text-center text-red-600 py-6">
//                   {error}
//                 </td>
//               </tr>
//             ) : users.length === 0 ? (
//               <tr>
//                 <td colSpan="6" className="text-center py-6">
//                   No users found.
//                 </td>
//               </tr>
//             ) : ( */}
//             {staticUsers.map((user, index) => {
//               const isFirst = index === 0;
//               const isLast = index === staticUsers.length - 1;

//               return (
//                 <tr key={index} className={`bg-white hover:bg-gray-50 ${isFirst ? 'rounded-t-3xl' : ''
//                   } ${isLast ? 'border-b-0 rounded-b-2xl' : 'border-b border-gray-200'}`}>
//                   <td className="px-4 py-7">{user.name}</td>
//                   <td className="px-4 py-7">{user.email}</td>
//                   <td className="px-4 py-7">{user.mobile}</td>
//                   <td className="px-4 py-7">{user.aadhar}</td>
//                   <td className="px-4 py-7">{user.address}</td>
//                   <td className="px-4 py-7 flex gap-2 items-center">
//                     <button className="flex items-center gap-1 px-3 py-1 bg-[#FCE3B9] text-[#EA7913] rounded-full text-sm hover:bg-[#fddfb0]">
//                       <FiEdit /> Edit Access
//                     </button>
//                     <button className="p-1 rounded-full text-blue-600 hover:text-blue-800">
//                       <FiXCircle size={18} />
//                     </button>
//                     <button className="p-1 rounded-full text-red-500 hover:text-red-700">
//                       <FiTrash2 size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               )
//             })}
//             {/* )} */}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default Users;






import React, { useRef, useState } from 'react';
import SearchIcon from "../../assets/svg/SearchIcon.svg";
import downloadIcon from "../../assets/svg/downloadIcon.svg";
import EditIcon from "../../assets/svg/EditIcon.svg"
import EyeopenIcon from "../../assets/svg/EyeopenIcon.svg"
import blockIcon from "../../assets/svg/blockIcon.svg"
import EditAccess from './EditAccess';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const staticUsers = [
    {
      id: 1,
      name: "Ryan Jones",
      email: "ryanjohn@gmail.com",
      mobile: "+91 95648 21024",
      aadhar: "2015 2021 3015",
      address: "1234 Elm Street, Springfield, IL 62704"
    },
    {
      id: 2,
      name: "Robin Clark",
      email: "robinvlarck@gmail.com",
      mobile: "+91 86402 20015",
      aadhar: "5540 2210 3215",
      address: "7890 Maple Avenue, Apt 5B, Brooklyn, NY 11215"
    },
    {
      id: 3,
      name: "Ivy Rogers",
      email: "ivyrogers@gmail.com",
      mobile: "+91 85884 65520",
      aadhar: "2211 6520 9852",
      address: "4567 Pine Ridge Road, Dallas, TX 75231"
    },
    {
      id: 4,
      name: "Ryan Jones",
      email: "ryanjones@gmail.com",
      mobile: "+91 64520 15420",
      aadhar: "3200 1250 6501",
      address: "2500 Sunset Boulevard, Suite 210, Los Angeles, CA 90026"
    }
  ];

  return (
    <div className="text-[#464646]">
      {!selectedUser ? (
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-3">
            <div>
              <h1 className="text-2xl font-bold">User Management</h1>
              <p className="text-[#656565] pt-1">Manage all your users</p>
            </div>
            <button className="bg-[#EA7913] flex items-center space-x-2 hover:bg-[#F39C2C] text-white px-6 py-3 rounded-full">
              <img src={downloadIcon} alt='Download Icon' />
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

          {/* Table-like Grid Layout */}
          <div className="overflow-x-auto px-3">
            {/* Table Header */}
            <table>
              <thead className="grid grid-cols-6 bg-[#FCEAC9] text-left text-base font-medium text-[#111111] rounded-t-2xl">
                <th className='px-4 py-3'>Name</th>
                <th className='px-4 py-3'>Email</th>
                <th className='px-4 py-3'>Mobile Number</th>
                <th className='px-4 py-3'>Aadhar Card</th>
                <th className='px-4 py-3'>Address</th>
                <th className='px-4 py-3'>Actions</th>
              </thead >

              {/* Table Body */}
              <tbody className="flex flex-col bg-[#FCEAC9] rounded-b-2xl overflow-hidden">
                {staticUsers.map((user, index) => {
                  const isFirst = index === 0;
                  const isLast = index === staticUsers.length - 1;

                  return (
                    <tr
                      key={index}
                      className={`grid grid-cols-6 items-center bg-white border-b border-[#DCDCDC] mt-[1px] text-sm ${isFirst ? 'rounded-t-xl border-y border-[#DCDCDC] shadow-[0_-2px_4px_rgba(0,0,0,0.05)]' : ''} ${isLast ? 'rounded-b-xl border-b-0' : ''}`}
                    >
                      <td className="whitespace-pre-wrap px-4 py-7">{user.name}</td>
                      <td className="whitespace-pre-wrap px-4 py-7">{user.email}</td>
                      <td className="whitespace-pre-wrap px-4 py-7">{user.mobile}</td>
                      <td className="whitespace-pre-wrap px-4 py-7">{user.aadhar}</td>
                      <td className="whitespace-pre-wrap px-4 py-7">{user.address}</td>
                      <td className="flex gap-1 items-center flex-wrap mt-2 md:mt-0">
                        <button onClick={() => setSelectedUser(user)} className="flex items-center gap-1 p-3 bg-[#FEF8EC] text-[#EA7913] border border-[#F9D38E] rounded-full text-sm hover:bg-[#FCEAC9] cursor-pointer">
                          <img src={EditIcon} alt='Download Icon' className='w-5 h-5' /><span>Edit Access</span>
                        </button>
                        <button className="p-3 rounded-full bg-[#E8F1FF] border border-[#B3CCFF] hover:bg-[#cdddff] cursor-pointer">
                          <img src={EyeopenIcon} alt='Download Icon' className='w-5 h-5' />
                        </button>
                        <button className="p-3 rounded-full bg-[#FEF2F2] border border-[#FECACA] hover:bg-[#fee3e3] cursor-pointer">
                          <img src={blockIcon} alt='Download Icon' className='w-5 h-5' />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EditAccess selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
      )}
    </div>
  );
}

export default Users;
