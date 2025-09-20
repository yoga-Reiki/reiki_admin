import React, { useState } from 'react';
import UserIcon from "../../assets/svg/userIcon.svg"
import { MdOutlineClose } from "react-icons/md";
import { getUserAccess } from '../../services/userServices';

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
            <div className="bg-white rounded-3xl w-full max-w-[625px] h-[692px] p-6 md:p-8 flex flex-col justify-between">
                <div>
                    <div className='flex justify-between items-center p-3 mb-5.5'>
                        <h2 className="text-[32px] font-Raleway Raleway-medium text-[#3D3D3D]">Block User</h2>

                        <button onClick={onClose} className="text-[#EA7913] border border-[#989898] cursor-pointer p-4 rounded-full">
                            <MdOutlineClose size={16} />
                        </button>
                    </div>

                    <div className='space-y-4.5'>
                        {/* Name Input */}
                        <div className="flex items-center w-full p-1 rounded-2xl overflow-hidden bg-gradient-to-r from-[#FCEAC9] to-[#EA7913]">
                            <div className="flex items-center gap-2 px-4 py-2 text-lg text-[#464646] font-medium">
                                <img src={UserIcon} alt='Not Found' className='w-5 h-5' /> Name
                            </div>
                            <input
                                type="text"
                                readOnly
                                value={blockUser?.name}
                                className="flex-1 px-4 py-2 bg-[#FFFFFF] rounded-xl outline-none border-0"
                            />
                        </div>

                        {/* Access Tags */}
                        <div className="mb-8">
                            <p className="text-[#656565] text-xl pb-2.5">Access to :</p>
                            <div className="flex flex-wrap gap-2">
                                {["Reiki Grandmaster ", "Reiki Full course"].map((item, idx) => (
                                    <span key={idx} className="px-2.5 py-1.5 text-sm text-[#656565] rounded-full border border-[#F9D38E]">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>


                {/* Buttons */}
                <div className="flex space-x-6">
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-full bg-[#FCEAC9] text-xl text-[#464646] font-medium hover:bg-[#f9ddae]"
                    >
                        Cancel
                    </button>
                    <div className="w-full relative inline-block rounded-full px-[5px] py-[3px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:via-[#F39C2C] hover:to-[#F39C2C] active:from-[#EA7913] active:via-[#EA7913] active:to-[#EA7913]">
                        <button
                            type="submit"
                            onClick={handleBlockUser}
                            disabled={loading}
                            className="w-full h-full inline-flex justify-center items-center space-x-1.5 py-2.5 bg-[#EA7913] text-xl text-[#F8F8F8] rounded-full font-medium hover:cursor-pointer hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-base"
                        >
                            {loading
                                ? blockUser?.isActive ? "Blocking..." : "Unblocking..."
                                : blockUser?.isActive ? "Confirm to Block User" : "Confirm to Unblock User"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlockUserModal;
