import React from 'react'
import success from "../../assets/img/success.png"

function SuccessModel({ setStep0 }) {
    return (
        <>
            <div className="flex flex-col justify-center items-center gap-12">
                <img
                    src={success}
                    alt="Not Found"
                    className="w-66 h-66"
                />
                <div className="w-full relative inline-block rounded-full p-[1px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:via-[#F39C2C] hover:to-[#F39C2C] active:from-[#EA7913] active:via-[#EA7913] active:to-[#EA7913]">
                    <button
                        type="submit"
                        onClick={setStep0}
                        className="w-full h-12 inline-flex justify-center items-center space-x-1.5 py-3 bg-[#EA7913] text-[#F8F8F8] rounded-full cursor-pointer hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-lg"
                    >
                        login again
                    </button>
                </div>
            </div>
        </>
    )
}

export default SuccessModel
