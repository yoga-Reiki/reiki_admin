import React, { useEffect, useState } from "react";
import { getAboutUsUpdate } from "../../services/aboutServices";
import editIconGrey from "../../assets/svg/editIconGrey.svg";
import UploadIcon from "../../assets/svg/UploadIcon.svg";
import toast from "react-hot-toast";

const DropImage = ({ onDropFile, inputId, file, setErrors, isEditing }) => {
    const handleFile = (file) => {
        if (!isEditing) return;
        onDropFile(file);
        if (setErrors) {
            setErrors((prev) => ({ ...prev, [inputId]: "" }));
        }
    };

    return (
        <div>
            <div
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={(e) => e.preventDefault()} 
                onDrop={(e) => {
                    e.preventDefault();
                    const droppedFile = e.dataTransfer.files[0];
                    if (droppedFile) handleFile(droppedFile);
                }}
                className="flex items-center justify-center h-[175.75px] border-2 border-dashed border-[#DCDCDC] text-[#525252] rounded-xl text-center cursor-pointer focus:outline-none focus:ring-0 transition-all"
            >
                <label
                    className="w-full h-full flex flex-col items-center justify-center gap-3 px-12"
                    htmlFor={inputId}
                >
                    <img src={UploadIcon} alt="Not Found" className="h-12 w-12" />
                    {file ? (
                        typeof file === "string" ? (
                            <div className="flex flex-col items-center gap-1">
                                <p className={`${isEditing ? "text-[#525252]" : "text-[#989898]"}`}>
                                    {file.split("/").pop()}
                                </p>
                                {isEditing && (
                                    <p className="text-sm text-[#525252] truncate">
                                        Drag & drop file here or <span className="underline">Choose file</span>
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-sm text-[#525252] truncate">{file.name}</p>
                                <p className="text-sm text-[#525252] truncate">
                                    Drag & drop file here or <span className="underline">Choose file</span>
                                </p>
                            </div>
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
                    disabled={!isEditing}
                    onChange={(e) => handleFile(e.target.files[0])}
                />
            </div>
        </div>
    );
};

function EditAboutUs({ onCancel, aboutData, fetchAboutData }) {
    // Saved state (server data)
    const [visionContent, setVisionContent] = useState("");
    const [missionContent, setMissionContent] = useState("");
    const [heroContent, setHeroContent] = useState("");
    const [visionImage, setVisionImage] = useState(null);
    const [missionImage, setMissionImage] = useState(null);
    const [heroImage, setHeroImage] = useState(null);

    // Temporary edit state (only used in editing mode)
    const [tempVisionContent, setTempVisionContent] = useState("");
    const [tempMissionContent, setTempMissionContent] = useState("");
    const [tempHeroContent, setTempHeroContent] = useState("");
    const [tempVisionImage, setTempVisionImage] = useState(null);
    const [tempMissionImage, setTempMissionImage] = useState(null);
    const [tempHeroImage, setTempHeroImage] = useState(null);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

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

    const startEditing = () => {
        setTempVisionContent(visionContent);
        setTempMissionContent(missionContent);
        setTempHeroContent(heroContent);
        setTempVisionImage(visionImage);
        setTempMissionImage(missionImage);
        setTempHeroImage(heroImage);
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setErrors({});
        onCancel();
    };

    const validateForm = () => {
        const newErrors = {};
        if (!tempVisionContent.trim()) newErrors.visionContent = "Vision content is required.";
        if (!tempMissionContent.trim()) newErrors.missionContent = "Mission content is required.";
        if (!tempHeroContent.trim()) newErrors.heroContent = "Hero content is required.";
        if (!tempVisionImage) newErrors.visionImage = "Vision image is required.";
        if (!tempMissionImage) newErrors.missionImage = "Mission image is required.";
        if (!tempHeroImage) newErrors.heroImage = "Hero image is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        const isUnchanged =
            tempVisionContent === visionContent &&
            tempMissionContent === missionContent &&
            tempHeroContent === heroContent &&
            tempVisionImage === visionImage &&
            tempMissionImage === missionImage &&
            tempHeroImage === heroImage;

        if (isUnchanged) {
            toast.error("No changes detected.");
            return; // ✅ Don't exit editing mode
        }

        if (!validateForm()) return;

        const formData = new FormData();
        formData.append("visionContent", tempVisionContent);
        formData.append("missionContent", tempMissionContent);
        formData.append("heroContent", tempHeroContent);
        formData.append("visionImage", tempVisionImage);
        formData.append("missionImage", tempMissionImage);
        formData.append("heroImage", tempHeroImage);

        setLoading(true);
        try {
            await getAboutUsUpdate(formData);
            toast.success("About Us content updated successfully!");

            // ✅ Save changes permanently
            setVisionContent(tempVisionContent);
            setMissionContent(tempMissionContent);
            setHeroContent(tempHeroContent);
            setVisionImage(tempVisionImage);
            setMissionImage(tempMissionImage);
            setHeroImage(tempHeroImage);

            fetchAboutData();
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update About Us. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-[#464646] space-y-2">
            <div className="px-3">
                <div className="bg-white rounded-b-3xl rounded-r-3xl w-full p-6 space-y-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl text-[#656565] font-Raleway Raleway-medium">
                            About Us Hero Section
                        </h2>

                        {!isEditing ? (
                            <button
                                className="flex text-sm items-center gap-2.5 py-2 px-4 text-[#656565] rounded-full border border-[#F9D38E] cursor-pointer"
                                onClick={startEditing}
                            >
                                <img src={editIconGrey} alt="Edit" className="p-[3px]" />
                                <span>Edit</span>
                            </button>
                        ) : null}
                    </div>

                    <div>
                        {/* Vision + Mission Content */}
                        <div className="grid md:grid-cols-2 gap-4.5 mb-4">
                            <div>
                                <label className="text-[#292929] block mb-1">Vision Content</label>
                                <textarea
                                    className={`w-full h-34.5 rounded-xl px-4 py-3 resize-none border-[1px] border-[#DCDCDC] ${isEditing ? "text-[#525252] focus:border-[#EA7913]" : "text-[#989898]"
                                        } focus:outline-none focus:ring-0`}
                                    rows={5}
                                    value={isEditing ? tempVisionContent : visionContent}
                                    onChange={(e) => {
                                        if (isEditing) {
                                            setTempVisionContent(e.target.value);
                                            setErrors((prev) => ({ ...prev, visionContent: "" }));
                                        }
                                    }}
                                    readOnly={!isEditing}
                                    placeholder="Enter vision content"
                                />
                                {errors.visionContent && <p className="text-red-500 text-sm">{errors.visionContent}</p>}
                            </div>
                            <div>
                                <label className="text-[#292929] block mb-1">Mission Content</label>
                                <textarea
                                    className={`w-full h-34.5 rounded-xl px-4 py-3 resize-none border-[1px] border-[#DCDCDC] ${isEditing ? "text-[#525252] focus:border-[#EA7913]" : "text-[#989898]"
                                        } focus:outline-none focus:ring-0`}
                                    rows={2}
                                    value={isEditing ? tempMissionContent : missionContent}
                                    onChange={(e) => {
                                        if (isEditing) {
                                            setTempMissionContent(e.target.value);
                                            setErrors((prev) => ({ ...prev, missionContent: "" }));
                                        }
                                    }}
                                    placeholder="Enter mission content"
                                    readOnly={!isEditing}
                                />
                                {errors.missionContent && <p className="text-red-500 text-sm">{errors.missionContent}</p>}
                            </div>
                        </div>

                        {/* Vision + Mission Images */}
                        <div className="grid md:grid-cols-2 gap-4.5 mb-4">
                            <div>
                                <label className="text-[#292929] block mb-1">Vision Image</label>
                                <DropImage
                                    onDropFile={isEditing ? setTempVisionImage : () => {}}
                                    inputId="visionImage"
                                    file={isEditing ? tempVisionImage : visionImage}
                                    error={errors.visionImage}
                                    setErrors={setErrors}
                                    isEditing={isEditing}
                                />
                                <div className={`pt-1 flex ${errors.visionImage ? "justify-between" : "justify-end"} `}>
                                    {errors.visionImage && <p className="text-red-500 text-sm">{errors.visionImage}</p>}
                                    <p className="text-[#656565] text-xs">Max size : 25 MB</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-[#292929] block mb-1">Mission Image</label>
                                <DropImage
                                    onDropFile={isEditing ? setTempMissionImage : () => {}}
                                    inputId="missionImage"
                                    file={isEditing ? tempMissionImage : missionImage}
                                    error={errors.missionImage}
                                    setErrors={setErrors}
                                    isEditing={isEditing}
                                />
                                <div className={`pt-1 flex ${errors.missionImage ? "justify-between" : "justify-end"} `}>
                                    {errors.missionImage && <p className="text-red-500 text-sm">{errors.missionImage}</p>}
                                    <p className="text-[#656565] text-xs">Max size : 25 MB</p>
                                </div>
                            </div>
                        </div>

                        {/* Hero Section */}
                        <div className="grid md:grid-cols-2 gap-4.5">
                            <div>
                                <label className="text-[#292929] block mb-1">Hero Section Content</label>
                                <textarea
                                    className={`w-full h-43 rounded-xl px-4 py-3 resize-none border-[1px] border-[#DCDCDC] ${isEditing ? "text-[#525252] focus:border-[#EA7913]" : "text-[#989898]"
                                        } focus:outline-none focus:ring-0`}
                                    rows={3}
                                    value={isEditing ? tempHeroContent : heroContent}
                                    onChange={(e) => {
                                        if (isEditing) {
                                            setTempHeroContent(e.target.value);
                                            setErrors((prev) => ({ ...prev, heroContent: "" }));
                                        }
                                    }}
                                    placeholder="Enter content for hero section"
                                    readOnly={!isEditing}
                                />
                                {errors.heroContent && <p className="text-red-500 text-sm">{errors.heroContent}</p>}
                            </div>
                            <div>
                                <label className="text-[#292929] block mb-1">Hero Image</label>
                                <DropImage
                                    onDropFile={isEditing ? setTempHeroImage : () => {}}
                                    inputId="heroImage"
                                    file={isEditing ? tempHeroImage : heroImage}
                                    error={errors.heroImage}
                                    setErrors={setErrors}
                                    isEditing={isEditing}
                                />
                                <div className={`pt-1 flex ${errors.heroImage ? "justify-between" : "justify-end"} `}>
                                    {errors.heroImage && <p className="text-red-500 text-sm">{errors.heroImage}</p>}
                                    <p className="text-[#656565] text-xs">Max size : 25 MB</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="flex justify-end gap-2">
                            <button
                                className="bg-[#FEF8EC] border border-[#F9D38E] text-[#656565] px-6 py-2.5 rounded-full cursor-pointer"
                                onClick={cancelEditing}
                            >
                                Cancel
                            </button>
                            <div className="relative inline-block rounded-full p-[1px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900]">
                                <button
                                    onClick={handleSubmit}
                                    type="submit"
                                    className="inline-flex justify-center items-center space-x-1.5 px-6 py-3 bg-[#EA7913] text-[#F8F8F8] rounded-full font-medium hover:cursor-pointer hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-base"
                                >
                                    {loading ? "Updating..." : "Save"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EditAboutUs;
