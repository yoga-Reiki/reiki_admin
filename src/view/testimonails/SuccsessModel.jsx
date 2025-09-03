import React, { useEffect } from "react";
import { MdOutlineClose } from "react-icons/md";
import successIcon from "../../assets/img/success.png";

function SuccsessModel({ onClose }) {

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center text-center">
            <div className="bg-white p-8 border-t-2 border-t-[#EA7913] rounded-3xl md:w-[500px] xl:w-[625px] flex flex-col gap-5.5">
                <div className="flex items-center justify-between">
                    {/* Title */}
                    <h2 className="text-[32px] font-Raleway text-[#3D3D3D]">Success !</h2>
                    <button
                        onClick={onClose}
                        className="text-[#EA7913] border border-[#989898] cursor-pointer p-4 rounded-full"
                    >
                        <MdOutlineClose size={16} />
                    </button>

                </div>

                {/* Message */}
                <div>
                    {/* <h3>Testimonials successfully</h3> */}
                    <p className="text-[#464646] md:pt-10 xl:pt-18">Testimonials has been successfully added.</p>
                </div>

                {/* Icon (Use inline SVG or image) */}
                <div className="pt-5">
                    <img
                        src={successIcon}
                        alt="Success Icon"
                        className="lg:w-[200px] md:h-[200px] xl:w-[287px] xl:h-[287px] object-contain mx-auto"
                    />
                </div>

                {/* Back Button */}
                <button
                    onClick={onClose}
                    className="md:mt-6 xl:mt-15 w-full bg-[#EA7913] hover:bg-[#F39C2C] text-white py-2 rounded-full text-lg"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}

export default SuccsessModel;
