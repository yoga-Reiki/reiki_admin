import React from 'react'
import success from "../../assets/img/success.png"

function SuccessProfile({ setCurrentScreenMain }) {
    return (
        <div>
            <div className="bg-white border-t border-t-[#EA7913] rounded-3xl p-8 max-w-[863px] mx-auto">
                <div className="flex gap-8 flex-col items-center justify-center rounded-2xl text-center">
                    <h2 className="text-[32px] text-[#3D3D3D] Raleway-medium font-Raleway">Success!</h2>
                    <img src={success} alt="Success" className="w-72 h-72" />

                    <div className='pt-18 w-full'>
                        <div className="w-full relative inline-block rounded-full px-[4px] py-[3px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:to-[#F39C2C]">
                            <button
                                type="submit"
                                onClick={setCurrentScreenMain}
                                className="w-full py-2 bg-[#EA7913] text-lg text-white rounded-full font-medium hover:bg-[#F39C2C] disabled:opacity-60"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SuccessProfile