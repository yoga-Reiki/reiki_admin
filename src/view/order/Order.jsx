import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "../../assets/svg/SearchIcon.svg";
import downloadIcon from "../../assets/svg/downloadIcon.svg";
import successTickIcon from "../../assets/svg/successTickIcon.svg"
import { getAllUser } from "../../services/userServices";
import CancelIconRed from "../../assets/svg/CancelIconRed.svg"
import { getAllOrder } from "../../services/orderServices";

function Order() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const hasFetched = useRef(false);
    const [activeTab, setActiveTab] = useState("Pending");

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
            // const response = await getAllOrder({ page: 1, pageSize: 10 });

            console.log("response", response);
            setOrders(response?.data?.users || []);
        } catch (err) {
            setError("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex flex-col gap-2 text-[#464646] pt-2">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-3">
                    <div>
                        <h1 className="text-[32px] font-bold">Order Management</h1>
                        <p className="text-[#656565] pt-1">Manage all your Orders</p>
                    </div>
                    <button className="bg-[#EA7913] flex items-center space-x-2 hover:bg-[#F39C2C] text-white px-6 py-3 rounded-full">
                        <img src={downloadIcon} alt="Download Icon" />
                        <span>Download all order details</span>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="flex flex-col md:flex-row justify-between md:items-start xl:items-center gap-4 py-4 px-3">
                    <p className="text-2xl font-medium text-[#656565]">All Orders</p>
                    <div className="flex md:flex-col xl:flex-row gap-2.5">
                        <div className="relative w-62 md:w-32 lg:w-48 xl:w-62">
                            <span className="absolute inset-y-0 left-3 flex items-center text-[#EA7913]">
                                <img src={SearchIcon} alt="search" className="w-5 h-5" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search Order"
                                className="w-full pl-10 pr-4 py-2 md:py-3 rounded-full bg-[#FCEAC9] text-[#656565] placeholder-[#656565] border-2 border-[#FEF8EC] focus:outline-none focus:ring-0 focus:border-[#F3E9D6]"
                            />
                        </div>
                        <div className="flex bg-[#F5F0E6] border border-[#FCEAC9] rounded-full text-[#656565] w-fit">
                            <button
                                onClick={() => setActiveTab("Pending")}
                                className={`text-center py-3 pl-6 pr-3.5 rounded-l-full font-medium cursor-pointer ${activeTab === "Pending" ? "bg-[#FCEAC9]" : "bg-[#F8F8F8]"
                                    }`}
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => setActiveTab("Completed")}
                                className={`text-center py-3 px-3.5 font-medium cursor-pointer ${activeTab === "Completed" ? "bg-[#FCEAC9]" : "bg-[#F8F8F8]"
                                    }`}
                            >
                                Completed
                            </button>
                            <button
                                onClick={() => setActiveTab("Canceled ")}
                                className={`text-center py-3 px-3.5 rounded-r-full font-medium cursor-pointer ${activeTab === "Canceled " ? "bg-[#FCEAC9]" : "bg-[#F8F8F8]"
                                    }`}
                            >
                                Canceled
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto px-3">
                    <table className="w-full table-auto">
                        <thead className="grid grid-cols-6 bg-[#FCEAC9] text-left text-base font-medium text-[#111111] rounded-t-2xl">
                            <th className='px-4 py-3'>Name</th>
                            <th className='px-4 py-3'>Email</th>
                            <th className='px-4 py-3'>Order Details</th>
                            <th className='px-4 py-3'>Mobile Number</th>
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
                            ) : orders.length > 0 ? (
                                orders.map((user, index) => {
                                    const isFirst = index === 0;
                                    const isLast = index === orders.length - 1;
                                    return (
                                        <tr
                                            key={index}
                                            className={`grid grid-cols-6 items-center bg-white mt-[1px] text-sm ${isFirst ? 'rounded-t-xl border-t border-[#DCDCDC] shadow-[0_-2px_4px_rgba(0,0,0,0.05)]' : ''} ${isLast ? 'rounded-b-xl border-b-0' : ''}`}
                                        >
                                            <td className="whitespace-pre-wrap px-4 py-7">{user.name}</td>
                                            <td className="whitespace-pre-wrap px-4 py-7">{user.email}</td>
                                            <td className="whitespace-pre-wrap px-4 py-7">{user.adharCardNumber}</td>
                                            <td className="whitespace-pre-wrap px-4 py-7">{user.mobileNumber}</td>
                                            <td className="whitespace-pre-wrap px-4 py-7">
                                                {user?.address
                                                    ? `${user.address.street}, ${user.address.city}, ${user.address.state}, ${user.address.pincode}, ${user.address.country}`
                                                    : "-"}
                                            </td>
                                            <td className="flex gap-1 items-center flex-wrap mt-2 md:mt-0">
                                                <button className="p-3 flex items-center gap-2 rounded-full bg-[#F0FDF4] text-[#22C55E] border border-[#BBF7D0] cursor-pointer">
                                                    <img src={successTickIcon} alt='Not Found' className='w-4 h-4' />
                                                    <span>Completed</span>
                                                </button>
                                                <button className="p-3 flex items-center gap-2 rounded-full bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA] cursor-pointer">
                                                    <img src={CancelIconRed} alt='Not Found' className='w-4 h-4' />
                                                    <span>Cancel</span>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-6">
                                        No orders found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Order;

