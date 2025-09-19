import React, { useEffect, useState } from 'react'
import leftBackIcon from "../../assets/svg/leftIcon.svg"
import Emailicon from "../../assets/svg/Email.svg";
import UserIconOrange from "../../assets/svg/UserIconOrange.svg";
import CallIconOra from "../../assets/svg/CallIconOra.svg";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import SuccessProfile from './SuccessProfile';

function EditProfile({ setCurrentScreenMain, ProfileData }) {
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNumber: ''
    });

    useEffect(() => {
        if (ProfileData) {
            setFormData({
                name: ProfileData?.data?.name || '',
                email: ProfileData?.data?.email || '',
                mobileNumber: ProfileData?.data?.mobileNumber || ''
            });
        }
    }, [ProfileData]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveDetails = (e) => {
        e.preventDefault();
        console.log('Saved Details:', formData);

        // simulate API success or update success screen
        setShowSuccess(true);
    };

    return (
        <div className='flex flex-col gap-14'>
            <div onClick={setCurrentScreenMain} className="flex items-center gap-6 py-4 cursor-pointer" >
                <img src={leftBackIcon} alt='Not Found' className='w-5 h-5' />
                <h1 className="text-[32px] font-Raleway Raleway-medium hover:text-[#EA7913]">Edit Profile</h1>
            </div>

            {showSuccess ? (
                <SuccessProfile setCurrentScreenMain={setCurrentScreenMain} />
            ) : (
                <div>
                    <div className="bg-white border-t border-t-[#EA7913] rounded-3xl p-8 max-w-[863px] mx-auto">
                        <form onSubmit={handleSaveDetails} className="flex flex-col gap-26">
                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="name" className="block text-sm md:text-lg mb-2">
                                        Name
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-3 flex items-center text-[#EA7913]">
                                            <img src={UserIconOrange} alt="name" className="w-5 h-5" />
                                        </span>
                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleFormChange}
                                            placeholder="Enter Your name"
                                            className="w-full pl-10 pr-3 py-2.5 rounded-xl text-[#525252] placeholder-[#525252] border-[1px] border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                        />
                                    </div>
                                    {/* {errors.name && (
                              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            )} */}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm md:text-lg mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-3 flex items-center text-[#EA7913]">
                                            <img src={Emailicon} alt="email" className="w-5 h-5" />
                                        </span>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            placeholder="Enter Your Email"
                                            value={formData.email}
                                            onChange={handleFormChange}
                                            className="w-full pl-10 pr-3 py-2.5 rounded-xl text-[#525252] placeholder-[#525252] border-[1px] border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                        />
                                    </div>
                                    {/* {errors.email && (
                              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )} */}
                                </div>

                                <div>
                                    <label htmlFor="contact" className="block text-sm md:text-lg mb-2">
                                        Contact Number
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-3 flex items-center text-[#EA7913]">
                                            <img src={CallIconOra} alt="contact" className="w-6 h-6" />
                                        </span>
                                        <input
                                            id="contact"
                                            type="text"
                                            name="mobileNumber"
                                            placeholder="Enter Your contact No"
                                            value={formData.mobileNumber}
                                            onChange={handleFormChange}
                                            className="w-full pl-10 pr-3 py-2.5 rounded-xl text-[#525252] placeholder-[#525252] border-[1px] border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                        />
                                    </div>
                                    {/* {errors.contact && (
                              <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
                            )} */}
                                </div>
                            </div>

                            <div className="w-full relative inline-block rounded-full px-[4px] py-[3px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:to-[#F39C2C]">
                                <button
                                    type="submit"
                                    className="w-full py-2 bg-[#EA7913] text-lg text-white rounded-full font-medium hover:bg-[#F39C2C] disabled:opacity-60"
                                >
                                    Save Details
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div >
    )
}

export default EditProfile