import React, { useState, useRef, useEffect } from 'react';
import leftBackIcon from "../../assets/svg/leftIcon.svg";
import ResetPassword from './ResetPassword';
import { userVerifyOtp } from '../../services/LoginServices';
import toast from 'react-hot-toast';
import { getUserUpdate } from '../../services/userServices';

function OtpVerification({ setCurrentScreenMain, ProfileData, email, handleBackProfile, formData, fetchUserProfile, setInitialData, handleSaveDetails }) {
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [activeInput, setActiveInput] = useState(0);
    const [timer, setTimer] = useState(300);
    const [error, setError] = useState("");
    const inputRefs = useRef([]);
    const [resetPassShow, setResetPassShow] = useState(false);
    const [resetToken, setResetToken] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (timer === 0) return;
        const countdown = setInterval(() => {
            setTimer(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(countdown);
    }, [timer]);

    const formatTime = () => {
        const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
        const seconds = String(timer % 60).padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const handleResendOtp = () => {
        if (formatTime() === "00:00") {
            handleSaveDetails();
            setTimer(30);
        }
    };

    const handleChange = (value, index) => {
        if (/^\d?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            setError(""); // clear error
            if (value !== "" && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            if (otp[index] === "") {
                if (index > 0) {
                    inputRefs.current[index - 1].focus();
                }
            } else {
                const newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
            }
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        setError("");

        const fullOtp = otp.join('');
        if (fullOtp.length !== 6 || otp.includes("")) {
            setError("Please enter a valid 6-digit OTP.");
            return;
        }

        try {
            setLoading(true);
            const body = {
                email: email,
                otp: fullOtp.trim()
            };

            const res = await userVerifyOtp({ body });
            if (res.success) {
                setResetToken(res?.data?.resetToken);
                setResetPassShow(true);
            } else {
                setError(res.message || "OTP verification failed.");
                toast.error(res.message || "OTP verification failed.");
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to verify OTP. Try again.";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleOTPVerifyUpdateProfile = async (e) => {
        e.preventDefault();

        const fullOtp = otp.join('');
        if (fullOtp.length !== 6 || otp.includes("")) {
            setError("Please enter a valid 6-digit OTP.");
            return;
        }

        try {
            setLoading(true);
            const body = {
                email: formData.email,
                otp: fullOtp.trim()
            };

            const res = await userVerifyOtp({ body });
            if (res.success) {
                setLoading(true);
                try {
                    const userId = ProfileData?.data?._id;
                    const updatePayload = {
                        name: formData.name,
                        email: formData.email,
                        mobileNumber: formData.mobileNumber,
                    };

                    const res = await getUserUpdate({ userId, formData: updatePayload });
                    toast.success("Profile updated successfully!");

                    if (fetchUserProfile) {
                        await fetchUserProfile();
                    }
                    handleBackProfile()
                    setInitialData(formData);
                } catch (error) {
                    console.error(error);
                    toast.error(error.response?.data?.message || "Failed to update profile");
                } finally {
                    setLoading(false);
                }
            } else {
                setError(res.message || "OTP verification failed.");
                toast.error(res.message || "OTP verification failed.");
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to verify OTP. Try again.";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {resetPassShow ? (
                <ResetPassword resetToken={resetToken} setCurrentScreenMain={setCurrentScreenMain} ProfileData={ProfileData} otp={otp} />
            ) : (
                <div className='flex flex-col gap-6'>
                    <div className='text-[#656565] space-y-1'>
                        <h1 className="text-2xl font-Raleway Raleway-medium">Enter OTP</h1>
                        <p className='text-sm'>OTP has been send to {email}</p>
                    </div>

                    {/* OTP Section */}
                    <div>
                        <form onSubmit={verifyOtp ? verifyOtp : handleOTPVerifyUpdateProfile} className="flex flex-col gap-62">
                            <div className="flex flex-col gap-1">
                                <label className="text-[#292929]">OTP</label>
                                <div className="relative flex gap-4 justify-start">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleChange(e.target.value, index)}
                                            onFocus={() => setActiveInput(index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            className={`
                                                    w-18 h-18
                                                    text-center text-xl md:text-2xl font-semibold 
                                                    border rounded-xl outline-none transition-all 
                                                    ${activeInput === index ? "border-[#EA7913]" : "border-[#BDBDBD]"}
                                                    focus:border-[#EA7913]
                                                `}
                                        />
                                    ))}
                                </div>

                                {/* Error + Timer */}
                                <div className={`flex ${error ? "justify-between" : "justify-end"} items-center`}>
                                    {error && <p className="text-red-500 text-sm">{error}</p>}
                                    <button
                                        onClick={handleResendOtp}
                                        disabled={formatTime() !== "00:00"}
                                        className={`text-sm ${formatTime() === "00:00"
                                                ? "text-[#333] cursor-pointer"
                                                : "cursor-not-allowed"
                                            }`}
                                    >
                                        {formatTime() === "00:00" ? "Resend OTP" : `Resend in ${formatTime()}`}
                                    </button>
                                </div>

                            </div>

                            <div className='flex justify-end gap-2'>
                                <button
                                    type="button"
                                    className="bg-[#FCEAC9] text-[#656565] px-6 py-3 rounded-full hover:bg-[#FCEAC2] cursor-pointer"
                                    onClick={handleBackProfile}
                                >
                                    Cancel
                                </button>
                                <div className="relative inline-block rounded-full p-[1px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:to-[#F39C2C]">
                                    <button
                                        type="submit"
                                        className="py-3 px-6 bg-[#EA7913] text-lg text-white rounded-full font-medium hover:bg-[#F39C2C] disabled:opacity-60"
                                        disabled={loading}
                                    >
                                        {loading ? "Verifying..." : "Verify"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OtpVerification;
