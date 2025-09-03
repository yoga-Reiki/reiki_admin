import React from "react";

function DeleteModel({ onCancel, onConfirm, onCancelImg, onfirmGalleryImgDelete }) {
    return (
        <div className="fixed inset-0 bg-black/40 z-50 text-[#464646] flex justify-center items-center">
            <div className="bg-white p-14 w-full max-w-[670px] border-t-2 border-t-[#EA7913] rounded-3xl flex flex-col gap-14">
                <div>
                    <h2 className="text-[32px] font-Raleway text-[#656565] pb-3.5">Delete {onConfirm ? "Testimonials" : "Image"}</h2>
                    <p className="text-[#656565] text-xl">
                        {onConfirm ? "This will lead to delete testimonials in website" : "This will lead to delete Image in website"}
                    </p>
                </div>
                <div className="flex justify-center gap-6">
                    <button
                        onClick={onCancel ? onCancel : onCancelImg}
                        className="w-full py-2 rounded-full bg-[#FCEAC9] text-[#111111] hover:bg-[#FCEAC9] transition cursor-pointer"
                    >
                        Cancel
                    </button>
                    <div className="w-full relative inline-block rounded-full px-[4px] py-[3px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:via-[#F39C2C] hover:to-[#F39C2C] active:from-[#EA7913] active:via-[#EA7913] active:to-[#EA7913]">
                        <button
                            type="button"
                            onClick={onConfirm ? onConfirm : onfirmGalleryImgDelete}
                            className="w-full h-full inline-flex justify-center items-center space-x-1.5 px-6 py-2.5 bg-[#EA7913] text-[#F8F8F8] rounded-full font-medium hover:cursor-pointer hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-base"
                        >
                            Confirm to delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteModel;
