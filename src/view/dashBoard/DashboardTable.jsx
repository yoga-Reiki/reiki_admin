import React, { useState } from 'react'
import successTickIcon from "../../assets/svg/successTickIcon.svg"

function DashboardTable() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("Pending");

    const contactData = [
        {
            name: "Ryan Jones",
            email: "ryanjohn@gmail.com",
            mobile: "+91 95648 21024",
            address: "1234 Elm Street, Springfield, IL 62704",
            status: "Contacted"
        },
        {
            name: "Robin Clark",
            email: "robinvlark@gmail.com",
            mobile: "+91 86402 20015",
            address: "7890 Maple Avenue, Apt 5B, Brooklyn, NY 11215",
            status: "Contacted"
        },
        {
            name: "Ivy Rogers",
            email: "ivyrogers@gmail.com",
            mobile: "+91 85884 65520",
            address: "4567 Pine Ridge Road, Dallas, TX 75231",
            status: "Contacted"
        },
        {
            name: "Ryan Jones",
            email: "ryanjones@gmail.com",
            mobile: "+91 64520 15420",
            address: "2500 Sunset Boulevard, Suite 210, Los Angeles, CA 90026",
            status: "Contacted"
        }
    ];

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center my-4 gap-4 px-3">
                <p className="text-2xl text-[#656565]">Testimonial Data List</p>
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
                    <thead className="grid grid-cols-5 bg-[#FCEAC9] text-left text-base font-medium text-[#111111] rounded-t-2xl">
                        <th className='px-4 py-3'>Name</th>
                        <th className='px-4 py-3'>Email</th>
                        <th className='px-4 py-3'>Mobile Number</th>
                        <th className='px-4 py-3'>Address</th>
                        <th className='px-4 py-3'>Action</th>
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
                        ) : contactData.length > 0 ? (
                            contactData.map((Data, index) => {
                                const isFirst = index === 0;
                                const isLast = index === contactData.length - 1;
                                return (
                                    <tr
                                        key={index}
                                        className={`grid grid-cols-5 items-center bg-white mt-[1px] text-sm ${isFirst ? 'rounded-t-xl border-t border-[#DCDCDC] shadow-[0_-2px_4px_rgba(0,0,0,0.05)]' : ''} ${isLast ? 'rounded-b-xl border-b-0' : ''}`}
                                    >
                                        <td className="whitespace-pre-wrap px-4 py-7.5">{Data.name}</td>
                                        <td className="whitespace-pre-wrap px-4 py-7.5">{Data.email}</td>
                                        <td className="whitespace-pre-wrap px-4 py-7.5">{Data.mobile}</td>
                                        <td className="pl-4 pr-8 py-7.5">
                                            <div className="line-clamp-2 whitespace-pre-wrap">
                                                {Data.address}
                                            </div>
                                        </td>
                                        <td className="flex gap-3.5 items-center flex-wrap mt-2 md:mt-0 px-4 py-7.5">
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
            </div>
        </div>
    )
}

export default DashboardTable