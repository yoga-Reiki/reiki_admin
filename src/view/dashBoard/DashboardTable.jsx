import React, { useEffect, useRef, useState } from 'react'
import successGreenIcon from "../../assets/svg/successGreenIcon.svg"
import SearchIcon from "../../assets/svg/SearchIcon.svg";
import ArrowDownIcon from "../../assets/svg/ArrowDownIcon.svg";

function DashboardTable({ fetchUsers, searchTerm, setSearchTerm, statusDropdownOpen, setStatusDropdownOpen, dateDropdownOpen, setDateDropdownOpen, setDateFilter, dateFilter, setActiveTab, activeTab, dashboardData, loading, error, pagination, setPagination }) {
    const dateDropdownRef = useRef(null);
    const statusDropdownRef = useRef(null);

    return (
        <div>
            <div className="flex flex-col lg:flex-row justify-between lg:items-start xl:items-center gap-4 px-3 lg:h-10 mb-2">
                <p className="text-2xl font-Raleway Raleway-medium text-[#656565]">Contact Requests</p>

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
                            onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
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
                            <img src={ArrowDownIcon} alt="Dropdown Icon" />
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
                            <img src={ArrowDownIcon} alt="Dropdown Icon" />
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

            {/* Table */}
            <div className="overflow-x-auto bg-white border border-[#BDBDBD] rounded-2xl mx-3">
                <table className="w-full border-collapse text-left text-[#464646] table-fixed">
                    <thead className="bg-[#FFF8EE] text-sm text-[#09090B] border-b border-[#D4D4D8]">
                        <tr>
                            <th className='px-4 py-3 font-medium'>Name</th>
                            <th className='px-4 py-3 font-medium'>Email</th>
                            <th className='px-4 py-3 font-medium'>Mobile Number</th>
                            <th className='px-4 py-3 font-medium lg:w-64 xl:w-96'>Address</th>
                            <th className='px-4 py-3 font-medium w-20'>Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center py-6">Loading...</td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="5" className="text-center py-6 text-red-500">{error}</td>
                            </tr>
                        ) : dashboardData?.length > 0 ? (
                            dashboardData.map((Data, index) => (
                                <tr key={index} className="border-b border-[#D4D4D8] last:border-b-0 transition h-16">
                                    <td className="px-4 whitespace-pre-wrap">{Data?.name}</td>
                                    <td className="px-4 w-32 break-words whitespace-normal">{Data.email}</td>
                                    <td className="whitespace-pre-wrap px-4">{Data.mobileNumber}</td>
                                    <td className="whitespace-pre-wrap px-4">
                                        {Data?.address
                                            ? `${Data.address.street}, ${Data.address.city}, ${Data.address.state}, ${Data.address.pincode}, ${Data.address.country}`
                                            : "-"}
                                    </td>
                                    <td className="flex gap-3.5 items-center flex-wrap mt-2 md:mt-0 px-4 py-[9.2px]">
                                        <button className="w-10 h-10 p-2 rounded-full bg-[#F0FDF4] text-[#22C55E] border border-[#BBF7D0] cursor-pointer">
                                            <img src={successGreenIcon} alt='Not Found' className='w-6 h-6' />
                                        </button>
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

            {/* Pagination */}
            <div className="flex justify-end items-center gap-4 py-6 text-[#464646] px-2">
                <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 bg-[#fceac9] rounded-full disabled:opacity-50 cursor-pointer"
                >
                    Previous
                </button>
                <span className="font-medium">
                    Page {pagination.page} of {Math.ceil(pagination.totalUsers / pagination.pageSize)}
                </span>
                <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page >= Math.ceil(pagination.totalUsers / pagination.pageSize)}
                    className="px-4 py-2 bg-[#fceac9] rounded-full disabled:opacity-50 cursor-pointer"
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default DashboardTable