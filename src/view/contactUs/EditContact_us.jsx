import React, { useEffect, useRef, useState } from 'react'
import galleryIconOrange from "../../assets/svg/galleryIconOrange.svg"
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
        heroImageUrl: ''
    });
    const [isDragging, setIsDragging] = useState(false);
    const [images, setImages] = useState(null);
    const fileInputRef = useRef(null);
    const [errors, setErrors] = useState({});

    const handleFileChange = (e, type) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setImages((prev) => ({ ...prev, [type]: file }));
            setErrors((p) => ({ ...p, image: "" }));
        } else {
            setErrors((p) => ({ ...p, image: "Please upload a valid image." }));
        }
    };

    const readFileAsDataURL = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    const isFormDataChanged = () => {
        const original = contactData || {};
        const current = formData;
        const keysToCheck = [
            "heroContent",
            "mobileNumber",
            "email",
            "youtube",
            "linkedin",
            "twitter",
            "instagram",
            "location"
        ];

        for (let key of keysToCheck) {
            if (original[key] !== current[key]) {
                return true;
            }
        }

        if (images?.detail) return true;

        return false;
    };

    const validateImageAndSet = async (file, type = "cover") => {
        if (!file) return;
        if (!file.type?.startsWith("image/")) {
            setErrors((p) => ({ ...p, image: "Please upload a valid image." }));
            return;
        }
        try {
            await readFileAsDataURL(file);
            setImages((prev) => ({ ...prev, [type]: file }));
            setErrors((p) => ({ ...p, image: "" }));
        } catch {
            setErrors((p) => ({ ...p, image: "Failed to load image preview." }));
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer?.files?.[0];
        await validateImageAndSet(file);
    };

    useEffect(() => {
        if (contactData) {
            setFormData({ ...contactData });
        }
    }, [contactData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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

        const updatedData = { ...formData };

        // If new image selected
        if (images?.detail) {
            const imageForm = new FormData();
            imageForm.append("file", images.detail);
        }

        try {
            await getContactUsUpdate(updatedData);
            toast.success("Contact Us content updated successfully!");
            onCancel()
            fetchContactData()
        } catch (error) {
            console.error(error);
            toast.error("Failed to update. Please try again.");
        }
    };

    return (
        <div className="text-[#464646] space-y-2">
            <div className='p-3'>
                <h1 className="text-[32px] font-Raleway">Contact Us</h1>
                <p className="text-[#656565] pt-1">Change Content and Image of Contact Us Page</p>
            </div>

            <div className="p-2">
                <div className="bg-white border-t border-t-[#EA7913] rounded-3xl w-full space-y-6 p-5">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <h2 className="text-[#656565] text-2xl">Contact Us Section</h2>
                        <div className="flex gap-2 w-full lg:w-auto">
                            <button
                                className="w-full lg:w-auto bg-[#FCEAC9] text-[#656565] px-6 py-2.5 rounded-full hover:bg-[#FCEAC2] cursor-pointer"
                                onClick={onCancel}
                            >
                                Cancel
                            </button>
                            <div className="w-full relative inline-block rounded-full px-[5px] py-[2.5px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:via-[#F39C2C] hover:to-[#F39C2C] active:from-[#EA7913] active:via-[#EA7913] active:to-[#EA7913]">
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="w-full h-full inline-flex justify-center items-center space-x-1.5 px-6 py-2.5 bg-[#EA7913] text-[#F8F8F8] rounded-full font-medium hover:cursor-pointer hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-base"
                                >
                                    Change in Website
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        <div className="grid lg:grid-cols-2 gap-6">
                            <div className="flex flex-col h-full">
                                <label className="text-lg font-medium mb-2">Hero Section Content</label>
                                <textarea
                                    name="heroContent"
                                    className="w-full h-full px-4 py-2 border-[1px] border-[#DCDCDC] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl outline-none text-[#989898]"
                                    value={formData.heroContent}
                                    onChange={handleChange}
                                />
                                {errors.heroContent && <p className="text-red-500 text-sm">{errors.heroContent}</p>}
                            </div>
                            <div>
                                <label className="text-lg font-medium mb-2">Hero Section Upload Image</label>
                                <div
                                    className={`flex flex-col items-center justify-center h-[136px] border rounded-xl cursor-pointer bg-[#FCFCFC] ${isDragging ? "border-dashed border-[#EA7913] bg-[#FEF8EC]" : "border-[#BDBDBD]"
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
                                    {images?.detail ? (
                                        <div className="flex flex-col items-center gap-1">
                                            <img src={galleryIconOrange} alt="Uploaded" />
                                            <span className="text-[#464646] font-medium">
                                                {images.detail.name}
                                            </span>
                                            <span className="text-xs text-[#9a9a9a]">Click Here to Change Image</span>
                                        </div>
                                    ) : formData.heroImageUrl ? (
                                        <div className="flex flex-col items-center gap-1">
                                            <img src={galleryIconOrange} alt="Uploaded" />
                                            <span className="text-[#464646] font-medium">
                                                {formData.heroImageUrl.split("/").pop()}
                                            </span>
                                            <span className="text-xs text-[#9a9a9a]">Click Here to Change Image</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 px-12">
                                            <img src={galleryIconOrange} alt="Upload" />
                                            <span className="text-[#989898]">Upload Image Here</span>
                                        </div>
                                    )}

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, "detail")}
                                        onInput={(e) => handleFileChange(e, "detail")}
                                    />
                                </div>
                                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-2">
                            <div>
                                <label className="block text-sm font-medium mb-1">Mobile Number</label>
                                <input
                                    type="text"
                                    name="mobileNumber"
                                    value={formData.mobileNumber}
                                    onChange={handleChange}
                                    className="w-full border-[1px] border-[#DCDCDC] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl px-4 py-2 text-[#656565]"
                                />
                                {errors.mobileNumber && <p className="text-red-500 text-sm">{errors.mobileNumber}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">E-mail</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border-[1px] border-[#DCDCDC] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl px-4 py-2 text-[#656565]"
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">YouTube</label>
                                <input
                                    type="text"
                                    name="youtube"
                                    value={formData.youtube}
                                    onChange={handleChange}
                                    className="w-full border-[1px] border-[#DCDCDC] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl px-4 py-2 text-[#656565]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">LinkedIn</label>
                                <input
                                    type="text"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                    className="w-full border-[1px] border-[#DCDCDC] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl px-4 py-2 text-[#656565]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Twitter</label>
                                <input
                                    type="text"
                                    name="twitter"
                                    value={formData.twitter}
                                    onChange={handleChange}
                                    className="w-full border-[1px] border-[#DCDCDC] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl px-4 py-2 text-[#656565]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Instagram</label>
                                <input
                                    type="text"
                                    name="instagram"
                                    value={formData.instagram}
                                    onChange={handleChange}
                                    className="w-full border-[1px] border-[#DCDCDC] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl px-4 py-2 text-[#656565]"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full border-[1px] border-[#DCDCDC] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl px-4 py-2 text-[#656565]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditContact_us
