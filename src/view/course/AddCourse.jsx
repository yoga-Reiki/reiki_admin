import React, { useRef, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { IoIosArrowRoundForward } from "react-icons/io";
import UploadIcon from "../../assets/svg/UploadIcon.svg";
import SuccsessModel from "../component/SuccsessModel";
import { getAddCourses } from "../../services/courseServices";
import { Editor } from "@tinymce/tinymce-react";

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
    const [isDragging, setIsDragging] = useState(false);
    const [step, setStep] = useState(1);
    const [showSuccess, setShowSuccess] = useState(false);

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

    const validateForm = () => {
        const newErrors = {};

        if (step === 1) {
            if (!formData.title.trim()) newErrors.title = "Title is required.";
            if (!formData.newPricing.trim()) newErrors.newPricing = "New Pricing is required.";
            if (!formData.oldPricing.trim()) newErrors.oldPricing = "Old Pricing is required.";
            if (!formData.content.trim()) newErrors.content = "Content is required.";
            if (!images.cover) newErrors.image = "Cover Image is required.";
        } else if (step === 2) {
            if (!formData.detailContent?.trim()) newErrors.detailContent = "detailContent is required.";
            if (!images.detail) newErrors.image = "Detail Image is required.";
            if (!formData.language.trim()) newErrors.language = "Language is required.";
            if (!formData.shippingDetails.trim()) newErrors.shippingDetails = "Shipping details are required.";
            if (!formData.duration.trim()) newErrors.duration = "Duration is required.";
            if (!formData.certificate.trim()) newErrors.certificate = "Certificate is required.";
            if (!formData.onlineOffline.trim()) newErrors.onlineOffline = "Mode is required.";
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
            setLoading(false); // stop loading
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
                <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50 text-[#464646] p-6">
                    <div className="bg-white w-full mx-4 sm:mx-6 md:mx-8 lg:mx-0 p-5 max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-[971px] flex flex-col justify-between gap-5.5 border-t-2 border-t-[#EA7913] rounded-3xl">
                        <div className="flex justify-between items-center p-3">
                            <h2 className="text-[32px] font-Raleway Raleway-medium">Add Course</h2>
                            <button
                                onClick={onClose}
                                className="text-[#EA7913] border border-[#989898] cursor-pointer p-4 rounded-full"
                            >
                                <MdOutlineClose size={16} />
                            </button>
                        </div>

                        <form className="flex flex-col gap-5.5">
                            {step === 1 ? (
                                <div>
                                    <div className="grid grid-cols-3 gap-y-2.5 gap-x-4.5">
                                        {[
                                            { label: "Title", name: "title", type: "text" },
                                            { label: "New Pricing", name: "newPricing", type: "number" },
                                            { label: "Old Pricing", name: "oldPricing", type: "number" },
                                        ].map((field) => (
                                            <div key={field.name}>
                                                <label className="block text-lg mb-1">{field.label}</label>
                                                <input
                                                    type={field.type}
                                                    name={field.name}
                                                    value={formData[field.name]}
                                                    onChange={handleChange}
                                                    placeholder={`Enter ${field.label}`}
                                                    className="w-full border border-[#BDBDBD] rounded-xl px-4.5 py-2.5 text-[#525252] placeholder-[#525252] focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                                    // Optionally prevent non-numeric input by pattern
                                                    {...(field.type === "number" ? { min: 0, step: "any" } : {})}
                                                />
                                                {errors[field.name] && (
                                                    <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Content + Image */}
                                    <div className="grid grid-cols-2 pt-2.5 gap-x-4.5 pb-5.5">
                                        <div>
                                            <label className="block text-lg mb-1">Content</label>
                                            <textarea
                                                name="content"
                                                value={formData.content}
                                                onChange={handleChange}
                                                placeholder="Enter Your Content Here"
                                                className="w-full h-[280px] border border-[#BDBDBD] rounded-xl px-4 py-3 text-[#525252] placeholder-[#525252] resize-none focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                            />
                                            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                                        </div>
                                        {/* <div>
                                            <label className="block text-lg mb-1">Content</label>
                                            <Editor
                                                apiKey="w0h75l9p91ijk4a35sioyvhphj294qox82aq9wntohg9iees"
                                                value={formData.content}
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
                                            />
                                            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                                        </div> */}

                                        {/* Image Upload */}
                                        <div>
                                            <label className="block text-lg mb-1">Upload Image</label>
                                            <div
                                                className={`flex flex-col items-center justify-center h-[280px] border rounded-xl cursor-pointer bg-[#FCFCFC] ${isDragging ? "border-dashed border-[#EA7913] bg-[#FEF8EC]" : "border-[#BDBDBD]"
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
                                                {images?.cover ? (
                                                    <div className="flex flex-col items-center gap-1 text-[#525252]">
                                                        <img src={UploadIcon} alt="Not Found" />
                                                        <span className="font-medium">{images?.cover.name}</span>
                                                        <span className="text-xs">Click Here to Change Image</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2 px-12 text-[#525252]">
                                                        <img src={UploadIcon} alt="Not Found" />
                                                        <span>Upload Image Here</span>
                                                    </div>
                                                )}
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => handleFileChange(e, "cover")}
                                                    onInput={(e) => handleFileChange(e, "cover")}
                                                />
                                            </div>
                                            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                                        </div>
                                    </div>

                                    {/* <div className="w-full relative inline-block rounded-full bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900]">
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="w-full flex justify-center items-center gap-2 cursor-pointer py-2.5 bg-[#EA7913] text-lg text-white rounded-full"
                                        >
                                            <span>Next</span>
                                            <IoIosArrowRoundForward size={28} />
                                        </button>
                                    </div> */}

                                    <div className="w-full relative inline-block rounded-full px-[4px] py-[3.5px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900]">
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="w-full flex justify-center items-center gap-2 cursor-pointer py-2 sm:py-[9.5px] bg-[#EA7913] text-white rounded-full font-medium shadow hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-sm sm:text-base"
                                        >
                                            <span>Next</span>
                                            <IoIosArrowRoundForward size={28} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-y-5.5 gap-x-6">
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

                                        <div>
                                            <label className="block text-lg mb-1">Upload Image - Details Section</label>
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
                                                        <img src={UploadIcon} alt="Not Found" />
                                                        <span className="text-[#464646] font-medium">{images?.detail.name}</span>
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
                                                    onChange={(e) => handleFileChange(e, "detail")}
                                                    onInput={(e) => handleFileChange(e, "detail")}
                                                />
                                            </div>
                                            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                                        </div>
                                    </div>

                                    {/* Right Section */}
                                    <div className="flex flex-col gap-4">
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

                                        {/* Language */}
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

                                    {/* Confirm Submit button */}
                                    <div className="col-span-2 pt-8.5">
                                        {/* <div className="w-full relative inline-block rounded-full bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900]">
                                            <button
                                                type="button"
                                                onClick={handleConfirmSubmit}
                                                className="w-full flex justify-center items-center gap-2 cursor-pointer py-2.5 bg-[#EA7913] text-lg text-white rounded-full"
                                            >
                                                {loading ? (<span>Submitting...</span>) : (
                                                    <>
                                                        <span>Submit</span>
                                                        <IoIosArrowRoundForward size={28} />
                                                    </>
                                                )}
                                            </button>
                                        </div> */}

                                        <div className="w-full relative inline-block rounded-full px-[4px] py-[3.5px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900]">
                                            <button
                                                type="button"
                                                onClick={handleConfirmSubmit}
                                                className="w-full flex justify-center items-center gap-2 cursor-pointer py-2 sm:py-[9.5px] bg-[#EA7913] text-white rounded-full font-medium shadow hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-sm sm:text-base"
                                            >
                                                {loading ? (<span>Submitting...</span>) : (
                                                    <>
                                                        <span>Submit</span>
                                                        <IoIosArrowRoundForward size={28} />
                                                    </>
                                                )}
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

export default AddCourse;
