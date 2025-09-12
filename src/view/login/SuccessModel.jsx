import React from 'react'
import success from "../../assets/img/success.png"

function SuccessModel({ setStep0 }) {
    return (
        <>
            <div className="flex flex-col justify-center items-center">
                <img
                    src={success}
                    alt="Not Found"
                    className="w-[287px] h-[287px]"
                />
                <div className="w-full mt-6 relative inline-block rounded-full px-[5px] py-[4px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:via-[#F39C2C] hover:to-[#F39C2C] active:from-[#EA7913] active:via-[#EA7913] active:to-[#EA7913]">
                    <button
                        type="submit"
                        onClick={setStep0}
                        className="w-full h-full inline-flex justify-center items-center space-x-1.5 py-2 bg-[#EA7913] text-[#F8F8F8] rounded-full font-medium hover:cursor-pointer hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-base"
                    >
                        login again
                    </button>
                </div>
            </div>
        </>
    )
}

export default SuccessModel
