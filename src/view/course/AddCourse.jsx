import React, { useRef, useState } from "react";
import UploadIcon from "../../assets/svg/UploadIcon.svg";
import SuccsessModel from "../component/SuccsessModel";
import { getAddCourses } from "../../services/courseServices";

function AddCourse({ onClose, fetchCourse }) {
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        title: "",
        newPricing: "",
        oldPricing: "",
        duration: "",
        certificate: "",
        onlineOffline: "",
        content: "",
        language: "",
        certificate: "",
        shippingDetails: ""
    });
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState({
        cover: "",
        detail: "",
    });
    const [errors, setErrors] = useState({});
    const [isDragging, setIsDragging] = useState({
        cover: false,
        detail: false,
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const coverFileInputRef = useRef(null);
    const detailFileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "newPricing" || name === "oldPricing") {
            if (value === "" || /^\d*\.?\d*$/.test(value)) {
                setFormData(prev => ({ ...prev, [name]: value }));
                setErrors(prev => ({ ...prev, [name]: "" }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setImages((prev) => ({ ...prev, [type]: file }));
            setErrors((p) => ({ ...p, [type]: "" }));
        } else {
            setErrors((p) => ({ ...p, [type]: "Please upload a valid image." }));
        }
    };

    const readFileAsDataURL = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    const validateImageAndSet = async (file, type) => {
        if (!file) return;
        if (!file.type?.startsWith("image/")) {
            setErrors((p) => ({ ...p, [type]: "Please upload a valid image." }));
            return;
        }
        try {
            await readFileAsDataURL(file);
            setImages((prev) => ({ ...prev, [type]: file }));
            setErrors((p) => ({ ...p, [type]: "" }));
        } catch {
            setErrors((p) => ({ ...p, [type]: "Failed to load image preview." }));
        }
    };

    const handleDrop = async (e, type) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging((prev) => ({ ...prev, [type]: false }));
        const file = e.dataTransfer?.files?.[0];
        await validateImageAndSet(file, type);
    };

    const renderImageUpload = (label, type, inputRef) => (
        <div className="w-full">
            <label className="block text-lg mb-1">{label}</label>
            <div
                className={`flex flex-col items-center justify-center h-[171px] border border-dashed rounded-2xl cursor-pointer transition-all ${isDragging[type] ? "border-[#EA7913]" : "border-[#BDBDBD]"
                    }`}
                onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging((prev) => ({ ...prev, [type]: true }));
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging((prev) => ({ ...prev, [type]: false }));
                }}
                onDrop={(e) => handleDrop(e, type)}
                onClick={() => inputRef.current?.click()}
            >
                <img src={UploadIcon} alt="Upload" className="h-12 w-12 mb-3" />
                {images[type] ? (
                    <div className="text-[#525252]">
                        <span className="font-medium">{images[type].name}</span>
                    </div>
                ) : (
                    <div className="px-12 text-[#525252]">
                        <span> Drag & drop file here or Choose file</span>
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, type)}
                />
            </div>
            <div className={`flex items-center ${errors[type] ? "justify-between" : "justify-end"}`}>
                {errors[type] && <p className="text-red-500 text-sm mt-1">{errors[type]}</p>}
                <p className="text-[#656565] text-xs pt-1">Max size : 25 MB</p>
            </div>
        </div>
    );

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = "Title is required.";
        if (!formData.newPricing.trim()) newErrors.newPricing = "New Pricing is required.";
        if (!formData.oldPricing.trim()) newErrors.oldPricing = "Old Pricing is required.";
        if (!formData.content.trim()) newErrors.content = "Content is required.";
        if (!images.cover) newErrors.cover = "Cover Image is required.";
        if (!formData.detailContent?.trim()) newErrors.detailContent = "detailContent is required.";
        if (!images.detail) newErrors.detail = "Detail Image is required.";
        if (!formData.language.trim()) newErrors.language = "Language is required.";
        if (!formData.shippingDetails.trim()) newErrors.shippingDetails = "Shipping details are required.";
        if (!formData.duration.trim()) newErrors.duration = "Duration is required.";
        if (!formData.certificate.trim()) newErrors.certificate = "Certificate is required.";
        if (!formData.onlineOffline.trim()) newErrors.onlineOffline = "Mode is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit button handler
    const handleConfirmSubmit = async () => {
        if (!validateForm()) return;
        setLoading(true);
        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach((key) => {
                formDataToSend.append(key, formData[key]);
            });
            if (images?.cover) {
                formDataToSend.append("listImage", images?.cover);
            }

            if (images?.detail) {
                formDataToSend.append("detailImage", images?.detail);
            }

            const res = await getAddCourses(formDataToSend);
            setShowSuccess(true);
            fetchCourse()
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Success Modal */}
            {showSuccess ? (
                <SuccsessModel
                    onClose={() => {
                        setShowSuccess(false);
                        onClose();
                    }}
                    showSuccessCourse={showSuccess}
                />
            ) : (
                <div className="text-[#464646] flex flex-col gap-2">
                    <div className="p-3">
                        <h2 className="text-[32px] font-Raleway Raleway-medium text-[#656565]">
                            <span onClick={onClose} className="cursor-pointer">
                                Courses
                            </span>{" "}
                            &gt;{" "}
                            <span className="text-[#464646]">
                                Add Course
                            </span>
                        </h2>
                        <p className="pt-1 text-[#656565]">Add new course and its details</p>
                    </div>

                    <div className="px-3">
                        <div className="bg-white w-full p-6 flex flex-col justify-between gap-8 rounded-3xl">
                            <div>
                                <h2 className="text-[32px] font-Raleway Raleway-medium">Add Course</h2>
                            </div>

                            <form className="flex flex-col gap-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
                                    <div className="space-y-4.5">
                                        {[
                                            { label: "Title", name: "title", type: "text" },
                                            { label: "New Pricing", name: "newPricing", type: "number" },
                                            { label: "Old Pricing", name: "oldPricing", type: "number" },
                                        ].map((field) => (
                                            <div key={field.name}>
                                                <label className="text-[#292929] block mb-1">{field.label}</label>
                                                <input
                                                    type={field.type}
                                                    name={field.name}
                                                    value={formData[field.name]}
                                                    onChange={handleChange}
                                                    placeholder={`Enter ${field.label}`}
                                                    className="w-full h-11 border border-[#BDBDBD] rounded-xl px-4.5 py-2.5 text-[#525252] placeholder-[#525252] focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                                    {...(field.type === "number" ? { min: 0, step: "any" } : {})}
                                                />
                                                {errors[field.name] && (
                                                    <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="h-[252px]">
                                        <label className="text-[#292929] block mb-1">Content</label>
                                        <textarea
                                            name="content"
                                            value={formData.content}
                                            onChange={handleChange}
                                            placeholder="Enter Your Content Here"
                                            className="w-full h-[224px] border border-[#BDBDBD] rounded-xl px-4 py-3 text-[#525252] placeholder-[#525252] resize-none focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                        />
                                        {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {/* Image */}
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {renderImageUpload("Upload Cover Image", "cover", coverFileInputRef)}
                                        {renderImageUpload("Upload Detail Image", "detail", detailFileInputRef)}
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className="block text-lg mb-1">Content</label>
                                            <textarea
                                                name="detailContent"
                                                value={formData.detailContent}
                                                onChange={handleChange}
                                                placeholder="Enter Your Content"
                                                className="w-full h-[136px] border border-[#BDBDBD] rounded-xl px-4 py-3 placeholder-gray-500 resize-none focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                            />
                                            {errors.detailContent && <p className="text-red-500 text-sm mt-1">{errors.detailContent}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                                        <div>
                                            <label className="block text-lg mb-1">Mode</label>
                                            <select
                                                name="onlineOffline"
                                                value={formData.onlineOffline}
                                                onChange={handleChange}
                                                className="w-full border border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl placeholder-[#525252] px-4.5 py-3"
                                            >
                                                <option value="" disabled>Select Mode of Course</option>
                                                <option value="Online">Online</option>
                                                <option value="Offline">Offline</option>
                                                <option value="Hybrid">Hybrid</option>
                                            </select>
                                            {errors.onlineOffline && <p className="text-red-500 text-sm mt-1">{errors.onlineOffline}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-lg mb-1">Language</label>
                                            <select
                                                name="language"
                                                value={formData.language}
                                                onChange={handleChange}
                                                className="w-full border border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl placeholder-[#525252] px-4.5 py-3"
                                            >
                                                <option value="" disabled>Select Language</option>
                                                <option value="English">English</option>
                                                <option value="Spanish">Spanish</option>
                                                <option value="French">French</option>
                                                <option value="German">German</option>
                                            </select>
                                            {errors.language && <p className="text-red-500 text-sm mt-1">{errors.language}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-lg mb-1">Duration</label>
                                            <input
                                                type="text"
                                                name="duration"
                                                value={formData.duration}
                                                onChange={handleChange}
                                                placeholder="Enter Duration of Course"
                                                className="w-full border border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl placeholder-[#525252] px-4.5 py-2.5"
                                            />
                                            {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-lg mb-1">Certificate</label>
                                            <input
                                                type="text"
                                                name="certificate"
                                                value={formData.certificate}
                                                onChange={handleChange}
                                                placeholder="Enter certificate of Course"
                                                className="w-full border border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl placeholder-[#525252] px-4.5 py-2.5"
                                            />
                                            {errors.certificate && <p className="text-red-500 text-sm mt-1">{errors.certificate}</p>}
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-lg mb-1">Shipping Details</label>
                                            <input
                                                type="text"
                                                name="shippingDetails"
                                                value={formData.shippingDetails}
                                                onChange={handleChange}
                                                placeholder="Enter Shipping Details"
                                                className="w-full border border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl placeholder-[#525252] px-4.5 py-2.5"
                                            />
                                            {errors.shippingDetails && <p className="text-red-500 text-sm mt-1">{errors.shippingDetails}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Confirm Submit button */}
                                <div className="flex justify-end gap-2 h-12">
                                    <div>
                                        <button
                                            className="w-full bg-[#FCEAC9] text-[#656565] px-6 py-3 rounded-full hover:bg-[#FCEAC2] cursor-pointer"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                    <div>
                                        <div className="w-full relative inline-block rounded-full p-[1px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:via-[#F39C2C] hover:to-[#F39C2C] active:from-[#EA7913] active:via-[#EA7913] active:to-[#EA7913]">
                                            <button
                                                type="button"
                                                onClick={handleConfirmSubmit}
                                                className="w-full h-full inline-flex justify-center items-center space-x-1.5 px-6 py-3 bg-[#EA7913] text-[#F8F8F8] rounded-full font-medium hover:cursor-pointer hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-base"
                                            >
                                                {loading ? "Uploading..." : "Save"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div >
            )
            }
        </div >
    );
}

export default AddCourse;
