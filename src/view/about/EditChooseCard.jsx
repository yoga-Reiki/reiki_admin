import React, { useEffect, useRef, useState } from 'react';
import EditIcon from "../../assets/svg/EditIcon.svg";
import toast from 'react-hot-toast';
import { getAboutUsCardUpdate } from '../../services/aboutServices';

const ChooseUsSliderCard = ({ index, data, handleChange, fileInputRef, handleDrop, handleFileChange }) => {
    return (
        <div className='text-[#464646] space-y-4'>
            <h3 className="text-2xl font-Raleway Raleway-medium text-[#656565]">Why Choose Us Slider {index + 1}</h3>
            <div></div>

            <div className='w-full flex gap-6'>
                <div className='w-[594px]'>
                    <div>
                        <label htmlFor="name" className="block text-[#292929] mb-1">
                            First Title
                        </label>
                        <div>
                            <input
                                id="name"
                                type="text"
                                name="title"
                                placeholder="Enter vision content"
                                value={data.title}
                                onChange={(e) => handleChange(index, e)}
                                className="w-full px-4 py-3 rounded-xl text-[#525252] placeholder-[#525252] border-[1px] border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[#292929] mb-1">Hero Section Content</label>
                        <textarea
                            name="content"
                            placeholder="Enter Content For hero section"
                            value={data.content}
                            onChange={(e) => handleChange(index, e)}
                            className="w-full h-[130px] border-[1px] text-[#525252] placeholder-[#525252] border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913] rounded-xl px-4 py-3 resize-none"
                            rows={5}
                        />
                    </div>
                </div>
                <div className='flex flex-col lg:flex-row gap-6'>
                    {[0, 1].map((imgIndex) => (
                        <div key={imgIndex} className='w-[232px]'>
                            <div>
                                <label className="block text-[#292929] mb-1">Slider Image</label>
                                <div
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.classList.add("border-dashed", "border-[#EA7913]", "bg-[#FEF8EC]");
                                    }}
                                    onDragLeave={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.classList.remove("border-dashed", "border-[#EA7913]", "bg-[#FEF8EC]");
                                    }}
                                    onDrop={(e) => handleDrop(index, imgIndex, e)}
                                    className="px-4 flex flex-col items-center justify-center h-[208px] border border-[#BDBDBD] rounded-xl text-center cursor-pointer bg-[#FCFCFC] transition-all"
                                    onClick={() => {
                                        if (fileInputRef[index][imgIndex].current) {
                                            fileInputRef[index][imgIndex].current.value = "";
                                            fileInputRef[index][imgIndex].current.click();
                                        }
                                    }}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef[index][imgIndex]}
                                        className="hidden"
                                        onChange={(e) => handleFileChange(index, imgIndex, e)}
                                    />
                                    <img src={EditIcon} alt="" className='w-6 h-6' />
                                    <p className="text-[#525252] w-52 break-all">
                                        {data.images[imgIndex]
                                            ? typeof data.images[imgIndex] === 'string'
                                                ? data.images[imgIndex].split('/').pop()
                                                : data.images[imgIndex].name
                                            : "Upload Image here or Drag & drop"}
                                    </p>
                                </div>
                                <p className="text-[#656565] text-xs pt-1 text-end">Max size : 25 MB</p>
                            </div>
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

            // create refs
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
                if (cardId) {
                    promises.push(getAboutUsCardUpdate(formData, cardId));
                }
            });

            if (!hasChanges) {
                toast.error("No changes detected.");
                setLoading(false);
                return;
            }
            setLoading(true);
            await Promise.all(promises);

            toast.success("Why Choose Us updated!");
            fetchAboutData()
            onCancel()
            setOriginalSliders(JSON.parse(JSON.stringify(sliders)));
        } catch (err) {
            console.error(err);
            toast.error("Failed to update. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const cancelEditing = () => {
        setIsEditing(false);
        onCancel();
    };

    return (
        <div className="flex flex-col gap-4 px-2.5">

            {/* Slider Cards */}
            <div className="bg-white flex flex-col gap-8 rounded-3xl w-full p-6">
                {sliders.map((slider, index) => (
                    <ChooseUsSliderCard
                        index={index}
                        data={slider}
                        handleFileChange={handleFileChange}
                        handleDrop={handleDrop}
                        handleChange={handleChange}
                        fileInputRef={fileInputRefs.current}
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
