import React, { useState } from 'react';
import { getUserAccess } from '../../services/userServices';
import BlockUser from "../../assets/img/blockUser.webp"

function BlockUserModal({ onClose, blockUser, onConfirm, fetchUsers }) {
    const [loading, setLoading] = useState(false);

    const handleBlockUser = async () => {
        try {
            setLoading(true);
            const res = await getUserAccess({ userId: blockUser?._id });
            if (onConfirm) {
                onConfirm(res);
            }
            onClose();
            fetchUsers()
        } catch (err) {
            console.error("Block user failed:", err);
            alert("Something went wrong while blocking user!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4">
            <div className="bg-white rounded-3xl w-full max-w-[500px] h-[460px] p-6 flex flex-col justify-between">
                <div className='text-center space-y-2 px-20'>
                    <h2 className="text-[32px] font-Raleway Raleway-medium text-[#3D3D3D]">Block User</h2>
                    <p>This user will be temporarily restrict user to access their account.</p>
                </div>

                <img
                    src={BlockUser}
                    alt="Success Icon"
                    className="w-[389px] h-[184px] object-contain mx-auto"
                />

                {/* Buttons */}
                <div className="flex gap-2 h-12">
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-full bg-[#FCEAC9] text-xl text-[#464646] font-medium hover:bg-[#f9ddae] cursor-pointer"
                    >
                        Cancel
                    </button>
                    <div className="w-full relative inline-block rounded-full p-[1px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:via-[#F39C2C] hover:to-[#F39C2C] active:from-[#EA7913] active:via-[#EA7913] active:to-[#EA7913]">
                        <button
                            type="submit"
                            onClick={handleBlockUser}
                            disabled={loading}
                            className="w-full h-full inline-flex justify-center items-center space-x-1.5 py-3 bg-[#EA7913] text-xl text-[#F8F8F8] rounded-full font-medium cursor-pointer hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-base"
                        >
                            {loading
                                ? blockUser?.isActive ? "Blocking..." : "Unblocking..."
                                : blockUser?.isActive ? "Block" : "Unblock"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlockUserModal;
