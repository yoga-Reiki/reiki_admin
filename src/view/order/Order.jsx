import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "../../assets/svg/SearchIcon.svg";
import successGreenIcon from "../../assets/svg/successGreenIcon.svg";
import CancelIconRed from "../../assets/svg/CancelIconRed.svg";
import { getAllOrder, getOrderUpdate } from "../../services/orderServices";
import * as XLSX from 'xlsx';

function Order() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const hasFetched = useRef(false);
    const [activeTab, setActiveTab] = useState("Pending");
    const [dateFilter, setDateFilter] = useState("Today");
    const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingOrder, setUpdatingOrder] = useState({ id: null, action: null });
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
    });
    const dateDropdownRef = useRef(null);
    const statusDropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dateDropdownRef.current &&
                !dateDropdownRef.current.contains(event.target)
            ) {
                setDateDropdownOpen(false);
            }
            if (
                statusDropdownRef.current &&
                !statusDropdownRef.current.contains(event.target)
            ) {
                setStatusDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // const handleDownloadAllOrders = async () => {
    //     try {
    //         const response = await getAllOrder({
    //             page: 1,
    //             pageSize: 10000,
    //         });

    //         const orders = response?.data?.items || [];

    //         if (orders.length === 0) {
    //             alert("No orders to download.");
    //             return;
    //         }

    //         const headers = [
    //             "Name",
    //             "Email",
    //             "Order Details",
    //             "Mobile Number",
    //             "Address",
    //             "Status"
    //         ];

    //         const rows = orders.map(order => [
    //             order.customer?.name || "",
    //             order.customer?.email || "",
    //             order.productSnapshot?.title || "",
    //             order.customer?.mobile || "",
    //             order.customer?.address || "",
    //             order.status || ""
    //         ]);

    //         const worksheetData = [headers, ...rows];

    //         const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    //         const colWidths = headers.map((h, i) => ({
    //             wch: Math.max(
    //                 h.length,
    //                 ...rows.map(r => (r[i] ? r[i].toString().length : 0))
    //             ) + 2
    //         }));
    //         worksheet['!cols'] = colWidths;

    //         const workbook = XLSX.utils.book_new();
    //         XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    //         XLSX.writeFile(workbook, "orders.xlsx");
    //     } catch (err) {
    //         console.error("Download failed:", err);
    //         alert("Failed to download orders.");
    //     }
    // };

    useEffect(() => {
        if (!hasFetched.current || searchTerm.trim() === "") {
            hasFetched.current = true;
            fetchOrder();
        }
    }, [pagination.page, activeTab, dateFilter, searchTerm]);

    const fetchOrder = async () => {
        setLoading(true);
        try {
            const now = new Date();
            let startDate;

            if (dateFilter === "Today") {
                startDate = new Date(now.setHours(0, 0, 0, 0));
            } else if (dateFilter === "Last Week") {
                startDate = new Date(now.setDate(now.getDate() - 7));
            } else if (dateFilter === "Last Month") {
                startDate = new Date(now.setMonth(now.getMonth() - 1));
            } else if (dateFilter === "Last 3 Months") {
                startDate = new Date(now.setMonth(now.getMonth() - 3));
            }

            const response = await getAllOrder({
                page: pagination.page,
                pageSize: pagination.pageSize,
                status: activeTab.toLowerCase(),
                query: searchTerm.trim() !== "" ? searchTerm.trim() : undefined,
                startDate: startDate.toISOString(),
            });

            setOrders(response?.data || { items: [] });
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
            setUpdatingOrder({ id: orderId, action: status });
            await getOrderUpdate(orderId, { status });
            await fetchOrder();
        } catch (err) {
            console.error(err);
            setError("Failed to update order status");
        } finally {
            setUpdatingOrder({ id: null, action: null });
        }
    };

    return (
        <div>
            <div className="flex flex-col gap-2 text-[#464646] pt-2">
                {/* Header */}
                <div className="p-3">
                    <h1 className="text-[32px] font-Raleway Raleway-medium">Order Management</h1>
                    <p className="text-[#656565] pt-1">Manage all your Orders</p>
                </div>

                {/* Search and Tabs */}
                <div className="flex flex-col lg:flex-row justify-between lg:items-start xl:items-center gap-4 px-3 lg:h-10">
                    <p className="text-2xl font-Raleway Raleway-medium text-[#656565]">All Orders List</p>

                    <div className="flex flex-row gap-2 items-center">
                        <div className="relative w-62 md:w-full lg:w-48 xl:w-62">
                            <span className="absolute inset-y-0 left-3 px-1 flex items-center text-[#EA7913]">
                                <img src={SearchIcon} alt="search" className="w-6 h-6" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search Order"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && fetchOrder()}
                                className="w-full h-10 pl-12 pr-4 py-2 rounded-full text-[#656565] placeholder-[#656565] border border-[#DCDCDC] focus:outline-none focus:ring-0 focus:border-[#F3E9D6]"
                            />
                        </div>

                        {/* Date Filter Dropdown */}
                        <div className="relative" ref={dateDropdownRef}>
                            <button
                                onClick={() => setDateDropdownOpen((prev) => !prev)}
                                className="flex items-center justify-between text-[#656565] border border-[#FCEAC9] rounded-full px-6 py-2 min-w-[112px] cursor-pointer"
                            >
                                {dateFilter}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-5 h-5 text-[#EA7913] ml-2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {dateDropdownOpen && (
                                <div className="absolute z-20 p-2 space-y-1 mt-2 bg-white shadow-lg rounded-2xl w-full overflow-hidden border border-[#FCEAC9] cursor-pointer">
                                    {["Today", "1 Week", "1 Month", "3 Months"].map((option) => (
                                        <div
                                            key={option}
                                            onClick={() => {
                                                setDateFilter(option);
                                                setDateDropdownOpen(false);
                                            }}
                                            className={`px-3 py-2 cursor-pointer rounded-lg hover:bg-[#FEF8EC] ${option === dateFilter ? "text-[#292929] bg-[#FEF8EC] rounded-lg" : "text-[#656565]"}`}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Status Dropdown */}
                        <div className="relative" ref={statusDropdownRef}>
                            <button
                                onClick={() => setStatusDropdownOpen((prev) => !prev)}
                                className="flex items-center justify-between text-[#656565] border border-[#FCEAC9] rounded-full px-6 py-2 min-w-[127px] cursor-pointer"
                            >
                                {activeTab}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-5 h-5 text-[#EA7913] ml-2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {statusDropdownOpen && (
                                <div className="absolute z-20 p-2 space-y-1 mt-2 bg-white shadow-lg rounded-2xl w-full overflow-hidden border border-[#FCEAC9] cursor-pointer">
                                    {["Pending", "Completed", "Canceled"].map((tab) => (
                                        <div
                                            key={tab}
                                            onClick={() => {
                                                setActiveTab(tab);
                                                setStatusDropdownOpen(false);
                                            }}
                                            className={`px-3 py-2 cursor-pointer rounded-lg hover:bg-[#FEF8EC] ${tab === activeTab ? "text-[#292929] bg-[#FEF8EC] rounded-lg" : "text-[#656565]"}`}
                                        >
                                            {tab}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="overflow-x-auto bg-white border border-[#BDBDBD] rounded-2xl mx-3">
                    <table className="w-full border-collapse text-left text-[#464646] table-fixed">
                        <thead className="bg-[#FFF8EE] text-sm text-[#09090B] border-b border-[#D4D4D8]">
                            <tr>
                                <th className='px-4 py-3 font-medium'>Name</th>
                                <th className='px-4 py-3 font-medium'>Email</th>
                                <th className='px-4 py-3 font-medium'>Order Details</th>
                                <th className='px-4 py-3 font-medium'>Mobile Number</th>
                                <th className='px-4 py-3 font-medium'>Address</th>
                                <th className='px-4 py-3 font-medium'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-6">Loading...</td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-6 text-red-500">{error}</td>
                                </tr>
                            ) : orders?.items?.length > 0 ? (
                                orders.items.map((Data, index) => (
                                    <tr key={index} className="border-b border-[#D4D4D8] last:border-b-0 transition h-21">
                                        <td className="px-4 whitespace-pre-wrap">{Data.customer?.name}</td>
                                        <td className="px-4 w-32 break-words whitespace-normal">{Data.customer?.email}</td>
                                        <td className="whitespace-pre-wrap px-4 py-7">{Data.productSnapshot?.title}</td>
                                        <td className="whitespace-pre-wrap px-4 py-7">{Data.customer?.mobile}</td>
                                        <td className="whitespace-pre-wrap px-4 py-7">{Data?.customer?.address}</td>
                                        <td className="px-4 py-7 flex items-center">
                                            {Data.status === "pending" && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleStatusChange(Data._id, "completed")}
                                                        disabled={updatingOrder.id === Data._id && updatingOrder.action === "completed"}
                                                        className={`p-2 gap-2 cursor-pointer rounded-full border bg-[#F0FDF4] border-[#BBF7D0]`}
                                                    >
                                                        {updatingOrder.id === Data._id && updatingOrder.action === "completed" ? (
                                                            <span className="loader w-4 h-4 border-2 border-t-transparent border-green-500 rounded-full animate-spin"></span>
                                                        ) : (
                                                            <img src={successGreenIcon} alt="" className="w-6 h-6" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(Data._id, "canceled")}
                                                        disabled={updatingOrder.id === Data._id && updatingOrder.action === "canceled"}
                                                        className={`p-2 gap-2 cursor-pointer bg-[#FEF2F2] border-[#FECACA] rounded-full border`}
                                                    >
                                                        {updatingOrder.id === Data._id && updatingOrder.action === "canceled" ? (
                                                            <span className="loader w-4 h-4 border-2 border-t-transparent border-red-500 rounded-full animate-spin"></span>
                                                        ) : (
                                                            <img src={CancelIconRed} alt="" className="w-6 h-6" />
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                            {Data.status === "completed" && (
                                                <button className="p-2 cursor-pointer rounded-full bg-[#F0FDF4] border border-[#BBF7D0]">
                                                    <img src={successGreenIcon} alt="" className="w-6 h-6" />
                                                </button>
                                            )}
                                            {Data.status === "canceled" && (
                                                <button className="p-2 cursor-pointer rounded-full bg-[#FEF2F2] border border-[#FECACA]">
                                                    <img src={CancelIconRed} alt="" className="w-6 h-6" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-6 text-[#9B9B9B]">
                                        No Data found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-end items-center gap-4 py-6 text-[#464646]">
                <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 bg-[#fceac9] rounded-full disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="font-medium">
                    Page {pagination.page} of {Math.ceil(pagination.totalUsers / pagination.pageSize)}
                </span>
                <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page >= Math.ceil(pagination.totalUsers / pagination.pageSize)}
                    className="px-4 py-2 bg-[#fceac9] rounded-full disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Order;
