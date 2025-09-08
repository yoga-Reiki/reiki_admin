import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { getProductUpdate } from '../../services/productServices';
import UploadIcon from "../../assets/svg/UploadIcon.svg";

function EditProduct({ selectedProduct, onCancel }) {

    const [formData, setFormData] = useState({
        title: selectedProduct?.title || '',
        content: selectedProduct?.points?.join('\n') || '',
        chip1: selectedProduct?.chip1 || '',
        chip2: selectedProduct?.chip2 || '',
        specifications: selectedProduct?.specifications || '',
        newPricing: selectedProduct?.discountedPrice || '',
        oldPricing: selectedProduct?.price || '',
        shippingDetails: selectedProduct?.shippingDetails || '',
    });
    const [errors, setErrors] = useState({});
    const [isDragging, setIsDragging] = useState(false);
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setImage(file);
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer?.files?.[0];
        await validateImageAndSet(file);
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

    const handleSubmit = async () => {
        const requiredFields = ["title", "newPricing", "oldPricing", "content", "chip1", "chip2", "specifications", "shippingDetails"];
        const newErrors = {};

        requiredFields.forEach((field) => {
            if (!formData[field] || formData[field].trim() === "") {
                newErrors[field] = `${field} is required`;
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const updatedForm = new FormData();
            updatedForm.append("title", formData.title);
            updatedForm.append("chip1 title", formData.chip1);
            updatedForm.append("chip2 title", formData.chip2);
            updatedForm.append("specifications", formData.specifications);
            updatedForm.append("discountedPrice", formData.newPricing);
            updatedForm.append("price", formData.oldPricing);
            updatedForm.append("shippingDetails", formData.shippingDetails || "");

            const points = formData.content.split('\n').filter(Boolean);
            points.forEach((point, index) => {
                updatedForm.append(`points[${index}]`, point);
            });

            if (image) {
                updatedForm.append("image", image);
            }

            const response = await getProductUpdate(updatedForm, selectedProduct.id);

            toast.success("Course updated successfully.", + response.message);
            // onCancel();

        } catch (error) {
            console.error("Update failed", error);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className='text-[#464646] flex flex-col gap-2'>
            <div onClick={onCancel} className="flex items-center gap-6 py-4 px-3 cursor-pointer" >
                {/* <img src={leftBackIcon} alt='Not Found' className='w-5 h-5' /> */}
                <div className='flex items-center'>
                    <button
                        onClick={onCancel}
                        className="flex items-center font-Raleway Raleway-medium text-[32px] gap-1 transition"
                    >
                        <span className='hover:text-[#EA7913] cursor-pointer'>Product</span> <span className="mx-2">{">"}</span>
                    </button>
                    <button className="text-2xl hover:text-[#EA7913] mt-1">Product Section</button>
                </div>
            </div>

            <div className='py-2.5 px-3'>
                <div className="bg-white border-t-2 border-t-[#EA7913] rounded-3xl p-5 space-y-5.5">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h2 className="text-2xl text-[#656565] font-Raleway">Product Section</h2>
                        <div className="flex md:flex-col lg:flex-row gap-3">
                            <div>
                                <button
                                    className="w-full bg-[#FCEAC9] text-[#656565] px-6 py-3 rounded-full hover:bg-[#FCEAC2] cursor-pointer"
                                    onClick={onCancel}
                                >
                                    Cancel
                                </button>
                            </div>
                            {/* <div>
                                <button
                                    className="flex items-center gap-2 bg-[#FCEAC9] text-[#656565] px-6 py-3 rounded-full hover:bg-[#FCEAC2] cursor-pointer"
                                    onClick={onCancel}
                                >
                                    <img src={EditIconGrey} alt="" />
                                    <span>Edit Course Detail</span>
                                </button>
                            </div> */}
                            <div>
                                <div className="w-full relative inline-block rounded-full px-[4px] py-[3px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:via-[#F39C2C] hover:to-[#F39C2C] active:from-[#EA7913] active:via-[#EA7913] active:to-[#EA7913]">
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="w-full h-full inline-flex justify-center items-center space-x-1.5 px-6 py-2.5 bg-[#EA7913] text-[#F8F8F8] rounded-full font-medium hover:cursor-pointer hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-base"
                                    >
                                        Change in Website
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-col-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        <div className="col-span-1 sticky top-24 self-start">
                            <div
                                key={selectedProduct.id}
                            >
                                <div className="bg-white rounded-3xl overflow-hidden">
                                    {/* products Image */}
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={selectedProduct.image}
                                            alt={selectedProduct.title}
                                            className="w-full h-[542px] object-cover"
                                        />

                                        {/* product Content */}
                                        <div className="absolute bottom-1 left-1 right-1 bg-white bg-opacity-90 backdrop-blur-md p-6 rounded-3xl">
                                            <h3 className="text-xl md:text-2xl font-Raleway Raleway-bold">
                                                {selectedProduct.name}
                                            </h3>
                                            <p className="text-[#525252] text-sm pt-2 pb-3.5">
                                                {selectedProduct.description}
                                            </p>
                                            <div className='space-x-1.5 space-y-2 md:space-y-0 pb-7 md:pb-5'>
                                                <button className='py-1 px-6 border border-[#BDBDBD] rounded-full text-xs'>Emotional balance</button>
                                                <button className='py-1 px-6 border border-[#BDBDBD] rounded-full text-xs'>Stress relief</button>
                                            </div>
                                            <div className="flex items-end gap-2 text-[#464646]">
                                                <span className="text-lg md:text-[32px] md:leading-[40px] font-Raleway Raleway-bold">$29</span>
                                                <span className="mb-1">$50</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-span-1 xl:col-span-2 space-y-2.5'>
                            <div>
                                <label className="block text-lg mb-1">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData?.name}
                                    onChange={handleChange}
                                    placeholder="Enter your Title"
                                    className="w-full border border-[#BDBDBD] rounded-xl px-4.5 py-2.5 placeholder-[#525252] focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                />
                                {errors?.title && (
                                    <p className="text-sm text-red-500 mt-1">{errors?.title}</p>
                                )}
                            </div>

                            {/* Content + Image */}
                            <div className="flex flex-col lg:flex-row gap-x-4.5">
                                <div className='w-full'>
                                    <label className="block text-lg mb-1">Content</label>
                                    <textarea
                                        name="content"
                                        value={formData.content}
                                        onChange={handleChange}
                                        placeholder="Enter Your Content Here"
                                        className="w-full h-[133px] border border-[#BDBDBD] rounded-xl px-4 py-3 placeholder-gray-500 resize-none focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                    />
                                </div>

                                {/* Image Upload */}
                                <div className='w-full'>
                                    <label className="block text-lg mb-1">Upload Image</label>
                                    <div
                                        className={`flex flex-col items-center justify-center h-[133px] border rounded-xl cursor-pointer bg-[#FCFCFC] ${isDragging ? "border-dashed border-[#EA7913] bg-[#FEF8EC]" : "border-[#BDBDBD]"
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
                                        {image || selectedProduct?.image ? (
                                            <div className="flex flex-col justify-center items-center gap-1">

                                                <span className="text-[#464646] text-sm font-medium w-full text-center break-words">
                                                    {image?.name || selectedProduct?.image?.split("/").pop()}
                                                </span>
                                                <span className="text-xs text-center text-[#9a9a9a]">Click Here to Change Image</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 px-12">
                                                <img src={UploadIcon} alt="Upload Icon" />
                                                <span className="text-[#989898]">Upload Image Here</span>
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
                            <div>
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
                            <div className='w-full'>
                                <label className="block text-lg mb-1">Specifications</label>
                                <textarea
                                    name="specifications"
                                    value={formData.specifications}
                                    onChange={handleChange}
                                    placeholder="Enter Your specifications"
                                    className="w-full h-[133px] border border-[#BDBDBD] rounded-xl px-4 py-3 placeholder-gray-500 resize-none focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                />
                                {errors.specifications && <p className="text-red-500 text-sm mt-1">{errors.specifications}</p>}
                            </div>

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

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditProduct