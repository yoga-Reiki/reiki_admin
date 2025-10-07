import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { getProductUpdate } from '../../services/productServices';
import UploadIcon from "../../assets/svg/UploadIcon.svg";
import SuccsessModel from '../component/SuccsessModel';

function EditProduct({ selectedProduct, onCancel, fetchProduct }) {

    const [formData, setFormData] = useState({
        title: selectedProduct?.title || '',
        summary: selectedProduct?.summary || '',
        chip1: selectedProduct?.chips?.[0] || '',
        chip2: selectedProduct?.chips?.[1] || '',
        specifications: selectedProduct?.detail?.specifications || '',
        newPricing: selectedProduct?.detail?.priceNew || '',
        oldPricing: selectedProduct?.detail?.priceOld || '',
        shippingDetails: selectedProduct?.detail?.shippingDetails || '',
        detailContent: selectedProduct?.detail?.content || '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isDragging, setIsDragging] = useState({
        cover: false,
        detail: false,
    });
    const [images, setImages] = useState({
        cover: selectedProduct?.coverImageUrl || '',
        detail: selectedProduct?.detail?.detailImageUrl || '',
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const coverInputRef = useRef(null);
    const detailInputRef = useRef(null);

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

    const handleImageChange = (file, type) => {
        if (file && file.type.startsWith("image/")) {
            setImages((prev) => ({
                ...prev,
                [type]: file,
            }));
        }
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files?.[0];
        handleImageChange(file, type);
    };

    const handleDrop = (e, type) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer?.files?.[0];
        handleImageChange(file, type);
    };

    const handleSubmit = async () => {
        const isChanged =
            formData.title !== (selectedProduct?.title || "") ||
            formData.summary !== (selectedProduct?.summary || "") ||
            formData.chip1 !== (selectedProduct?.chips?.[0] || "") ||
            formData.chip2 !== (selectedProduct?.chips?.[1] || "") ||
            formData.specifications !== (selectedProduct?.detail?.specifications || "") ||
            formData.newPricing !== (selectedProduct?.detail?.priceNew || "") ||
            formData.oldPricing !== (selectedProduct?.detail?.priceOld || "") ||
            formData.shippingDetails !== (selectedProduct?.detail?.shippingDetails || "") ||
            formData.detailContent !== (selectedProduct?.detail?.content || "") ||
            (images.cover && images.cover instanceof File) ||
            (images.detail && images.detail instanceof File);

        if (!isChanged) {
            toast.error("No changes detected.");
            return;
        }

        // validation check
        const requiredFields = ["title", "newPricing", "oldPricing", "summary", "detailContent", "chip1", "chip2", "specifications", "shippingDetails"];
        const newErrors = {};

        requiredFields.forEach((field) => {
            if (!formData[field] || String(formData[field]).trim() === "") {
                newErrors[field] = `${field} is required`;
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setLoading(true);
        try {
            const updatedForm = new FormData();
            updatedForm.append("title", formData.title);
            updatedForm.append("summary", formData.summary);
            updatedForm.append("specifications", formData.specifications);
            updatedForm.append("priceNew", formData.newPricing);
            updatedForm.append("priceOld", formData.oldPricing);
            updatedForm.append("shippingDetails", formData.shippingDetails || "");
            updatedForm.append("detailContent", formData.detailContent || "");

            const chips = [formData.chip1, formData.chip2];
            chips.forEach((chip, index) => {
                if (chip) {
                    updatedForm.append(`chips[${index}]`, chip);
                }
            });

            const points = formData.summary.split('\n').filter(Boolean);
            points.forEach((point, index) => {
                updatedForm.append(`points[${index}]`, point);
            });

            if (images.cover && images.cover instanceof File) {
                updatedForm.append("coverImage", images.cover);
            }

            if (images.detail && images.detail instanceof File) {
                updatedForm.append("detailImage", images.detail);
            }

            const response = await getProductUpdate(updatedForm, selectedProduct._id);

            toast.success(response.message || "Product updated successfully.");
            setShowSuccess(true);

        } catch (error) {
            console.error("Update failed", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {showSuccess ? (
                <SuccsessModel
                    onClose={() => {
                        setShowSuccess(false);
                        onCancel();
                    }}
                    showSuccessProductEdit={showSuccess}
                />
            ) : (
                <div className='text-[#464646] flex flex-col gap-2'>
                    <div className="p-3">
                        <h2 className="text-[32px] font-Raleway Raleway-medium text-[#656565]">
                            <span onClick={onCancel} className="cursor-pointer">
                                Products
                            </span>{" "}
                            &gt;{" "}
                            <span className="text-[#464646]">
                                Edit Product
                            </span>
                        </h2>
                        <p className="pt-1 text-[#656565]">Manage Product Section and its details</p>
                    </div>

                    <div className='px-3'>
                        <div className="bg-white rounded-3xl p-6 space-y-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <h2 className="text-2xl text-[#656565] font-Raleway Raleway-medium">Edit Product Details</h2>
                            </div>

                            <div className="grid grid-col-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:h-[464px]">
                                {/* left side card */}
                                <div className="col-span-1">
                                    <div key={selectedProduct.id}>
                                        <div className="bg-white rounded-3xl overflow-hidden">
                                            <div className="relative overflow-hidden">
                                                <img
                                                    src={
                                                        images.cover instanceof File
                                                            ? URL.createObjectURL(images.cover)
                                                            : images.cover || selectedProduct.coverImageUrl
                                                    }
                                                    alt={selectedProduct.title}
                                                    className="w-full h-[464px] object-cover"
                                                />

                                                {/* product Content */}
                                                <div className="absolute bottom-1 left-1 right-1 bg-white bg-opacity-90 backdrop-blur-md p-6 rounded-3xl">
                                                    <h3 className="text-xl md:text-2xl font-Raleway Raleway-bold">
                                                        {formData.title || selectedProduct.title}
                                                    </h3>
                                                    <p className="text-sm pt-2 pb-3.5">
                                                        {formData.summary || selectedProduct.summary}
                                                    </p>
                                                    <div className='space-x-1.5 space-y-2 md:space-y-0 pb-7 md:pb-5'>
                                                        <button className='py-1 px-4 border border-[#BDBDBD] rounded-full text-xs'>{formData?.chip1 || selectedProduct?.chips[0]}</button>
                                                        <button className='py-1 px-4 border border-[#BDBDBD] rounded-full text-xs'>{formData?.chip2 || selectedProduct?.chips[1]}</button>
                                                    </div>
                                                    <div className="flex items-end gap-2 text-[#464646]">
                                                        <span className="text-lg md:text-[32px] md:leading-[40px] font-Raleway Raleway-bold">${formData.newPricing || selectedProduct?.detail?.priceNew}</span>
                                                        <span className="mb-1">${formData.oldPricing || selectedProduct?.detail?.priceOld}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='col-span-1 xl:col-span-2 space-y-4.5'>
                                    {["title", "chip1", "chip2"].map((f, i) => (
                                        <div key={f}>
                                            <label className="text-[#292929] block mb-1">{f.charAt(0).toUpperCase() + f.slice(1)}</label>
                                            <input
                                                type="text"
                                                name={f}
                                                value={formData[f]}
                                                onChange={handleChange}
                                                placeholder={`Enter ${f}`}
                                                className="w-full h-11 border border-[#BDBDBD] rounded-xl px-4.5 py-2.5 text-[#525252] placeholder-[#525252] focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                            />
                                            {errors[f] && <p className="text-red-500 text-sm mt-1">{errors[f]}</p>}
                                        </div>
                                    ))}

                                    <div>
                                        <label className="text-[#292929] block mb-1">Content</label>
                                        <textarea
                                            name="summary"
                                            value={formData.summary}
                                            onChange={handleChange}
                                            placeholder="Enter Your Content Here"
                                            className="w-full h-[166px] border border-[#BDBDBD] rounded-xl px-4 py-3 text-[#525252] placeholder-[#525252] resize-none focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                        />
                                        {errors.summary && <p className="text-red-500 text-sm mt-1">{errors.summary}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className='space-y-3'>
                                <div className='flex flex-col lg:flex-row gap-6'>
                                    {/* Image Upload */}
                                    <div className='w-full'>
                                        <label className="text-[#292929] block mb-1">Product Image</label>
                                        <div
                                            className={`flex flex-col items-center justify-center h-[171px] border border-dashed rounded-xl cursor-pointer ${isDragging.cover ? "border-[#EA7913]" : "border-[#BDBDBD]"
                                                }`}
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setIsDragging(prev => ({ ...prev, cover: true }));
                                            }}
                                            onDragLeave={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setIsDragging(prev => ({ ...prev, cover: false }));
                                            }}
                                            onDrop={(e) => handleDrop(e, "cover")}
                                            onClick={() => coverInputRef.current?.click()}
                                        >
                                            <img src={UploadIcon} alt="Not Found" className="h-12 w-12 mb-3" />
                                            {images.cover ? (
                                                <div className="text-[#525252]">
                                                    <span className="font-medium w-full text-center break-words">
                                                        {images.cover?.name || selectedProduct?.coverImageUrl?.split("/").pop()}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="px-12 text-[#525252]">
                                                    <span>Drag & drop file here or Choose file</span>
                                                </div>
                                            )}

                                            <input
                                                ref={coverInputRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleFileChange(e, "cover")}
                                            />
                                        </div>
                                        <p className="text-[#656565] text-xs pt-1 text-end">Max size : 25 MB</p>
                                    </div>

                                    {/* Image Upload */}
                                    <div className='w-full'>
                                        <label className="text-[#292929] block mb-1">Product Detail Image</label>
                                        <div
                                            className={`flex flex-col items-center justify-center h-[171px] border border-dashed rounded-xl cursor-pointer ${isDragging?.detail ? "border-[#EA7913]" : "border-[#BDBDBD]"
                                                }`}
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setIsDragging(prev => ({ ...prev, detail: true }));
                                            }}
                                            onDragLeave={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setIsDragging(prev => ({ ...prev, detail: false }));
                                            }}
                                            onDrop={(e) => handleDrop(e, "detail")}
                                            onClick={() => detailInputRef.current?.click()}
                                        >
                                            <img src={UploadIcon} alt="Not Found" className="h-12 w-12 mb-3" />
                                            {images.detail ? (
                                                <div className="text-[#525252]">
                                                    <span className="font-medium w-full text-center break-words">
                                                        {images.detail?.name || selectedProduct?.detail?.detailImageUrl?.split("/").pop()}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="px-12 text-[#525252]">
                                                    <span>Upload Image Here</span>
                                                </div>
                                            )}

                                            <input
                                                ref={detailInputRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleFileChange(e, "detail")}
                                            />
                                        </div>
                                        <p className="text-[#656565] text-xs pt-1 text-end">Max size : 25 MB</p>
                                    </div>
                                </div>


                                {/* Editor + Specifications */}
                                <div className="flex flex-col lg:flex-row gap-6">
                                    <div className="w-full">
                                        <label className="block text-lg mb-1">Product Detail Content</label>
                                        <textarea
                                            name="detailContent"
                                            value={formData.detailContent}
                                            onChange={handleChange}
                                            placeholder="Enter Your Content"
                                            className="w-full h-[171px] border border-[#BDBDBD] rounded-xl px-4 py-3 placeholder-gray-500 resize-none focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                        />
                                        {errors.detailContent && <p className="text-red-500 text-sm mt-1">{errors.detailContent}</p>}
                                    </div>

                                    <div className='w-full'>
                                        <label className="text-[#292929] block mb-1">Specifications</label>
                                        <textarea
                                            name="specifications"
                                            value={formData.specifications}
                                            onChange={handleChange}
                                            placeholder="Enter Your specifications"
                                            className="w-full h-[171px] border border-[#BDBDBD] rounded-xl px-4 py-3 text-[#525252] placeholder-[#525252] resize-none focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                        />
                                        {errors.specifications && <p className="text-red-500 text-sm mt-1">{errors.specifications}</p>}
                                    </div>
                                </div>

                                <div className='flex gap-6'>
                                    {["newPricing", "oldPricing"].map(f => (
                                        <div key={f} className='w-full'>
                                            <label className="text-[#292929] block mb-1">{f === "newPricing" ? "New Pricing" : "Old Pricing"}</label>
                                            <input
                                                type="text"
                                                name={f}
                                                value={formData[f]}
                                                onChange={handleChange}
                                                className="w-full border border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl text-[#525252] placeholder-[#525252] px-4.5 py-2.5"
                                            />
                                            {errors[f] && <p className="text-red-500 text-sm mt-1">{errors[f]}</p>}
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <label className="text-[#292929] block mb-1">Shipping Details</label>
                                    <input
                                        type="text"
                                        name="shippingDetails"
                                        value={formData.shippingDetails}
                                        onChange={handleChange}
                                        placeholder="Enter Shipping Details"
                                        className="w-full border border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl text-[#525252] placeholder-[#525252] px-4.5 py-2.5"
                                    />
                                    {errors.shippingDetails && <p className="text-red-500 text-sm mt-1">{errors.shippingDetails}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 h-12">
                                <div>
                                    <button
                                        className="w-full bg-[#FCEAC9] text-[#656565] px-6 py-3 rounded-full hover:bg-[#FCEAC2] cursor-pointer"
                                        onClick={onCancel}
                                    >
                                        Cancel
                                    </button>
                                </div>
                                <div>
                                    <div className="w-full relative inline-block rounded-full p-[1px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:via-[#F39C2C] hover:to-[#F39C2C] active:from-[#EA7913] active:via-[#EA7913] active:to-[#EA7913]">
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            className="w-full h-full inline-flex justify-center items-center space-x-1.5 px-6 py-3 bg-[#EA7913] text-[#F8F8F8] rounded-full font-medium hover:cursor-pointer hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-base"
                                        >
                                            <span>{loading ? "Updating..." : "Save"}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EditProduct