import React from 'react'
import logoutImg from "../../assets/img/logoutImg.png"

function LogoutModel({ handleLogout, setCurrentScreenMain }) {
    return (
        <div>
            <div className="text-[#464646] flex justify-center items-center">
                <div className="bg-white rounded-3xl w-[784px] flex flex-col gap-6">
                    <p className="text-2xl text-[#656565]">Are you sure you want to log out?</p>
                    <div className='flex justify-center items-center'>
                        <img src={logoutImg} alt="Not Found" className='w-[264px] h-75' />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={setCurrentScreenMain}
                            className="bg-[#FEF8EC] border border-[#F9D38E] py-3 px-6 rounded-full cursor-pointer text-[#656565]"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-[#EA7913] text-white py-3 px-6 rounded-full cursor-pointer"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LogoutModel