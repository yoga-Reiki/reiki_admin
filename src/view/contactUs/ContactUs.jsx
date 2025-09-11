import React, { useEffect, useRef, useState } from "react";
import { getAboutPageData } from "../../services/aboutServices";
import editIconWhite from "../../assets/svg/editIconWhite.svg"
import galleryIconOrange from "../../assets/svg/galleryIconOrange.svg"
import EditContact_us from "./EditContact_us";

function ContactUs() {
    const [aboutData, setAboutData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const hasFetched = useRef(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await getAboutPageData();
                if (res?.data?.about) {
                    setAboutData(res.data.about);
                }
            } catch (err) {
                console.error("Error fetching about page data:", err);
            }
        }
        if (!hasFetched.current) {
            fetchData();
            hasFetched.current = true;
        }
    }, []);

    if (!aboutData) {
        return <div className="text-center py-10">Loading...</div>;
    }

    const getFilename = (url) => {
        if (!url) return '';
        return url.split('/').pop();
    };

    return (
        <div>
            {!isEditing ? (
                <div className="text-[#464646] space-y-2">
                    <div className='p-3'>
                        <h1 className="text-[32px] font-Raleway">Contact Us</h1>
                        <p className="text-[#656565] pt-1">Change Content and Image of Contact Us Page</p>
                    </div>

                    <div className="p-2">
                        <div className="bg-white border-t border-t-[#EA7913] rounded-3xl w-full space-y-6 p-5">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <h2 className="text-[#656565] text-2xl">Contact Us Section</h2>
                                <button onClick={() => setIsEditing(true)} className="bg-[#EA7913] flex items-center space-x-2 hover:bg-[#F39C2C] text-white px-6 py-3 rounded-full cursor-pointer">
                                    <img src={editIconWhite} alt="Download Icon" />
                                    <span>Edit</span>
                                </button>
                            </div>

                            <div className="space-y-2.5">
                                {/* Vision + Mission Content */}
                                <div className="grid lg:grid-cols-2 gap-6">
                                    <div className="flex flex-col h-full">
                                        <h3 className="text-lg font-medium mb-2">Hero Section Content</h3>
                                        <div className="flex-1 border border-[#DCDCDC] rounded-xl p-4">
                                            <textarea
                                                className="w-full h-full border-none outline-none text-[#989898]"
                                                value={aboutData.heroContent}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium mb-2">Hero Section Upload Image</h3>
                                        <div className="flex flex-col gap-2.5 h-[168px] items-center justify-center border border-[#DCDCDC] rounded-xl px-20 py-4">
                                            <img src={galleryIconOrange} alt="Not Found" />
                                            {/* <span className="text-[#989898]">{getFilename(aboutData.visionImageUrl)}</span> */}
                                            <span className="text-[#989898]">Click Here to Upload Image or Drag & drop here</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-2">
                                    {/* Mobile Number */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Mobile Number</label>
                                        <input
                                            type="text"
                                            value={aboutData.mobileNumber}
                                            readOnly
                                            className="w-full border border-[#DCDCDC] focus:outline-none focus:ring-0 focus:border-[#DCDCDC] rounded-xl px-4 py-2 text-[#DCDCDC]"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">E-mail</label>
                                        <input
                                            type="email"
                                            value={aboutData.email}
                                            readOnly
                                            className="w-full border border-[#DCDCDC] focus:outline-none focus:ring-0 focus:border-[#DCDCDC] rounded-xl px-4 py-2 text-[#656565]"
                                        />
                                    </div>

                                    {/* YouTube */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Youtube</label>
                                        <input
                                            type="text"
                                            value={aboutData.youtube}
                                            readOnly
                                            className="w-full border border-[#DCDCDC] focus:outline-none focus:ring-0 focus:border-[#DCDCDC] rounded-xl px-4 py-2 text-[#656565]"
                                        />
                                    </div>

                                    {/* LinkedIn */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Linkedin</label>
                                        <input
                                            type="text"
                                            value={aboutData.linkedin}
                                            readOnly
                                            className="w-full border border-[#DCDCDC] focus:outline-none focus:ring-0 focus:border-[#DCDCDC] rounded-xl px-4 py-2 text-[#656565]"
                                        />
                                    </div>

                                    {/* Twitter */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Twitter</label>
                                        <input
                                            type="text"
                                            value={aboutData.twitter}
                                            readOnly
                                            className="w-full border border-[#DCDCDC] focus:outline-none focus:ring-0 focus:border-[#DCDCDC] rounded-xl px-4 py-2 text-[#656565]"
                                        />
                                    </div>

                                    {/* Instagram */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Instagram</label>
                                        <input
                                            type="text"
                                            value={aboutData.instagram}
                                            readOnly
                                            className="w-full border border-[#DCDCDC] focus:outline-none focus:ring-0 focus:border-[#DCDCDC] rounded-xl px-4 py-2 text-[#656565]"
                                        />
                                    </div>

                                    {/* Location (full width) */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-1">Location</label>
                                        <input
                                            type="text"
                                            value={aboutData.location}
                                            readOnly
                                            className="w-full border border-[#DCDCDC] focus:outline-none focus:ring-0 focus:border-[#DCDCDC] rounded-xl px-4 py-2 text-[#656565]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            ) : (
                <EditContact_us onCancel={() => setIsEditing(false)} />
            )}
        </div>
    );
}

export default ContactUs;


