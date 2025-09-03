import React from 'react';
import Emailicon from "../../assets/svg/Email.svg";
import { IoIosArrowRoundForward } from "react-icons/io";

function ForgotModel({ onForgotPassword, onChange, form, errors, loading }) {
    return (
        <div>
            <form className="space-y-5">
                <div className="flex flex-col justify-between gap-52">
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
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={onChange}
                                placeholder="Enter Your Email"
                                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#BDBDBD]"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div className="relative inline-block rounded-full px-[5px] py-[3px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] mt-2 hover:from-[#F39C2C] hover:via-[#F39C2C] hover:to-[#F39C2C] active:from-[#EA7913] active:via-[#EA7913] active:to-[#EA7913]">
                        <button type='button' onClick={onForgotPassword} className="inline-flex justify-center items-center space-x-1.5 px-5 sm:px-6 py-2 sm:py-2.5 bg-[#EA7913] text-[#F8F8F8] rounded-full font-medium hover:cursor-pointer hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-base w-full h-full">
                            <span>Send Reset Link</span>
                            <IoIosArrowRoundForward size={28} />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default ForgotModel;
