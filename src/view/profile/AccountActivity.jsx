import React from 'react';
import leftBackIcon from "../../assets/svg/leftIcon.svg";
import LogoutIconRed from "../../assets/svg/LogoutIconRed.svg";

const devices = [
    { id: 1, name: "Desktop - 2310", date: "18/08/2025" },
    { id: 2, name: "Desktop - 2399", date: "15/02/2025" },
    { id: 3, name: "Desktop - 2450", date: "14/01/2025" },
];

function AccountActivity({ setCurrentScreenMain }) {
    return (
        <div className="flex flex-col gap-2">
            <div onClick={setCurrentScreenMain} className="flex items-center gap-6 py-4 cursor-pointer" >
                <img src={leftBackIcon} alt='Not Found' className='w-5 h-5' />
                <h1 className="text-[32px] font-Raleway Raleway-medium">Account Activity</h1>
            </div>

            {/* Device List */}
            <div className="flex flex-col gap-4">
                {devices.map((device) => (
                    <div
                        key={device.id}
                        className="bg-white text-[#525252] rounded-xl p-4 sm:p-6 flex items-center justify-between"
                    >
                        <div className='flex flex-col gap-2.5'>
                            <p className="text-lg">{device.name}</p>
                            <p className="text-sm">{device.date}</p>
                        </div>
                        <button
                            className="px-6 py-3 bg-[#FEF2F2] text-[#EF4444] hover:bg-[#FCDADA] border border-[#FECACA] rounded-full flex items-center justify-center gap-2 transition"
                        >
                            <img src={LogoutIconRed} alt="Not Found" />
                            Logout
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AccountActivity;
