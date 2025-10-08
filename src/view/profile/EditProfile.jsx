import React, { useEffect, useState } from 'react'
import Emailicon from "../../assets/svg/Email.svg";
import UserIconOrange from "../../assets/svg/UserIconOrange.svg";
import CallIconOra from "../../assets/svg/CallIconOra.svg";
import SuccessProfile from './SuccessProfile';
import toast from "react-hot-toast";
import { getUserUpdate } from '../../services/userServices';
import { useNavigate } from 'react-router-dom';
import { userForgotPassowrd } from '../../services/LoginServices';
import OtpVerification from './OtpVerification';

function EditProfile({ setCurrentScreenMain, ProfileData, fetchUserProfile }) {
    const navigate = useNavigate()
    const [otpVerification, setOtpVerification] = useState(false)
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNumber: ''
    });
    const [initialData, setInitialData] = useState({});

    useEffect(() => {
        if (ProfileData?.data) {
            const initial = {
                name: ProfileData.data.name || '',
                email: ProfileData.data.email || '',
                mobileNumber: ProfileData.data.mobileNumber || ''
            };
            setFormData(initial);
            setInitialData(initial);
        }
    }, [ProfileData]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveDetails = async (e) => {
        e?.preventDefault();

        if (!otpVerification) {
            const hasChanges =
                formData.name !== initialData.name ||
                formData.email !== initialData.email ||
                formData.mobileNumber !== initialData.mobileNumber;

            if (!hasChanges) {
                toast.error("No changes made")
                return;
            }
        }

        try {
            setLoading(true)
            const body = { email: formData.email };

            const res = await userForgotPassowrd({ body });

            setOtpVerification(true);
        } catch (err) {
            console.error("Forgot password failed:", err);
        } finally {
            setLoading(false)
        }
    };

    return (
        <div>

            {otpVerification ? (
                <OtpVerification handleSaveDetails={handleSaveDetails} setInitialData={setInitialData} fetchUserProfile={fetchUserProfile} formData={formData} email={formData.email} handleBackProfile={() => setOtpVerification(false)} setCurrentScreenMain={setCurrentScreenMain} ProfileData={ProfileData} />
            ) : (
                <div className="flex flex-col gap-6">
                    <h1 className="text-2xl font-Raleway Raleway-medium">Edit Profile</h1>
                    <div>
                        <form className="flex flex-col gap-27">
                            <div className="space-y-6">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="block text-[#292929] mb-1">Name</label>
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
                                            className="w-full h-11 pl-10 pr-3 py-2.5 rounded-full text-[#525252] border border-[#BDBDBD] focus:border-[#EA7913] focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-[#292929] mb-1">Email</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-3 flex items-center text-[#EA7913]">
                                            <img src={Emailicon} alt="email" className="w-5 h-5" />
                                        </span>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleFormChange}
                                            placeholder="Enter Your Email"
                                            className="w-full h-11 pl-10 pr-3 py-2.5 rounded-full text-[#525252] border border-[#BDBDBD] focus:border-[#EA7913] focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Contact Number */}
                                <div>
                                    <label htmlFor="mobileNumber" className="block text-[#292929] mb-1">Contact Number</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-3 flex items-center text-[#EA7913]">
                                            <img src={CallIconOra} alt="contact" className="w-6 h-6" />
                                        </span>
                                        <input
                                            id="mobileNumber"
                                            type="text"
                                            name="mobileNumber"
                                            value={formData.mobileNumber}
                                            onChange={handleFormChange}
                                            placeholder="Enter Your contact No"
                                            className="w-full h-11 pl-10 pr-3 py-2.5 rounded-full text-[#525252] border border-[#BDBDBD] focus:border-[#EA7913] focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className='flex justify-end gap-2 h-12'>
                                <button
                                    onClick={() => navigate("/dashboard")}
                                    className="bg-[#FEF8EC] border border-[#F9D38E] py-3 px-6 rounded-full cursor-pointer text-[#656565]"
                                >
                                    Cancel
                                </button>
                                <div className="relative inline-block rounded-full p-[1px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:to-[#F39C2C]">
                                    <button
                                        type="submit"
                                        onClick={handleSaveDetails}
                                        disabled={loading}
                                        className="h-12 px-6 py-3 bg-[#EA7913] text-lg text-white rounded-full font-medium hover:bg-[#F39C2C] disabled:opacity-60 cursor-pointer"
                                    >
                                        {loading ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div >
            )
            }
        </div >
    );
}

export default EditProfile;
