import React, { useState, useRef, useEffect } from 'react';
import addIconBlack from "../../assets/svg/addIconBlack.svg";
import DeleteModel from '../component/DeleteModel';
import { getAddGalleryImg, getAllGalleryImg, getGalleryImgDelete, getUpdateGalleryImg } from '../../services/galleryServices';
import toast from 'react-hot-toast';
import CameraIcon from "../../assets/svg/CameraIcon.svg";
import EditGallery from './EditGallery';
import DotMenuIcon from "../../assets/svg/3DotMenuIcon.svg";
import deleteIconGrey from "../../assets/svg/deleteIconGrey.svg";

function Gallery() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [draggedItem, setDraggedItem] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const fileInputRef = useRef(null);
    const hasFetched = useRef(false);
    const [galleyImgDelete, setGalleyImgDelete] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]); // for batch/new uploads
    const [updatedFile, setUpdatedFile] = useState(null); // last selected file (used for edit/add modal)
    const [showChangeModal, setShowChangeModal] = useState(null); // null | 'edit' | 'add'
    const [uploading, setUploading] = useState(false);
    const [changingImageLoading, setChangingImageLoading] = useState(false);
    const [showMenuIndex, setShowMenuIndex] = useState(null);

    useEffect(() => {
        if (!hasFetched.current) {
            fetchImages();
            hasFetched.current = true;
        }
    }, []);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const response = await getAllGalleryImg();
            if (response?.message) toast.success(response.message);
            setImages(response?.data?.items || []);
        } catch (error) {
            console.error("Failed to fetch gallery images", error);
        } finally {
            setLoading(false);
        }
    }

    const handleImageFile = (file) => {
        if (!file) return;
        const imageUrl = URL.createObjectURL(file);

        setUpdatedFile(file);

        if (selectedImageIndex !== null && images[selectedImageIndex]?._id) {
            const updatedImages = [...images];
            updatedImages[selectedImageIndex].imageUrl = imageUrl;
            setImages(updatedImages);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        handleImageFile(file);
        e.target.value = '';
    };

    const handleChangeImage = async () => {
        if (!updatedFile || selectedImageIndex === null) {
            toast.error("Please select a new image.");
            return;
        }

        setChangingImageLoading(true);
        const selectedImage = images[selectedImageIndex];
        const imageId = selectedImage?._id;
        if (!imageId) {
            toast.error("Cannot update a temporary image. Use Upload instead.");
            setChangingImageLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("image", updatedFile);

        try {
            const response = await getUpdateGalleryImg(formData, imageId);
            toast.success(response?.message || "Image updated successfully!");
            const refreshed = await getAllGalleryImg();
            setImages(refreshed?.data?.items || []);
            setShowChangeModal(null);
        } catch (error) {
            toast.error("Failed to update image.");
            console.error(error);
        } finally {
            setUpdatedFile(null);
            setChangingImageLoading(false);
        }
    };

    const handleAddImage = async () => {
        if (!updatedFile) {
            toast.error("Please select an image to upload.");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("images", updatedFile);

        try {
            const res = await getAddGalleryImg(formData);
            toast.success(res?.message || "Image uploaded successfully!");

            if (res?.data?.items?.length) {
                setImages(prev => [...prev, ...res.data.items]);
            } else {
                const refreshed = await getAllGalleryImg();
                setImages(refreshed?.data?.items || []);
            }

            setUploadedFiles([]);
            setUpdatedFile(null);
            setShowChangeModal(null);
            fetchImages()
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
            {/* Hidden file input (shared) */}
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageUpload}
            />

            {/* Header */}
            {/* <div > */}
            <div className="p-3">
                <h1 className="text-[32px] font-Raleway">Gallery</h1>
                <p className="text-[#656565] pt-1">Manage Your Gallery</p>
            </div>
            {/* <button
                    className="bg-[#EA7913] flex items-center space-x-2 hover:bg-[#F39C2C] text-white px-6 py-3 rounded-full cursor-pointer"
                    onClick={handleUploadToWebsite}
                    disabled={uploadedFiles.length === 0 || uploading}
                >
                    {uploading ? "Uploading..." : "Upload in Website"}
                </button> */}
            {/* </div> */}

            {/* Grid and Upload Box */}
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-2">
                <div className="w-full lg:w-1/2 grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 flex-1 lg:p-3 xl:p-5">
                    {loading ? (
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
                                className="relative overflow-hidden rounded-3xl border border-transparent transition group"
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
                                    className="w-full h-48 md:h-60 lg:h-72 object-cover rounded-3xl"
                                />

                                {/* 3-dot menu */}
                                <div className="absolute top-4 right-4 z-10">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowMenuIndex(showMenuIndex === index ? null : index);
                                        }}
                                        className="p-2 bg-white rounded-full border border-[#FCEAC9] cursor-pointer"
                                    >
                                        <img src={DotMenuIcon} alt="Options" />
                                    </button>

                                    {showMenuIndex === index && (
                                        <div className="absolute space-y-3 right-0 mt-2 w-50 bg-white rounded-3xl p-4.5 cursor-pointer border border-[#BDBDBD] z-20">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedImageIndex(index);
                                                    setUpdatedFile(null); // reset any previous selection
                                                    setShowChangeModal('edit'); // open modal in edit mode
                                                    setShowMenuIndex(null);
                                                }}
                                                className="flex items-center gap-2.5 w-full rounded-xl p-3 text-left cursor-pointer text-sm hover:bg-[#FEF8EC]"
                                            >
                                                <img src={CameraIcon} alt="CameraIcon Not Found" />
                                                <p>Change Image</p>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setGalleyImgDelete(img);
                                                    setShowMenuIndex(null);
                                                }}
                                                className="flex items-center gap-2.5 w-full rounded-xl p-3 text-left text-sm hover:bg-[#FEF8EC]"
                                            >
                                                <img src={deleteIconGrey} alt="deleteIcon Not Found" />
                                                <p>Delete Image</p>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}

                    {/* Upload Box (opens modal in add mode) */}
                    <div
                        className="w-full h-48 md:h-60 lg:h-72 rounded-3xl bg-[#FEF8EC] flex items-center justify-center cursor-pointer transition"
                        onClick={() => {
                            setSelectedImageIndex(null);
                            setUpdatedFile(null);
                            setShowChangeModal('add');
                        }}
                    >
                        <img src={addIconBlack} alt="Add" />
                    </div>
                </div>
            </div>

            {galleyImgDelete && (
                <DeleteModel
                    onCancelImg={() => setGalleyImgDelete(null)}
                    onfirmGalleryImgDelete={confirmDelete}
                />
            )}

            {/* Reusable modal for both add & edit */}
            {showChangeModal && (
                <EditGallery
                    mode={showChangeModal}
                    updatedFile={updatedFile}
                    changingImageLoading={changingImageLoading}
                    uploading={uploading}
                    images={images}
                    selectedImageIndex={selectedImageIndex}
                    fileInputRef={fileInputRef}
                    onClose={() => setShowChangeModal(null)}
                    handleChangeImage={handleChangeImage}
                    handleAddImage={handleAddImage}
                    onFileSelect={handleImageFile}
                />
            )}
        </div>
    );
}

export default Gallery;
