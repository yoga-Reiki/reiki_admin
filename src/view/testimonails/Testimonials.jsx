import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "../../assets/svg/SearchIcon.svg";
import AddIcon from "../../assets/svg/AddIcon.svg";
import EditIcon from "../../assets/svg/EditIcon.svg";
import AddTestimonials from "./AddTestimonials";
import { getTestimonialsData, getTestimonialsDelete } from "../../services/testimonialsServices";
import TestimonialsEdit from "./TestimonialsEdit";
import DeleteIcon from "../../assets/svg/DeleteIcon.svg"
import downloadIconGrey from "../../assets/svg/downloadIconGrey.svg"
import DeleteModel from "../component/DeleteModel";
import toast from "react-hot-toast";

function Testimonials() {
    const [testimonialsData, setTestimonialsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const hasFetched = useRef(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [addTestimonials, setAddTestimonials] = useState(null);
    const [testimonialsDelete, setTestimonialsDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState(""); // 🔍 New state

    useEffect(() => {
        if (!hasFetched.current) {
            fetchTestimonials();
            toast.success("Testimonials Fetched Successfully");
            hasFetched.current = true;
        }
    }, []);

    const fetchTestimonials = async () => {
        setLoading(true);
        try {
            const response = await getTestimonialsData({ page: 1, pageSize: 10 });
            setTestimonialsData(response?.data?.items || []);
        } catch (err) {
            setError("Failed to fetch users");
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
            fetchTestimonials();
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const filteredTestimonials = testimonialsData.filter((item) =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.roleOrAddress?.toLowerCase().includes(searchQuery.toLowerCase())
        // || item.message?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="text-[#464646]">
            {selectedUser ? (
                <TestimonialsEdit
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    fetchTestimonials={fetchTestimonials}
                />
            ) : (
                <div>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-3">
                        <div>
                            <h1 className="text-[32px] font-bold">Testimonials</h1>
                            <p className="text-[#656565] pt-1">Add and manage testimonials</p>
                        </div>
                        <button
                            onClick={() => setAddTestimonials({})}
                            className="bg-[#EA7913] flex items-center space-x-2 hover:bg-[#F39C2C] text-white px-6 py-3 rounded-full cursor-pointer"
                        >
                            <img src={AddIcon} alt="Add Icon" className="p-1.5" />
                            <span>Add Testimonials</span>
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center mt-6 mb-6 gap-4 px-3">
                        <p className="text-2xl text-[#656565]">Testimonial Data List</p>
                        <div className="relative w-full md:w-72 lg:w-74.5">
                            <span className="absolute inset-y-0 left-3 flex items-center text-[#EA7913]">
                                <img src={SearchIcon} alt="search" className="w-5 h-5" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search Testimonials"
                                value={searchQuery} // 🔍 bind state
                                onChange={(e) => setSearchQuery(e.target.value)} // update state
                                className="w-full pl-10 pr-4 py-2 md:py-3 rounded-full bg-[#FCEAC9] text-[#656565] placeholder-[#656565] border-2 border-[#FEF8EC] focus:outline-none focus:ring-0 focus:border-[#F3E9D6]"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto px-3">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="grid grid-cols-5 md:w-[190%] lg:w-[130%] xl:w-full bg-[#FCEAC9] text-left text-base font-medium text-[#111111] rounded-t-2xl">
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Post / Address</th>
                                    <th className="px-4 py-3">Image</th>
                                    <th className="px-4 py-3">Testimonials</th>
                                    <th className="px-4 py-3">Action</th>
                                </tr>
                            </thead>

                            <tbody className="flex flex-col justify-center md:w-[190%] lg:w-[130%] xl:w-full bg-[#FCEAC9] rounded-b-2xl overflow-hidden">
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
                                ) : filteredTestimonials.length > 0 ? (
                                    filteredTestimonials.map((Data, index) => {
                                        const isFirst = index === 0;
                                        const isLast = index === filteredTestimonials.length - 1;
                                        return (
                                            <tr
                                                key={index}
                                                className={`grid grid-cols-5 items-center bg-white mt-[1px] text-sm ${
                                                    isFirst
                                                        ? "rounded-t-xl border-t border-[#DCDCDC] shadow-[0_-2px_4px_rgba(0,0,0,0.05)]"
                                                        : ""
                                                } ${isLast ? "rounded-b-xl border-b-0" : ""}`}
                                            >
                                                <td className="whitespace-pre-wrap px-4 py-4">{Data.name}</td>
                                                <td className="whitespace-pre-wrap px-4 py-4">{Data.roleOrAddress}</td>
                                                <td className="whitespace-pre-wrap px-4 py-4 flex items-center gap-2">
                                                    <img src={downloadIconGrey} alt="Not download" className="w-4 h-4" />
                                                    {Data.imageUrl ? Data.imageUrl.split("/").pop() : "-"}
                                                </td>
                                                <td className="pl-4 pr-8 py-4">
                                                    <div className="line-clamp-3 whitespace-pre-wrap">{Data.message}</div>
                                                </td>
                                                <td className="flex gap-3.5 items-center flex-wrap mt-2 md:mt-0 px-4 py-4">
                                                    <button
                                                        onClick={() => setSelectedUser(Data)}
                                                        className="p-3 rounded-full bg-[#FEF8EC] border border-[#F9D38E] hover:bg-[#FCEAC9] cursor-pointer"
                                                    >
                                                        <img src={EditIcon} alt="Edit Icon" className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => setTestimonialsDelete(Data)}
                                                        className="p-3 rounded-full bg-[#FEF2F2] border border-[#FECACA] hover:bg-[#fce1e1] cursor-pointer"
                                                    >
                                                        <img src={DeleteIcon} alt="Delete Icon" className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-6">
                                            No testimonials found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {addTestimonials && (
                <AddTestimonials
                    addTestimonials={addTestimonials}
                    onClose={() => setAddTestimonials(null)}
                    onConfirm={() => {
                        setAddTestimonials(null);
                        fetchTestimonials();
                    }}
                    fetchTestimonials={fetchTestimonials}
                />
            )}

            {testimonialsDelete && (
                <DeleteModel onCancel={() => setTestimonialsDelete(null)} onConfirm={confirmDelete} />
            )}
        </div>
    );
}

export default Testimonials;
