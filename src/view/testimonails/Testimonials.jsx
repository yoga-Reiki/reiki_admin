import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "../../assets/svg/SearchIcon.svg";
import EditIcon from "../../assets/svg/EditIcon.svg";
import DeleteIcon from "../../assets/svg/DeleteIcon.svg";
import plusIconGrey from "../../assets/svg/plusIconGrey.svg";
import galleryIconGrey from "../../assets/svg/galleryIconGrey.svg";
import DeleteModel from "../component/DeleteModel";
import toast from "react-hot-toast";

import TestimonialsEdit from "./TestimonialsEdit";
import { getTestimonialsData, getTestimonialsDelete } from "../../services/testimonialsServices";

function Testimonials() {
    const [testimonialsData, setTestimonialsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const hasFetched = useRef(false);

    const [activeForm, setActiveForm] = useState(null);
    const [testimonialsDelete, setTestimonialsDelete] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 5;

    useEffect(() => {
        if (!hasFetched.current) {
            fetchTestimonials(currentPage);
            hasFetched.current = true;
        }
    }, [currentPage]);

    const fetchTestimonials = async (page = 1) => {
        setLoading(true);
        try {
            const response = await getTestimonialsData({ page, pageSize });
            const data = response?.data;
            setTestimonialsData(data?.items || []);
            setTotalPages(data?.totalPages || 1);
        } catch (err) {
            setError("Failed to fetch testimonials");
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!testimonialsDelete || !testimonialsDelete._id) return;
        try {
            const response = await getTestimonialsDelete(testimonialsDelete._id);
            setTestimonialsDelete(null);
            toast.success(response?.message);
            fetchTestimonials(currentPage);
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const filteredTestimonials = testimonialsData.filter((item) =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.roleOrAddress?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handleFormClose = () => {
        setActiveForm(null);
        fetchTestimonials(currentPage);
    };

    return (
        <div className="text-[#464646]">
            {activeForm ? (
                <TestimonialsEdit
                    selectedUser={activeForm._id ? activeForm : null}
                    setSelectedUser={setActiveForm}
                    fetchTestimonials={fetchTestimonials}
                    onClose={handleFormClose}
                />
            ) : (
                <div>
                    {/* Header */}
                    <div className="p-3">
                        <h1 className="text-[32px] font-Raleway Raleway-medium">Testimonials</h1>
                        <p className="text-[#656565] pt-1">Add and manage testimonials</p>
                    </div>

                    {/* Search Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center my-2 gap-4 px-3">
                        <p className="text-2xl text-[#656565] font-Raleway Raleway-medium">All testimonials List</p>
                        <div className="relative w-full md:w-60 lg:w-76">
                            <span className="absolute inset-y-0 left-3 px-1 flex items-center text-[#EA7913]">
                                <img src={SearchIcon} alt="search" className="w-6 h-6" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search Testimonials"
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
                                    <th className="px-4 py-3 font-medium">Post / Address</th>
                                    <th className="px-4 py-3 font-medium">Image</th>
                                    <th className="px-4 py-3 font-medium">Testimonials</th>
                                    <th className="px-4 py-3 font-medium text-center">Actions</th>
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
                                ) : filteredTestimonials.length > 0 ? (
                                    filteredTestimonials.map((Data, index) => (
                                        <tr key={index} className="border-b border-[#D4D4D8] transition h-21">
                                            <td className="px-4 whitespace-pre-wrap">{Data.name}</td>
                                            <td className="px-4 whitespace-pre-wrap">{Data.roleOrAddress}</td>
                                            <td className="px-4">
                                                <div className="flex items-center gap-1">
                                                    <img src={galleryIconGrey} alt="User" />
                                                    <span className="truncate max-w-[160px]">
                                                        {Data.imageUrl ? Data.imageUrl.split("/").pop() : "-"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 ">
                                                <div className="line-clamp-2 whitespace-pre-wrap">
                                                    {Data.message}
                                                </div>
                                            </td>
                                            <td className="px-4 text-center">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => setActiveForm(Data)}
                                                        className="p-2 rounded-full bg-[#FEF8EC] border border-[#F9D38E] hover:bg-[#FCEAC9] transition cursor-pointer"
                                                    >
                                                        <img src={EditIcon} alt="Edit" className="w-6 h-6" />
                                                    </button>
                                                    <button
                                                        onClick={() => setTestimonialsDelete(Data)}
                                                        className="p-2 rounded-full bg-[#FEF2F2] border border-[#FECACA] hover:bg-[#FDE3E3] transition cursor-pointer"
                                                    >
                                                        <img src={DeleteIcon} alt="Delete" className="w-6 h-6" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-6 text-[#9B9B9B]">
                                            No Testimonials added
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Add New Button */}
                        <div
                            className="flex px-4 py-3.5 text-[#09090B] bg-[#F1F1F1] cursor-pointer transition hover:bg-[#EAEAEA]"
                            onClick={() => setActiveForm({})}
                        >
                            <img src={plusIconGrey} alt="Add" className="w-5 h-5 mr-2" />
                            <span className="text-sm font-medium">Add New Testimonials</span>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-end px-6 py-4 gap-3">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-full border border-[#E6E6E6] text-sm font-medium ${currentPage === 1 ? "text-[#BDBDBD] cursor-not-allowed" : "hover:bg-[#FFF8EE]"}`}
                        >
                            Previous
                        </button>
                        <span className="text-sm text-[#656565]">
                            Page <span className="font-semibold">{currentPage}</span> of {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-full border border-[#E6E6E6] text-sm font-medium ${currentPage === totalPages ? "text-[#BDBDBD] cursor-not-allowed" : "hover:bg-[#FFF8EE]"}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {testimonialsDelete && (
                <DeleteModel onCancel={() => setTestimonialsDelete(null)} onConfirm={confirmDelete} />
            )}
        </div>
    );
}

export default Testimonials;
