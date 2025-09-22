import React, { useState, useRef, useEffect } from 'react';
import leftBackIcon from "../../assets/svg/leftIcon.svg";
import ResetPassword from './ResetPassword';
import { userVerifyOtp } from '../../services/LoginServices';
import toast from 'react-hot-toast';

function OtpVerification({ setCurrentScreenMain, ProfileData, email }) {
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [activeInput, setActiveInput] = useState(0);
    const [timer, setTimer] = useState(300);
    const [error, setError] = useState("");   // ✅ always a string
    const inputRefs = useRef([]);
    const [resetPassShow, setResetPassShow] = useState(false);
    const [resetToken, setResetToken] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const countdown = setInterval(() => {
            setTimer(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(countdown);
    }, []);

    const formatTime = () => {
        const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
        const seconds = String(timer % 60).padStart(2, '0');
        return `${minutes}:${seconds}`;
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
        setError(""); // ✅ reset error

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

    return (
        <div>
            {resetPassShow ? (
                <ResetPassword resetToken={resetToken} setCurrentScreenMain={setCurrentScreenMain} ProfileData={ProfileData} otp={otp} />
            ) : (
                <div className='flex flex-col gap-14'>
                    {/* Top Navigation */}
                    <div className="flex items-center gap-6 py-4 cursor-pointer">
                        <img onClick={setCurrentScreenMain} src={leftBackIcon} alt='Not Found' className='w-5 h-5' />
                        <h2 className="text-2xl md:text-[32px] font-Raleway Raleway-medium">
                            <span onClick={setCurrentScreenMain} className="cursor-pointer hover:text-[#EA7913]">Change Password</span> &gt;{" "}
                            <span className="text-2xl font-Raleway">OTP Verification</span>
                        </h2>
                    </div>

                    {/* OTP Section */}
                    <div>
                        <div className="bg-white border-t border-t-[#EA7913] rounded-3xl p-8 w-full xl:max-w-[863px] mx-auto">
                            <form onSubmit={verifyOtp} className="flex flex-col gap-5">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm md:text-lg">OTP</label>
                                    <div className="relative flex gap-2 justify-start">
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
                                                    w-12 h-12 md:w-[126px] md:h-[76px] 
                                                    text-center text-xl md:text-2xl font-semibold 
                                                    border rounded-xl outline-none transition-all 
                                                    ${activeInput === index ? "border-[#EA7913]" : "border-[#BDBDBD]"}
                                                    focus:border-[#EA7913]
                                                `}
                                            />
                                        ))}
                                    </div>

                                    {/* Error + Timer */}
                                    <div className="flex justify-between items-center">
                                        {error && <p className="text-red-500 text-sm">{error}</p>}
                                        <span className="text-sm text-[#333]">
                                            Resend in {formatTime()}
                                        </span>
                                    </div>
                                </div>

                                <div className="w-full relative inline-block rounded-full px-[4px] py-[3px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:to-[#F39C2C]">
                                    <button
                                        type="submit"
                                        className="w-full py-2 md:py-3 bg-[#EA7913] text-lg text-white rounded-full font-medium hover:bg-[#F39C2C] disabled:opacity-60"
                                        disabled={loading}
                                    >
                                        {loading ? "Verifying..." : "Verify Otp"}
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

export default OtpVerification;
