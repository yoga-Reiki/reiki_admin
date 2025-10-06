import React, { useState } from "react";
import DeleteImg from "../../assets/img/DeleteImg.png";

function DeleteModel({
    onCancel,
    onConfirm,
    onCancelImg,
    onfirmGalleryImgDelete,
    onConfirmBlog,
    onConfirmProduct,
    onConfirmCourse,
}) {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm =
        onConfirm ||
        onConfirmBlog ||
        onConfirmProduct ||
        onConfirmCourse ||
        onfirmGalleryImgDelete;

    const handleDeleteClick = async () => {
        try {
            setIsLoading(true);
            await handleConfirm();
        } catch (err) {
            console.error("Delete failed:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 text-[#464646] flex justify-center items-center">
            <div className="bg-white p-6 w-full max-w-[500px] rounded-3xl flex flex-col gap-9">
                {/* Header */}
                <div className="text-center text-[#3D3D3D]">
                    <h2 className="text-[32px] leading-[40px] font-Raleway Raleway-medium pb-2">
                        Delete{" "}
                        {onConfirm
                            ? "Testimonials"
                            : onConfirmBlog
                                ? "Blog"
                                : onConfirmProduct
                                    ? "Product"
                                    : onConfirmCourse
                                        ? "Courses"
                                        : "Image"}
                    </h2>
                    <p>
                        {onConfirm
                            ? "This will delete the testimonial from the website."
                            : onConfirmBlog
                                ? "This will lead to delete blog in website"
                                : onConfirmProduct
                                    ? "This will delete the product from the website."
                                    : onConfirmCourse
                                        ? "This will delete the course from the website."
                                        : "This will delete the image from the website."}
                    </p>
                </div>

                {/* Image */}
                <div className="flex justify-center">
                    <img src={DeleteImg} alt="Delete" className="w-41 h-66" />
                </div>

                {/* Buttons */}
                <div className="flex justify-center gap-2 pt-3">
                    <button
                        onClick={onCancel ? onCancel : onCancelImg}
                        disabled={isLoading}
                        className={`w-full h-12 py-3 rounded-full text-[#111111] transition cursor-pointer ${isLoading
                            ? "bg-[#F5F5F5] text-[#A3A3A3] cursor-not-allowed"
                            : "bg-[#FCEAC9] hover:bg-[#FCE0AE]"
                            }`}
                    >
                        Cancel
                    </button>

                    <div className="w-full relative inline-block rounded-full p-[1px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900]">
                        <button
                            type="button"
                            onClick={handleDeleteClick}
                            disabled={isLoading}
                            className={`w-full h-full inline-flex justify-center items-center space-x-2 py-3 rounded-full font-medium transition text-[#FFFFFF] text-base cursor-pointer ${isLoading
                                ? "bg-[#F3A86A] cursor-not-allowed"
                                : "bg-[#EA7913] hover:bg-[#F39C2C] active:bg-[#EA7913]"
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                    </svg>
                                    <span>Deleting...</span>
                                </>
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
