// import React, { useRef, useState } from "react";
// import { MdOutlineClose } from "react-icons/md";
// import { FiUploadCloud } from "react-icons/fi";
// import { IoIosArrowRoundForward } from "react-icons/io";
// import UploadIcon from "../../assets/svg/UploadIcon.svg"

// function AddCourse({ onClose }) {
//     const fileInputRef = useRef(null);
//     const [formData, setFormData] = useState({
//         title: "",
//         newPricing: "",
//         oldPricing: "",
//         duration: "",
//         certificate: "",
//         onlineOffline: "",
//         content: "",
//         language: "",
//         shippingDetails: ""
//     });
//     const [image, setImage] = useState(null);
//     const [errors, setErrors] = useState({});
//     const [isDragging, setIsDragging] = useState(false);
//     const [showImagePreview, setShowImagePreview] = useState(false);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((p) => ({ ...p, [name]: value }));
//         setErrors((p) => ({ ...p, [name]: "" }));
//     };

//     const readFileAsDataURL = (file) =>
//         new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onload = () => resolve(reader.result);
//             reader.onerror = reject;
//             reader.readAsDataURL(file);
//         });

//     const validateImageAndSet = async (file) => {
//         if (!file) return;
//         if (!file.type?.startsWith("image/")) {
//             setErrors((p) => ({ ...p, image: "Please upload a valid image." }));
//             return;
//         }
//         try {
//             const dataUrl = await readFileAsDataURL(file);
//             setImage(file);
//             setErrors((p) => ({ ...p, image: "" }));
//         } catch {
//             setErrors((p) => ({ ...p, image: "Failed to load image preview." }));
//         }
//     };

//     const handleDrop = async (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         setIsDragging(false);
//         const file = e.dataTransfer?.files?.[0];
//         await validateImageAndSet(file);
//     };

//     const handleFileChange = (e) => {
//         const file = e.target.files?.[0];
//         if (file && file.type.startsWith("image/")) {
//             setImage(file);
//             setErrors((p) => ({ ...p, image: "" }));
//         } else {
//             setErrors((p) => ({ ...p, image: "Please upload a valid image." }));
//         }
//     };

//     const validateForm = () => {
//         const newErrors = {};
//         if (!formData.title.trim()) newErrors.title = "Title is required.";
//         if (!formData.newPricing.trim()) newErrors.newPricing = "New Pricing is required.";
//         if (!formData.oldPricing.trim()) newErrors.oldPricing = "Old Pricing is required.";
//         if (!formData.duration.trim()) newErrors.duration = "Duration is required.";
//         if (!formData.certificate.trim()) newErrors.certificate = "Certificate is required.";
//         if (!formData.onlineOffline.trim()) newErrors.onlineOffline = "Online/Offline is required.";
//         if (!formData.content.trim()) newErrors.content = "Content is required.";
//         if (!image) newErrors.image = "Image is required.";
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!validateForm()) return;
//         setShowImagePreview(true);
//     };

//     const handleConfirmSubmit = () => {
//         setShowImagePreview(false);
//         alert("Form submitted with image!");
//         // You can add actual submission logic here, like API call
//     };

//     return (
//         <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50 text-[#464646] p-6">
//             <div className="bg-white w-full max-w-[971px] p-5 rounded-3xl border-t-2 border-t-[#EA7913] flex flex-col gap-5.5">
//                 <div className="flex justify-between items-center p-3">
//                     <h2 className="text-[32px] font-Raleway">Add Course</h2>
//                     <button
//                         onClick={onClose}
//                         className="text-[#EA7913] border border-[#989898] cursor-pointer p-4 rounded-full"
//                     >
//                         <MdOutlineClose size={16} />
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="flex flex-col gap-5.5">
//                     {!showImagePreview ? (
//                         <div>
//                             <div>
//                                 <div className="grid grid-cols-3 gap-y-2.5 gap-x-4.5">
//                                     {[
//                                         { label: "Title", name: "title" },
//                                         { label: "New Pricing", name: "newPricing" },
//                                         { label: "Old Pricing", name: "oldPricing" },
//                                         { label: "Duration", name: "duration" },
//                                         { label: "Certificate", name: "certificate" },
//                                         { label: "Online/Offline", name: "onlineOffline" }
//                                     ].map((field) => (
//                                         <div key={field.name}>
//                                             <label className="block text-lg mb-1">{field.label}</label>
//                                             <input
//                                                 type="text"
//                                                 name={field.name}
//                                                 value={formData[field.name]}
//                                                 onChange={handleChange}
//                                                 placeholder={`Enter ${field.label}`}
//                                                 className="w-full border border-[#BDBDBD] rounded-xl px-4.5 py-2.5 placeholder-[#525252] focus:outline-none focus:ring-0 focus:border-[#EA7913]"
//                                             />
//                                             {errors[field.name] && (
//                                                 <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
//                                             )}
//                                         </div>
//                                     ))}
//                                 </div>
//                                 <div className="grid grid-cols-2 pt-2.5 gap-x-4.5 pb-14.5 ">
//                                     {/* Content */}
//                                     <div>
//                                         <label className="block text-lg mb-1">Content</label>
//                                         <textarea
//                                             name="content"
//                                             value={formData.content}
//                                             onChange={handleChange}
//                                             placeholder="Enter Your Content"
//                                             className="w-full h-[136px] border border-[#BDBDBD] rounded-xl px-4 py-3 placeholder-gray-500 resize-none focus:outline-none focus:ring-0 focus:border-[#EA7913]"
//                                         />
//                                         {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
//                                     </div>

//                                     {/* Image Upload */}
//                                     <div>
//                                         <label className="block text-lg mb-1">Image for Blog Section</label>
//                                         <div
//                                             className={`flex flex-col items-center justify-center h-[136px] border rounded-xl cursor-pointer bg-[#FCFCFC] ${isDragging ? "border-dashed border-[#EA7913] bg-[#FEF8EC]" : "border-[#BDBDBD]"
//                                                 }`}
//                                             onDragOver={(e) => {
//                                                 e.preventDefault();
//                                                 e.stopPropagation();
//                                                 setIsDragging(true);
//                                             }}
//                                             onDragLeave={(e) => {
//                                                 e.preventDefault();
//                                                 e.stopPropagation();
//                                                 setIsDragging(false);
//                                             }}
//                                             onDrop={handleDrop}
//                                             onClick={() => fileInputRef.current?.click()}
//                                         >
//                                             {image ? (
//                                                 <div className="flex flex-col items-center gap-1">
//                                                     <img src={UploadIcon} alt="Not Found" />
//                                                     <span className="text-[#464646] font-medium">{image.name}</span>
//                                                     <span className="text-xs text-[#9a9a9a]">Click Here to Change Image</span>
//                                                 </div>
//                                             ) : (
//                                                 <div className="flex flex-col items-center gap-2 px-12">
//                                                     <img src={UploadIcon} alt="Not Found" />
//                                                     <span className="text-[#989898]">Upload Image Here</span>
//                                                 </div>
//                                             )}

//                                             <input
//                                                 ref={fileInputRef}
//                                                 type="file"
//                                                 accept="image/*"
//                                                 className="hidden"
//                                                 onChange={handleFileChange}
//                                                 onInput={handleFileChange}
//                                             />
//                                         </div>
//                                         {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Submit Button */}
//                             <div className="w-full relative inline-block rounded-full px-[4px] py-[3px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:to-[#F39C2C]">
//                                 <button
//                                     type="submit"
//                                     className="w-full flex justify-center items-center gap-2 py-2.5 bg-[#EA7913] text-lg text-white rounded-full cursor-pointer font-medium hover:bg-[#F39C2C] disabled:opacity-60"
//                                 >
//                                     <span>Next</span>
//                                     <IoIosArrowRoundForward size={28} />
//                                 </button>
//                             </div>
//                         </div>
//                     ) : (
//                         <div className="abc">
//                             <div className="grid grid-cols-2 gap-y-5.5 gap-x-4.5">
//                                 <div className="flex flex-col gap-4">
//                                     <div>
//                                         <label className="block text-lg mb-1">Content</label>
//                                         <textarea
//                                             name="content"
//                                             value={formData.content}
//                                             onChange={handleChange}
//                                             placeholder="Enter Your Content"
//                                             className="w-full h-[136px] border border-[#BDBDBD] rounded-xl px-4 py-3 placeholder-gray-500 resize-none focus:outline-none focus:ring-0 focus:border-[#EA7913]"
//                                         />
//                                         {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
//                                     </div>

//                                     <div>
//                                         <label className="block text-lg mb-1">Image for Blog Section</label>
//                                         <div
//                                             className={`flex flex-col items-center justify-center h-[136px] border rounded-xl cursor-pointer bg-[#FCFCFC] ${isDragging ? "border-dashed border-[#EA7913] bg-[#FEF8EC]" : "border-[#BDBDBD]"
//                                                 }`}
//                                             onDragOver={(e) => {
//                                                 e.preventDefault();
//                                                 e.stopPropagation();
//                                                 setIsDragging(true);
//                                             }}
//                                             onDragLeave={(e) => {
//                                                 e.preventDefault();
//                                                 e.stopPropagation();
//                                                 setIsDragging(false);
//                                             }}
//                                             onDrop={handleDrop}
//                                             onClick={() => fileInputRef.current?.click()}
//                                         >
//                                             {image ? (
//                                                 <div className="flex flex-col items-center gap-1">
//                                                     <img src={UploadIcon} alt="Not Found" />
//                                                     <span className="text-[#464646] font-medium">{image.name}</span>
//                                                     <span className="text-xs text-[#9a9a9a]">Click Here to Change Image</span>
//                                                 </div>
//                                             ) : (
//                                                 <div className="flex flex-col items-center gap-2 px-12">
//                                                     <img src={UploadIcon} alt="Not Found" />
//                                                     <span className="text-[#989898]">Upload Image Here</span>
//                                                 </div>
//                                             )}

//                                             <input
//                                                 ref={fileInputRef}
//                                                 type="file"
//                                                 accept="image/*"
//                                                 className="hidden"
//                                                 onChange={handleFileChange}
//                                                 onInput={handleFileChange}
//                                             />
//                                         </div>
//                                         {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
//                                     </div>
//                                 </div>

//                                 {/* Right Section */}
//                                 <div className="flex flex-col gap-4">
//                                     <div>
//                                         <label className="block text-lg mb-1">Mode</label>
//                                         <select
//                                             name="onlineOffline"
//                                             value={formData.onlineOffline}
//                                             onChange={handleChange}
//                                             className="w-full border border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl placeholder-[#525252] px-4.5 py-3"
//                                         >
//                                             <option className="" value="" disabled>Select Mode of Course</option>
//                                             <option value="Online">Online</option>
//                                             <option value="Offline">Offline</option>
//                                             <option value="Hybrid">Hybrid</option>
//                                         </select>
//                                     </div>

//                                     {/* Language */}
//                                     <div>
//                                         <label className="block text-lg mb-1">Language</label>
//                                         <select
//                                             name="language"
//                                             value={formData.language}
//                                             onChange={handleChange}
//                                             className="w-full border border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl placeholder-[#525252] px-4.5 py-3"
//                                         >
//                                             <option value="" disabled>Select Language</option>
//                                             <option value="English">English</option>
//                                             <option value="Spanish">Spanish</option>
//                                             <option value="French">French</option>
//                                             <option value="German">German</option>
//                                         </select>
//                                     </div>

//                                     <div>
//                                         <label className="block text-lg mb-1">Duration</label>
//                                         <input
//                                             type="text"
//                                             name="duration"
//                                             // value={formData.duration}
//                                             onChange={handleChange}
//                                             placeholder="Enter Duration of Course"
//                                             className="w-full border border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl placeholder-[#525252] px-4.5 py-2.5"
//                                         />
//                                         {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
//                                     </div>

//                                     <div>
//                                         <label className="block text-lg mb-1">Shipping Details</label>
//                                         <input
//                                             type="text"
//                                             name="shippingDetails"
//                                             // value={formData.shippingDetails}
//                                             onChange={handleChange}
//                                             placeholder="Enter Shipping Details"
//                                             className="w-full border border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl placeholder-[#525252] px-4.5 py-2.5"
//                                         />
//                                         {errors.shippingDetails && <p className="text-red-500 text-sm mt-1">{errors.shippingDetails}</p>}
//                                     </div>
//                                 </div>

//                                 {/* Confirm Button - full width below both columns */}
//                                 <div className="col-span-2 pt-8.5">
//                                     <div className="w-full relative inline-block rounded-full px-[4px] py-[3px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:to-[#F39C2C]">
//                                         <button
//                                             type="button"
//                                             onClick={handleConfirmSubmit}
//                                             className="w-full flex justify-center items-center gap-2 py-2.5 bg-[#EA7913] text-lg text-white rounded-full cursor-pointer font-medium hover:bg-[#F39C2C] disabled:opacity-60"
//                                         >
//                                             <span>Submit</span>
//                                             <IoIosArrowRoundForward size={28} />
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default AddCourse;



import React, { useRef, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { IoIosArrowRoundForward } from "react-icons/io";
import UploadIcon from "../../assets/svg/UploadIcon.svg";
import SuccsessModel from "../component/SuccsessModel";
import { getAddCourses } from "../../services/courseServices";

function AddCourse({ onClose }) {
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
        shippingDetails: ""
    });
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [isDragging, setIsDragging] = useState(false);
    const [step, setStep] = useState(1); // 🔹 step control (1 = first form, 2 = abc div)
    const [showSuccess, setShowSuccess] = useState(false); // 🔹 success modal state

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
            if (!formData.newPricing.trim()) newErrors.newPricing = "New Pricing is required.";
            if (!formData.oldPricing.trim()) newErrors.oldPricing = "Old Pricing is required.";
            if (!formData.duration.trim()) newErrors.duration = "Duration is required.";
            if (!formData.certificate.trim()) newErrors.certificate = "Certificate is required.";
            if (!formData.onlineOffline.trim()) newErrors.onlineOffline = "Mode is required.";
            if (!formData.content.trim()) newErrors.content = "Content is required.";
            if (!image) newErrors.image = "Image is required.";
        } else if (step === 2) {
            if (!formData.content.trim()) newErrors.content = "Content is required.";
            if (!image) newErrors.image = "Image is required.";
            if (!formData.language.trim()) newErrors.language = "Language is required.";
            if (!formData.shippingDetails.trim()) newErrors.shippingDetails = "Shipping details are required.";
            if (!formData.duration.trim()) newErrors.duration = "Duration is required.";
            if (!formData.onlineOffline.trim()) newErrors.onlineOffline = "Mode is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 🔹 Next button handler
    const handleNext = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setStep(2);
    };

    // 🔹 Submit button handler (API call + Success modal)
    const handleConfirmSubmit = async () => {
        if (!validateForm()) return;

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach((key) => {
                formDataToSend.append(key, formData[key]);
            });
            if (image) {
                formDataToSend.append("image", image);
            }

            // 🔹 Call API
            const res = await getAddCourses(formDataToSend);

            console.log("Course added ✅", res);
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
                    showSuccessCourse={showSuccess}
                />
            ) : (
                <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50 text-[#464646] p-6">
                    <div className="bg-white w-full max-w-[971px] p-5 rounded-3xl border-t-2 border-t-[#EA7913] flex flex-col gap-5.5">
                        <div className="flex justify-between items-center p-3">
                            <h2 className="text-[32px] font-Raleway">Add Course</h2>
                            <button
                                onClick={onClose}
                                className="text-[#EA7913] border border-[#989898] cursor-pointer p-4 rounded-full"
                            >
                                <MdOutlineClose size={16} />
                            </button>
                        </div>

                        <form className="flex flex-col gap-5.5">
                            {step === 1 ? (
                                // 🔹 Step 1 form
                                <div>
                                    <div className="grid grid-cols-3 gap-y-2.5 gap-x-4.5">
                                        {[
                                            { label: "Title", name: "title" },
                                            { label: "New Pricing", name: "newPricing" },
                                            { label: "Old Pricing", name: "oldPricing" },
                                            { label: "Duration", name: "duration" },
                                            { label: "Certificate", name: "certificate" },
                                            { label: "Online/Offline", name: "onlineOffline" }
                                        ].map((field) => (
                                            <div key={field.name}>
                                                <label className="block text-lg mb-1">{field.label}</label>
                                                <input
                                                    type="text"
                                                    name={field.name}
                                                    value={formData[field.name]}
                                                    onChange={handleChange}
                                                    placeholder={`Enter ${field.label}`}
                                                    className="w-full border border-[#BDBDBD] rounded-xl px-4.5 py-2.5"
                                                />
                                                {errors[field.name] && (
                                                    <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Content + Image */}
                                    <div className="grid grid-cols-2 pt-2.5 gap-x-4.5 pb-14.5 ">
                                        <div>
                                            <label className="block text-lg mb-1">Content</label>
                                            <textarea
                                                name="content"
                                                value={formData.content}
                                                onChange={handleChange}
                                                placeholder="Enter Your Content"
                                                className="w-full h-[136px] border border-[#BDBDBD] rounded-xl px-4 py-3"
                                            />
                                            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-lg mb-1">Image for Blog Section</label>
                                            <div
                                                className="flex flex-col items-center justify-center h-[136px] border rounded-xl cursor-pointer bg-[#FCFCFC]"
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
                                                />
                                            </div>
                                            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                                        </div>
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
                                <div className="abc">
                                    <div className="grid grid-cols-2 gap-y-5.5 gap-x-4.5">
                                        <div className="flex flex-col gap-4">
                                            <div>
                                                <label className="block text-lg mb-1">Content</label>
                                                <textarea
                                                    name="content"
                                                    value={formData.content}
                                                    onChange={handleChange}
                                                    placeholder="Enter Your Content"
                                                    className="w-full h-[136px] border border-[#BDBDBD] rounded-xl px-4 py-3 placeholder-gray-500 resize-none focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                                />
                                                {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-lg mb-1">Image for Blog Section</label>
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
                                            <div className="w-full relative inline-block rounded-full bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900]">
                                                <button
                                                    type="button"
                                                    onClick={handleConfirmSubmit}
                                                    className="w-full flex justify-center items-center gap-2 py-2.5 bg-[#EA7913] text-lg text-white rounded-full"
                                                >
                                                    <span>Submit</span>
                                                    <IoIosArrowRoundForward size={28} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddCourse;
