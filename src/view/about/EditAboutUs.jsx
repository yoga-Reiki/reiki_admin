import React, { useEffect, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { getAboutUsUpdate } from "../../services/aboutServices";
import toast from "react-hot-toast";

const DropImage = ({ onDropFile, inputId, file, error, setErrors }) => {
    const handleFile = (file) => {
        onDropFile(file);
        if (setErrors) {
            setErrors((prev) => ({ ...prev, [inputId]: "" }));
        }
    };

    return (
        <div>
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('border-dashed', 'border-[#EA7913]', 'bg-[#FEF8EC]');
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-dashed', 'border-[#EA7913]', 'bg-[#FEF8EC]');
                }}
                onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-dashed', 'border-[#EA7913]', 'bg-[#FEF8EC]');
                    const droppedFile = e.dataTransfer.files[0];
                    if (droppedFile) handleFile(droppedFile);
                }}
                className="flex items-center justify-center h-[153px] border border-[#DCDCDC] text-[#525252] rounded-xl text-center cursor-pointer focus:outline-none focus:ring-0 focus:border-[#EA7913] transition-all bg-[#FCFCFC]"
            >
                <label
                    className="w-full h-full flex flex-col items-center justify-center gap-2 px-12"
                    htmlFor={inputId}
                >
                    <FiUploadCloud size={20} className="text-[#EA7913]" />
                    {file ? (
                        typeof file === "string" ? (
                            <p className="text-[#525252]">
                                {file.split("/").pop()}
                            </p>
                        ) : (
                            <p className="text-[#525252]">{file.name}</p>
                        )
                    ) : (
                        <span className="text-[#525252]">
                            Click Here to Upload Image or Drag & drop here
                        </span>
                    )}

                </label>
                <input
                    type="file"
                    id={inputId}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files[0])}
                />
            </div>
        </div>
    );
};

function EditAboutUs({ onCancel, aboutData, fetchAboutData }) {
    const [visionContent, setVisionContent] = useState("");
    const [missionContent, setMissionContent] = useState("");
    const [heroContent, setHeroContent] = useState("");
    const [visionImage, setVisionImage] = useState(null);
    const [missionImage, setMissionImage] = useState(null);
    const [heroImage, setHeroImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (aboutData) {
            setVisionContent(aboutData.visionContent || "");
            setMissionContent(aboutData.missionContent || "");
            setHeroContent(aboutData.heroContent || "");
            setVisionImage(aboutData.visionImageUrl || null);
            setMissionImage(aboutData.missionImageUrl || null);
            setHeroImage(aboutData.heroImageUrl || null);
        }
    }, [aboutData]);


    const validateForm = () => {
        const newErrors = {};
        if (!visionContent.trim()) newErrors.visionContent = "Vision content is required.";
        if (!missionContent.trim()) newErrors.missionContent = "Mission content is required.";
        if (!heroContent.trim()) newErrors.heroContent = "Hero content is required.";
        if (!visionImage) newErrors.visionImage = "Vision image is required.";
        if (!missionImage) newErrors.missionImage = "Mission image is required.";
        if (!heroImage) newErrors.heroImage = "Hero image is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        // Check if any value changed
        const isUnchanged =
            visionContent === (aboutData?.visionContent || "") &&
            missionContent === (aboutData?.missionContent || "") &&
            heroContent === (aboutData?.heroContent || "") &&
            (visionImage === (aboutData?.visionImageUrl || null) ||
                (visionImage && typeof visionImage !== "string" && aboutData?.visionImageUrl)) &&
            (missionImage === (aboutData?.missionImageUrl || null) ||
                (missionImage && typeof missionImage !== "string" && aboutData?.missionImageUrl)) &&
            (heroImage === (aboutData?.heroImageUrl || null) ||
                (heroImage && typeof heroImage !== "string" && aboutData?.heroImageUrl));

        if (isUnchanged) {
            toast.error("No changes detected.");
            return;
        }

        if (!validateForm()) return;

        const formData = new FormData();
        formData.append("visionContent", visionContent);
        formData.append("missionContent", missionContent);
        formData.append("heroContent", heroContent);
        formData.append("visionImage", visionImage);
        formData.append("missionImage", missionImage);
        formData.append("heroImage", heroImage);

        setLoading(true);
        try {
            await getAboutUsUpdate(formData);
            toast.success("About Us content updated successfully!");
            fetchAboutData();
            onCancel()
        } catch (err) {
            console.error(err);
            alert("Failed to update About Us. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="text-[#464646] space-y-2">
            {/* Header */}
            <div className="p-3">
                <h1 className="text-[32px] font-Raleway Raleway-medium">About Us</h1>
                <p className="text-[#656565] pt-1">Change Content and Image of About Us Page</p>
            </div>

            {/* Form Box */}
            <div className="p-3">
                <div className="bg-white border-t border-t-[#EA7913] rounded-3xl w-full p-2.5 space-y-5.5">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <h2 className="text-2xl text-[#656565] font-Raleway Raleway-medium">About Us Hero Section</h2>
                        <div className="flex gap-2 md:w-full lg:w-auto">
                            <button
                                className="w-full lg:w-auto bg-[#FCEAC9] text-[#656565] px-6 py-2.5 rounded-full hover:bg-[#FCEAC2] cursor-pointer"
                                onClick={onCancel}
                            >
                                Cancel
                            </button>
                            <div className="w-full relative inline-block rounded-full px-[5px] py-[2.5px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:via-[#F39C2C] hover:to-[#F39C2C] active:from-[#EA7913] active:via-[#EA7913] active:to-[#EA7913]">
                                <button onClick={handleSubmit}
                                    type="submit"
                                    className="w-full h-full inline-flex justify-center items-center space-x-1.5 px-6 py-2.5 bg-[#EA7913] text-[#F8F8F8] rounded-full font-medium hover:cursor-pointer hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-base"
                                >
                                    {loading ? "Updating..." : "Change in Website"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Vision + Mission Content */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-lg font-medium block mb-2">Vision Content</label>
                            <textarea
                                className="w-full rounded-xl px-4.5 py-3 resize-none border-[1px] border-[#DCDCDC] text-[#525252] text-[#525252] focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                rows={2}
                                value={visionContent}
                                onChange={(e) => {
                                    setVisionContent(e.target.value);
                                    setErrors(prev => ({ ...prev, visionContent: "" }));
                                }}
                                placeholder="Enter vision content"
                            />
                            {errors.visionContent && <p className="text-red-500 text-sm">{errors.visionContent}</p>}
                        </div>
                        <div>
                            <label className="text-lg font-medium block mb-2">Mission Content</label>
                            <textarea
                                className="w-full rounded-xl px-4.5 py-3 resize-none border-[1px] border-[#DCDCDC] text-[#525252] focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                rows={2}
                                value={missionContent}
                                onChange={(e) => {
                                    setMissionContent(e.target.value);
                                    setErrors(prev => ({ ...prev, missionContent: "" }));
                                }}
                                placeholder="Enter mission content"
                            />
                            {errors.missionContent && <p className="text-red-500 text-sm">{errors.missionContent}</p>}
                        </div>
                    </div>

                    {/* Vision + Mission Images */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-lg font-medium block mb-2">Vision Image</label>
                            <DropImage
                                onDropFile={setVisionImage}
                                inputId="visionImage"
                                file={visionImage}
                                error={errors.visionImage}
                                setErrors={setErrors}
                            />
                            {errors.visionImage && <p className="text-red-500 text-sm">{errors.visionImage}</p>}
                        </div>
                        <div>
                            <label className="text-lg font-medium block mb-2">Mission Image</label>
                            <DropImage
                                onDropFile={setMissionImage}
                                inputId="missionImage"
                                file={missionImage}
                                error={errors.missionImage}
                                setErrors={setErrors}
                            />
                            {errors.missionImage && <p className="text-red-500 text-sm">{errors.missionImage}</p>}
                        </div>
                    </div>

                    {/* Hero Section */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-lg font-medium block mb-2">Hero Section Content</label>
                            <textarea
                                className="w-full h-[153px] rounded-xl px-4.5 py-3 resize-none border-[1px] border-[#DCDCDC] text-[#525252] focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                rows={3}
                                value={heroContent}
                                onChange={(e) => {
                                    setHeroContent(e.target.value);
                                    setErrors(prev => ({ ...prev, heroContent: "" }));
                                }}
                                placeholder="Enter content for hero section"
                            />
                            {errors.heroContent && <p className="text-red-500 text-sm">{errors.heroContent}</p>}
                        </div>
                        <div>
                            <label className="text-lg font-medium block mb-2">Hero Image</label>
                            <DropImage
                                onDropFile={setHeroImage}
                                inputId="heroImage"
                                file={heroImage}
                                error={errors.heroImage}
                                setErrors={setErrors}
                            />
                            {errors.heroImage && <p className="text-red-500 text-sm">{errors.heroImage}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditAboutUs;
