import React, { useEffect, useRef, useState } from 'react';
import UploadIcon from "../../assets/svg/UploadIcon.svg";
import toast from 'react-hot-toast';
import editIconGrey from "../../assets/svg/editIconGrey.svg";
import { getAboutUsCardUpdate } from '../../services/aboutServices';

const ChooseUsSliderCard = ({
    index,
    data,
    handleChange,
    fileInputRef,
    handleDrop,
    handleFileChange,
    isEditing,
    startEditing
}) => {
    return (
        <div className='text-[#464646] space-y-4'>
            <div className='flex justify-between items-center'>
                <h3 className="text-2xl font-Raleway Raleway-medium text-[#656565]">
                    Why Choose Us Slider {index + 1}
                </h3>

                {!isEditing && index === 0 ? (
                    <button
                        className="flex text-sm items-center gap-2.5 py-2 px-4 text-[#656565] rounded-full border border-[#F9D38E] cursor-pointer"
                        onClick={startEditing}
                    >
                        <img src={editIconGrey} alt="Edit" className="p-[3px]" />
                        <span>Edit</span>
                    </button>
                ) : null}
            </div>

            <div className='w-full grid xl:grid-cols-2 gap-6'>
                <div className='space-y-3'>
                    <div>
                        <label htmlFor="name" className="block text-[#292929] mb-1">
                            Slider Title
                        </label>
                        <div>
                            <input
                                id="name"
                                type="text"
                                name="title"
                                placeholder="Enter vision content"
                                value={data.title}
                                onChange={(e) => handleChange(index, e)}
                                disabled={!isEditing}
                                className={`w-full px-4 py-3 rounded-xl placeholder-[#525252] border-[1px] border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913] ${isEditing ? "text-[#525252]" : "text-[#989898]"
                                    }`}
                                readOnly={!isEditing}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[#292929] mb-1">Slider Description</label>
                        <textarea
                            name="content"
                            placeholder="Enter Content For hero section"
                            value={data.content}
                            onChange={(e) => handleChange(index, e)}
                            disabled={!isEditing}
                            className={`custom-scrollbar w-full h-[118px] border-[1px] placeholder-[#525252] border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl px-4 py-3 resize-none ${isEditing ? "text-[#525252]" : "text-[#989898]"
                                }`}
                            rows={5}
                            readOnly={!isEditing}
                        />
                    </div>
                </div>

                <div className='flex gap-6'>
                    {[0, 1].map((imgIndex) => (
                        <div key={imgIndex} className='w-full'>
                            <label className="block text-[#292929] mb-1">Slider Image</label>
                            <div
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => isEditing && handleDrop(index, imgIndex, e)}
                                className={`px-4 flex flex-col items-center justify-center h-[208px] border-2 border-dashed rounded-xl text-center transition-all ${isEditing
                                    ? "border-[#BDBDBD] cursor-pointer text-[#525252]"
                                    : "border-[#E0E0E0] text-[#989898]"
                                    }`}
                                onClick={() => {
                                    if (!isEditing) return;
                                    if (fileInputRef[index][imgIndex].current) {
                                        fileInputRef[index][imgIndex].current.value = "";
                                        fileInputRef[index][imgIndex].current.click();
                                    }
                                }}
                                readOnly={!isEditing}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef[index][imgIndex]}
                                    className="hidden"
                                    onChange={(e) => handleFileChange(index, imgIndex, e)}
                                    readOnly={!isEditing}
                                />
                                <img src={UploadIcon} alt="Not Found" className="h-12 w-12" />
                                <p className="w-52 break-all pt-3">
                                    {data.images[imgIndex]
                                        ? typeof data.images[imgIndex] === 'string'
                                            ? data.images[imgIndex].split('/').pop()
                                            : data.images[imgIndex].name
                                        : "Upload Image here or Drag & drop"}
                                </p>
                            </div>
                            <p className="text-[#656565] text-xs pt-1 text-end">Max size : 25 MB</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

function EditChooseCard({ onCancel, aboutData, fetchAboutData }) {
    const [sliders, setSliders] = useState([]);
    const [originalSliders, setOriginalSliders] = useState([]);
    const fileInputRefs = useRef([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (aboutData?.whyChoose?.length > 0) {
            const initialSliders = aboutData.whyChoose.map((item) => ({
                title: item.title || '',
                content: item.description || '',
                images: [item.images?.[0] || null, item.images?.[1] || null],
            }));

            setSliders(initialSliders);
            setOriginalSliders(JSON.parse(JSON.stringify(initialSliders)));
            fileInputRefs.current = initialSliders.map(() => [React.createRef(), React.createRef()]);
        }
    }, [aboutData]);

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        setSliders((prev) => {
            const updated = [...prev];
            updated[index][name] = value;
            return updated;
        });
    };

    const handleFileChange = (sliderIndex, imageIndex, e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setSliders((prev) => {
                const updated = [...prev];
                updated[sliderIndex].images[imageIndex] = file;
                return updated;
            });
        }
    };

    const handleDrop = (sliderIndex, imageIndex, e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            setSliders((prev) => {
                const updated = [...prev];
                updated[sliderIndex].images[imageIndex] = file;
                return updated;
            });
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const promises = [];
            let hasChanges = false;

            sliders.forEach((slider, i) => {
                const original = originalSliders[i];
                const isChanged =
                    slider.title !== original.title ||
                    slider.content !== original.content ||
                    JSON.stringify(slider.images.map((img) => (typeof img === "string" ? img : img.name))) !==
                    JSON.stringify(original.images.map((img) => (typeof img === "string" ? img : img.name)));

                if (!isChanged) return;
                hasChanges = true;

                const formData = new FormData();
                formData.append("title", slider.title);
                formData.append("description", slider.content);
                slider.images.forEach((image) => {
                    if (image && typeof image === "object") {
                        formData.append("images", image);
                    }
                });

                const cardId = aboutData?.whyChoose?.[i]?._id;
                if (cardId) promises.push(getAboutUsCardUpdate(formData, cardId));
            });

            if (!hasChanges) {
                toast.error("No changes detected.");
                setLoading(false);
                return;
            }

            await Promise.all(promises);
            toast.success("Why Choose Us updated!");
            fetchAboutData();
            setIsEditing(false);
            setOriginalSliders(JSON.parse(JSON.stringify(sliders)));
        } catch (err) {
            console.error(err);
            toast.error("Failed to update. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const cancelEditing = () => {
        setSliders(JSON.parse(JSON.stringify(originalSliders)));
        setIsEditing(false);
        onCancel();
    };

    return (
        <div className="flex flex-col gap-4 px-2.5">
            <div className="bg-white flex flex-col gap-8 rounded-3xl w-full p-6">
                {sliders.map((slider, index) => (
                    <ChooseUsSliderCard
                        key={index}
                        index={index}
                        data={slider}
                        handleFileChange={handleFileChange}
                        handleDrop={handleDrop}
                        handleChange={handleChange}
                        fileInputRef={fileInputRefs.current}
                        isEditing={isEditing}
                        startEditing={() => setIsEditing(true)}
                    />
                ))}

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
    );
}

export default EditChooseCard;
