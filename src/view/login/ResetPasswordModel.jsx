import React, { useState } from "react";
import eyeIcon from "../../assets/svg/eyeIcon.svg";
import { IoEyeOffOutline } from "react-icons/io5";
import { RiLockPasswordLine } from "react-icons/ri";
import Password from "../../assets/svg/Password.svg";
import { IoIosArrowRoundForward } from "react-icons/io";

function ResetPasswordModel({ form, setForm, errors, handleChangePassword, loading }) {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <form className="flex flex-col gap-20 w-full" onSubmit={handleChangePassword}>
            <div className="space-y-6">
                {/* New Password */}
                <div>
                    <label htmlFor="newPassword" className="block text-sm md:text-lg mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-[#EA7913]">
                            <img src={Password} alt="password" className="w-5 h-5" />
                        </span>
                        <input
                            id="newPassword"
                            name="newPassword"
                            value={form.newPassword}
                            onChange={onChange}
                            className="w-full pl-10 pr-3 py-2.5 rounded-xl text-[#525252] placeholder-[#525252] border-[1px] border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                            placeholder="Enter New Password"
                            type={showNewPassword ? "text" : "password"}
                            onCopy={(e) => e.preventDefault()}
                            onCut={(e) => e.preventDefault()}
                            onPaste={(e) => e.preventDefault()}
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer focus:outline-none"
                        >
                            {showNewPassword ? (
                                <img src={eyeIcon} className="w-5 h-5" alt="eye" />
                            ) : (
                                <IoEyeOffOutline className="w-5 h-5 text-[#EA7913]" />
                            )}
                        </button>
                    </div>
                    {errors.newPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label
                        htmlFor="confirmPassword"
                        className="block text-sm md:text-lg mb-2"
                    >
                        Confirm Password
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-[#EA7913]">
                            <RiLockPasswordLine className="w-5 h-5" />
                        </span>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={onChange}
                            className="w-full pl-10 pr-10 py-2.5 rounded-xl text-[#525252] placeholder-[#525252] border-[1px] border-[#BDBDBD] focus:outline-none focus:ring-0 focus:border-[#EA7913]"
                            placeholder="Confirm Your Password"
                            type={showConfirmPassword ? "text" : "password"}
                            onCopy={(e) => e.preventDefault()}
                            onCut={(e) => e.preventDefault()}
                            onPaste={(e) => e.preventDefault()}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer focus:outline-none"
                        >
                            {showConfirmPassword ? (
                                <img src={eyeIcon} className="w-5 h-5" alt="eye" />
                            ) : (
                                <IoEyeOffOutline className="w-5 h-5 text-[#EA7913]" />
                            )}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.confirmPassword}
                        </p>
                    )}
                </div>
            </div>

            {/* Reset Button */}
            <div className="w-full mt-6 relative inline-block rounded-full px-[5px] py-[4px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:via-[#F39C2C] hover:to-[#F39C2C] active:from-[#EA7913] active:via-[#EA7913] active:to-[#EA7913]">
                <button
                    type="submit"
                    className="w-full h-full inline-flex justify-center items-center space-x-1.5 py-2 bg-[#EA7913] text-[#F8F8F8] rounded-full font-medium hover:cursor-pointer hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-base"
                >
                    {loading ? (
                        <span>Reseating...</span>
                    ) : (
                        <>
                            <span>Reset Password</span>
                            <IoIosArrowRoundForward size={28} />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

export default ResetPasswordModel;
