import React, { useEffect, useRef, useState } from "react";
import { getTestimonialsUpdate, getAddTestimonials } from "../../services/testimonialsServices";
import toast from "react-hot-toast";
import UploadIcon from "../../assets/svg/UploadIcon.svg";
import SuccsessModel from "../component/SuccsessModel";

function TestimonialsEdit({ selectedUser, setSelectedUser, fetchTestimonials, onClose }) {
  const isEditMode = !!selectedUser?._id;
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    roleOrAddress: "",
    message: "",
  });
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isEditMode) {
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
    } else {
      setFormData({ name: "", roleOrAddress: "", message: "" });
      setImage(null);
    }
  }, [selectedUser, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateImage(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    validateImage(file);
  };

  const validateImage = (file) => {
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setImageName(file.name);
      setErrors((prev) => ({ ...prev, image: "" }));
    } else {
      setErrors((prev) => ({ ...prev, image: "Please upload a valid image." }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.roleOrAddress.trim())
      newErrors.roleOrAddress = "Post/Address is required.";
    if (!formData.message.trim()) newErrors.message = "Testimonial is required.";
    if (!isEditMode && !image)
      newErrors.image = "Image is required for new testimonials.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    if (onClose) onClose();
    else setSelectedUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditMode && !validateForm()) return;

    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append("name", formData.name);
      data.append("roleOrAddress", formData.roleOrAddress);
      data.append("message", formData.message);
      if (image) data.append("image", image);
      if (!isEditMode) {
        data.append("order", "1");
        data.append("isActive", "true");
      }

      const response = isEditMode
        ? await getTestimonialsUpdate(data, selectedUser._id)
        : await getAddTestimonials(data);

      toast.success(response?.message || (isEditMode ? "Updated!" : "Added!"));
      fetchTestimonials();
      if (isEditMode) {
        handleCancel()
      }

      if (!isEditMode) {
        setShowSuccess(true);
      }
    } catch (err) {
      console.error("Testimonial error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAFAFA] text-[#464646] flex flex-col gap-2 px-3">
      {/* Header */}
      <div className="py-3">
        <h2 className="text-[32px] font-Raleway Raleway-medium text-[#656565]">
          <span onClick={handleCancel} className="cursor-pointer">
            Testimonials
          </span>{" "}
          &gt;{" "}
          <span className="text-[#464646]">
            {isEditMode ? "Edit Testimonial" : "Add Testimonial"}
          </span>
        </h2>
        <p className="pt-1 text-[#656565]">{isEditMode ? "Edit and manage testimonials" : "Add and manage testimonials"}</p>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-6 space-y-8"
      >
        <h2 className="text-2xl text-[#656565] font-Raleway Raleway-medium">
          {isEditMode ? "Edit Testimonial" : "Add Testimonial"}
        </h2>

        <div className="grid lg:grid-cols-2 gap-y-3 gap-x-4.5">
          {/* Name */}
          <div>
            <label className="text-[#292929] block mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Client’s Name"
              className="w-full h-11 border border-[#BDBDBD] text-[#525252] rounded-2xl py-3 px-4 focus:outline-none focus:border-[#EA7913]"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Role/Address */}
          <div>
            <label className="text-[#292929] block mb-1">Post / Address</label>
            <input
              type="text"
              name="roleOrAddress"
              value={formData.roleOrAddress}
              onChange={handleChange}
              placeholder="Enter Client’s Post/Address"
              className="w-full h-11 border border-[#BDBDBD] text-[#525252] rounded-2xl py-3 px-4 focus:outline-none focus:border-[#EA7913]"
            />
            {errors.roleOrAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.roleOrAddress}</p>
            )}
          </div>

          {/* Testimonials */}
          <div className="md:col-span-1">
            <label className="text-[#292929] block mb-1">Testimonials</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              placeholder="Enter Client’s Testimonials "
              className="w-full h-[171px] border border-[#BDBDBD] text-[#525252] rounded-xl py-3 px-4 resize-none focus:outline-none focus:border-[#EA7913]"
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message}</p>
            )}
          </div>

          {/* Upload Image */}
          <div>
            <label className="text-[#292929] block mb-1">Upload Image</label>
            <div
              onClick={handleFileClick}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border border-dashed border-[#BDBDBD] rounded-xl h-[171px] py-3 px-4 flex items-center justify-center text-center text-sm text-[#888] cursor-pointer transition-all"
            >
              <div className="flex flex-col justify-center items-center text-[#525252]">
                <img src={UploadIcon} alt="Not Found" className="h-12 w-12" />
                <p className="font-medium pt-3">{imageName ? imageName : "Drag & drop file here or Choose file"}</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <div className={`flex items-center ${errors.image ? "justify-between" : "justify-end"}`}>
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image}</p>
              )}
              <p className="text-[#656565] text-xs pt-1 text-end">Max size : 25 MB</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 h-12">
          <button
            type="button"
            className="bg-[#FCEAC9] text-[#656565] px-6 py-3 rounded-full hover:bg-[#FCEAC2] cursor-pointer"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <div className="relative inline-block rounded-full p-[1px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:via-[#F39C2C] hover:to-[#F39C2C] active:from-[#EA7913] active:via-[#EA7913] active:to-[#EA7913]">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center items-center space-x-1.5 px-6 py-3 bg-[#EA7913] text-[#F8F8F8] rounded-full font-medium hover:cursor-pointer hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-base"
            >
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Adding..."
                : isEditMode
                  ? "Save"
                  : "Save"}
            </button>
          </div>
        </div>
      </form>

      {showSuccess && (
        <SuccsessModel
          onClose={() => {
            setShowSuccess(false);
            handleCancel();
          }}
          showSuccessTestimonails={showSuccess}
        />
      )}
    </div>
  );
}

export default TestimonialsEdit;




// ******************************************************  old code *************************************************

// import React, { useEffect, useRef, useState } from "react";
// import { getTestimonialsUpdate } from "../../services/testimonialsServices";
// import toast from "react-hot-toast";
// import galleryIconOrange from "../../assets/svg/galleryIconOrange.svg"

// function TestimonialsEdit({ selectedUser, setSelectedUser, fetchTestimonials }) {
//   const [formData, setFormData] = useState({
//     name: "",
//     roleOrAddress: "",
//     message: "",
//   });
//   const [imageName, setImageName] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null);
//   const fileInputRef = useRef(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     if (selectedUser) {
//       setFormData({
//         name: selectedUser.name || "",
//         roleOrAddress: selectedUser.roleOrAddress || "",
//         message: selectedUser.message || "",
//       });
//       setImageName(
//         selectedUser.imageUrl
//           ? selectedUser.imageUrl.split("/").pop()
//           : "No image"
//       );
//       setSelectedFile(null);
//     }
//   }, [selectedUser]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileClick = () => {
//     if (fileInputRef.current) fileInputRef.current.click();
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageName(file.name);
//       setSelectedFile(file);
//     }
//   };

//   const handleCancel = () => {
//     setSelectedUser(null)
//   };

//   const handleSubmit = async () => {
//     // Check if anything has changed
//     const hasChanged =
//       formData.name !== selectedUser.name ||
//       formData.roleOrAddress !== selectedUser.roleOrAddress ||
//       formData.message !== selectedUser.message ||
//       selectedFile !== null;

//     if (!hasChanged) {
//       toast.error("Please make a change before submitting.");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const data = new FormData();
//       data.append("name", formData.name);
//       data.append("roleOrAddress", formData.roleOrAddress);
//       data.append("message", formData.message);

//       if (selectedFile) {
//         data.append("image", selectedFile);
//       }

//       const result = await getTestimonialsUpdate(data, selectedUser._id);
//       setSelectedUser(null);
//       fetchTestimonials()
//       toast.success(result?.message)
//     } catch (error) {
//       console.error("Error updating testimonial:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="bg-[#FAFAFA] text-[#464646] flex flex-col gap-2 px-3">
//       {/* Header */}
//       <h2 className="pt-6 pb-4 text-2xl md:text-[32px] font-Raleway Raleway-medium">
//         <span onClick={handleCancel} className="cursor-pointer">Testimonials</span> &gt;{" "}
//         <span className="text-2xl">Edit Testimonials</span>
//       </h2>

//       {/* Form Container */}
//       <div className="bg-white border-t-2 border-t-[#EA7913] rounded-3xl p-5 space-y-5.5">
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//           <h2 className="text-2xl text-[#656565] font-Raleway Raleway-medium">Edit Testimonial</h2>
//           <div className="flex gap-3 w-full lg:w-auto">
//             <button
//               className="w-full lg:w-auto bg-[#FCEAC9] text-[#656565] px-6 py-2.5 rounded-full hover:bg-[#FCEAC2] cursor-pointer"
//               onClick={handleCancel}
//             >
//               Cancel
//             </button>
//             <div className="w-full relative inline-block rounded-full px-[4px] py-[3px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:via-[#F39C2C] hover:to-[#F39C2C] active:from-[#EA7913] active:via-[#EA7913] active:to-[#EA7913]">
//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 className="w-full h-full inline-flex justify-center items-center space-x-1.5 px-6 py-2.5 bg-[#EA7913] text-[#F8F8F8] rounded-full font-medium hover:cursor-pointer hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-base"
//               >
//                 {isSubmitting ? "Updating..." : "Update in website"}
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-y-2.5 gap-x-5">
//           {/* Name */}
//           <div>
//             <label className="block text-lg mb-1.5">Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full border border-[#BDBDBD] text-[#525252] rounded-xl py-2 px-3 focus:outline-none focus:border-[#EA7913]"
//             />
//           </div>

//           {/* Role/Address */}
//           <div>
//             <label className="block text-lg mb-1.5">Post / Address</label>
//             <input
//               type="text"
//               name="roleOrAddress"
//               value={formData.roleOrAddress}
//               onChange={handleChange}
//               className="w-full border border-[#BDBDBD] text-[#525252] rounded-xl py-2 px-3 focus:outline-none focus:border-[#EA7913]"
//             />
//           </div>

//           <div className="md:col-span-1">
//             <label className="block text-lg mb-1.5">Testimonials</label>
//             <textarea
//               name="message"
//               value={formData.message}
//               onChange={handleChange}
//               rows={6}
//               className="w-full h-[196px] border border-[#BDBDBD] text-[#525252] rounded-xl py-2 px-3 resize-none focus:outline-none focus:border-[#EA7913] flex-grow"
//             />
//           </div>

//           {/* Upload Image */}
//           <div>
//             <label className="block text-lg mb-1.5">Upload Image</label>
//             <div
//               onClick={handleFileClick}
//               className="border border-[#BDBDBD] rounded-xl h-[196px] flex items-center justify-center text-center text-sm text-[#888] cursor-pointer hover:border-[#EA7913] transition-all"
//             >
//               <div className="flex flex-col justify-center items-center text-[#525252]">
//                 <img src={galleryIconOrange} alt="Not Found" className="w-6 h-6" />
//                 <p className="font-medium pt-2.5">{imageName}</p>
//                 <p>Click Here to Change</p>
//               </div>
//             </div>
//             <input
//               type="file"
//               ref={fileInputRef}
//               className="hidden"
//               accept="image/*"
//               onChange={handleFileChange}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TestimonialsEdit;



