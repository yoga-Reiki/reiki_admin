import React, { useEffect, useRef, useState } from "react";
import { getTestimonialsUpdate } from "../../services/testimonialsServices";
import toast from "react-hot-toast";
import galleryIconOrange from "../../assets/svg/galleryIconOrange.svg"

function TestimonialsEdit({ selectedUser, setSelectedUser, fetchTestimonials }) {
  const [formData, setFormData] = useState({
    name: "",
    roleOrAddress: "",
    message: "",
  });
  const [imageName, setImageName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name || "",
        roleOrAddress: selectedUser.roleOrAddress || "",
        message: selectedUser.message || "",
      });
      setImageName(
        selectedUser.imageUrl
          ? selectedUser.imageUrl.split("/").pop()
          : "No image"
      );
      setSelectedFile(null);
    }
  }, [selectedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageName(file.name);
      setSelectedFile(file);
    }
  };

  const handleCancel = () => {
    setSelectedUser(null)
  };

  const handleSubmit = async () => {
    // Check if anything has changed
    const hasChanged =
      formData.name !== selectedUser.name ||
      formData.roleOrAddress !== selectedUser.roleOrAddress ||
      formData.message !== selectedUser.message ||
      selectedFile !== null;

    if (!hasChanged) {
      toast.error("Please make a change before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("roleOrAddress", formData.roleOrAddress);
      data.append("message", formData.message);

      if (selectedFile) {
        data.append("image", selectedFile);
      }

      const result = await getTestimonialsUpdate(data, selectedUser._id);
      setSelectedUser(null);
      fetchTestimonials()
      toast.success(result?.message)
    } catch (error) {
      console.error("Error updating testimonial:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAFAFA] text-[#464646] flex flex-col gap-2 px-3">
      {/* Header */}
      <h2 className="pt-6 pb-4 text-2xl md:text-[32px] font-Raleway Raleway-medium">
        <span onClick={handleCancel} className="cursor-pointer">Testimonials</span> &gt;{" "}
        <span className="text-2xl">Edit Testimonials</span>
      </h2>

      {/* Form Container */}
      <div className="bg-white border-t-2 border-t-[#EA7913] rounded-3xl p-5 space-y-5.5">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h2 className="text-2xl text-[#656565] font-Raleway Raleway-medium">Edit Testimonial</h2>
          <div className="flex gap-3 w-full lg:w-auto">
            <button
              className="w-full lg:w-auto bg-[#FCEAC9] text-[#656565] px-6 py-2.5 rounded-full hover:bg-[#FCEAC2] cursor-pointer"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <div className="w-full relative inline-block rounded-full px-[4px] py-[3px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:via-[#F39C2C] hover:to-[#F39C2C] active:from-[#EA7913] active:via-[#EA7913] active:to-[#EA7913]">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full h-full inline-flex justify-center items-center space-x-1.5 px-6 py-2.5 bg-[#EA7913] text-[#F8F8F8] rounded-full font-medium hover:cursor-pointer hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-base"
              >
                {isSubmitting ? "Updating..." : "Update in website"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-y-2.5 gap-x-5">
          {/* Name */}
          <div>
            <label className="block text-lg mb-1.5">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-[#BDBDBD] text-[#525252] rounded-xl py-2 px-3 focus:outline-none focus:border-[#EA7913]"
            />
          </div>

          {/* Role/Address */}
          <div>
            <label className="block text-lg mb-1.5">Post / Address</label>
            <input
              type="text"
              name="roleOrAddress"
              value={formData.roleOrAddress}
              onChange={handleChange}
              className="w-full border border-[#BDBDBD] text-[#525252] rounded-xl py-2 px-3 focus:outline-none focus:border-[#EA7913]"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-lg mb-1.5">Testimonials</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className="w-full h-[196px] border border-[#BDBDBD] text-[#525252] rounded-xl py-2 px-3 resize-none focus:outline-none focus:border-[#EA7913] flex-grow"
            />
          </div>

          {/* Upload Image */}
          <div>
            <label className="block text-lg mb-1.5">Upload Image</label>
            <div
              onClick={handleFileClick}
              className="border border-[#BDBDBD] rounded-xl h-[196px] flex items-center justify-center text-center text-sm text-[#888] cursor-pointer hover:border-[#EA7913] transition-all"
            >
              <div className="flex flex-col justify-center items-center text-[#525252]">
                <img src={galleryIconOrange} alt="Not Found" className="w-6 h-6" />
                <p className="font-medium pt-2.5">{imageName}</p>
                <p>Click Here to Change</p>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestimonialsEdit;
