import React, { useRef, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { FiUploadCloud } from "react-icons/fi";
import toast from "react-hot-toast";
import SuccsessModel from "../component/SuccsessModel";
import { getAddBlog } from "../../services/blogServices";

function AddBlog({ onClose, selectedUser, fetchBlog }) {
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        title: selectedUser?.name || "",
        description: selectedUser?.post || "",
        content: selectedUser?.testimonials || "",
    });
    const [image, setImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const readFileAsDataURL = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
        setErrors((p) => ({ ...p, [name]: "" }));
    };

    const validateImageAndSet = async (file) => {
        if (!file) return;
        if (!file.type?.startsWith("image/")) {
            setErrors((p) => ({ ...p, image: "Please upload a valid image." }));
            return;
        }
        try {
            const dataUrl = await readFileAsDataURL(file);
            setImage(file);
            setErrors((p) => ({ ...p, image: "" }));
        } catch {
            setErrors((p) => ({ ...p, image: "Failed to load image preview." }));
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        await validateImageAndSet(file);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer?.files?.[0];
        await validateImageAndSet(file);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Blog title is required.";
        if (!formData.description.trim()) newErrors.description = "Blog description is required.";
        if (!formData.content.trim()) newErrors.content = "Blog content is required.";
        if (!image) newErrors.image = "Image is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("content", formData.content);
        data.append("isPublished", "true");
        data.append("image", image);

        try {
            setIsSubmitting(true);
            const response = await getAddBlog(data);
            setShowSuccess(true);
            toast.success(response?.message || "Added successfully");
            fetchBlog()
        } catch (err) {
            console.error("API Error:", err.response?.data || err.message);
            toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {showSuccess ? (
                <SuccsessModel
                    onClose={() => {
                        setShowSuccess(false);
                        onClose();
                    }}
                    showSuccessBlog={showSuccess}
                />
            ) : (
                <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50 text-[#464646]">
                    <div className="bg-white w-full mx-4 sm:mx-6 md:mx-8 lg:mx-0 p-5 max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-[971px] flex flex-col justify-between gap-5.5 border-t-2 border-t-[#EA7913] rounded-3xl">
                        <div className="max-h-[86vh] overflow-y-auto custom-scrollbar pr-6">
                            <div className="flex justify-between items-center p-3">
                                <h2 className="text-[32px] font-Raleway">Add Blog</h2>
                                <button
                                    onClick={onClose}
                                    className="text-[#EA7913] border border-[#989898] cursor-pointer p-4 rounded-full"
                                >
                                    <MdOutlineClose size={16} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-2.5">
                                {/* Title */}
                                <div>
                                    <label className="block text-lg mb-1">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Enter blog title"
                                        className="w-full border border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl placeholder-[#525252] px-4.5 py-2.5"
                                    />
                                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-lg mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        rows={2}
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Enter a short description"
                                        className="w-full border border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl placeholder-[#525252] px-4.5 py-2.5"
                                    />
                                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                </div>

                                {/* Content */}
                                <div>
                                    <label className="block text-lg mb-1">Content For Blog</label>
                                    <textarea
                                        name="content"
                                        rows={5}
                                        value={formData.content}
                                        onChange={handleChange}
                                        placeholder="Write your blog content here"
                                        className="w-full border border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl placeholder-[#525252] px-4.5 py-2.5"
                                    />
                                    {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                                </div>

                                {/* Image Upload */}
                                <div className="pb-4.5">
                                    <label className="block text-lg mb-1">Image for Blog Section</label>
                                    <div
                                        className={`flex flex-col items-center justify-center h-[130px] border rounded-xl cursor-pointer bg-[#FCFCFC] ${isDragging ? "border-dashed border-[#EA7913] bg-[#FEF8EC]" : "border-[#BDBDBD]"
                                            }`}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setIsDragging(true);
                                        }}
                                        onDragLeave={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setIsDragging(false);
                                        }}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {image ? (
                                            <div className="flex flex-col items-center gap-1">
                                                <FiUploadCloud size={20} className="text-[#EA7913]" />
                                                <span className="text-[#464646] font-medium">{image.name}</span>
                                                <span className="text-xs text-[#9a9a9a]">Click Here to Change Image</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 px-12">
                                                <FiUploadCloud size={20} className="text-[#EA7913]" />
                                                <span className="text-[#989898]">Upload Image Here</span>
                                                <span className="text-xs text-[#9a9a9a]">(Drag & drop or click)</span>
                                            </div>
                                        )}

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            onInput={handleFileChange}
                                        />
                                    </div>
                                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                                </div>

                                {/* Submit */}
                                <div className="pt-5.5">
                                    <div className="w-full relative inline-block rounded-full px-[4px] py-[3px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:to-[#F39C2C]">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-2.5 bg-[#EA7913] text-lg text-white cursor-pointer rounded-full font-medium hover:bg-[#F39C2C]"
                                        >
                                            {isSubmitting ? "Adding..." : "Add Blog"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AddBlog;





