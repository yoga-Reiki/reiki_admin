import React, { useState } from 'react'
import AddIcon from "../../assets/svg/AddIcon.svg";
import CourseCard from './CourseCard';
import CourseSection from './CourseSection';
import AddCourse from './AddCourse';

function Courses() {
    const [addCourse, setAddCourse] = useState(null);

    return (
        <div className="text-[#464646] flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-3">
                <div>
                    <h1 className="text-[32px] font-bold">Courses</h1>
                    <p className="text-[#656565] pt-1">Manage Courses Section and Page</p>
                </div>
                <button onClick={() => setAddCourse({})} className="bg-[#EA7913] flex items-center space-x-2 hover:bg-[#F39C2C] text-white px-6 py-3 rounded-full cursor-pointer">
                    <img src={AddIcon} alt="Download Icon" className="p-1.5" />
                    <span>Add Courses</span>
                </button>
            </div>

            <CourseCard />

            <CourseSection />

            {addCourse && (
                <AddCourse
                    addCourse={addCourse}
                    onClose={() => setAddCourse(null)}
                    onConfirm={() => {
                        console.log("Blocked:", addCourse.name);
                        setAddCourse(null);
                    }}
                />
            )}
        </div>
    )
}

export default Courses