import React, { useRef, useState, useEffect } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import toast from "react-hot-toast";

function OtpModel({ form, setForm, errors, verifyOtp, loading }) {
    const inputsRef = useRef([]);
    const [timer, setTimer] = useState(300);
    const [isResendActive, setIsResendActive] = useState(false);

    useEffect(() => {
        let countdown;
        if (timer > 0) {
            countdown = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setIsResendActive(true);
        }
        return () => clearInterval(countdown);
    }, [timer]);

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        let otpArray = form.otp.split("");
        otpArray[index] = value;
        setForm({ ...form, otp: otpArray.join("") });

        if (value && index < inputsRef.current.length - 1) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !form.otp[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    const handleResend = () => {
        if (isResendActive) {
            toast.success("OTP resent successfully!");
            setTimer(300);
            setIsResendActive(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-24 text-[#464646]">
            <div>
                <label htmlFor="otp" className="block text-sm md:text-base mb-1 text-[#292929]">
                    OTP
                </label>
                <div className="flex space-x-1">
                    {Array(6)
                        .fill("")
                        .map((_, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                className={`w-17 h-14 text-center border rounded-lg text-lg focus:outline-none ${errors.otp
                                    ? "border-red-500"
                                    : "border border-[#BDBDBD] focus:ring-0 focus:border-[#EA7913]"
                                    }`}
                                value={form.otp[index] || ""}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => (inputsRef.current[index] = el)}
                            />
                        ))}
                </div>
                <div className={`${errors.otp && "flex justify-between"}`}>
                    {errors.otp && <p className="text-red-500 text-sm mt-2">{errors.otp}</p>}
                    <p className="flex justify-end text-sm mt-2">
                        {isResendActive ? (
                            <button
                                onClick={handleResend}
                                className="text-blue-500 underline hover:text-blue-700 cursor-pointer"
                            >
                                Resend OTP
                            </button>
                        ) : (
                            <>
                                <span className="underline pr-1">Resend </span> in {formatTime(timer)}
                            </>
                        )}
                    </p>
                </div>
            </div>

            <div className="w-full h-full relative inline-block rounded-full p-[1px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:via-[#F39C2C] hover:to-[#F39C2C] active:from-[#EA7913] active:via-[#EA7913] active:to-[#EA7913]">
                <button
                    type="button"
                    onClick={verifyOtp}
                    className="w-full h-12 inline-flex justify-center items-center space-x-1.5 py-3 bg-[#EA7913] text-[#F8F8F8] rounded-full font-medium hover:cursor-pointer hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-lg"
                >
                    {loading ? (
                        <span>Verify...</span>
                    ) : (
                        <>
                            <span>Verify</span>
                            <IoIosArrowRoundForward size={28} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default OtpModel;
