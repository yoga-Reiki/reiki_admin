import React, { useRef, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { IoIosArrowRoundForward } from "react-icons/io";
import UploadIcon from "../../assets/svg/UploadIcon.svg";
import SuccsessModel from "../component/SuccsessModel";
import { getAddProduct } from "../../services/productServices";

function AddProduct({ onClose }) {
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        title: "",
        newPricing: "",
        oldPricing: "",
        duration: "",
        certificate: "",
        onlineOffline: "",
        content: "",
        content1: "",
        language: "",
        shippingDetails: ""
    });
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [isDragging, setIsDragging] = useState(false);
    const [step, setStep] = useState(1);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
        setErrors((p) => ({ ...p, [name]: "" }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setImage(file);
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

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer?.files?.[0];
        await validateImageAndSet(file);
    };

    const validateForm = () => {
        const newErrors = {};

        if (step === 1) {
            if (!formData.title.trim()) newErrors.title = "Title is required.";
            if (!formData.chip1?.trim()) newErrors.chip1 = "Chip 1 title is required.";
            if (!formData.chip2?.trim()) newErrors.chip2 = "Chip 2 title is required.";
            if (!formData.content.trim()) newErrors.content = "Content is required.";
            if (!image) newErrors.image = "Image is required.";
        } else if (step === 2) {
            if (!formData.content1?.trim()) newErrors.content1 = "Content is required.";
            if (!formData.specifications?.trim()) newErrors.specifications = "Specifications is required.";
            if (!image) newErrors.image = "Image is required.";
            if (!formData.newPricing.trim()) newErrors.newPricing = "New Pricing is required.";
            if (!formData.shippingDetails.trim()) newErrors.shippingDetails = "Shipping details are required.";
            if (!formData.oldPricing.trim()) newErrors.oldPricing = "Old Pricing is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Next button handler
    const handleNext = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setStep(2);
    };

    // Submit button handler
    const handleConfirmSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach((key) => {
                formDataToSend.append(key, formData[key]);
            });
            if (image) {
                formDataToSend.append("image", image);
            }

            // Call API
            const res = await getAddProduct(formDataToSend);

            console.log("Product added ✅", res);
            // Show success modal
            setShowSuccess(true);
        } catch (error) {
            console.error("Error submitting form:", error);
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
                    showSuccessProduct={showSuccess}
                />
            ) : (
                <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50 text-[#464646] p-6">
                    <div className="bg-white w-full max-w-[971px] p-5 rounded-3xl border-t-2 border-t-[#EA7913] flex flex-col gap-5.5">
                        <div className="flex justify-between items-center px-3 py-4">
                            <h2 className="text-[32px] font-Raleway Raleway-medium">Add Product</h2>
                            <button
                                onClick={onClose}
                                className="text-[#EA7913] border border-[#989898] cursor-pointer p-4 rounded-full"
                            >
                                <MdOutlineClose size={16} />
                            </button>
                        </div>

                        <form className="flex flex-col gap-5.5">
                            {step === 1 ? (
                                <div className="space-y-2.5">
                                    <div>
                                        <label className="block text-lg mb-1">Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData?.title}
                                            onChange={handleChange}
                                            placeholder="Enter your Title"
                                            className="w-full border border-[#BDBDBD] rounded-xl px-4.5 py-2.5 placeholder-[#525252] focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                        />
                                        {errors?.title && (
                                            <p className="text-red-500 text-sm mt-1">{errors?.title}</p>
                                        )}
                                    </div>

                                    {/* Content + Image */}
                                    <div className="grid grid-cols-2 gap-x-4.5">
                                        <div>
                                            <label className="block text-lg mb-1">Content</label>
                                            <textarea
                                                name="content"
                                                value={formData.content}
                                                onChange={handleChange}
                                                placeholder="Enter Your Content"
                                                className="w-full h-[120px] border border-[#BDBDBD] rounded-xl px-4 py-3 placeholder-gray-500 resize-none focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                            />
                                            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                                        </div>

                                        {/* Image Upload */}
                                        <div>
                                            <label className="block text-lg mb-1">Upload Image - Product Section</label>
                                            <div
                                                className={`flex flex-col items-center justify-center h-[120px] border rounded-xl cursor-pointer bg-[#FCFCFC] ${isDragging ? "border-dashed border-[#EA7913] bg-[#FEF8EC]" : "border-[#BDBDBD]"
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
                                                        <img src={UploadIcon} alt="Not Found" />
                                                        <span className="text-[#464646] font-medium">{image.name}</span>
                                                        <span className="text-xs text-[#9a9a9a]">Click Here to Change Image</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2 px-12">
                                                        <img src={UploadIcon} alt="Not Found" />
                                                        <span className="text-[#525252]">Upload Image or Drag & drop here</span>
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
                                    </div>

                                    <div>
                                        <label className="block text-lg mb-1">Chip 1 </label>
                                        <input
                                            type="text"
                                            name="chip1"
                                            value={formData?.chip1}
                                            onChange={handleChange}
                                            placeholder="Enter your Title"
                                            className="w-full border border-[#BDBDBD] rounded-xl px-4.5 py-2.5 placeholder-[#525252] focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                        />
                                        {errors?.chip1 && (
                                            <p className="text-red-500 text-sm mt-1">{errors?.chip1}</p>
                                        )}
                                    </div>
                                    <div className="pb-16.5">
                                        <label className="block text-lg mb-1">Chip 2 </label>
                                        <input
                                            type="text"
                                            name="chip2"
                                            value={formData?.chip2}
                                            onChange={handleChange}
                                            placeholder="Enter your Title"
                                            className="w-full border border-[#BDBDBD] rounded-xl px-4.5 py-2.5 placeholder-[#525252] focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                        />
                                        {errors?.chip2 && (
                                            <p className="text-red-500 text-sm mt-1">{errors?.chip2}</p>
                                        )}
                                    </div>

                                    {/* Next button */}
                                    <div className="w-full relative inline-block rounded-full bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900]">
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="w-full flex justify-center items-center gap-2 py-2.5 bg-[#EA7913] text-lg text-white rounded-full"
                                        >
                                            <span>Next</span>
                                            <IoIosArrowRoundForward size={28} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-y-5.5 gap-x-4.5">
                                    <div className="flex flex-col gap-4.5">
                                        <div>
                                            <label className="block text-lg mb-1">Content</label>
                                            <textarea
                                                name="content1"
                                                value={formData.content1}
                                                onChange={handleChange}
                                                placeholder="Enter Your Content"
                                                className="w-full h-[217px] border border-[#BDBDBD] rounded-xl px-4 py-3 placeholder-gray-500 resize-none focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                            />
                                            {errors.content1 && <p className="text-red-500 text-sm mt-1">{errors.content1}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-lg mb-1">Specifications</label>
                                            <textarea
                                                name="specifications"
                                                value={formData.specifications}
                                                onChange={handleChange}
                                                placeholder="Enter Your Specifications"
                                                className="w-full h-[217px] border border-[#BDBDBD] rounded-xl px-4 py-3 placeholder-gray-500 resize-none focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                            />
                                            {errors.specifications && <p className="text-red-500 text-sm mt-1">{errors.specifications}</p>}
                                        </div>
                                    </div>

                                    {/* Right Section */}
                                    <div className="flex flex-col gap-6">
                                        <div>
                                            <label className="block text-lg mb-1">New Pricing</label>
                                            <input
                                                type="text"
                                                name="newPricing"
                                                value={formData.newPricing}
                                                onChange={handleChange}
                                                placeholder="Enter Your New Pricing"
                                                className="w-full border border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl placeholder-[#525252] px-4.5 py-2.5"
                                            />
                                            {errors.newPricing && <p className="text-red-500 text-sm mt-1">{errors.newPricing}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-lg mb-1">Old Pricing</label>
                                            <input
                                                type="text"
                                                name="oldPricing"
                                                value={formData.oldPricing}
                                                onChange={handleChange}
                                                placeholder="Enter Your Old Pricing"
                                                className="w-full border border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl placeholder-[#525252] px-4.5 py-2.5"
                                            />
                                            {errors.oldPricing && <p className="text-red-500 text-sm mt-1">{errors.oldPricing}</p>}
                                        </div>

                                        <div>
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

                                        <div>
                                            <label className="block text-lg mb-1">Image for Blog Section</label>
                                            <div
                                                className={`flex flex-col items-center justify-center h-[185px] border rounded-xl cursor-pointer bg-[#FCFCFC] ${isDragging ? "border-dashed border-[#EA7913] bg-[#FEF8EC]" : "border-[#BDBDBD]"
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
                                                        <img src={UploadIcon} alt="Not Found" />
                                                        <span className="text-[#464646] font-medium">{image.name}</span>
                                                        <span className="text-xs text-[#9a9a9a]">Click Here to Change Image</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2 px-12">
                                                        <img src={UploadIcon} alt="Not Found" />
                                                        <span className="text-[#989898]">Upload Image Here</span>
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
                                    </div>

                                    {/* Confirm Submit button */}
                                    <div className="col-span-2 pt-8.5">
                                        <div className="w-full relative inline-block rounded-full px-[5px] py-[3px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:via-[#F39C2C] hover:to-[#F39C2C] active:from-[#EA7913] active:via-[#EA7913] active:to-[#EA7913]">
                                            <button
                                                type="submit"
                                                onClick={(e) => handleConfirmSubmit(e)}
                                                className="w-full h-full inline-flex justify-center items-center space-x-1.5 py-2 bg-[#EA7913] text-[#F8F8F8] rounded-full font-medium hover:cursor-pointer hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-base"
                                            >
                                                <span>Submit</span>
                                                <IoIosArrowRoundForward size={28} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div >
            )
            }
        </div >
    );
}

export default AddProduct;
