import React, { useEffect, useState } from "react";
import Right from "../../assets/svg/right.svg";
import Left from "../../assets/svg/left.svg";

function CourseSection({ coursesData, loading }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(4);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setCardsToShow(1);
      } else if (window.innerWidth < 1025) {
        setCardsToShow(2);
      } else if (window.innerWidth < 1280) {
        setCardsToShow(3);
      } else {
        setCardsToShow(4);
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

  const cardWidthPercent = 100 / cardsToShow;

  return (
    <div className="p-2.5">
      <div className="bg-white p-5 rounded-xl border-t-2 border-t-[#EA7913] relative overflow-hidden flex flex-col gap-5.5">
        {/* Header and Navigation */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl text-[#656565] font-Raleway">Courses Section</h2>
          <div className="flex space-x-2.5">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`w-12 h-12 bg-[#FCEAC9] hover:bg-[#FEF8EC] rounded-full flex items-center justify-center transition-all duration-300 ${
                currentSlide === 0 ? "bg-[#FEF8EC] cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <img src={Left} alt="Previous" className="w-3 h-2.5" />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentSlide >= coursesData.length - cardsToShow}
              className={`w-12 h-12 bg-[#FCEAC9] hover:bg-[#FEF8EC] rounded-full flex items-center justify-center transition-all duration-300 ${
                currentSlide >= coursesData.length - cardsToShow ? "bg-[#FEF8EC] cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <img src={Right} alt="Next" className="w-3 h-2.5" />
            </button>
          </div>
        </div>

        {/* Slider / Skeletons */}
        <div className="overflow-hidden">
          {loading ? (
            // ✅ Simple box skeletons
            <div className="flex gap-6">
              {[...Array(cardsToShow)].map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-gray-200 rounded-3xl h-[450px] w-full"
                  style={{ flex: `0 0 ${100 / cardsToShow}%` }}
                />
              ))}
            </div>
          ) : (
            // ✅ Real course data
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                width: `${(coursesData.length * 100) / cardsToShow}%`,
                transform: `translateX(-${currentSlide * cardWidthPercent}%)`,
              }}
            >
              {coursesData.map((item, index) => (
                <div
                  key={index}
                  className="px-1.5 md:px-3"
                  style={{
                    flex: `0 0 ${100 / coursesData.length}%`,
                    maxWidth: `${96 / coursesData.length}%`,
                  }}
                >
                  <div className="bg-white rounded-3xl shadow-md">
                    <div className="relative overflow-hidden rounded-3xl">
                      <img
                        src={item.listImageUrl}
                        alt={item.title}
                        className="w-full h-[450px] md:h-[360px] object-cover"
                      />
                      <div className="text-center absolute bottom-1 left-1 right-1 h-32 bg-white bg-opacity-90 backdrop-blur-md p-4 rounded-2xl space-y-1">
                        <h3 className="text-lg text-[#292929]">{item.title}</h3>
                        <p className="text-xs text-[#525252] md:line-clamp-3 line-clamp-none">
                          {item.shortContent}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseSection;
