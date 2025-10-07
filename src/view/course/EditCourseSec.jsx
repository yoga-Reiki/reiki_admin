import React, { useRef, useState } from 'react'
import UploadIcon from "../../assets/svg/UploadIcon.svg";
import { getCoursesUpdate } from '../../services/courseServices';
import toast from 'react-hot-toast';
import { FiUploadCloud } from "react-icons/fi";
import SuccsessModel from '../component/SuccsessModel';

function EditCourseSec({ selectedCourse, onCancel, fetchCourse }) {
    const [formData, setFormData] = useState({
        title: selectedCourse?.title || '',
        newPricing: selectedCourse?.priceNew || '',
        oldPricing: selectedCourse?.priceOld || '',
        content: selectedCourse?.shortContent || '',
        detailContent: selectedCourse?.descriptionHtml || '',
        certificate: selectedCourse?.certificate || 1,
        shippingDetails: selectedCourse?.shippingDetails || 'Free Shipping (T&c applied)',
        mode: selectedCourse?.mode || '',
        language: selectedCourse?.language || '',
        duration: selectedCourse?.audioDurationSec || '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isDragging, setIsDragging] = useState(false);
    const [images, setImages] = useState({
        cover: selectedCourse?.listImageUrl || '',
        detail: selectedCourse?.detailImageUrl || '',
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
        if (file && file.type.startsWith("image/")) {
            setImages((prev) => ({
                ...prev,
                [type]: file,
            }));

            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors[type];
                return newErrors;
            });
        } else {
            setErrors((prev) => ({
                ...prev,
                [type]: "Please upload a valid image.",
            }));
        }
    };

    const handleDrop = async (e, type) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer?.files?.[0];

        if (file && file.type.startsWith("image/")) {
            handleImageChange(file, type);
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors[type];
                return newErrors;
            });
        } else {
            setErrors((prev) => ({
                ...prev,
                [type]: "Please upload a valid image.",
            }));
        }
    };

    const hasChanges = () => {
        const originalData = {
            title: selectedCourse?.title || '',
            newPricing: selectedCourse?.priceNew || '',
            oldPricing: selectedCourse?.priceOld || '',
            content: selectedCourse?.shortContent || '',
            detailContent: selectedCourse?.descriptionHtml || '',
            certificate: selectedCourse?.certificate || 1,
            shippingDetails: selectedCourse?.shippingDetails || 'Free Shipping (T&c applied)',
            mode: selectedCourse?.mode || '',
            language: selectedCourse?.language || '',
            duration: selectedCourse?.audioDurationSec || '',
        };

        const dataChanged = Object.keys(formData).some((key) => {
            return formData[key]?.toString().trim() !== originalData[key]?.toString().trim();
        });

        const imagesChanged =
            images.cover instanceof File ||
            images.detail instanceof File;

        return dataChanged || imagesChanged;
    };


    const handleSubmit = async () => {
        const requiredFields = ["title", "newPricing", "oldPricing", "content", "detailContent", "mode", "language", "duration", "certificate", "shippingDetails", "cover", "detail"];
        const newErrors = {};

        requiredFields.forEach((field) => {
            const value = field in formData ? formData[field] : images[field];
            if (!value || (typeof value === "string" && value.trim() === "")) {
                newErrors[field] = `${field === 'cover' ? "Cover Image" : field === 'detail' ? "Detail Image" : field} is required`;
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (!hasChanges()) {
            toast.error("No changes detected.");
            return;
        }

        setLoading(true);
        try {
            const updatedForm = new FormData();
            Object.entries(formData).forEach(([key, val]) => updatedForm.append(key, val));
            if (images.cover instanceof File) updatedForm.append("listImage", images.cover);
            if (images.detail instanceof File) updatedForm.append("detailImage", images.detail);
            updatedForm.append("isRequired", true);
            const response = await getCoursesUpdate(updatedForm, selectedCourse._id);

            toast.success("Course updated successfully.", + response.message);
            setShowSuccess(true);

        } catch (error) {
            console.error("Update failed", error);
            alert("Something went wrong. Please try again.");
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
                    showSuccessCourseEdit={showSuccess}
                />
            ) : (
                <div className='text-[#464646] flex flex-col gap-2'>
                    <div className="flex items-center gap-6 py-4 px-3 cursor-pointer" >
                        {/* <img src={leftBackIcon} alt='Not Found' className='w-5 h-5' /> */}
                        <div className='flex items-center font-Raleway Raleway-medium'>
                            <button
                                onClick={onCancel}
                                className="flex items-center text-[32px] gap-1 transition"
                            >
                                <span className='hover:text-[#EA7913] cursor-pointer'>Courses</span> <span className="mx-2">{">"}</span>
                            </button>
                            <button className="text-2xl mt-1">Courses Section</button>
                        </div>
                    </div>

                    <div className='px-3'>
                        <div className="bg-white rounded-3xl p-6 space-y-8">
                            <h2 className="text-2xl text-[#656565] font-Raleway Raleway-medium">Courses Section</h2>

                            <div className='grid grid-col-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:h-[452px]'>
                                <div className="col-span-1">
                                    <div className="bg-white rounded-3xl">
                                        {/* Course Image */}
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={selectedCourse.listImageUrl}
                                                loading="lazy"
                                                alt="Not Found"
                                                className="w-full lg:h-[452px] object-cover rounded-3xl"
                                            />
                                            {/* Course Content */}
                                            <div className="py-4.5 px-6 absolute bottom-2 left-2 right-2 bg-white bg-opacity-90 h-[223px] xl:h-[256px] backdrop-blur-md rounded-3xl flex flex-col justify-between">
                                                <div className='flex flex-col gap-2 pb-4'>
                                                    <h3 className="text-xl xl:text-2xl font-semibold">
                                                        {formData?.title || selectedCourse.title}
                                                    </h3>
                                                    <p className="text-xs xl:text-sm text-[#656565] whitespace-pre-line line-clamp-5 xl:line-clamp-6">
                                                        {(formData?.content || selectedCourse?.shortContent)}
                                                    </p>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-2xl md:text-[32px] font-Raleway text-[#292929]">
                                                            ${formData?.newPricing || selectedCourse.priceNew}
                                                        </span>
                                                        <span className="text-base sm:text-lg text-[#EF4444] line-through">
                                                            ${formData?.oldPricing || selectedCourse.priceOld}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='col-span-1 xl:col-span-2 space-y-4.5'>
                                    {[
                                        { label: "Title", name: "title", value: formData.title },
                                        { label: "New Pricing", name: "newPricing", value: formData.newPricing },
                                        { label: "Old Pricing", name: "oldPricing", value: formData.oldPricing },
                                    ].map((field) => (
                                        <div key={field.name}>
                                            <label className="text-[#292929] block mb-1">{field.label}</label>
                                            <input
                                                type="text"
                                                name={field.name}
                                                value={field?.value}
                                                onChange={handleChange}
                                                placeholder={`Enter ${field.label}`}
                                                className="w-full h-11 border border-[#BDBDBD] rounded-full px-4.5 py-2.5 text-[#525252] placeholder-[#525252] focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                            />
                                            {errors[field.name] && (
                                                <p className="text-sm text-red-500 mt-1">{errors[field.name]}</p>
                                            )}
                                        </div>
                                    ))}

                                    <div>
                                        <label className="text-[#292929] block mb-1">Content</label>
                                        <textarea
                                            name="content"
                                            value={formData.content}
                                            onChange={handleChange}
                                            placeholder="Enter Your Content Here"
                                            className="custom-scrollbar w-full h-[154px] border border-[#BDBDBD] rounded-2xl px-4 py-3 text-[#525252] placeholder-[#525252] resize-none focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                        />
                                        {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className='space-y-3'>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-6">
                                    <div>
                                        <label className="text-[#292929] block mb-1">Upload Image</label>
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
                                            onDrop={(e) => handleDrop(e, "cover")}
                                            onClick={() => coverInputRef.current?.click()}
                                        >
                                            {images.cover ? (
                                                <div className="flex flex-col justify-center items-center gap-1 text-[#525252]">
                                                    <FiUploadCloud size={20} className="text-[#EA7913]" />
                                                    <span className="font-medium w-full text-center break-words">
                                                        {images.cover?.name || selectedCourse?.listImageUrl?.split("/").pop()}
                                                    </span>
                                                    <span className="text-center">Click Here to Change Image</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 px-12 text-[#525252]">
                                                    <img src={UploadIcon} alt="Upload Icon" />
                                                    <span>Upload Image Here</span>
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
                                        {errors.cover && <p className="text-red-500 text-sm mt-1">{errors.cover}</p>}
                                    </div>

                                    <div>
                                        <label className="text-[#292929] block mb-1">Detail Upload Image</label>
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
                                            onDrop={(e) => handleDrop(e, "detail")}
                                            onClick={() => detailInputRef.current?.click()}
                                        >
                                            {images.detail ? (
                                                <div className="flex flex-col justify-center items-center gap-1 text-[#525252]">
                                                    <FiUploadCloud size={20} className="text-[#EA7913]" />
                                                    <span className="font-medium w-full text-center break-words">
                                                        {images.detail.name || selectedCourse?.detailImageUrl?.split("/").pop()}
                                                    </span>
                                                    <span className="text-center">Click Here to Change Image</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 px-12">
                                                    <img src={UploadIcon} alt="Upload Icon" />
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
                                        {errors.detail && <p className="text-red-500 text-sm mt-1">{errors.detail}</p>}
                                    </div>
                                </div>

                                {/*course detail Content */}
                                <div>
                                    <label className="text-[#292929] block mb-1">Detail Content</label>
                                    <textarea
                                        name="detailContent"
                                        value={formData.detailContent}
                                        onChange={handleChange}
                                        placeholder="Enter Your Content Here"
                                        className="custom-scrollbar w-full h-[133px] border border-[#BDBDBD] rounded-xl px-4 py-3 text-[#525252] placeholder-[#525252] resize-none focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                    />
                                    {errors?.detailContent && (
                                        <p className="text-red-500 text-sm">{errors?.detailContent}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-3 gap-x-6">
                                    {[
                                        { label: "Mode", name: "mode", value: formData.mode },
                                        { label: "Language", name: "language", value: formData.language },
                                        { label: "Duration", name: "duration", value: formData.duration },
                                        { label: "Certificate", name: "certificate", value: formData.certificate },
                                        { label: "Shipping Details", name: "shippingDetails", value: formData.shippingDetails },
                                    ].map((field) => (
                                        <div key={field.name} className={`${field?.name === "shippingDetails" && "lg:col-span-2"}`}>
                                            <label className="text-[#292929] block mb-1">{field.label}</label>

                                            {["mode", "language"].includes(field.name) ? (
                                                <select
                                                    name={field.name}
                                                    value={field.value}
                                                    onChange={handleChange}
                                                    className="w-full border border-[#BDBDBD] rounded-full px-4.5 py-3 text-[#525252] focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                                >
                                                    <option value="">Select {field.label}</option>
                                                    {field.name === "mode" &&
                                                        ["Online", "Offline", "Hybrid"].map((option) => (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    {field.name === "language" &&
                                                        ["English", "Hindi", "Hindi + English"].map((option) => (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type="text"
                                                    name={field.name}
                                                    value={field.value}
                                                    onChange={handleChange}
                                                    placeholder={`Enter ${field.label}`}
                                                    className="w-full border border-[#BDBDBD] rounded-full px-4.5 py-2.5 text-[#525252] placeholder-[#525252] focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                                />
                                            )}
                                            {errors[field.name] && (
                                                <p className="text-sm text-red-500 mt-1">{errors[field.name]}</p>
                                            )}
                                        </div>
                                    ))}
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

export default EditCourseSec