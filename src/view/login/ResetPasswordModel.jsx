import React from 'react'
import toast from 'react-hot-toast';

function ResetPasswordModel({ newPassword, setNewPassword, confirmPassword, setConfirmPassword, setStep }) {
    return (
        <>
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <input
                type="password"
                placeholder="New Password"
                className="input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Confirm Password"
                className="input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
                onClick={() => {
                    if (newPassword !== confirmPassword) {
                        toast.error("Passwords do not match");
                        return;
                    }
                    toast.success("Password successfully reset!");
                    setStep(4);
                }}
                className="btn mt-4"
            >
                Reset Password
            </button>
        </>
    )
}

export default ResetPasswordModel