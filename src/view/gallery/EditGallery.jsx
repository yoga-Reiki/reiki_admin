import React, { useState } from 'react';
import UploadIcon from "../../assets/svg/UploadIcon.svg"

function EditGallery({
    mode = "edit",
    updatedFile,
    changingImageLoading,
    uploading,
    images,
    selectedImageIndex,
    fileInputRef,
    onClose,
    handleChangeImage,
    handleAddImage,
}) {
    const [tempFile, setTempFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const isEdit = mode === "edit";
    const isSubmitting = isEdit ? changingImageLoading : uploading;

    const handleFileSelect = (file) => {
        setTempFile(file);
    };

    const getHelperText = () => {
        const fileToShow = tempFile || updatedFile;

        if (isEdit) {
            const filename = fileToShow
                ? fileToShow.name
                : (images[selectedImageIndex]?.imageUrl || '').split("/").pop();

            return (
                <div className='flex flex-col items-center gap-2'>
                    <img src={UploadIcon} alt='Not Found' className='h-12 w-12' />
                    <p className="text-sm text-[#525252] truncate">{filename}</p>
                    <p className="text-sm text-[#525252] truncate">
                        Drag & drop file here or <span className='underline'>Choose file</span>
                    </p>
                </div>
            );
        }

        if (fileToShow) {
            return (
                <div className='flex flex-col items-center gap-2'>
                    <img src={UploadIcon} alt='Not Found' className='h-12 w-12' />
                    <p className="text-sm text-[#525252] truncate">{fileToShow.name}</p>
                    <p className="text-sm text-[#525252] truncate">
                        Drag & drop file here or <span className='underline'>Choose file</span>
                    </p>
                </div>
            );
        }

        return (
            <div className='flex flex-col items-center gap-2'>
                <img src={UploadIcon} alt='Not Found' className='h-12 w-12' />
                <p className="text-sm text-[#525252]">
                    Click Here to Upload Image or Drag & Drop here
                </p>
            </div>
        );
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileSelect(file);
    };

    const handleConfirm = () => {
        if (isEdit) {
            handleChangeImage(tempFile || updatedFile);
        } else {
            handleAddImage(tempFile);
        }
    };

    return (
        <div>
            <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50 text-[#464646] p-6">
                <div className="bg-white w-full mx-4 sm:mx-6 md:mx-8 lg:mx-0 p-6 max-w-md md:max-w-lg lg:max-w-[500px] flex flex-col justify-between gap-12 rounded-3xl">

                    {/* Title */}
                    <div className='text-center space-y-2'>
                        <h2 className="text-[32px] leading-[40px] font-Raleway Raleway-medium text-[#3D3D3D]">
                            {isEdit ? "Change Image" : "Add Image"}
                        </h2>
                        <p className='text-[#525252] leading-[24px] text-lg'>
                            {isEdit ? "Upload image in below input to change the image." : "Upload image in below input to Add the image."}
                        </p>
                    </div>

                    {/* Drop Zone */}
                    <div>
                        <h2 className="mb-1">Upload file</h2>
                        <div
                            className={`border-2 border-dashed rounded-xl h-51.5 flex items-center justify-center cursor-pointer overflow-hidden transition 
                            ${isDragging ? "border-[#EA7913] bg-orange-50" : "border-[#BDBDBD] bg-white"}`}
                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnter={() => setIsDragging(true)}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                        >
                            <div className="flex flex-col items-center justify-center w-full h-full text-center px-2">
                                {getHelperText()}
                            </div>
                        </div>
                        <p className='text-xs text-[#656565] text-end pt-1'>Max size : 25 MB</p>
                    </div>

                    {/* Buttons */}
                    <div className='flex gap-2 h-12'>
                        <button
                            onClick={onClose}
                            className='bg-[#FCEAC9] text-[#111111] text-lg py-3 w-full rounded-full cursor-pointer'>
                            Cancel
                        </button>
                        <div className="w-full h-full relative inline-block rounded-full p-[1px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:to-[#F39C2C]">
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={isSubmitting}
                                className="w-full py-3 bg-[#EA7913] text-white rounded-full font-medium hover:bg-[#F39C2C] cursor-pointer disabled:opacity-60"
                            >
                                {isSubmitting
                                    ? (isEdit ? "Changing..." : "Uploading...")
                                    : (isEdit ? "Confirm to Change" : "Upload Image")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditGallery;
