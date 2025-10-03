import React from "react";
import DeleteImg from "../../assets/img/DeleteImg.png"

function DeleteModel({ onCancel, onConfirm, onCancelImg, onfirmGalleryImgDelete, onConfirmBlog, onConfirmProduct, onConfirmCourse, courseLoading, productLoading }) {
    return (
        <div className="fixed inset-0 bg-black/40 z-50 text-[#464646] flex justify-center items-center">
            <div className="bg-white p-6 w-full max-w-[500px] rounded-3xl flex flex-col gap-9">
                <div className="text-center text-[#3D3D3D]">
                    <h2 className="text-[32px] leading-[40px] font-Raleway Raleway-medium pb-2">Delete {onConfirm ? "Testimonials" : onConfirmBlog ? "Blog" : onConfirmProduct ? "Product" : onConfirmCourse ? "Courses" : "Image"}</h2>
                    <p>
                        {onConfirm ? "This will lead to delete testimonials in website" : onConfirmBlog ? "This will lead to delete Blog in website"
                            : onConfirmProduct ? "This will lead to delete Product in website" : onConfirmCourse ? "This will lead to delete Courses in website" : "This will lead to delete this image in website"}
                    </p>
                </div>

                <div className="flex justify-center">
                    <img src={DeleteImg} alt="Not Found" className="w-41 h-66" />
                </div>

                <div className="flex justify-center gap-2 pt-3">
                    <button
                        onClick={onCancel ? onCancel : onCancelImg}
                        className="w-full h-12 py-3 rounded-full bg-[#FCEAC9] text-[#111111] hover:bg-[#FCEAC9] transition cursor-pointer"
                    >
                        Cancel
                    </button>
                    <div className="w-full relative inline-block rounded-full p-[1px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:via-[#F39C2C] hover:to-[#F39C2C] active:from-[#EA7913] active:via-[#EA7913] active:to-[#EA7913]">
                        <button
                            type="button"
                            onClick={onConfirm ? onConfirm : onConfirmBlog ? onConfirmBlog : onConfirmProduct ? onConfirmProduct : onConfirmCourse ? onConfirmCourse : onfirmGalleryImgDelete}
                            className="w-full h-full inline-flex justify-center items-center space-x-1.5 py-3 bg-[#EA7913] text-[#F8F8F8] rounded-full font-medium hover:cursor-pointer hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-base"
                        >
                            {courseLoading || productLoading ? (<span>Deleting...</span>
                            ) : (
                                <span>Delete</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteModel;
