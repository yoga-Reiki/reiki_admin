import React, { useRef, useState } from "react";
import UploadIcon from "../../assets/svg/UploadIcon.svg";
import SuccsessModel from "../component/SuccsessModel";
import { getAddProduct } from "../../services/productServices";
import toast from "react-hot-toast";

function AddProduct({ onClose, fetchProduct }) {
    const coverFileInputRef = useRef(null);
    const detailFileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        priceNew: "",
        priceOld: "",
        duration: "",
        certificate: "",
        onlineOffline: "",
        summary: "",
        content1: "",
        language: "",
        shippingDetails: ""
    });
    const [images, setImages] = useState({
        cover: "",
        detail: "",
    });
    const [errors, setErrors] = useState({});
    const [isDragging, setIsDragging] = useState({
        cover: false,
        detail: false,
    });
    const [step, setStep] = useState(1);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
        setErrors((p) => ({ ...p, [name]: "" }));
    };
    const handleFileChange = (e, type) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setImages((prev) => ({ ...prev, [type]: file }));
            setErrors((prev) => ({ ...prev, [type]: "" }));
        } else {
            setErrors((prev) => ({ ...prev, [type]: "Please upload a valid image." }));
        }
    };

    const handleDrop = async (e, type) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer?.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setImages((prev) => ({ ...prev, [type]: file }));
            setErrors((prev) => ({ ...prev, [type]: "" }));
        } else {
            setErrors((prev) => ({ ...prev, [type]: "Please upload a valid image." }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = "Title is required.";
        if (!formData.chip1?.trim()) newErrors.chip1 = "Chip 1 title is required.";
        if (!formData.chip2?.trim()) newErrors.chip2 = "Chip 2 title is required.";
        if (!formData.summary.trim()) newErrors.summary = "Content is required.";
        if (!images.cover) newErrors.cover = "Product section image is required.";
        if (!formData.content1?.trim()) newErrors.content1 = "Content is required.";
        if (!formData.specifications?.trim()) newErrors.specifications = "Specifications are required.";
        if (!images.detail) newErrors.detail = "Blog section image is required.";
        if (!formData.priceNew.trim()) {
            newErrors.priceNew = "New Pricing is required.";
        } else if (isNaN(formData.priceNew)) {
            newErrors.priceNew = "New Pricing must be a number.";
        }
        if (!formData.priceOld.trim()) {
            newErrors.priceOld = "Old Pricing is required.";
        } else if (isNaN(formData.priceOld)) {
            newErrors.priceOld = "Old Pricing must be a number.";
        }
        if (!formData.shippingDetails.trim()) newErrors.shippingDetails = "Shipping details are required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit button handler
    const handleConfirmSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach((key) => {
                formDataToSend.append(key, formData[key]);
            });

            if (images.cover) formDataToSend.append("coverImage", images.cover);
            if (images.detail) formDataToSend.append("detailImage", images.detail);

            const res = await getAddProduct(formDataToSend);
            fetchProduct()
            toast.success(res?.message)
            setShowSuccess(true);
        } catch (error) {
            console.error("Error submitting form:", error);
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
                        onClose();
                    }}
                    showSuccessProduct={showSuccess}
                />
            ) : (
                <div className='text-[#464646] flex flex-col gap-2'>
                    <div className="p-3">
                        <h2 className="text-[32px] font-Raleway Raleway-medium text-[#656565]">
                            <span onClick={onClose} className="cursor-pointer">
                                Products
                            </span>{" "}
                            &gt;{" "}
                            <span className="text-[#464646]">
                                Add Product
                            </span>
                        </h2>
                        <p className="pt-1 text-[#656565]">Add new product and its details</p>
                    </div>

                    <div className="flex justify-center items-center text-[#464646] px-3">
                        <div className="bg-white w-full p-6 flex flex-col justify-between gap-8 rounded-3xl">
                            <div>
                                <h2 className="text-[32px] font-Raleway Raleway-medium">Add Product</h2>
                            </div>

                            <form>
                                <div className="space-y-8 w-full">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
                                        <div className="space-y-4.5">
                                            {["title", "chip1", "chip2"].map((f, i) => (
                                                <div key={f}>
                                                    <label className="text-[#292929] block mb-1">{f.charAt(0).toUpperCase() + f.slice(1)}</label>
                                                    <input
                                                        type="text"
                                                        name={f}
                                                        value={formData[f]}
                                                        onChange={handleChange}
                                                        placeholder={`Enter ${f}`}
                                                        className="w-full h-11 border border-[#BDBDBD] rounded-full px-4.5 py-2.5 text-[#525252] placeholder-[#525252] focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                                    />
                                                    {errors[f] && <p className="text-red-500 text-sm mt-1">{errors[f]}</p>}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="h-[252px]">
                                            <label className="block text-lg mb-1">Content</label>
                                            <textarea
                                                name="summary"
                                                value={formData.summary}
                                                onChange={handleChange}
                                                placeholder="Enter Your Content"
                                                className="w-full h-[220px] border border-[#BDBDBD] rounded-2xl px-4 py-3 text-[#525252] placeholder-gray-500 resize-none focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                            />
                                            {errors.summary && <p className="text-red-500 text-sm mt-1">{errors.summary}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex flex-col lg:flex-row gap-6">
                                            {/* --- COVER IMAGE UPLOAD --- */}
                                            <div className="w-full">
                                                <label className="block text-lg mb-1">Product Image</label>
                                                <div
                                                    className={`flex flex-col items-center justify-center h-[171px] border border-dashed rounded-xl cursor-pointer transition-all ${isDragging.cover ? "border-[#EA7913]" : "border-[#BDBDBD]"
                                                        }`}
                                                    onDragOver={(e) => {
                                                        e.preventDefault();
                                                        setIsDragging((prev) => ({ ...prev, cover: true }));
                                                    }}
                                                    onDragLeave={(e) => {
                                                        e.preventDefault();
                                                        setIsDragging((prev) => ({ ...prev, cover: false }));
                                                    }}
                                                    onDrop={(e) => handleDrop(e, "cover")}
                                                    onClick={() => coverFileInputRef.current?.click()}
                                                >
                                                    <img src={UploadIcon} alt="Upload" className="h-12 w-12 mb-3" />
                                                    {images.cover ? (
                                                        <div className="text-[#525252]">
                                                            <span className="font-medium">{images.cover.name}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="px-12 text-[#525252]">
                                                            <span>Drag & drop file here or Choose file</span>
                                                        </div>
                                                    )}
                                                    <input
                                                        ref={coverFileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handleFileChange(e, "cover")}
                                                    />
                                                </div>
                                                <div
                                                    className={`flex items-center ${errors.cover ? "justify-between" : "justify-end"
                                                        }`}
                                                >
                                                    {errors.cover && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.cover}</p>
                                                    )}
                                                    <p className="text-[#656565] text-xs pt-1">Max size : 25 MB</p>
                                                </div>
                                            </div>

                                            {/* --- DETAIL IMAGE UPLOAD --- */}
                                            <div className="w-full">
                                                <label className="block text-lg mb-1">Product Detail Image</label>
                                                <div
                                                    className={`flex flex-col items-center justify-center h-[171px] border border-dashed rounded-xl cursor-pointer transition-all ${isDragging.detail ? "border-[#EA7913]" : "border-[#BDBDBD]"
                                                        }`}
                                                    onDragOver={(e) => {
                                                        e.preventDefault();
                                                        setIsDragging((prev) => ({ ...prev, detail: true }));
                                                    }}
                                                    onDragLeave={(e) => {
                                                        e.preventDefault();
                                                        setIsDragging((prev) => ({ ...prev, detail: false }));
                                                    }}
                                                    onDrop={(e) => handleDrop(e, "detail")}
                                                    onClick={() => detailFileInputRef.current?.click()}
                                                >
                                                    <img src={UploadIcon} alt="Upload" className="h-12 w-12 mb-3" />
                                                    {images.detail ? (
                                                        <div className="text-[#525252]">
                                                            <span className="font-medium">{images.detail.name}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="px-12 text-[#525252]">
                                                            <span>Drag & drop file here or Choose file</span>
                                                        </div>
                                                    )}
                                                    <input
                                                        ref={detailFileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handleFileChange(e, "detail")}
                                                    />
                                                </div>
                                                <div
                                                    className={`flex items-center ${errors.detail ? "justify-between" : "justify-end"
                                                        }`}
                                                >
                                                    {errors.detail && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.detail}</p>
                                                    )}
                                                    <p className="text-[#656565] text-xs pt-1">Max size : 25 MB</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col lg:flex-row gap-6">
                                            <div className="w-full">
                                                <label className="block text-lg mb-1">Product Detail Content</label>
                                                <textarea
                                                    name="content1"
                                                    value={formData.content1}
                                                    onChange={handleChange}
                                                    placeholder="Enter Your Content"
                                                    className="w-full h-[171px] border border-[#BDBDBD] rounded-xl px-4 py-3 placeholder-gray-500 resize-none focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                                />
                                                {errors.content1 && <p className="text-red-500 text-sm mt-1">{errors.content1}</p>}
                                            </div>

                                            {/* <div>
                                            <label className="block text-lg mb-1">Product Detail Content</label>
                                            <Editor
                                                apiKey="w0h75l9p91ijk4a35sioyvhphj294qox82aq9wntohg9iees"
                                                name="content1"
                                                value={formData.content1}
                                                onEditorChange={(content) => {
                                                    setFormData((prev) => ({ ...prev, content1: content }));
                                                    setErrors((prev) => ({ ...prev, content1: "" }));
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
                                                    height: 250
                                                }}
                                            />
                                            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                                            </div> */}
                                            <div className="w-full">
                                                <label className="block text-lg mb-1">Specifications</label>
                                                <textarea
                                                    name="specifications"
                                                    value={formData.specifications}
                                                    onChange={handleChange}
                                                    placeholder="Enter Your Specifications"
                                                    className="w-full h-[171px] border border-[#BDBDBD] rounded-xl px-4 py-3 text-[#525252] placeholder-[#525252] resize-none focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                                />
                                                {errors.specifications && <p className="text-red-500 text-sm mt-1">{errors.specifications}</p>}
                                            </div>
                                        </div>

                                        <div className="flex flex-col lg:flex-row gap-6">
                                            <div className="w-full">
                                                <label className="block text-lg mb-1">New Pricing</label>
                                                <input
                                                    type="text"
                                                    name="priceNew"
                                                    value={formData.priceNew}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (/^\d*$/.test(val)) {
                                                            handleChange(e);
                                                        }
                                                    }}
                                                    placeholder="Enter Your New Pricing"
                                                    className="w-full border border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-full text-[#525252] placeholder-[#525252] px-4.5 py-2.5"
                                                />
                                                {errors.priceNew && <p className="text-red-500 text-sm mt-1">{errors.priceNew}</p>}
                                            </div>

                                            <div className="w-full">
                                                <label className="block text-lg mb-1">Old Pricing</label>
                                                <input
                                                    type="text"
                                                    name="priceOld"
                                                    value={formData.priceOld}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (/^\d*$/.test(val)) {
                                                            handleChange(e);
                                                        }
                                                    }}
                                                    placeholder="Enter Your Old Pricing"
                                                    className="w-full border border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-full text-[#525252] placeholder-[#525252] px-4.5 py-2.5"
                                                />
                                                {errors.priceOld && <p className="text-red-500 text-sm mt-1">{errors.priceOld}</p>}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-lg mb-1">Shipping Details</label>
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
                                                    onClick={(e) => handleConfirmSubmit(e)}
                                                    className="w-full h-full inline-flex justify-center items-center space-x-1.5 px-6 py-3 bg-[#EA7913] text-[#F8F8F8] rounded-full font-medium hover:cursor-pointer hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-base"
                                                >
                                                    {loading ? "Uploading..." : "Save"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div >
                </div>
            )
            }
        </div >
    );
}

export default AddProduct;
