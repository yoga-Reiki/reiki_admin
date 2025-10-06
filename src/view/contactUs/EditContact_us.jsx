import React, { useEffect, useRef, useState } from 'react'
import editIconGrey from "../../assets/svg/editIconGrey.svg";
import UploadIcon from "../../assets/svg/UploadIcon.svg";
import toast from 'react-hot-toast';
import { getContactUsUpdate } from '../../services/contactUsServices';

function EditContact_us({ contactData, onCancel, fetchContactData }) {
    const [formData, setFormData] = useState({
        heroContent: '',
        mobileNumber: '',
        email: '',
        youtube: '',
        linkedin: '',
        twitter: '',
        instagram: '',
        location: '',
    });
    const [isDragging, setIsDragging] = useState(false);
    const [imageName, setImageName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const coverInputRef = useRef(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const startEditing = () => {
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setFormData({ ...contactData });
        setImageName("");
        setSelectedFile(null);
        setIsEditing(false);
        onCancel && onCancel();
    };

    const handleImageChange = (file) => {
        if (file && file.type.startsWith("image/")) {
            setImageName(file.name);
            setSelectedFile(file);
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer?.files?.[0];
        if (file && file.type.startsWith("image/")) {
            handleImageChange(file);
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.cover;
                return newErrors;
            });
        } else {
            setErrors((prev) => ({
                ...prev,
                cover: "Please upload a valid image.",
            }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) handleImageChange(file);
    };

    const isFormDataChanged = () => {
        const original = contactData || {};
        const current = formData;
        const keys = [
            "heroContent", "mobileNumber", "email", "youtube",
            "linkedin", "twitter", "instagram", "location"
        ];
        for (let key of keys) {
            if (original[key] !== current[key]) return true;
        }
        return !!imageName;
    };

    useEffect(() => {
        if (contactData) {
            setFormData({ ...contactData });
        }
    }, [contactData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        let tempErrors = {};
        if (!formData.heroContent.trim()) tempErrors.heroContent = "Hero content is required";
        if (!formData.email.trim()) tempErrors.email = "Email is required";
        if (!formData.mobileNumber.trim()) tempErrors.mobileNumber = "Mobile number is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!isFormDataChanged()) {
            toast.error("No changes detected.");
            return;
        }
        if (!validateForm()) {
            toast.error("Please fix the errors before submitting.");
            return;
        }
        setLoading(true);
        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach((key) => {
                if (key !== "heroImageUrl") {
                    formDataToSend.append(key, formData[key] || "");
                }
            });
            if (selectedFile) formDataToSend.append("heroImage", selectedFile);

            await getContactUsUpdate(formDataToSend);
            toast.success("Contact Us content updated successfully!");
            fetchContactData();
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getFilename = (url) => (!url ? '' : url.split('/').pop());

    return (
        <div className="space-y-2">
            <div className="px-3">
                <div className="bg-white rounded-3xl w-full space-y-8 p-6">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 h-8">
                        <h2 className="text-[#656565] text-2xl font-Raleway Raleway-medium">
                            Contact Us Section
                        </h2>
                        {!isEditing ? (
                            <button
                                className="flex text-sm items-center gap-2.5 py-2 px-4 text-[#656565] rounded-full border border-[#F9D38E] cursor-pointer"
                                onClick={startEditing}
                            >
                                <img src={editIconGrey} alt="Edit" className="p-[3px]" />
                                <span>Edit</span>
                            </button>
                        ) : null}
                    </div>

                    <div className="space-y-3">
                        <div className="grid lg:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[#292929] block mb-1">Hero Section Content</label>
                                <textarea
                                    name="heroContent"
                                    disabled={!isEditing}
                                    className={`w-full h-[172px] px-4 py-3 border-[1px] border-[#DCDCDC] rounded-2xl outline-none 
                                        ${isEditing
                                            ? "text-[#525252] focus:border-[#EA7913]"
                                            : "text-[#989898]"
                                        }`}
                                    value={formData.heroContent}
                                    onChange={handleChange}
                                />
                                {errors.heroContent && <p className="text-red-500 text-sm">{errors.heroContent}</p>}
                            </div>

                            <div>
                                <label className="text-[#292929] block mb-1">Hero Section Upload Image</label>
                                <div
                                    className={`flex flex-col items-center justify-center h-[172px] border border-dashed rounded-2xl cursor-pointer
                                        ${isDragging ? "border-[#EA7913]" : "border-[#BDBDBD]"}`}
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
                                    onDrop={isEditing ? (e) => handleDrop(e) : undefined}
                                    onClick={isEditing ? () => coverInputRef.current?.click() : undefined}
                                >
                                    <img src={UploadIcon} alt="Not Found" className="h-12 w-12 mb-3" />
                                    {imageName ? (
                                        <div className={`${isEditing ? "text-[#525252]" : "text-[#989898]"}`}>
                                            <span className="font-medium text-center break-words">{imageName}</span>
                                        </div>
                                    ) : (
                                        <div className={`${isEditing ? "text-[#525252]" : "text-[#989898]"}`}>
                                            <span className="text-center">{getFilename(formData?.heroImageUrl)}</span>
                                        </div>
                                    )}
                                    <input
                                        ref={coverInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e)}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <p className="text-[#656565] text-xs pt-1 text-end">Max size : 25 MB</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4.5 gap-y-3">
                            {[
                                { label: "Mobile Number", name: "mobileNumber" },
                                { label: "E-mail", name: "email" },
                                { label: "YouTube", name: "youtube" },
                                { label: "LinkedIn", name: "linkedin" },
                                { label: "Twitter", name: "twitter" },
                                { label: "Instagram", name: "instagram" },
                                { label: "Location", name: "location" },
                            ].map((field, i) => (
                                <div key={i} className={field.name === "location" ? "md:col-span-2" : ""}>
                                    <label className="text-[#292929] block mb-1">{field.label}</label>
                                    <input
                                        type="text"
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`w-full border-[1px] border-[#DCDCDC] rounded-full px-4 py-2 outline-none 
                                            ${isEditing
                                                ? "text-[#525252] focus:border-[#EA7913]"
                                                : "text-[#989898]"
                                            }`}
                                    />
                                    {errors[field.name] && <p className="text-red-500 text-sm">{errors[field.name]}</p>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Buttons */}
                    {isEditing && (
                        <div className="flex justify-end gap-2">
                            <button
                                className="bg-[#FEF8EC] border border-[#F9D38E] text-[#656565] px-6 py-2.5 rounded-full cursor-pointer"
                                onClick={cancelEditing}
                            >
                                Cancel
                            </button>
                            <div className="relative inline-block rounded-full p-[1px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900]">
                                <button
                                    onClick={handleSubmit}
                                    type="submit"
                                    className="inline-flex justify-center items-center space-x-1.5 px-6 py-3 bg-[#EA7913] text-[#F8F8F8] rounded-full font-medium hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-base cursor-pointer"
                                >
                                    {loading ? "Updating..." : "Save"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EditContact_us;
