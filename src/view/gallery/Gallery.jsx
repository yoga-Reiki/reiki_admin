import React, { useState, useRef, useEffect } from 'react';
import plusIcon from "../../assets/svg/plusIcon.svg";
import DeleteModel from '../component/DeleteModel';
import { getAddGalleryImg, getAllGalleryImg, getGalleryImgDelete, getUpdateGalleryImg } from '../../services/galleryServices';
import toast from 'react-hot-toast';
import EditGallery from './EditGallery';
// import eyeIconGrey from "../../assets/svg/eyeIconGrey.svg";
import CameraIcon from "../../assets/svg/CameraIcon.svg";
import DotMenuIcon from "../../assets/svg/DotMenuIcon.svg";
import deleteIconGrey from "../../assets/svg/deleteIconGrey.svg";
import addImgBG from "../../assets/img/addImgBG.png"

function Gallery() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [draggedItem, setDraggedItem] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const fileInputRef = useRef(null);
    const hasFetched = useRef(false);
    const [galleyImgDelete, setGalleyImgDelete] = useState(null);
    const [updatedFile, setUpdatedFile] = useState(null);
    const [showChangeModal, setShowChangeModal] = useState(null)
    const [uploading, setUploading] = useState(false);
    const [changingImageLoading, setChangingImageLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
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
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageUpload}
            />

            <div className="px-4 py-3">
                <h1 className="text-[32px] font-Raleway Raleway-medium">Gallery</h1>
                <p className="text-[#656565] pt-1">Manage Your Gallery</p>
            </div>
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-2">
                <div className="w-full lg:w-1/2 grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-2 flex-1 px-4">
                    <div
                        className="w-full h-48 rounded-3xl border border-[#F9D38E] flex flex-col items-center justify-center text-[#333] space-y-2 cursor-pointer transition"
                        style={{
                            backgroundImage: `url(${addImgBG})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                        onClick={() => {
                            setSelectedImageIndex(null);
                            setUpdatedFile(null);
                            setShowChangeModal('add');
                        }}
                    >
                        <div>
                            <img src={plusIcon} alt="Add" />
                        </div>
                        <p className="text-sm font-medium">Add Images here</p>
                    </div>

                    {loading ? (
                        Array(6).fill(0).map((_, i) => (
                            <div
                                key={i}
                                className="w-full h-48 rounded-3xl bg-gray-300 animate-pulse"
                            />
                        ))
                    ) : (
                        // images.map((img, index) => (
                        //     <div
                        //         key={img._id || index}
                        //         className="relative overflow-hidden rounded-3xl border border-transparent transition group"
                        //         draggable
                        //         onClick={() => setSelectedImageIndex(index)}
                        //         onDragStart={(e) => {
                        //             setDraggedItem(index);
                        //             e.dataTransfer.effectAllowed = "move";
                        //         }}
                        //         onDragOver={(e) => {
                        //             e.preventDefault();
                        //             e.dataTransfer.dropEffect = "move";
                        //         }}
                        //         onDrop={(e) => {
                        //             e.preventDefault();
                        //             if (draggedItem !== null && draggedItem !== index) {
                        //                 const newImages = [...images];
                        //                 const draggedImage = newImages[draggedItem];
                        //                 newImages.splice(draggedItem, 1);
                        //                 newImages.splice(index, 0, draggedImage);
                        //                 setImages(newImages);
                        //                 setDraggedItem(null);
                        //             }
                        //         }}
                        //     >
                        //         <img
                        //             src={img.imageUrl}
                        //             alt={`Gallery ${index + 1}`}
                        //             className="w-full h-48 md:h-60 lg:h-48 object-cover rounded-3xl transition duration-300 group-hover:blur-xs"
                        //         />

                        //         {/* Hover Overlay with Icons */}
                        //         <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition duration-300">
                        //             <button
                        //                 onClick={(e) => {
                        //                     e.stopPropagation();
                        //                     setPreviewImage(img.imageUrl);
                        //                 }}
                        //                 className="bg-white p-2 rounded-full shadow-md hover:bg-[#] cursor-pointer"
                        //             >
                        //                 <img src={eyeIconGrey} alt="Preview" className="w-7 h-7" />
                        //             </button>


                        //             <button
                        //                 onClick={(e) => {
                        //                     e.stopPropagation();
                        //                     setSelectedImageIndex(index);
                        //                     setUpdatedFile(null);
                        //                     setShowChangeModal('edit');
                        //                 }}
                        //                 className="bg-white p-3 rounded-full shadow-md hover:bg-[#] cursor-pointer"
                        //             >
                        //                 <img src={editPencilGreyIcon} alt="Edit" className="w-5 h-5" />
                        //             </button>

                        //             {/* Delete Icon */}
                        //             <button
                        //                 onClick={(e) => {
                        //                     e.stopPropagation();
                        //                     setGalleyImgDelete(img);
                        //                 }}
                        //                 className="bg-white p-3 rounded-full shadow-md hover:bg-[#] cursor-pointer"
                        //             >
                        //                 <img src={deleteIconGrey} alt="Delete" className="w-5 h-5" />
                        //             </button>
                        //         </div>
                        //     </div>
                        // ))
                        images.map((img, index) => (
                            <div
                                key={img._id || index}
                                className="relative overflow-hidden rounded-3xl border border-transparent transition group"
                                draggable
                                onClick={() => setSelectedImageIndex(index)}
                                onMouseEnter={() => {
                                    if (showMenuIndex !== index) {
                                        setShowMenuIndex(null);
                                    }
                                }}
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
                                    className="w-full h-48 object-cover rounded-3xl"
                                />
                                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowMenuIndex(showMenuIndex === index ? null : index);
                                        }}
                                        className="p-1.5 w-9 h-9 bg-white rounded-full border border-[#FCEAC9] cursor-pointer shadow-sm"
                                    >
                                        <img src={DotMenuIcon} alt="Options" />
                                    </button>

                                    {/* dropdown menu */}
                                    {showMenuIndex === index && (
                                        <div className="absolute space-y-2 right-0 mt-2 w-48 lg:w-55 bg-white rounded-2xl p-2 cursor-pointer border border-[#FCEAC9] z-20">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedImageIndex(index);
                                                    setUpdatedFile(null);
                                                    setShowChangeModal('edit');
                                                    setShowMenuIndex(null);
                                                }}
                                                className="cursor-pointer flex items-center gap-2.5 w-full rounded-xl p-3 text-left text-sm hover:bg-[#FEF8EC] text-[#656565] hover:text-[#292929]"
                                            >
                                                <img src={CameraIcon} alt="CameraIcon" />
                                                <p>Change Image</p>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setGalleyImgDelete(img);
                                                    setShowMenuIndex(null);
                                                }}
                                                className="cursor-pointer flex items-center gap-2.5 w-full rounded-xl p-3 text-left text-sm hover:bg-[#FEF8EC] text-[#656565] hover:text-[#292929]"
                                            >
                                                <img src={deleteIconGrey} alt="deleteIcon" />
                                                <p>Delete Image</p>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {previewImage && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50 text-[#464646] w-full p-4">
                    <div className="relative">
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-4 right-4 bg-white py-2 px-3.5 rounded-full shadow-md hover:bg-[#] cursor-pointer z-50"
                        >
                            ✕
                        </button>

                        <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full max-h-[80vh] object-contain rounded-2xl"
                        />
                    </div>
                </div>
            )}

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
