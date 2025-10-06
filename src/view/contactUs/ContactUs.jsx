import React, { useEffect, useRef, useState } from "react";
import editIconWhite from "../../assets/svg/editIconWhite.svg"
import galleryIconOrange from "../../assets/svg/galleryIconOrange.svg"
import EditContact_us from "./EditContact_us";
import { getContactUsData } from "../../services/contactUsServices";
import toast from "react-hot-toast";

function ContactUs() {
    const [contactUsData, setContactUsData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (!hasFetched.current) {
            fetchContactData();
            hasFetched.current = true;
        }
    }, []);

    const fetchContactData = async () => {
        try {
            const res = await getContactUsData();
            toast.success("Contact Us fetched successfully!")
            setContactUsData(res.data?.contact);
        } catch (err) {
            console.error("Error fetching about page data:", err);
        }
    }

    if (!contactUsData) {
        return <div className="text-center py-10">Loading...</div>;
    }

    const getFilename = (url) => {
        if (!url) return '';
        return url.split('/').pop();
    };

    return (
        <div>
            <div className="text-[#464646] space-y-2">
                <div className='p-3'>
                    <h1 className="text-[32px] font-Raleway Raleway-medium">Contact Us</h1>
                    <p className="text-[#656565] pt-1">Change Contact Us details Page</p>
                </div>

                {/* <div className="p-2">
                    <div className="bg-white border-t border-t-[#EA7913] rounded-3xl w-full space-y-6 p-5">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h2 className="text-[#656565] text-2xl font-Raleway Raleway-medium">Contact Us Section</h2>
                            <button onClick={() => setIsEditing(true)} className="bg-[#EA7913] flex items-center space-x-2 hover:bg-[#F39C2C] text-white px-6 py-3 rounded-full cursor-pointer">
                                <img src={editIconWhite} alt="Download Icon" />
                                <span>Edit</span>
                            </button>
                        </div>

                        <div className="space-y-2.5">
                            <div className="grid lg:grid-cols-2 gap-6">
                                <div className="flex flex-col h-full">
                                    <h3 className="text-lg font-medium mb-2">Hero Section Content</h3>
                                    <div className="flex-1 border border-[#DCDCDC] rounded-xl p-4">
                                        <textarea
                                            className="w-full h-full border-none outline-none text-[#989898]"
                                            value={contactUsData.heroContent}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium mb-2">Hero Section Upload Image</h3>
                                    <div className="flex flex-col gap-1 h-[168px] items-center justify-center border border-[#DCDCDC] rounded-xl px-20 py-4">
                                        <img src={galleryIconOrange} alt="Not Found" />
                                        <span className="text-[#989898] text-center">{getFilename(contactUsData?.heroImageUrl)}</span>
                                        <span className="text-[#989898] text-center">Click Here to Upload Image or Drag & drop here</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-2">
                                <div>
                                    <label className="block text-lg font-medium mb-1">Mobile Number</label>
                                    <input
                                        type="text"
                                        value={contactUsData.mobileNumber}
                                        readOnly
                                        className="w-full border border-[#DCDCDC] focus:outline-none focus:ring-0 focus:border-[#DCDCDC] rounded-xl px-4 py-2 text-[#989898]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium mb-1">E-mail</label>
                                    <input
                                        type="email"
                                        value={contactUsData.email}
                                        readOnly
                                        className="w-full border border-[#DCDCDC] focus:outline-none focus:ring-0 focus:border-[#DCDCDC] rounded-xl px-4 py-2 text-[#989898]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium mb-1">Youtube</label>
                                    <input
                                        type="text"
                                        value={contactUsData.youtube}
                                        readOnly
                                        className="w-full border border-[#DCDCDC] focus:outline-none focus:ring-0 focus:border-[#DCDCDC] rounded-xl px-4 py-2 text-[#989898]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium mb-1">Linkedin</label>
                                    <input
                                        type="text"
                                        value={contactUsData.linkedin}
                                        readOnly
                                        className="w-full border border-[#DCDCDC] focus:outline-none focus:ring-0 focus:border-[#DCDCDC] rounded-xl px-4 py-2 text-[#989898]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium mb-1">Twitter</label>
                                    <input
                                        type="text"
                                        value={contactUsData.twitter}
                                        readOnly
                                        className="w-full border border-[#DCDCDC] focus:outline-none focus:ring-0 focus:border-[#DCDCDC] rounded-xl px-4 py-2 text-[#989898]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-medium mb-1">Instagram</label>
                                    <input
                                        type="text"
                                        value={contactUsData.instagram}
                                        readOnly
                                        className="w-full border border-[#DCDCDC] focus:outline-none focus:ring-0 focus:border-[#DCDCDC] rounded-xl px-4 py-2 text-[#989898]"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-lg font-medium mb-1">Location</label>
                                    <input
                                        type="text"
                                        value={contactUsData.location}
                                        readOnly
                                        className="w-full border border-[#DCDCDC] focus:outline-none focus:ring-0 focus:border-[#DCDCDC] rounded-xl px-4 py-2 text-[#989898]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

                <EditContact_us fetchContactData={fetchContactData} contactData={contactUsData} onCancel={() => setIsEditing(false)} />
            </div>
        </div>
    );
}

export default ContactUs;


