import React from 'react';
import { useNavigate } from 'react-router-dom';

function Error() {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center h-[36rem] xl:min-h-[48rem]">
            <div className="text-center">
                <h1 className="text-8xl lg:text-[104px] lg:leading:-[112px] font-delcy font-bold text-[#656565]">Error!</h1>

                <p className="text-xl lg:text-[32px] text-[#7C7C7C]">Oops! Some error occurred.</p>

                <div className="mt-10 md:mt-12 relative inline-block rounded-full px-[5px] py-[3px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:via-[#F39C2C] hover:to-[#F39C2C] active:from-[#EA7913] active:via-[#EA7913] active:to-[#EA7913]">
                    <button
                        type="submit"
                        className="w-full h-full inline-flex items-center space-x-1.5 px-6 py-2 bg-[#EA7913] text-[#F8F8F8] rounded-full font-medium hover:cursor-pointer hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-base"
                    >
                        <span>Go to Dashboard</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Error;
