import React, { useEffect, useRef, useState } from 'react'
import successTickIcon from "../../assets/svg/successTickIcon.svg"

function DashboardTable({ dashboardData, loading, error, pagination, setPagination }) {
    const [activeTab, setActiveTab] = useState("Pending");

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center my-4 gap-4 px-3">
                <p className="text-2xl text-[#656565]">Today’s Contact Details</p>
                <div className="flex bg-[#F5F0E6] rounded-full text-[#656565] w-fit">
                    <button
                        onClick={() => setActiveTab("Pending")}
                        className={`text-center py-3 pl-6 pr-3.5 rounded-l-full font-medium cursor-pointer ${activeTab === "Pending" ? "bg-[#FCEAC9]" : "bg-white"
                            }`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setActiveTab("Completed")}
                        className={`text-center py-3 px-3.5 rounded-r-full font-medium cursor-pointer ${activeTab === "Completed" ? "bg-[#FCEAC9]" : "bg-white"
                            }`}
                    >
                        Completed
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto px-3">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="grid grid-cols-5 md:w-[160%] lg:w-[130%] xl:w-full bg-[#FCEAC9] text-left text-base font-medium text-[#111111] rounded-t-2xl">
                            <th className='px-4 py-3'>Name</th>
                            <th className='px-4 py-3'>Email</th>
                            <th className='px-4 py-3'>Mobile Number</th>
                            <th className='px-4 py-3'>Address</th>
                            <th className='px-4 py-3 text-end'>Action</th>
                        </tr>
                    </thead >

                    <tbody className="flex flex-col justify-center md:w-[160%] lg:w-[130%] xl:w-full bg-[#FCEAC9] rounded-b-2xl overflow-hidden">
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
                        ) : dashboardData.length > 0 ? (
                            dashboardData.map((Data, index) => {
                                const isFirst = index === 0;
                                const isLast = index === dashboardData.length - 1;
                                return (
                                    <tr
                                        key={index}
                                        className={`grid grid-cols-5 items-center bg-white mt-[1px] text-sm ${isFirst ? 'rounded-t-xl border-t border-[#DCDCDC] shadow-[0_-2px_4px_rgba(0,0,0,0.05)]' : ''} ${isLast ? 'rounded-b-xl border-b-0' : ''}`}
                                    >
                                        <td className="whitespace-pre-wrap px-4 py-7.5">{Data.name}</td>
                                        <td className="px-4 py-7.5">
                                            <p className="md:w-24 lg:w-30 xl:w-full break-all">{Data.email}</p>
                                        </td>
                                        <td className="whitespace-pre-wrap px-4 py-7.5">{Data.mobileNumber}</td>
                                        <td className="whitespace-pre-wrap px-4 py-7">
                                            {Data?.address
                                                ? `${Data.address.street}, ${Data.address.city}, ${Data.address.state}, ${Data.address.pincode}, ${Data.address.country}`
                                                : "-"}
                                        </td>
                                        <td className="flex justify-end gap-3.5 items-center flex-wrap mt-2 md:mt-0 px-4 py-7.5">
                                            <button className="p-3 flex items-center gap-2 rounded-full bg-[#F0FDF4] text-[#22C55E] border border-[#BBF7D0] cursor-pointer">
                                                <img src={successTickIcon} alt='Not Found' className='w-4 h-4' />
                                                <span>Contacted</span>
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
        </div>
    )
}

export default DashboardTable