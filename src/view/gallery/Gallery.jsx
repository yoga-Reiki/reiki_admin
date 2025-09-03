import React, { useState, useRef } from 'react';
import loginBG from "../../assets/img/loginBG.png";
import gallery1 from "../../assets/img/blog1.png";
import gallery2 from "../../assets/img/blog2.png";
import gallery3 from "../../assets/img/blog3.png";
import gallery4 from "../../assets/img/blog4.png";
import gallery5 from "../../assets/img/blog5.png";
import gallery6 from "../../assets/img/blog6.png";
import gallery7 from "../../assets/img/blog7.png";
import addIconBlack from "../../assets/svg/addIconBlack.svg";
import deletIconBlack from "../../assets/svg/deletIconBlack.svg"
import DeleteModel from '../component/DeleteModel';
import { getGalleryImgDelete } from '../../services/galleryServices';

function Gallery() {
    const [images, setImages] = useState([
        loginBG, gallery1, gallery2,
        gallery3, gallery4, gallery5,
        gallery6, gallery7
    ]);
    const [draggedItem, setDraggedItem] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const fileInputRef = useRef(null);
    const [galleyImgDelete, setGalleyImgDelete] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImages(prev => [...prev, imageUrl]);
        }
    };

    const confirmDelete = async () => {
        if (!galleyImgDelete || !galleyImgDelete._id) return;

        try {
            await getGalleryImgDelete(galleyImgDelete._id);
            setGalleyImgDelete(null);
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    return (
        <div className='text-[#464646] flex flex-col gap-2'>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-3">
                <div>
                    <h1 className="text-[32px] font-Raleway">Gallery</h1>
                    <p className="text-[#656565] pt-1">Manage Your Gallery</p>
                </div>
                <button className="bg-[#EA7913] flex items-center space-x-2 hover:bg-[#F39C2C] text-white px-6 py-3 rounded-full cursor-pointer">
                    Upload in Website
                </button>
            </div>

            {/* Grid and Upload Box */}
            <div className='flex flex-col lg:flex-row gap-10 lg:gap-2'>
                <div className="w-full lg:w-1/2 grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 flex-1 lg:p-3 xl:p-5">
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className={`overflow-hidden rounded-3xl border-2 ${selectedImageIndex === index ? 'border-[#EA7913] p-0.5' : 'border-transparent'} transition`}
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

                                    // Remove the dragged image
                                    newImages.splice(draggedItem, 1);

                                    // Insert it at the drop index
                                    newImages.splice(index, 0, draggedImage);

                                    setImages(newImages);
                                    setDraggedItem(null);
                                }
                            }}
                        >
                            <img
                                src={img}
                                alt={`Gallery ${index + 1}`}
                                className={`w-full h-48 md:h-60 lg:h-72 ${selectedImageIndex === index && "rounded-3xl"} object-cover cursor-pointer`}
                            />
                        </div>
                    ))}

                    <div
                        className="w-full h-48 md:h-60 lg:h-72 rounded-3xl bg-[#FEF8EC] flex items-center justify-center cursor-pointer transition"
                        onClick={() => fileInputRef.current.click()}
                    >
                        <img src={addIconBlack} alt='Add' />
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    </div>
                </div>

                <div className='w-full lg:w-1/4 flex flex-col gap-6'>
                    <div>
                        <h2 className='text-lg mb-2'>Upload Image</h2>
                        <div className={`bg-white border ${selectedImageIndex !== null ? "border-[#EA7913]" : "border-[#DCDCDC]"} rounded-xl h-48 flex items-center justify-center overflow-hidden`}>
                            {selectedImageIndex !== null ? (
                                <div className="flex flex-col items-center justify-center w-full h-full text-center">
                                    <p className="text-sm text-[#525252]">Image {selectedImageIndex + 1}</p>
                                </div>
                            ) : (
                                <div className='text-[#525252] text-center px-4'>
                                    <p>Select Image to Change </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {selectedImageIndex !== null && (
                        <div className="flex justify-center gap-3">
                            <button
                                className="w-full bg-[#FCEAC9] text-[#656565] px-4 py-2 rounded-full flex justify-center gap-2 items-center cursor-pointer"
                                onClick={() => setGalleyImgDelete(selectedImageIndex)}
                            >
                                <img src={deletIconBlack} alt='Not Found' />
                                Delete
                            </button>
                            <div className="w-full relative inline-block rounded-full px-[4px] py-[3px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:to-[#F39C2C]">
                                <button
                                    type="submit"
                                    className="w-full py-2.5 bg-[#EA7913] text-white rounded-full font-medium hover:bg-[#F39C2C] disabled:opacity-60"
                                >
                                    Change Image
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {galleyImgDelete && (
                <DeleteModel onCancelImg={() => setGalleyImgDelete(null)} onfirmGalleryImgDelete={confirmDelete} />
            )}
        </div>
    );
}

export default Gallery;
