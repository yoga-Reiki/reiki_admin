import React from 'react';
import { MdOutlineClose } from "react-icons/md";

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
    onFileSelect
}) {
    const isEdit = mode === "edit";
    const isSubmitting = isEdit ? changingImageLoading : uploading;

    const getHelperText = () => {
        if (isEdit) {
            const filename = updatedFile
                ? updatedFile.name
                : (images[selectedImageIndex]?.imageUrl || '').split("/").pop();
            return (
                <>
                    <p className="text-sm text-[#525252] truncate">{filename}</p>
                    <p className="text-sm text-[#525252] truncate">Click Here to Change</p>
                </>
            );
        } else {
            // ✅ Add mode
            if (updatedFile) {
                return (
                    <>
                        <p className="text-sm text-[#525252] truncate">{updatedFile.name}</p>
                        <p className="text-sm text-[#525252] truncate">Click Here to Change</p>
                    </>
                );
            }
            return (
                <p className="text-sm text-[#525252]">
                    Click Here to Upload Image or Drag & Drop here
                </p>
            );
        }
    };


    return (
        <div>
            <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50 text-[#464646] p-6">
                <div className="bg-white w-full mx-4 sm:mx-6 md:mx-8 lg:mx-0 p-5 max-w-md md:max-w-lg lg:max-w-[625px] flex flex-col justify-between gap-5.5 border-t-2 border-t-[#EA7913] rounded-3xl">
                    <div className="flex justify-between items-center p-3">
                        <h2 className="text-[32px] font-Raleway Raleway-medium">
                            {isEdit ? "Change Image" : "Add Image"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-[#EA7913] border border-[#989898] cursor-pointer p-4 rounded-full"
                        >
                            <MdOutlineClose size={16} />
                        </button>
                    </div>

                    <div>
                        <h2 className="text-lg mb-2">
                            {isEdit ? "Upload New Image" : "Upload Image"}
                        </h2>

                        <div
                            className={`bg-white border ${isEdit && selectedImageIndex !== null ? "border-[#EA7913]" : "border-[#DCDCDC]"} rounded-xl h-44 flex items-center justify-center cursor-pointer overflow-hidden`}
                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                const file = e.dataTransfer.files?.[0];
                                if (file && onFileSelect) onFileSelect(file);
                            }}
                        >
                            <div className="flex flex-col items-center justify-center w-full h-full text-center px-2">
                                {getHelperText()}
                            </div>
                        </div>
                    </div>

                    <div className="w-full relative inline-block rounded-full px-[4px] py-[3px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:to-[#F39C2C]">
                        <button
                            type="button"
                            onClick={isEdit ? handleChangeImage : handleAddImage}
                            disabled={isSubmitting}
                            className="w-full py-2.5 bg-[#EA7913] text-white rounded-full font-medium hover:bg-[#F39C2C] cursor-pointer disabled:opacity-60"
                        >
                            {isSubmitting ? (isEdit ? "Changing..." : "Uploading...") : (isEdit ? "Change Image" : "Upload Image")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditGallery;
