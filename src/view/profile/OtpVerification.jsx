import React, { useState, useRef, useEffect } from 'react';
import leftBackIcon from "../../assets/svg/leftIcon.svg";
import ResetPassword from './ResetPassword';

function OtpVerification({ setCurrentScreenMain }) {
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [activeInput, setActiveInput] = useState(0);
    const [timer, setTimer] = useState(300);
    const [error, setError] = useState("");
    const inputRefs = useRef([]);
    const [resetPassShow, setResetPassShow] = useState(false)

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
            setError("");
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

    const verifyOtp = (e) => {
        e.preventDefault();

        const fullOtp = otp.join('');
        if (fullOtp.length !== 6 || otp.includes("")) {
            setError("Please enter a valid 6-digit OTP.");
            return;
        }
        setError("");
        console.log("Entered OTP:", fullOtp);
        setResetPassShow(true);
    };

    return (
        <div>
            {resetPassShow ? (
                <ResetPassword setCurrentScreenMain={setCurrentScreenMain} />
            ) : (
                <div className='flex flex-col gap-14'>
                    {/* Top Navigation */}
                    <div className="flex items-center gap-6 py-4 cursor-pointer">
                        <img src={leftBackIcon} alt='Not Found' className='w-5 h-5' />
                        <h2 className="text-2xl md:text-[32px] font-Raleway Raleway-medium">
                            <span onClick={setCurrentScreenMain} className="cursor-pointer">Change Password</span> &gt;{" "}
                            <span className="text-2xl font-Raleway">OTP Verification</span>
                        </h2>
                    </div>

                    {/* OTP Section */}
                    <div>
                        <div className="bg-white border-t border-t-[#EA7913] rounded-3xl p-8 w-full xl:max-w-[863px] mx-auto">
                            <form onSubmit={verifyOtp} className="flex flex-col gap-51">

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

                                    <div className={`${error && "flex justify-between"}`}>
                                        {error && <p className="text-red-500 text-sm">{error}</p>}

                                        {/* Timer */}
                                        <span className="flex justify-end text-sm text-[#333]">
                                            Resend in {formatTime()}
                                        </span>
                                    </div>
                                </div>

                                <div className="w-full relative inline-block rounded-full px-[4px] py-[3px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:to-[#F39C2C]">
                                    <button
                                        type="submit"
                                        className="w-full py-2 md:py-3 bg-[#EA7913] text-lg text-white rounded-full font-medium hover:bg-[#F39C2C] disabled:opacity-60"
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

export default OtpVerification;
