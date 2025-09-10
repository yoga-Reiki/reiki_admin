import React, { useEffect, useRef, useState } from 'react'
import AddIcon from "../../assets/svg/AddIcon.svg";
import CourseCard from './CourseCard';
import CourseSection from './CourseSection';
import AddCourse from './AddCourse';
import EditCourseSec from './EditCourseSec';
import { getCoursesData, getCoursesDelete } from '../../services/courseServices';
import toast from 'react-hot-toast';
import DeleteModel from '../component/DeleteModel';

function Courses() {
    const [addCourse, setAddCourse] = useState(null);
    const [isEditingCard, setIsEditingCard] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [coursesData, setCoursesData] = useState([])
    const [coursesDelete, setCoursesDelete] = useState(null);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (!hasFetched.current) {
            fetchCourse();
            hasFetched.current = true;
        }
    }, []);

    const fetchCourse = async () => {
        try {
            const response = await getCoursesData();

            toast.success("Courses fetched successfully!")
            setCoursesData(response?.data?.items || []);
        } catch (err) {
            toast.error("Failed to fetch users");
        }
    };

    const confirmDelete = async () => {
        if (!coursesDelete || !coursesDelete._id) return;

        try {
            await getCoursesDelete(coursesDelete._id);
            toast.success("Course deleted successfully!");
            setCoursesDelete(null);
            fetchCourse();
        } catch (error) {
            console.error("Delete failed", error);
            toast.error("Failed to delete product");
        }
    };

    return (
        <div>
            {isEditingCard ? (
                <EditCourseSec selectedCourse={selectedCourse} onCancel={() => setIsEditingCard(false)} fetchCourse={fetchCourse} />
            ) : (
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

                    <CourseCard setIsEditingCard={setIsEditingCard} setSelectedCourse={setSelectedCourse} coursesData={coursesData} setCoursesDelete={setCoursesDelete} />

                    <CourseSection />

                    {addCourse && (
                        <AddCourse
                            addCourse={addCourse}
                            onClose={() => setAddCourse(null)}
                            onConfirm={() => {
                                console.log("Blocked:", addCourse.name);
                                setAddCourse(null);
                            }}
                            fetchCourse={fetchCourse}
                        />
                    )}

                    {coursesDelete && (
                        <DeleteModel onCancel={() => setCoursesDelete(null)} onConfirmCourse={confirmDelete} />
                    )}
                </div>
            )}
        </div>
    )
}

export default Courses