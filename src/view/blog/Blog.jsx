import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "../../assets/svg/SearchIcon.svg";
import AddIcon from "../../assets/svg/AddIcon.svg";
import EditIcon from "../../assets/svg/EditIcon.svg";
import DeleteIcon from "../../assets/svg/DeleteIcon.svg"
import DeleteModel from "../component/DeleteModel";
import EditBlog from "./EditBlog";
import AddBlog from "./AddBlog";
import { getblogData, getBlogDelete } from "../../services/blogServices";
import toast from "react-hot-toast";

function Blog() {
    const [blogsData, setBlogsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const hasFetched = useRef(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [addBlogs, setAddBlogs] = useState(null);
    const [blogDelete, setBlogDelete] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        totalUsers: 0,
    });
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!hasFetched.current) {
            fetchBlog();
            hasFetched.current = true;
        }
    }, []);

    useEffect(() => {
        if (searchQuery === "") {
            fetchBlog();
        }
    }, [searchQuery]);

    const fetchBlog = async () => {
        setLoading(true);
        try {
            const response = await getblogData({
                page: pagination.page,
                pageSize: pagination.pageSize,
                query: searchQuery,
            });

            setBlogsData(response?.data?.items || []);
            setPagination((prev) => ({
                ...prev,
                totalUsers: response?.data?.totalItems || 0,
            }));
        } catch (err) {
            setError("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!blogDelete || !blogDelete._id) return;

        try {
            await getBlogDelete(blogDelete._id);
            setBlogDelete(null);
            toast.success("blog deleted successfully!")
            fetchBlog();
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    return (
        <div className="text-[#464646]">
            {selectedUser ? (
                <EditBlog
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    fetchBlog={fetchBlog}
                />
            ) : (
                <div>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-3">
                        <div>
                            <h1 className="text-[32px] font-bold">Blog</h1>
                            <p className="text-[#656565] pt-1">Change Content and Image of Blog Page</p>
                        </div>
                        <button onClick={() => setAddBlogs({})} className="bg-[#EA7913] flex items-center space-x-2 hover:bg-[#F39C2C] text-white px-6 py-3 rounded-full cursor-pointer">
                            <img src={AddIcon} alt="Download Icon" className="p-1.5" />
                            <span>Add Blog </span>
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center mt-6 mb-6 gap-4 px-3">
                        <p className="text-2xl text-[#656565]">All Blogs</p>
                        <div className="relative w-full md:w-72 lg:w-74.5">
                            <span className="absolute inset-y-0 left-3 px-1 flex items-center text-[#EA7913]">
                                <img src={SearchIcon} alt="search" className="w-5 h-5" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search Blog by Title"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        fetchBlog();
                                    }
                                }}
                                className="w-full pl-10 pr-4 py-2 md:py-3 rounded-full bg-[#FCEAC9] text-[#656565] placeholder-[#656565] border-2 border-[#FEF8EC] focus:outline-none focus:ring-0 focus:border-[#F3E9D6]"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto px-3">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="grid grid-cols-3 md:w-[110%] lg:w-full bg-[#FCEAC9] text-left text-base font-medium text-[#111111] rounded-t-2xl">
                                    <th className='px-4 py-3'>Title</th>
                                    <th className='px-4 py-3'>Description</th>
                                    <th className='px-4 py-3'>Actions</th>
                                </tr>
                            </thead >

                            <tbody className="flex flex-col justify-center md:w-[110%] lg:w-full bg-[#FCEAC9] rounded-b-2xl overflow-hidden">
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
                                ) : blogsData.length > 0 ? (
                                    blogsData.map((Data, index) => {
                                        const isFirst = index === 0;
                                        const isLast = index === blogsData.length - 1;
                                        return (
                                            <tr
                                                key={index}
                                                className={`grid grid-cols-3 items-center bg-white mt-[1px] text-sm ${isFirst ? 'rounded-t-xl border-t border-[#DCDCDC] shadow-[0_-2px_4px_rgba(0,0,0,0.05)]' : ''} ${isLast ? 'rounded-b-xl border-b-0' : ''}`}
                                            >
                                                <td className="whitespace-pre-wrap px-4 py-4">{Data.title}</td>
                                                <td className="whitespace-pre-wrap px-4 py-4">
                                                    <div className="line-clamp-2 whitespace-pre-wrap">{Data.description}</div>
                                                </td>
                                                <td className="flex gap-1 items-center flex-wrap mt-2 md:mt-0 px-4 py-4">
                                                    <button onClick={() => setSelectedUser(Data)} className="p-3 flex items-center gap-2 rounded-full text-[#EA7913] bg-[#FEF8EC] border border-[#F9D38E] hover:bg-[#FCEAC9] cursor-pointer">
                                                        <img src={EditIcon} alt='Download Icon' className='w-5 h-5' />
                                                        <span>Edit</span>
                                                    </button>
                                                    <button onClick={() => setBlogDelete(Data)} className="p-3 rounded-full bg-[#FEF2F2] border border-[#FECACA] hover:bg-[#fce1e1] cursor-pointer">
                                                        <img src={DeleteIcon} alt='Download Icon' className='w-5 h-5' />
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
            )}

            {addBlogs && (
                <AddBlog
                    addBlogs={addBlogs}
                    onClose={() => setAddBlogs(null)}
                    onConfirm={() => {
                        console.log("Blocked:", addBlogs.name);
                        setAddBlogs(null);
                    }}
                    fetchBlog={fetchBlog}
                />
            )}

            {blogDelete && (
                <DeleteModel onCancel={() => setBlogDelete(null)} onConfirmBlog={confirmDelete} />
            )}
        </div>
    );
}

export default Blog;

