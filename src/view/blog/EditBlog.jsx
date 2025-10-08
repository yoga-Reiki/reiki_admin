import React, { useEffect, useRef, useState } from "react";
import UploadIcon from "../../assets/svg/UploadIcon.svg";
import { getAddBlog, getBlogUpdate } from "../../services/blogServices";
import toast from "react-hot-toast";
import { Editor } from "@tinymce/tinymce-react";
import SuccsessModel from "../component/SuccsessModel";

function BlogForm({ selectedUser, setSelectedUser, fetchBlog, onClose }) {
    const isEditMode = !!selectedUser?._id;
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        content: "",
    });
    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const [showSuccess, setShowSuccess] = useState(false);

    // Load existing data if editing
    useEffect(() => {
        if (isEditMode && selectedUser) {
            setFormData({
                title: selectedUser.title || "",
                description: selectedUser.description || "",
                content: selectedUser.content || "",
            });
            const imgName = selectedUser.imageUrl
                ? selectedUser.imageUrl.split("/").pop()
                : "No image";
            setImageName(imgName);
        } else {
            setFormData({ title: "", description: "", content: "" });
            setImage(null);
            setImageName("");
        }
    }, [selectedUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
        setErrors((p) => ({ ...p, [name]: "" }));
    };

    const readFileAsDataURL = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    const validateImageAndSet = async (file) => {
        if (!file) return;
        if (!file.type?.startsWith("image/")) {
            setErrors((p) => ({ ...p, image: "Please upload a valid image." }));
            return;
        }
        try {
            await readFileAsDataURL(file);
            setImage(file);
            setImageName(file.name);
            setErrors((p) => ({ ...p, image: "" }));
        } catch {
            setErrors((p) => ({ ...p, image: "Failed to load image." }));
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        await validateImageAndSet(file);
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
        if (!formData.description.trim())
            newErrors.description = "Blog description is required.";
        if (!formData.content.trim())
            newErrors.content = "Blog content is required.";
        if (!isEditMode && !image)
            newErrors.image = "Image is required for new blogs.";
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
        if (image) data.append("image", image);

        setLoading(true);
        try {
            if (isEditMode) {
                await getBlogUpdate(data, selectedUser._id);
                toast.success("Blog updated successfully!");
                setSelectedUser(null);
            } else {
                await getAddBlog(data);
                toast.success("Blog added successfully!");
                setShowSuccess(true);
            }
            fetchBlog();
        } catch (err) {
            console.error("Error:", err);
            toast.error("Failed to save blog. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => setSelectedUser(null);

    return (
        <div className="bg-[#FAFAFA] text-[#464646] flex flex-col gap-2 px-3">
            <div className="py-3">
                <h2 className="text-[32px] font-Raleway Raleway-medium text-[#656565]">
                    <span
                        onClick={handleCancel}
                        className="cursor-pointer"
                    >
                        Blog
                    </span>{" "}
                    &gt;{" "}
                    <span className="text-[#464646]">
                        {isEditMode ? "Edit Blog" : "Add Blog"}
                    </span>
                </h2>
                <p className="pt-1 text-[#656565]">
                    {isEditMode
                        ? "Change Content and Image of Blog Page"
                        : "Add Blog Page"}
                </p>
            </div>

            <div className="bg-white rounded-3xl p-6 space-y-8">
                <h2 className="text-2xl text-[#656565] font-Raleway Raleway-medium">
                    Blog Content
                </h2>

                <form className="space-y-3">
                    <div>
                        <label className="text-[#292929] block mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border border-[#BDBDBD] text-[#525252] rounded-full py-2.5 px-4.5 focus:outline-none focus:border-[#EA7913]"
                            placeholder="Enter blog title"
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm pt-1">{errors.title}</p>
                        )}
                    </div>

                    <div className="h-24.5">
                        <label className="text-[#292929] block mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={2}
                            className="w-full border border-[#BDBDBD] text-[#525252] rounded-2xl py-2.5 px-4.5 focus:outline-none focus:border-[#EA7913]"
                            placeholder="Enter short description"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm">{errors.description}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-[#292929] block mb-1">Content</label>
                            <Editor
                                apiKey="w0h75l9p91ijk4a35sioyvhphj294qox82aq9wntohg9iees"
                                value={formData.content}
                                onEditorChange={(content) =>
                                    setFormData((p) => ({ ...p, content }))
                                }
                                init={{
                                    height: 171,
                                    menubar: false,
                                    plugins: [
                                        "link", "lists", "image", "media", "table", "code", "wordcount",
                                    ],
                                    toolbar:
                                        "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image media | code",
                                }}
                            />
                            {errors.content && (
                                <p className="text-red-500 text-sm pt-1">{errors.content}</p>
                            )}
                        </div>
                        <div>
                            <label className="text-[#292929] block mb-1">
                                Image for Blog Section
                            </label>
                            <div
                                className={`flex flex-col items-center justify-center h-[171px] border border-dashed rounded-2xl cursor-pointer ${isDragging
                                    ? "border-[#EA7913]"
                                    : "border-[#BDBDBD]"
                                    }`}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragging(true);
                                }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {imageName ? (
                                    <div className="flex flex-col justify-center items-center gap-3 text-[#525252]">
                                        <img src={UploadIcon} alt="Not Found" className="h-12 w-12" />
                                        <span className="font-medium w-full text-center break-words">
                                            {imageName}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 px-12 text-[#525252]">
                                        <img src={UploadIcon} alt="Not Found" className="h-12 w-12" />
                                        <span className="text-[#989898]">Drag & drop file here or Choose file</span>
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className={`flex items-center ${errors.image ? "justify-between" : "justify-end"}`}>
                                {errors.image && (
                                    <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                                )}
                                <p className="text-[#656565] text-xs pt-1 text-end">Max size : 25 MB</p>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="flex justify-end gap-2 h-12">
                    <button
                        className="bg-[#FCEAC9] text-[#656565] px-6 py-2.5 rounded-full hover:bg-[#FCEAC2] cursor-pointer"
                        onClick={onClose ? onClose : handleCancel}
                    >
                        Cancel
                    </button>
                    <div className="relative inline-block rounded-full p-[1px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900]">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="inline-flex justify-center items-center space-x-1.5 px-6 py-3 bg-[#EA7913] text-[#F8F8F8] rounded-full font-medium hover:bg-[#F39C2C] transition text-base cursor-pointer"
                        >
                            {loading
                                ? isEditMode
                                    ? "Updating..."
                                    : "Adding..."
                                : isEditMode
                                    ? "Save"
                                    : "Save"}
                        </button>
                    </div>
                </div>
            </div>
            {showSuccess && (
                <SuccsessModel
                    onClose={() => {
                        setShowSuccess(false);
                        handleCancel()
                    }}
                    showSuccessBlog={showSuccess}
                />
            )}
        </div>
    );
}

export default BlogForm;
