import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "../../assets/svg/SearchIcon.svg";
import downloadIcon from "../../assets/svg/downloadIcon.svg";
import successTickIcon from "../../assets/svg/successTickIcon.svg";
import CancelIconRed from "../../assets/svg/CancelIconRed.svg";
import { getAllOrder, getOrderUpdate } from "../../services/orderServices";

function Order() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const hasFetched = useRef(false);
    const [activeTab, setActiveTab] = useState("Pending");
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        totalUsers: 0,
    });

    useEffect(() => {
        if (!hasFetched.current || searchTerm.trim() === "") {
            hasFetched.current = true;
            fetchOrder();
        }
    }, [pagination.page, activeTab, searchTerm]);

    const fetchOrder = async () => {
        setLoading(true);
        try {
            const response = await getAllOrder({
                page: pagination.page,
                pageSize: pagination.pageSize,
                status: activeTab.toLowerCase(),
                query: searchTerm.trim() !== "" ? searchTerm.trim() : undefined,
            });

            const filteredItems = response?.data?.items?.filter(
                item => item.status === activeTab.toLowerCase()
            ) || [];

            setOrders({
                ...response.data,
                items: filteredItems,
            });

            setPagination((prev) => ({
                ...prev,
                totalUsers: response?.data?.total || 0,
            }));
        } catch (err) {
            setError("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, status) => {
        try {
            await getOrderUpdate(orderId, { status });
            fetchOrder();
        } catch (err) {
            console.error(err);
            setError("Failed to update order status");
        }
    };

    return (
        <div>
            <div className="flex flex-col gap-2 text-[#464646] pt-2">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-3">
                    <div>
                        <h1 className="text-[32px] font-bold">Order Management</h1>
                        <p className="text-[#656565] pt-1">Manage all your Orders</p>
                    </div>
                    <button className="bg-[#EA7913] flex items-center space-x-2 hover:bg-[#F39C2C] text-white px-6 py-3 rounded-full">
                        <img src={downloadIcon} alt="Download Icon" />
                        <span>Download all order details</span>
                    </button>
                </div>

                {/* Search and Tabs */}
                <div className="flex flex-col lg:flex-row justify-between lg:items-start xl:items-center gap-4 py-4 px-3">
                    <p className="text-2xl font-medium text-[#656565]">All Orders</p>
                    <div className="flex md:flex-col xl:flex-row gap-2.5">
                        <div className="relative w-62 md:w-full lg:w-48 xl:w-62">
                            <span className="absolute inset-y-0 left-3 px-1 flex items-center text-[#EA7913]">
                                <img src={SearchIcon} alt="search" className="w-5 h-5" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search Order"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        fetchOrder();
                                    }
                                }}
                                className="w-full pl-10 pr-4 py-2 md:py-3 rounded-full bg-[#FCEAC9] text-[#656565] placeholder-[#656565] border-2 border-[#FEF8EC] focus:outline-none focus:ring-0 focus:border-[#F3E9D6]"
                            />
                        </div>
                        <div className="flex bg-[#F8F8F8] rounded-full text-[#656565] w-fit">
                            {["Pending", "Completed", "Canceled"].map((tab, index) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`text-center ${index === 0 ? "rounded-l-full" : index === 2 && "rounded-r-full"} py-3 px-3.5 font-medium cursor-pointer ${activeTab === tab ? "bg-[#FCEAC9]" : "bg-[#F8F8F8]"}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="overflow-x-auto px-3">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="grid grid-cols-6 md:w-[300%] lg:w-[200%] xl:w-[125%] 2xl:w-full bg-[#FCEAC9] text-left text-base font-medium text-[#111111] rounded-t-2xl">
                                <th className='px-4 py-3'>Name</th>
                                <th className='px-4 py-3'>Email</th>
                                <th className='px-4 py-3'>Order Details</th>
                                <th className='px-4 py-3'>Mobile Number</th>
                                <th className='px-4 py-3'>Address</th>
                                <th className='px-4 py-3'>Actions</th>
                            </tr>
                        </thead>

                        <tbody className="flex flex-col justify-center md:w-[300%] lg:w-[200%] xl:w-[125%] 2xl:w-full bg-[#FCEAC9] rounded-b-2xl overflow-hidden">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="flex justify-center py-6">Loading...</td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="6" className="flex justify-center py-6 text-red-500">{error}</td>
                                </tr>
                            ) : orders?.items?.length > 0 ? (
                                orders.items.map((data, index) => {
                                    const isFirst = index === 0;
                                    const isLast = index === orders.items.length - 1;

                                    return (
                                        <tr
                                            key={index}
                                            className={`grid grid-cols-6 items-center bg-white mt-[1px] text-sm ${isFirst ? "rounded-t-xl border-t border-[#DCDCDC] shadow-[0_-2px_4px_rgba(0,0,0,0.05)]" : ""} ${isLast ? "rounded-b-xl border-b-0" : ""}`}
                                        >
                                            <td className="whitespace-pre-wrap px-4 py-7">{data.customer?.name}</td>
                                            <td className="whitespace-pre-wrap px-4 py-7">{data.customer?.email}</td>
                                            <td className="whitespace-pre-wrap px-4 py-7">{data.productSnapshot?.title}</td>
                                            <td className="whitespace-pre-wrap px-4 py-7">{data.customer?.mobile}</td>
                                            <td className="whitespace-pre-wrap px-4 py-7">{data?.customer?.address}</td>
                                            <td className="flex gap-2">
                                                {data.status === "pending" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusChange(data._id, "completed")}
                                                            className="p-3 flex items-center gap-2 cursor-pointer rounded-full bg-[#F0FDF4] text-[#22C55E] border border-[#BBF7D0]"
                                                        >
                                                            <img src={successTickIcon} alt="" className="w-4 h-4" />
                                                            Completed
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(data._id, "canceled")}
                                                            className="p-3 flex items-center gap-2 cursor-pointer rounded-full bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA]"
                                                        >
                                                            <img src={CancelIconRed} alt="" className="w-4 h-4" />
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}
                                                {data.status === "completed" && (
                                                    <button className="p-3 flex items-center gap-2 cursor-pointer rounded-full bg-[#F0FDF4] text-[#22C55E] border border-[#BBF7D0]">
                                                        <img src={successTickIcon} alt="" className="w-4 h-4" />
                                                        Completed
                                                    </button>
                                                )}
                                                {data.status === "canceled" && (
                                                    <button className="p-3 flex items-center gap-2 cursor-pointer rounded-full bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA]">
                                                        <img src={CancelIconRed} alt="" className="w-4 h-4" />
                                                        Cancel
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="flex justify-center py-6">No orders found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-end items-center gap-4 py-6">
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
    );
}

export default Order;
