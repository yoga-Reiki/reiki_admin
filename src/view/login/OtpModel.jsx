import React from 'react'
import toast from 'react-hot-toast';

function OtpModel({ otp, setOtp, setStep }) {
    return (
        <>
            <input
                type="text"
                placeholder="Enter OTP"
                className="input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
            />
            <button
                onClick={() => {
                    if (otp === "123456") {
                        toast.success("OTP Verified");
                        setStep(3);
                    } else {
                        toast.error("Invalid OTP");
                    }
                }}
                className="btn mt-4"
            >
                Verify OTP
            </button>
        </>
    )
}

export default OtpModel