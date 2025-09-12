import React, { useState, useRef, useEffect } from 'react';
import addIconBlack from "../../assets/svg/addIconBlack.svg";
import deletIconBlack from "../../assets/svg/deletIconBlack.svg";
import DeleteModel from '../component/DeleteModel';
import { getAddGalleryImg, getAllGalleryImg, getGalleryImgDelete, getUpdateGalleryImg } from '../../services/galleryServices';
import toast from 'react-hot-toast';

function Gallery() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [draggedItem, setDraggedItem] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const fileInputRef = useRef(null);
    const hasFetched = useRef(false);
    const [galleyImgDelete, setGalleyImgDelete] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [updatedFile, setUpdatedFile] = useState(null);

    const [uploading, setUploading] = useState(false);
    const [changingImageLoading, setchangingImageLoading] = useState(false);

    useEffect(() => {
        async function fetchImages() {
            try {
                setLoading(true);
                const response = await getAllGalleryImg();
                toast.success(response?.message);
                setImages(response?.data?.items || []);
            } catch (error) {
                console.error("Failed to fetch gallery images", error);
            } finally {
                setLoading(false);
            }
        }

        if (!hasFetched.current) {
            fetchImages();
            hasFetched.current = true;
        }
    }, []);

    useEffect(() => {
        const updateImage = async () => {
            if (!updatedFile || selectedImageIndex === null) return;
            setchangingImageLoading(true);
            const selectedImage = images[selectedImageIndex];
            const imageId = selectedImage._id;
            if (!imageId) return;

            const formData = new FormData();
            formData.append("image", updatedFile);

            try {
                const response = await getUpdateGalleryImg(formData, imageId);
                toast.success(response.message || "Image updated successfully!");

                const refreshed = await getAllGalleryImg();
                setImages(refreshed?.data?.items || []);
            } catch (error) {
                toast.error("Failed to update image.");
                console.error(error);
            } finally {
                setUpdatedFile(null);
                setchangingImageLoading(false);
            }
        };

        updateImage();
    }, [updatedFile]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const imageUrl = URL.createObjectURL(file);

        if (selectedImageIndex !== null && images[selectedImageIndex]?._id) {
            // Replace the image at selected index
            const updatedImages = [...images];
            updatedImages[selectedImageIndex].imageUrl = imageUrl;
            setImages(updatedImages);
            setUpdatedFile(file);
        } else {
            // Add as new temp image
            const tempImage = { _id: null, imageUrl };
            setImages(prev => [...prev, tempImage]);
            setUploadedFiles(prev => [...prev, file]);
        }
    };

    const handleUploadToWebsite = async () => {
        if (uploadedFiles.length === 0) {
            toast.error("No new images to upload.");
            return;
        }
        setUploading(true);
        const formData = new FormData();
        uploadedFiles.forEach(file => formData.append("images", file));

        try {
            const res = await getAddGalleryImg(formData);
            toast.success(res?.message || "Images uploaded successfully!");

            const refreshed = await getAllGalleryImg();
            setImages(refreshed?.data?.items || []);
            setUploadedFiles([]);
        } catch (error) {
            toast.error("Image upload failed.");
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const confirmDelete = async () => {
        if (!galleyImgDelete || !galleyImgDelete._id) return;

        try {
            const response = await getGalleryImgDelete(galleyImgDelete._id);
            setImages(prev => prev.filter(img => img._id !== galleyImgDelete._id));
            toast.success(response.message);
            setGalleyImgDelete(null);
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    return (
        <div className="text-[#464646] flex flex-col gap-2">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-3">
                <div>
                    <h1 className="text-[32px] font-Raleway">Gallery</h1>
                    <p className="text-[#656565] pt-1">Manage Your Gallery</p>
                </div>
                <button
                    className="bg-[#EA7913] flex items-center space-x-2 hover:bg-[#F39C2C] text-white px-6 py-3 rounded-full cursor-pointer"
                    onClick={handleUploadToWebsite}
                    disabled={uploadedFiles.length === 0 || uploading }
                >
                    {uploading  ? "Uploading..." : "Upload in Website"}
                </button>
            </div>

            {/* Grid and Upload Box */}
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-2">
                <div className="w-full lg:w-1/2 grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 flex-1 lg:p-3 xl:p-5">
                    {loading ? (
                        // Simple Skeleton placeholders: 6 blocks with pulse animation
                        Array(6).fill(0).map((_, i) => (
                            <div
                                key={i}
                                className="w-full h-48 md:h-60 lg:h-72 rounded-3xl bg-gray-300 animate-pulse"
                            />
                        ))
                    ) : (
                        images.map((img, index) => (
                            <div
                                key={img._id || index}
                                className={`overflow-hidden rounded-3xl border-2 ${selectedImageIndex === index ? "border-[#EA7913] p-0.5" : "border-transparent"
                                    } transition`}
                                draggable
                                onClick={() => setSelectedImageIndex(index)}
                                onDragStart={(e) => {
                                    setDraggedItem(index);
                                    e.dataTransfer.effectAllowed = "move";
                                }}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.dataTransfer.dropEffect = "move";
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    if (draggedItem !== null && draggedItem !== index) {
                                        const newImages = [...images];
                                        const draggedImage = newImages[draggedItem];
                                        newImages.splice(draggedItem, 1);
                                        newImages.splice(index, 0, draggedImage);
                                        setImages(newImages);
                                        setDraggedItem(null);
                                    }
                                }}
                            >
                                <img
                                    src={img.imageUrl}
                                    alt={`Gallery ${index + 1}`}
                                    className={`w-full h-48 md:h-60 lg:h-72 ${selectedImageIndex === index ? "rounded-3xl" : ""
                                        } object-cover cursor-pointer`}
                                />
                            </div>
                        ))
                    )}

                    {/* Upload Box */}
                    <div
                        className="w-full h-48 md:h-60 lg:h-72 rounded-3xl bg-[#FEF8EC] flex items-center justify-center cursor-pointer transition"
                        onClick={() => fileInputRef.current.click()}
                    >
                        <img src={addIconBlack} alt="Add" />
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    </div>
                </div>

                {/* Right side panel */}
                <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col gap-6">
                    <div>
                        <h2 className="text-lg mb-2">Upload Image</h2>
                        <div
                            className={`bg-white border ${selectedImageIndex !== null ? "border-[#EA7913]" : "border-[#DCDCDC]"
                                } rounded-xl h-48 flex items-center justify-center overflow-hidden`}
                        >
                            {selectedImageIndex !== null ? (
                                <div className="flex flex-col items-center justify-center w-full h-full text-center px-2">
                                    <p className="text-sm text-[#525252] truncate">
                                        {updatedFile
                                            ? updatedFile.name
                                            : images[selectedImageIndex]?.imageUrl.split("/").pop()}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-[#525252] text-center px-4">
                                    <p>Select Image to Change</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {selectedImageIndex !== null && (
                        <div className="flex justify-center gap-3">
                            <button
                                className="w-full bg-[#FCEAC9] text-[#656565] px-4 py-2 rounded-full flex justify-center gap-2 items-center cursor-pointer"
                                onClick={() => setGalleyImgDelete(images[selectedImageIndex])}
                            >
                                <img src={deletIconBlack} alt="Delete" />
                                Delete
                            </button>
                            <div className="w-full relative inline-block rounded-full px-[4px] py-[3px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:to-[#F39C2C]">
                                <button
                                    type="submit"
                                    onClick={() => fileInputRef.current.click()}
                                    disabled={changingImageLoading }
                                    className="w-full py-2.5 bg-[#EA7913] text-white rounded-full font-medium hover:bg-[#F39C2C] disabled:opacity-60"
                                >
                                    {changingImageLoading  ? "Changing..." : "Change Image"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {galleyImgDelete && (
                <DeleteModel
                    onCancelImg={() => setGalleyImgDelete(null)}
                    onfirmGalleryImgDelete={confirmDelete}
                />
            )}
        </div>
    );
}

export default Gallery;
