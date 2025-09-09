import React, { useEffect, useRef, useState } from "react";
import { getTestimonialsUpdate } from "../../services/testimonialsServices";
import leftBackIcon from "../../assets/svg/leftIcon.svg"
import imageIconOrange from "../../assets/svg/imageIconOrange.svg"
import { getBlogUpdate } from "../../services/blogServices";
import toast from "react-hot-toast";

function EditBlog({ selectedUser, setSelectedUser, fetchBlog }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        content: "",
    });
    const [initialData, setInitialData] = useState({});
    const [imageName, setImageName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [originalImage, setOriginalImage] = useState("");
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (selectedUser) {
            const updatedData = {
                title: selectedUser.title || "",
                description: selectedUser.description || "",
                content: selectedUser.content || "",
            };

            setFormData(updatedData);
            setInitialData(updatedData);

            const imgName = selectedUser.imageUrl
                ? selectedUser.imageUrl.split("/").pop()
                : "No image";

            setImageName(imgName);
            setOriginalImage(imgName);
            setSelectedFile(null);
        }
    }, [selectedUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageName(file.name);
            setSelectedFile(file);
        }
    };

    const handleCancel = () => {
        setSelectedUser(null)
    };

    const handleSubmit = async () => {
        const hasTextChanges =
            formData.title !== initialData.title ||
            formData.description !== initialData.description ||
            formData.content !== initialData.content;

        const hasImageChange = selectedFile !== null;

        if (!hasTextChanges && !hasImageChange) {
            toast.error("No changes detected.");
            return;
        }

        if (!selectedUser?._id) {
            toast.error("Invalid blog ID. Please refresh the page.");
            return;
        }

        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("content", formData.content);
            data.append("isPublished", "true");

            if (selectedFile) {
                data.append("image", selectedFile);
            }

            await getBlogUpdate(data, selectedUser._id);

            toast.success("Blog updated successfully!");
            setSelectedUser(null);
            fetchBlog()
        } catch (error) {
            console.error("Update failed:", error);
            toast.error("Failed to update blog.");
        }
    };

    return (
        <div className="bg-[#FAFAFA] text-[#464646] flex flex-col gap-2 px-3">
            {/* Header */}
            <div className="pt-5 pb-4 flex items-start gap-4">
                <div className='p-2'>
                    <img src={leftBackIcon} alt='Not Found' className='w-5 h-5' />
                </div>
                <div className="space-y-1">
                    <h2 className="text-2xl md:text-[32px] font-Raleway font-medium">
                        <span onClick={handleCancel} className="cursor-pointer">Blog</span> &gt;{" "}
                        <span className="text-2xl font-Raleway">Edit Blog</span>
                    </h2>
                    <p className="text-[#656565]">Change Content and Image of Blog Page</p>
                </div>
            </div>

            {/* Form Container */}
            <div className="bg-white border-t-2 border-t-[#EA7913] rounded-3xl p-5 space-y-5.5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-2xl text-[#656565] font-Raleway">Blog Content</h2>
                    <div className="flex gap-3">
                        <button
                            className="bg-[#FCEAC9] text-[#656565] px-6 py-2.5 rounded-full hover:bg-[#FCEAC2] cursor-pointer"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <div className="w-full relative inline-block rounded-full px-[4px] py-[3px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:via-[#F39C2C] hover:to-[#F39C2C] active:from-[#EA7913] active:via-[#EA7913] active:to-[#EA7913]">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="w-full h-full inline-flex justify-center items-center space-x-1.5 px-6 py-2.5 bg-[#EA7913] text-[#F8F8F8] rounded-full font-medium hover:cursor-pointer hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-base"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>

                <form className="space-y-2.5">
                    {/* Title Input */}
                    <div>
                        <label className="block text-lg mb-1.5">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border border-[#BDBDBD] rounded-xl py-2.5 px-4.5 focus:outline-none focus:border-[#EA7913]"
                            placeholder="Enter blog title"
                        />
                    </div>

                    {/* Description Input */}
                    <div>
                        <label className="block text-lg mb-1.5">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={2}
                            className="w-full border border-[#BDBDBD] rounded-xl py-2.5 px-4.5 focus:outline-none focus:border-[#EA7913]"
                            placeholder="Enter short description"
                        />
                    </div>

                    {/* Blog Content & Image Upload */}
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <label className="block text-lg mb-1.5">Content For Blog</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                rows={6}
                                className="w-full h-[231px] border border-[#BDBDBD] rounded-xl py-2.5 px-4.5 focus:outline-none focus:border-[#EA7913]"
                                placeholder="Enter blog content..."
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block text-lg mb-1.5">Image for Blog Section</label>
                            <div
                                className="w-full h-[231px] flex flex-col items-center justify-center border border-[#BDBDBD] rounded-md text-center cursor-pointer hover:border-[#EA7913] transition"
                                onClick={handleFileClick}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <div className="flex flex-col justify-center items-center gap-2.5 text-[#525252]">
                                    <img src={imageIconOrange} alt="not Found" className="w-6 h-6" />
                                    <div>
                                        <p>{imageName}</p>
                                        <p >Click Here to Change Image</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditBlog;
