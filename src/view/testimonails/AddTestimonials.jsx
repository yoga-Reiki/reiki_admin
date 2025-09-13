import React, { useRef, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { FiUploadCloud } from "react-icons/fi";
import { getAddTestimonials } from "../../services/testimonialsServices";
import toast from "react-hot-toast";
import SuccsessModel from "../component/SuccsessModel";

function AddTestimonials({ onClose, selectedUser, fetchTestimonials }) {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: selectedUser?.name || "",
    roleOrAddress: selectedUser?.post || "",
    message: selectedUser?.testimonials || "",
  });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   validateImage(file);
  // };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setErrors((prev) => ({ ...prev, image: "" }));
    } else {
      setImage(null);
      setErrors((prev) => ({ ...prev, image: "Please upload a valid image." }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    validateImage(file);
  };

  const validateImage = (file) => {
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setErrors((prev) => ({ ...prev, image: "" }));
    } else {
      setErrors((prev) => ({ ...prev, image: "Please upload a valid image." }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.roleOrAddress.trim()) newErrors.roleOrAddress = "Post/Address is required.";
    if (!formData.message.trim()) newErrors.message = "Testimonial is required.";
    if (!image) newErrors.image = "Image is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const data = new FormData();
    data.append("name", formData.name);
    data.append("roleOrAddress", formData.roleOrAddress);
    data.append("message", formData.message);
    data.append("order", "1");
    data.append("isActive", "true");
    data.append("image", image);

    try {
      setIsSubmitting(true);
      const response = await getAddTestimonials(data);
      setShowSuccess(true);
      fetchTestimonials()
      toast.success(response?.message)
    } catch (err) {
      console.error("API Error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {showSuccess ? (
        <SuccsessModel onClose={() => {
          setShowSuccess(false);
          onClose();
        }} showSuccessTestimonails={showSuccess} />
      ) : (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50 text-[#464646]">
          <div className="bg-white w-full mx-4 sm:mx-6 md:mx-8 lg:mx-0 p-5 max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-[971px] flex flex-col justify-between gap-5.5 border-t-2 border-t-[#EA7913] rounded-3xl">
            {/* Header */}
            <div className="flex justify-between items-center p-3">
              <h2 className="text-[32px] font-Raleway">Add Testimonials</h2>
              <button
                onClick={onClose}
                className="text-[#EA7913] border border-[#989898] cursor-pointer p-4 rounded-full"
              >
                <MdOutlineClose size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-4.5 gap-y-4">
              <div>
                <label className="block text-lg mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter Client’s Name"
                  className="w-full border border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl placeholder-[#525252] px-4.5 py-2.5"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-lg mb-1">Post / Address</label>
                <input
                  type="text"
                  name="roleOrAddress"
                  value={formData.roleOrAddress}
                  onChange={handleChange}
                  placeholder="Enter Client’s Post or Address"
                  className="w-full border border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl placeholder-[#525252] px-4.5 py-2.5"
                />
                {errors.roleOrAddress && <p className="text-red-500 text-sm mt-1">{errors.roleOrAddress}</p>}
              </div>

              {/* Testimonials */}
              <div>
                <label className="block text-lg mb-1">Testimonials</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter Client’s Feedback Here"
                  rows={6}
                  className="w-full h-[196px] border border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl placeholder-[#525252] px-4.5 py-2.5"
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-lg mb-1">Upload Image</label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add("border-dashed", "border-[#EA7913]", "bg-[#FEF8EC]");
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove("border-dashed", "border-[#EA7913]", "bg-[#FEF8EC]");
                  }}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center h-[196px] border border-[#BDBDBD] rounded-xl text-center cursor-pointer bg-[#FCFCFC] transition-all`}
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                      fileInputRef.current.click();
                    }
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <FiUploadCloud size={24} className="text-[#EA7913] mb-2" />
                  {image ? (
                    <p className="text-[#464646]">{image.name}</p>
                  ) : (
                    <span className="text-[#989898]">Upload Image Here</span>
                  )}
                </div>
                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 mt-4">
                <div className="w-full relative inline-block rounded-full px-[4px] py-[3px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:to-[#F39C2C]">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-[#EA7913] text-lg text-white rounded-full font-medium hover:bg-[#F39C2C] disabled:opacity-60"
                  >
                    {isSubmitting ? "Uploading..." : "Upload in Website"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AddTestimonials;
