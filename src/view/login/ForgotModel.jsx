import React from 'react';
import Emailicon from "../../assets/svg/Email.svg";
import { IoIosArrowRoundForward } from "react-icons/io";

function ForgotModel({ onForgotPassword, onChange, form, errors, loading }) {
    return (
        <div>
            <form className="space-y-5">
                <div className="flex flex-col justify-between gap-36">
                    <div>
                        <label htmlFor="email" className="block text-sm md:text-base mb-1 text-[#292929]">
                            Email
                        </label>
                        <div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={onChange}
                                placeholder="Enter Your Email"
                                className="w-full h-11 px-4 py-3 rounded-full text-[#525252] placeholder-[#656565] border-[1px] border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div className="relative inline-block rounded-full p-[0.5px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:via-[#F39C2C] hover:to-[#F39C2C] active:from-[#EA7913] active:via-[#EA7913] active:to-[#EA7913]">
                        <button type='button' onClick={onForgotPassword} className="inline-flex justify-center items-center space-x-1.5 py-3 bg-[#EA7913] text-[#F8F8F8] rounded-full font-medium hover:cursor-pointer hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-lg w-full h-12">
                            {loading ? (
                                <span>Sending...</span>
                            ) : (
                                <>
                                    <span>Send Reset Link</span>
                                    <IoIosArrowRoundForward size={28} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default ForgotModel;
