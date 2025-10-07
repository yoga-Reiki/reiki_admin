import React, { useEffect, useState } from "react";
import editIconDarkGrey from "../../assets/svg/editIconDarkGrey.svg"
import deleteIconGrey from "../../assets/svg/deleteIconGrey.svg";
import DotMenuIcon from "../../assets/svg/DotMenuIcon.svg";

function SkeletonBox() {
    return (
        <div className="bg-gray-300 animate-pulse rounded-3xl h-[444px] lg:h-[396px] xl:h-[542px] w-full"></div>
    );
}

const CourseCard = ({
    setIsEditingCard,
    setSelectedCourse,
    coursesData,
    setCoursesDelete,
    loading,
}) => {
    const [hoveredCard, setHoveredCard] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null);

    const handleEdit = (course) => {
        setSelectedCourse(course);
        setIsEditingCard(true);
        setMenuOpen(null);
    };

    const handleDelete = (courseId) => {
        setCoursesDelete(courseId);
        setMenuOpen(null);
    };

    return (
        <div className="px-3">
            <div className="p-6 rounded-2xl bg-white flex flex-col gap-8">
                <h2 className="text-2xl text-[#656565] font-Raleway Raleway-medium">
                    Courses Card
                </h2>

                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <SkeletonBox key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
                        {coursesData.map((item, index) => (
                            <div
                                key={index}
                                className="relative bg-white rounded-3xl"
                                onMouseEnter={() => setHoveredCard(index)}
                                onMouseLeave={() => {
                                    setHoveredCard(null);
                                    setMenuOpen(null);
                                }}
                            >
                                {/* Hover Dot Menu */}
                                {hoveredCard === index && (
                                    <div className="absolute top-4 right-4 z-20">
                                        <button
                                            onClick={() =>
                                                setMenuOpen(
                                                    menuOpen === index
                                                        ? null
                                                        : index
                                                )
                                            }
                                            className="p-3 rounded-full bg-white border border-[#FCEAC9] cursor-pointer"
                                        >
                                            <img
                                                src={DotMenuIcon}
                                                alt="menu"
                                                className="w-6 h-6"
                                            />
                                        </button>

                                        {/* Dropdown */}
                                        {menuOpen === index && (
                                            <div className="absolute space-y-2 right-0 mt-2 w-48 lg:w-55 bg-white rounded-2xl p-2 cursor-pointer border border-[#FCEAC9] z-20">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(item)
                                                    }
                                                    className="cursor-pointer flex items-center gap-2.5 w-full rounded-xl p-3 text-left text-sm hover:bg-[#FEF8EC] text-[#656565] hover:text-[#292929]"
                                                >
                                                    <img src={editIconDarkGrey} alt="Edit" className="w-5 h-5" />
                                                    <p>Edit Course</p>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(item._id)
                                                    }
                                                    className="cursor-pointer flex items-center gap-2.5 w-full rounded-xl p-3 text-left text-sm hover:bg-[#FEF8EC] text-[#656565] hover:text-[#292929]"
                                                >
                                                    <img src={deleteIconGrey} alt="deleteIcon" className="w-5 h-5" />
                                                    <p>Delete Course</p>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Course Image and Info */}
                                <div className="relative overflow-hidden">
                                    <img
                                        src={item.listImageUrl}
                                        loading="lazy"
                                        alt={item.title}
                                        className="w-full max-[375px]:h-[380px] h-[444px] lg:h-[396px] xl:h-[504px] object-cover rounded-3xl"
                                    />
                                    <div className="py-4.5 px-6 absolute bottom-2 left-2 right-2 bg-white bg-opacity-90 h-[223px] xl:h-[256px] backdrop-blur-md rounded-3xl flex flex-col justify-between">
                                        <div className="flex flex-col gap-2 pb-4">
                                            <h3 className="text-xl xl:text-2xl font-semibold">
                                                {item.title}
                                            </h3>
                                            <p className="text-xs xl:text-sm text-[#656565] whitespace-pre-line line-clamp-5 xl:line-clamp-6">
                                                {item?.shortContent}
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl md:text-[32px] font-Raleway text-[#292929]">
                                                    ${item.priceNew}
                                                </span>
                                                <span className="text-base sm:text-lg text-[#EF4444] line-through">
                                                    ${item.priceOld}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
};

export default CourseCard;
