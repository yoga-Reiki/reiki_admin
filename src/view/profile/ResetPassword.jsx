import React, { useState } from 'react';
import leftBackIcon from "../../assets/svg/leftIcon.svg";
import SuccessProfile from './SuccessProfile';
import eyeIcon from "../../assets/svg/eyeIcon.svg";
import { IoEyeOffOutline } from "react-icons/io5";
import { RiLockPasswordLine } from "react-icons/ri";
import Password from "../../assets/svg/Password.svg";

function ResetPassword({ setCurrentScreenMain }) {
    const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validate = () => {
        const newErrors = {};

        if (!formData.newPassword) {
            newErrors.newPassword = "Password is required";
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = "Password must be at least 8 characters";
        } else if (!/[A-Z]/.test(formData.newPassword)) {
            newErrors.newPassword = "Password must contain at least one uppercase letter";
        } else if (!/[a-z]/.test(formData.newPassword)) {
            newErrors.newPassword = "Password must contain at least one lowercase letter";
        } else if (!/[0-9]/.test(formData.newPassword)) {
            newErrors.newPassword = "Password must contain at least one number";
        } else if (!/[!@#$%^&*]/.test(formData.newPassword)) {
            newErrors.newPassword = "Password must contain at least one special character";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.confirmPassword !== formData.newPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
    };

    const handleResetPassword = (e) => {
        e.preventDefault();

        if (!validate()) return;

        console.log('Saved Details:', formData);

        // Simulate success response
        setShowSuccess(true);
    };

    return (
        <div>
            {showSuccess ? (
                <>
                    <div className='flex flex-col gap-14'>
                        <div className="flex items-center gap-6 py-4 cursor-pointer" >
                            <img src={leftBackIcon} alt='Not Found' className='w-5 h-5' />
                            <h2 className="text-2xl md:text-[32px] font-Raleway Raleway-medium">
                                <span onClick={setCurrentScreenMain} className="cursor-pointer">Change Password</span> &gt;{" "}
                                <span className="text-2xl font-Raleway">Successfully Changed Password</span>
                            </h2>
                        </div>
                        <SuccessProfile setCurrentScreenMain={setCurrentScreenMain} />
                    </div>
                </>
            ) : (
                <div className='flex flex-col gap-14'>
                    <div className="flex items-center gap-6 py-4 cursor-pointer" >
                        <img src={leftBackIcon} alt='Not Found' className='w-5 h-5' />
                        <h2 className="text-2xl md:text-[32px] font-Raleway Raleway-medium">
                            <span onClick={setCurrentScreenMain} className="cursor-pointer">Change Password</span> &gt;{" "}
                            <span className="text-2xl font-Raleway">New Password</span>
                        </h2>
                    </div>

                    <div>
                        <div className="bg-white border-t border-t-[#EA7913] rounded-3xl p-8 max-w-[863px] mx-auto">
                            <form onSubmit={handleResetPassword} className="flex flex-col gap-66">
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
                                                value={formData.newPassword}
                                                onChange={onChange}
                                                className={`w-full pl-10 pr-3 py-2.5 rounded-xl text-[#525252] placeholder-[#525252] border-[1px] ${errors.newPassword ? 'border-red-500' : 'border-[#BDBDBD]'} focus:outline-none focus:ring-0 focus:border-[#EA7913]`}
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
                                        <label htmlFor="confirmPassword" className="block text-sm md:text-lg mb-2">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-3 flex items-center text-[#EA7913]">
                                                <img src={Password} alt="password" className="w-5 h-5" />
                                            </span>
                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={onChange}
                                                className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-[#525252] placeholder-[#525252] border-[1px] ${errors.confirmPassword ? 'border-red-500' : 'border-[#BDBDBD]'} focus:outline-none focus:ring-0 focus:border-[#EA7913]`}
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
                                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                                        )}
                                    </div>
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
                </div>
            )}
        </div>
    );
}

export default ResetPassword;
