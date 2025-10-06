import React, { useEffect } from "react";
import { MdOutlineClose } from "react-icons/md";
import successIcon from "../../assets/img/success.png";

function SuccsessModel({ onClose, showSuccessTestimonails, showSuccessBlog, showSuccessCourse, showSuccessProduct }) {

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center text-center">
            <div className="bg-white p-6 rounded-3xl w-100 lg:w-[500px] flex flex-col gap-6 lg:gap-9">
                <div className="space-y-2">
                    <h2 className="text-[32px] font-Raleway Raleway-medium text-[#3D3D3D] text-center">Success</h2>

                    <div>
                        <p className="text-[#464646]">{showSuccessTestimonails ? "Testimonial Added Successfully"
                            : showSuccessBlog ? "Blog has been successfully added." : showSuccessCourse ? "Course has been successfully added." : showSuccessProduct && "Product has been successfully added."}</p>
                    </div>
                </div>

                <div className="flex justify-center items-center">
                    <img
                        src={successIcon}
                        alt="Success Icon"
                        className="w-[264px] h-[264px] object-contain"
                    />
                </div>

                {/* Back Button */}
                <button
                    onClick={onClose}
                    className="mt-3 w-full bg-[#EA7913] hover:bg-[#F39C2C] text-white py-2 rounded-full text-lg"
                >
                    Done
                </button>
            </div>
        </div>
    );
}

export default SuccsessModel;
