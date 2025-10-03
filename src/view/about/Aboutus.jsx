import React, { useEffect, useRef, useState } from "react";
import { getAboutPageData } from "../../services/aboutServices";
import editIconWhite from "../../assets/svg/editIconWhite.svg"
import galleryIconOrange from "../../assets/svg/galleryIconOrange.svg"
import EditAboutUs from "./EditAboutUs";
import EditChooseCard from "./EditChooseCard";

function Aboutus() {
    const [aboutData, setAboutData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingChooseCard, setIsEditingChooseCard] = useState(false);
    const hasFetched = useRef(false);
    const [activeTab, setActiveTab] = useState("hero");

    useEffect(() => {
        if (!hasFetched.current) {
            fetchAboutData();
            hasFetched.current = true;
        }
    }, []);

    const fetchAboutData = async () => {
        try {
            const res = await getAboutPageData();
            if (res?.data?.about) {
                setAboutData(res.data.about);
            }
        } catch (err) {
            console.error("Error fetching about page data:", err);
        }
    }

    if (!aboutData) {
        return <div className="text-center py-10">Loading...</div>;
    }

    const getFilename = (url) => {
        if (!url) return '';
        return url.split('/').pop();
    };

    return (
        // <div>
        //     {isEditing ? (
        //         <EditAboutUs fetchAboutData={fetchAboutData} aboutData={aboutData} onCancel={() => setIsEditing(false)} />
        //     ) : isEditingChooseCard ? (
        //         <EditChooseCard aboutData={aboutData} onCancel={() => setIsEditingChooseCard(false)} fetchAboutData={fetchAboutData} />
        //     ) : (
        //         <div className="text-[#464646] space-y-2">
        //             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-3">
        //                 <div>
        //                     <h1 className="text-[32px] font-Raleway Raleway-medium">About Us</h1>
        //                     <p className="text-[#656565] pt-1">Change Content and Image of About Us Page</p>
        //                 </div>
        //                 <button onClick={() => setIsEditingChooseCard(true)} className="bg-[#EA7913] flex items-center space-x-2 hover:bg-[#F39C2C] text-white px-6 py-3 rounded-full cursor-pointer">
        //                     <img src={editIconWhite} alt="Download Icon" />
        //                     <span>Edit Why Choose Us</span>
        //                 </button>
        //             </div>

        //             <div className="p-2">
        //                 <div className="bg-white border-t border-t-[#EA7913] rounded-3xl w-full space-y-6 p-5">
        //                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        //                         <h2 className="text-[#656565] text-2xl font-Raleway Raleway-medium">About Us Hero Section</h2>
        //                         <button onClick={() => setIsEditing(true)} className="bg-[#EA7913] flex items-center space-x-2 hover:bg-[#F39C2C] text-white px-6 py-3 rounded-full cursor-pointer">
        //                             <img src={editIconWhite} alt="Download Icon" />
        //                             <span>Edit</span>
        //                         </button>
        //                     </div>

        //                     <div className="space-y-2.5">
        //                         {/* Vision + Mission Content */}
        //                         <div className="grid md:grid-cols-2 gap-6">
        //                             <div>
        //                                 <h3 className="text-lg font-medium mb-2">Vision Content</h3>
        //                                 <div className="flex flex-col border border-[#DCDCDC] rounded-xl px-4.5 py-3">
        //                                     <p className="text-[#989898]">{aboutData.visionContent}</p>
        //                                 </div>
        //                             </div>
        //                             <div>
        //                                 <h3 className="text-lg font-medium mb-2">Mission Content</h3>
        //                                 <div className="flex flex-col border border-[#DCDCDC] rounded-xl px-4.5 py-3">
        //                                     <p className="text-[#989898]">{aboutData.missionContent}</p>
        //                                 </div>
        //                             </div>
        //                         </div>

        //                         {/* Vision + Mission Image */}
        //                         <div className="grid md:grid-cols-2 gap-6">
        //                             <div>
        //                                 <h3 className="text-lg font-medium mb-2">Vision Image</h3>
        //                                 <div className="flex flex-col gap-2.5 h-[155px] items-center justify-center border border-[#DCDCDC] rounded-xl p-4">
        //                                     <img src={galleryIconOrange} alt="Not Found" />
        //                                     <span className="text-[#989898]">{getFilename(aboutData.visionImageUrl)}</span>
        //                                 </div>
        //                             </div>
        //                             <div>
        //                                 <h3 className="text-lg font-medium mb-2">Mission Image</h3>
        //                                 <div className="flex flex-col gap-2.5 h-[155px] items-center justify-center border border-[#DCDCDC] rounded-xl p-4">
        //                                     <img src={galleryIconOrange} alt="Not Found" />
        //                                     <span className="text-[#989898]">{getFilename(aboutData.missionImageUrl)}</span>
        //                                 </div>
        //                             </div>
        //                         </div>

        //                         {/* Hero Section Content + Image */}
        //                         <div className="grid md:grid-cols-2 gap-6 items-stretch">
        //                             {/* Left Side - Textarea */}
        //                             <div className="flex flex-col h-full">
        //                                 <h3 className="text-lg font-medium mb-2">Hero Section Content</h3>
        //                                 <div className="flex-1 border border-[#DCDCDC] rounded-xl p-4">
        //                                     <textarea
        //                                         className="w-full h-full border-none outline-none text-[#989898]"
        //                                         value={aboutData.heroContent}
        //                                         readOnly
        //                                     />
        //                                 </div>
        //                             </div>

        //                             {/* Right Side - Image Box */}
        //                             <div className="flex flex-col h-[155px]">
        //                                 <h3 className="text-lg font-medium mb-2">Hero Section Upload Image</h3>
        //                                 <div className="flex-1 flex flex-col gap-2.5 items-center justify-center border border-[#DCDCDC] rounded-xl p-4">
        //                                     <img src={galleryIconOrange} alt="Not Found" />
        //                                     <span className="text-[#989898]">
        //                                         {getFilename(aboutData.heroImageUrl)}
        //                                     </span>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>

        //         </div>
        //     )}
        // </div>
        <div className="text-[#464646]">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-3 mb-2">
                <div>
                    <h1 className="text-[32px] font-Raleway Raleway-medium">About Us</h1>
                    <p className="text-[#656565] pt-1">Change Content and Image of About Us Page</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex px-3">
                <button
                    onClick={() => setActiveTab("hero")}
                    className={`px-4 py-3 font-medium text-[#525252] ${activeTab === "hero" && "bg-white rounded-t-3xl"} cursor-pointer`}
                >
                    Hero Section
                </button>
                <button
                    onClick={() => setActiveTab("choose")}
                    className={`px-4 py-3 font-medium text-[#525252] ${activeTab === "choose" && "bg-white rounded-t-3xl"} cursor-pointer`}
                >
                    Why Choose Us
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === "hero" && (
                <div>
                    <EditAboutUs fetchAboutData={fetchAboutData} aboutData={aboutData} onCancel={() => setIsEditing(false)} />
                </div>
            )}

            {activeTab === "choose" && (
                <div>
                    <EditChooseCard aboutData={aboutData} onCancel={() => setIsEditingChooseCard(false)} fetchAboutData={fetchAboutData} />
                </div>
            )}
        </div>
    );
}

export default Aboutus;
