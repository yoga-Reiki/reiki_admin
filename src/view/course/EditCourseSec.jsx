import React, { useRef, useState } from 'react'
import UploadIcon from "../../assets/svg/UploadIcon.svg";
import { getCoursesUpdate } from '../../services/courseServices';
import toast from 'react-hot-toast';
import { Editor } from '@tinymce/tinymce-react';

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
            if (fetchCourse) {
                await fetchCourse();
            }

            if (onCancel) {
                onCancel();
            }

        } catch (error) {
            console.error("Update failed", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
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
                        <span className='hover:text-[#EA7913] cursor-pointer'>Courses</span> <span className="mx-2">{">"}</span>
                    </button>
                    <button className="text-2xl hover:text-[#EA7913] mt-1">Courses Section</button>
                </div>
            </div>

            <div className='py-2.5 px-3'>
                <div className="bg-white border-t-2 border-t-[#EA7913] rounded-3xl p-5 space-y-5.5">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h2 className="text-2xl text-[#656565] font-Raleway">Courses Section</h2>
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
                                        <span>{loading ? "Updating..." : "Change in Website"}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div
                            key={selectedCourse.id}
                            className="relative bg-cover bg-center bg-no-repeat rounded-3xl overflow-hidden"
                            style={{
                                backgroundImage: `url(${images.cover instanceof File
                                    ? URL.createObjectURL(images.cover)
                                    : images.cover || selectedCourse.listImageUrl
                                    })`,
                            }}
                        >
                            <div
                                className={`flex flex-col md:flex-row items-stretch justify-between min-h-[349px] p-3`}
                            >
                                {/* Empty Half (for background image side) */}
                                <div className="hidden lg:block w-full" />

                                {/* Content Box */}
                                <div className="w-full">
                                    <div className="flex flex-col justify-between bg-white rounded-3xl p-6 sm:px-8 sm:py-6 h-full">
                                        <div>
                                            <h3 className="text-2xl sm:text-3xl font-Raleway font-medium text-[#292929] pb-3">
                                                {formData?.title || selectedCourse.title}
                                            </h3>
                                            <p className="text-sm text-[#525252] whitespace-pre-line">
                                                {(formData?.content || selectedCourse?.shortContent)}
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-start mt-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-lg sm:text-xl md:text-2xl font-Raleway text-[#292929]">
                                                    ${formData?.newPricing || selectedCourse.priceNew}
                                                </span>
                                                <span className="text-sm sm:text-base text-red-400 line-through">
                                                    ${formData?.oldPricing || selectedCourse.priceOld}
                                                </span>
                                            </div>
                                            <div className="relative inline-block rounded-full px-[4px] py-[2.5px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900]">
                                                <button
                                                    className="px-5 sm:px-6 py-2 sm:py-3 bg-[#EA7913] text-white rounded-full font-medium shadow hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-sm sm:text-base"
                                                >
                                                    View Course Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='space-y-2.5'>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2.5 gap-x-4.5">
                            {[
                                { label: "Title", name: "title", value: formData.title },
                                { label: "New Pricing", name: "newPricing", value: formData.newPricing },
                                { label: "Old Pricing", name: "oldPricing", value: formData.oldPricing },
                            ].map((field) => (
                                <div key={field.name}>
                                    <label className="block text-lg mb-1">{field.label}</label>
                                    <input
                                        type="text"
                                        name={field.name}
                                        value={field?.value}
                                        onChange={handleChange}
                                        placeholder={`Enter ${field.label}`}
                                        className="w-full border border-[#BDBDBD] rounded-xl px-4.5 py-2.5 placeholder-[#525252] focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                    />
                                    {errors[field.name] && (
                                        <p className="text-sm text-red-500 mt-1">{errors[field.name]}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Content + Image */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4.5">
                            <div>
                                <label className="block text-lg mb-1">Content</label>
                                {/* <Editor
                                    apiKey="w0h75l9p91ijk4a35sioyvhphj294qox82aq9wntohg9iees"
                                    value={formData.content}
                                    onChange={handleChange}
                                    onEditorChange={(content) => {
                                        setFormData((prev) => ({ ...prev, content }));
                                        setErrors((prev) => ({ ...prev, content: "" }));
                                    }}
                                    init={{
                                        plugins: [
                                            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                                            'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste',
                                            'advtable', 'advcode', 'advtemplate', 'ai', 'uploadcare', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect',
                                            'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
                                        ],
                                        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                                        tinycomments_mode: 'embedded',
                                        tinycomments_author: 'Author name',
                                        mergetags_list: [
                                            { value: 'First.Name', title: 'First Name' },
                                            { value: 'Email', title: 'Email' },
                                        ],
                                        ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                                        uploadcare_public_key: '5e7e532088944fab02a1',
                                        height: 280
                                    }}
                                /> */}
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    placeholder="Enter Your Content Here"
                                    className="w-full h-[133px] border border-[#BDBDBD] rounded-xl px-4 py-3 placeholder-gray-500 resize-none focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                />
                                {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                            </div>

                            {/* Image Upload */}
                            <div>
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
                                    onDrop={(e) => handleDrop(e, "cover")}
                                    onClick={() => coverInputRef.current?.click()}
                                >
                                    {images.cover ? (
                                        <div className="flex flex-col justify-center items-center gap-1">

                                            <span className="text-[#464646] text-sm font-medium w-full text-center break-words">
                                                {images.cover?.name || selectedCourse?.listImageUrl?.split("/").pop()}
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
                                        ref={coverInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, "cover")}
                                    />
                                </div>
                                {errors.cover && <p className="text-red-500 text-sm mt-1">{errors.cover}</p>}
                            </div>
                        </div>

                        {/*course detail Content + Image */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4.5">
                            <div>
                                <label className="block text-lg mb-1">Detail Content</label>
                                <textarea
                                    name="detailContent"
                                    value={formData.detailContent}
                                    onChange={handleChange}
                                    placeholder="Enter Your Content Here"
                                    className="w-full h-[133px] border border-[#BDBDBD] rounded-xl px-4 py-3 placeholder-gray-500 resize-none focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                />
                                {errors?.detailContent && (
                                    <p className="text-red-500 text-sm">{errors?.detailContent}</p>
                                )}
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-lg mb-1">Detail Upload Image</label>
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
                                        <div className="flex flex-col justify-center items-center gap-1">

                                            <span className="text-[#464646] text-sm font-medium w-full text-center break-words">
                                                {images.detail.name || selectedCourse?.detailImageUrl?.split("/").pop()}
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2.5 gap-x-4.5">
                            {[
                                { label: "Mode", name: "mode", value: formData.mode },
                                { label: "Language", name: "language", value: formData.language },
                                { label: "Duration", name: "duration", value: formData.duration },
                                { label: "Certificate", name: "certificate", value: formData.certificate },
                                { label: "Shipping Details", name: "shippingDetails", value: formData.shippingDetails },
                            ].map((field) => (
                                <div key={field.name}>
                                    <label className="block text-lg mb-1">{field.label}</label>

                                    {["mode", "language"].includes(field.name) ? (
                                        <select
                                            name={field.name}
                                            value={field.value}
                                            onChange={handleChange}
                                            className="w-full border border-[#BDBDBD] rounded-xl px-4.5 py-3 text-[#464646] focus:outline-none focus:ring-0 focus:border-[#EA7913]"
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
                                            className="w-full border border-[#BDBDBD] rounded-xl px-4.5 py-2.5 placeholder-[#525252] focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                        />
                                    )}
                                    {errors[field.name] && (
                                        <p className="text-sm text-red-500 mt-1">{errors[field.name]}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditCourseSec