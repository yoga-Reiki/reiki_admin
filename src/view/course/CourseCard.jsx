import React, { useEffect, useState } from "react";
import Left from "../../assets/svg/left.svg";
import Right from "../../assets/svg/right.svg";
import editIconGrey from "../../assets/svg/editIconGrey.svg";
import deleteIconGrey from "../../assets/svg/deleteIconGrey.svg";

const CourseCard = ({ setIsEditingCard, setSelectedCourse, coursesData, setCoursesDelete, loading }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [cardsToShow, setCardsToShow] = useState(3);

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 1024) {
                setCardsToShow(1);
            } else {
                setCardsToShow(2);
            }
        }
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (currentSlide > coursesData.length - cardsToShow) {
            setCurrentSlide(Math.max(0, coursesData.length - cardsToShow));
        }
    }, [cardsToShow, coursesData.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => Math.min(prev + 1, coursesData.length - cardsToShow));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
    };

    return (
        <div className="p-2.5">
            <div className="p-5 rounded-2xl bg-white border-t-2 border-t-[#EA7913] flex flex-col gap-5.5">
                {/* Header with Pagination */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl text-[#656565] font-Raleway">Courses Card</h2>
                    <div className="flex space-x-2.5">
                        <button
                            onClick={prevSlide}
                            disabled={currentSlide === 0}
                            className={`w-12 h-12 bg-[#FCEAC9] hover:bg-[#FEF8EC] rounded-full flex items-center justify-center transition-all duration-300
                                ${currentSlide === 0 ? "bg-[#FEF8EC] cursor-not-allowed" : "cursor-pointer"}`}
                        >
                            <img src={Left} alt="Previous" className="w-3 h-2.5" />
                        </button>
                        <button
                            onClick={nextSlide}
                            disabled={currentSlide >= coursesData.length - cardsToShow}
                            className={`w-12 h-12 bg-[#FCEAC9] hover:bg-[#FEF8EC] rounded-full flex items-center justify-center transition-all duration-300
                                ${currentSlide >= coursesData.length - cardsToShow
                                    ? "bg-[#FEF8EC] cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                        >
                            <img src={Right} alt="Next" className="w-3 h-2.5" />
                        </button>
                    </div>
                </div>

                {/* Loading Skeletons */}
                {loading ? (
                    <div className="flex gap-6">
                        {[...Array(cardsToShow)].map((_, index) => (
                            <div
                                key={index}
                                className="bg-gray-200 animate-pulse rounded-xl h-[300px] w-full"
                                style={{
                                    flex: `0 0 ${100 / cardsToShow}%`,
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-hidden relative">
                        <div
                            className="flex gap-6 transition-transform duration-500 ease-in-out"
                            style={{
                                transform: `translateX(-${(100 / coursesData.length) * currentSlide}%)`,
                                width: `${(100 / cardsToShow) * coursesData.length}%`,
                            }}
                        >
                            {coursesData?.map((data, index) => (
                                <div
                                    key={index}
                                    className="relative rounded-3xl overflow-hidden"
                                    style={{
                                        flex: `0 0 ${100 / coursesData.length}%`,
                                        maxWidth: `${96 / coursesData.length}%`,
                                    }}
                                >
                                    <img
                                        src={data.listImageUrl}
                                        alt={data.title}
                                        className="w-full h-[260px] object-cover"
                                    />
                                    <button
                                        onClick={() => {
                                            setSelectedCourse(data);
                                            setIsEditingCard(true);
                                        }}
                                        className="absolute flex items-center gap-2 top-3 left-3 bg-[#FFFFFF] p-3 text-[#656565] rounded-full border border-[#989898] cursor-pointer hover:bg-gray-100"
                                    >
                                        <img src={editIconGrey} alt="Edit" className="p-0.5" /> <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={() => setCoursesDelete(data)}
                                        className="absolute bottom-3 left-3 bg-white p-3 cursor-pointer rounded-full border border-[#989898] hover:bg-gray-100"
                                    >
                                        <img src={deleteIconGrey} alt="Delete" />
                                    </button>
                                    <div className="absolute flex flex-col justify-between top-3 right-3 bottom-3 w-[80%] sm:w-[75%] md:w-[56%] bg-white rounded-3xl px-6 py-4.5">
                                        <div>
                                            <h3 className="text-xl text-[#292929] mb-2">{data.title}</h3>
                                            {/* <p className="text-sm text-[#525252] lg:line-clamp-4 line-clamp-none">
                                                {data?.shortContent}
                                            </p> */}
                                            <p className="text-sm text-[#525252] whitespace-pre-line md:line-clamp-3 lg:line-clamp-4">
                                                {data?.shortContent}
                                            </p>
                                        </div>
                                        <div className="flex items-end gap-2">
                                            <span className="text-lg md:text-[32px] md:leading-[40px] font-Raleway text-[#292929]">
                                                ${data.priceNew}
                                            </span>
                                            <span className="text-lg text-[#EF4444] line-through">
                                                ${data.priceOld}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseCard;
