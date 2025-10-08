import React, { useEffect, useState } from 'react'
import { IoEyeOffOutline } from "react-icons/io5";
import eyeIcon from "../../assets/svg/eyeIcon.svg";
import OtpVerification from './OtpVerification';
import { userForgotPassowrd } from '../../services/LoginServices';
import Password from "../../assets/svg/Password.svg";

function ChangePassword({ setCurrentScreenMain, ProfileData }) {
    const [formData, setFormData] = useState({
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [otpVerification, setOtpVerification] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (ProfileData?.data?.email) {
            setFormData((prev) => ({ ...prev, email: ProfileData.data.email }));
        }
    }, [ProfileData]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.currentPassword.trim()) {
            newErrors.currentPassword = "Please enter your current password.";
        }

        if (!formData.newPassword.trim()) {
            newErrors.newPassword = "Please enter a new password.";
        } else if (
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.newPassword)
        ) {
            newErrors.newPassword =
                "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.";
        }

        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = "Please confirm your password.";
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        return newErrors;
    };

    const handleForgotPassword = async (e) => {
        e?.preventDefault();

        try {
            setErrors({});
            const body = { email: formData.email.trim() };

            const res = await userForgotPassowrd({ body });
            console.log("Forgot password response:", res);
            setOtpVerification(true);
        } catch (err) {
            console.error("Forgot password failed:", err);
            setErrors({
                api: err.response?.data?.message || "Failed to send reset email. Try again."
            });
        }
    };

    const handleChangePassword = async (e) => {
        e?.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setLoading(true);
            setErrors({});
            const body = { email: formData.email.trim() };

            const res = await userForgotPassowrd({ body });
            console.log("Forgot password response:", res);
            setOtpVerification(true);
        } catch (err) {
            console.error("Forgot password failed:", err);
            setErrors({
                api: err.response?.data?.message || "Failed to send reset email. Try again."
            });
        } finally {
            setLoading(false);
        }
    };

    if (otpVerification) {
        return (
            <OtpVerification
                currentPassword={formData?.currentPassword}
                email={formData.email}
                handleClose={() => setOtpVerification(false)}
                ProfileData={ProfileData}
            />
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-Raleway Raleway-medium text-[#656565]">
                Change Password
            </h2>

            <form onSubmit={handleChangePassword} className="flex flex-col">
                <div className='pb-29'>
                    <div>
                        <label htmlFor="currentPassword" className="block text-[#292929] mb-1">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                id="currentPassword"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={onChange}
                                className={`w-full h-11 px-4 py-2.5 rounded-full text-[#525252] border-[1px] ${errors.currentPassword ? "border-red-500" : "border-[#BDBDBD]"} focus:outline-none focus:ring-0 focus:border-[#EA7913]`}
                                placeholder="Enter Your Current Password"
                                type={showCurrentPassword ? "text" : "password"}
                                onCopy={(e) => e.preventDefault()}
                                onCut={(e) => e.preventDefault()}
                                onPaste={(e) => e.preventDefault()}
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer focus:outline-none"
                            >
                                {showCurrentPassword ? (
                                    <img src={eyeIcon} className="w-5 h-5" alt="eye" />
                                ) : (
                                    <IoEyeOffOutline className="w-5 h-5 text-[#EA7913]" />
                                )}
                            </button>
                        </div>
                        {errors.currentPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                        )}
                        <div className="flex justify-end pt-1">
                            <button
                                type="button"
                                className="text-xs cursor-pointer"
                                onClick={() => {
                                    handleForgotPassword()
                                }}
                            >
                                Forgot Password ?
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="newPassword" className="block text-[#292929] mb-1">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                id="newPassword"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={onChange}
                                className={`w-full h-11 px-4 py-2.5 rounded-full text-[#525252] border-[1px] ${errors.newPassword ? "border-red-500" : "border-[#BDBDBD]"} focus:outline-none focus:ring-0 focus:border-[#EA7913]`}
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

                    <div className='pt-5'>
                        <label htmlFor="confirmPassword" className="block text-[#292929] mb-1">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={onChange}
                                className={`w-full h-11 px-4 py-2.5 rounded-full text-[#525252] border-[1px] ${errors.confirmPassword ? "border-red-500" : "border-[#BDBDBD]"} focus:outline-none focus:ring-0 focus:border-[#EA7913]`}
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

                {/* Submit Button */}
                <div className='flex justify-end h-12'>
                    <div className="relative inline-block rounded-full p-[1px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:to-[#F39C2C]">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-[#EA7913] text-lg text-white rounded-full font-medium hover:bg-[#F39C2C] disabled:opacity-60 cursor-pointer"
                        >
                            {loading ? "Sending..." : "Next"}
                        </button>
                    </div>
                </div>
                {errors.api && (
                    <p className="text-red-500 text-center text-sm mt-2">{errors.api}</p>
                )}
            </form>
        </div>
    );
}

export default ChangePassword;
