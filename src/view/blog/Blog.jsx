import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "../../assets/svg/SearchIcon.svg";
import EditIcon from "../../assets/svg/EditIcon.svg";
import DeleteIcon from "../../assets/svg/DeleteIcon.svg";
import DeleteModel from "../component/DeleteModel";
import { getblogData, getBlogDelete } from "../../services/blogServices";
import toast from "react-hot-toast";
import plusIconGrey from "../../assets/svg/plusIconGrey.svg";
import BlogForm from "./EditBlog";

function Blog() {
    const [blogsData, setBlogsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const hasFetched = useRef(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [blogDelete, setBlogDelete] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        totalUsers: 0,
    });
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!hasFetched.current || searchQuery === "") {
            fetchBlog();
            hasFetched.current = true;
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
            setError("Failed to fetch blogs");
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!blogDelete || !blogDelete._id) return;

        try {
            await getBlogDelete(blogDelete._id);
            setBlogDelete(null);
            toast.success("Blog deleted successfully!");
            fetchBlog();
        } catch (error) {
            console.error("Delete failed", error);
            toast.error("Failed to delete blog.");
        }
    };

    return (
        <div className="text-[#464646]">
            {selectedUser ? (
                <BlogForm
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    fetchBlog={fetchBlog}
                />
            ) : (
                <div>
                    <div className="p-3">
                        <h1 className="text-[32px] font-Raleway Raleway-medium">Blog</h1>
                        <p className="text-[#656565] pt-1">
                            Change Content and Image of Blog Page
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center my-2 gap-4 px-3">
                        <p className="text-2xl text-[#656565] font-Raleway Raleway-medium">
                            All Blogs
                        </p>
                        <div className="relative w-full md:w-60 lg:w-76">
                            <span className="absolute inset-y-0 left-3 px-1 flex items-center text-[#EA7913]">
                                <img src={SearchIcon} alt="search" className="w-6 h-6" />
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
                                className="w-full h-10 pl-12 pr-4 py-2 rounded-full text-[#656565] placeholder-[#656565] border border-[#DCDCDC] focus:outline-none focus:ring-0 focus:border-[#F3E9D6]"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto bg-white border border-[#BDBDBD] rounded-2xl mx-3">
                        <table className="w-full border-collapse text-left text-[#464646] table-fixed">
                            <thead className="bg-[#FFF8EE] text-sm text-[#09090B] border-b border-[#D4D4D8]">
                                <tr>
                                    <th className="px-4 py-3 font-medium w-40 lg:w-64 xl:w-94">
                                        Title
                                    </th>
                                    <th className="px-4 py-3 font-medium">Description</th>
                                    <th className="px-4 py-3 font-medium w-36">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {loading ? (
                                    <tr>
                                        <td colSpan="3" className="text-center py-6">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="3" className="text-center py-6 text-red-500">
                                            {error}
                                        </td>
                                    </tr>
                                ) : blogsData.length > 0 ? (
                                    blogsData.map((Data, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-[#D4D4D8] transition h-21"
                                        >
                                            <td className="px-4 whitespace-pre-wrap w-40 lg:w-64 xl:w-94">
                                                {Data.title}
                                            </td>
                                            <td className="whitespace-pre-wrap pl-4 pr-4 lg:pr-10 xl:pr-36">
                                                <div className="line-clamp-2 whitespace-pre-wrap">
                                                    {Data.description}
                                                </div>
                                            </td>
                                            <td className="px-4 text-center w-42 lg:w-36">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setSelectedUser(Data)}
                                                        className="p-2 rounded-full bg-[#FEF8EC] border border-[#F9D38E] hover:bg-[#FCEAC9] transition cursor-pointer"
                                                    >
                                                        <img
                                                            src={EditIcon}
                                                            alt="Edit"
                                                            className="w-6 h-6"
                                                        />
                                                    </button>
                                                    <button
                                                        onClick={() => setBlogDelete(Data)}
                                                        className="p-2 rounded-full bg-[#FEF2F2] border border-[#FECACA] hover:bg-[#FDE3E3] transition cursor-pointer"
                                                    >
                                                        <img
                                                            src={DeleteIcon}
                                                            alt="Delete"
                                                            className="w-6 h-6"
                                                        />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="text-center py-6 text-[#9B9B9B]"
                                        >
                                            No Blogs added
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div
                            className="flex px-4 py-3.5 text-[#09090B] bg-[#F1F1F1] cursor-pointer transition hover:bg-[#EAEAEA]"
                            onClick={() => setSelectedUser({})}
                        >
                            <img
                                src={plusIconGrey}
                                alt="Add"
                                className="w-5 h-5 mr-2"
                            />
                            <span className="text-sm font-medium">Add New Blog</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {blogDelete && (
                <DeleteModel
                    onCancel={() => setBlogDelete(null)}
                    onConfirmBlog={confirmDelete}
                />
            )}
        </div>
    );
}

export default Blog;
