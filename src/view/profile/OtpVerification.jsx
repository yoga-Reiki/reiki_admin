import React, { useState } from 'react'
import leftBackIcon from "../../assets/svg/leftIcon.svg"
import Emailicon from "../../assets/svg/Email.svg";

function OtpVerification({ setCurrentScreenMain }) {
    const [formData, setFormData] = useState({ email: '' });

    const handleOTPVerify = (e) => {
        e.preventDefault();
        console.log('Saved Details:', formData);

        // simulate API success or update success screen
        // setOtpVerification(true);
    };

    return (
        <div className='flex flex-col gap-14'>
            <div className="flex items-center gap-6 py-4 cursor-pointer" >
                <img src={leftBackIcon} alt='Not Found' className='w-5 h-5' />
                <h2 className="text-2xl md:text-[32px] font-Raleway Raleway-medium">
                    <span onClick={setCurrentScreenMain} className="cursor-pointer">Change Password</span> &gt;{" "}
                    <span className="text-2xl font-Raleway">Enter Your Email</span>
                </h2>
            </div>

            <div>
                <div className="bg-white border-t border-t-[#EA7913] rounded-3xl p-8 max-w-[863px] mx-auto">
                    <form onSubmit={handleOTPVerify} className="flex flex-col gap-66">
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
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-10 pr-3 py-2.5 rounded-xl text-[#525252] placeholder-[#525252] border-[1px] border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                                />
                            </div>
                            {/* {errors.email && (
                              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )} */}
                        </div>

                        <div className="w-full relative inline-block rounded-full px-[4px] py-[3px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:to-[#F39C2C]">
                            <button
                                type="submit"
                                className="w-full py-2 bg-[#EA7913] text-lg text-white rounded-full font-medium hover:bg-[#F39C2C] disabled:opacity-60"
                            >
                                Send Reset Link
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    )
}

export default OtpVerification