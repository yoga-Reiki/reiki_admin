import React, { useEffect, useMemo, useRef, useState } from 'react';
import leftBackIcon from "../../assets/svg/leftIcon.svg"
import UserIcon from "../../assets/svg/userIcon.svg"
import { getCoursesData } from '../../services/courseServices';
import toast from 'react-hot-toast';
import { getCourseEditAccess } from '../../services/userServices';
import { useLocation } from 'react-router-dom';

function EditAccess({ selectedUser, setSelectedUser }) {
    const location = useLocation()
    const userId = useMemo(() => location.search.split("?selectedUserId=")?.[1], [location])
    const [userCourses, setUserCourses] = useState({});
    const [coursesData, setCoursesData] = useState([])
    const hasFetched = useRef(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!hasFetched.current) {
            fetchCourse();
            hasFetched.current = true;
        }
    }, []);

    const fetchCourse = async () => {
        setLoading(true);
        try {
            const response = await getCoursesData({ userId });
            const items = response?.data?.items || [];

            setCoursesData(items);
            
            const accessibleCoursesMap = items.reduce((acc, course) => {
                acc[course._id] = course.isAccessible;
                return acc;
            }, {});
            setUserCourses(accessibleCoursesMap);

        } catch (err) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const toggleCourse = async (courseId) => {
        setLoading(true);
        const isCurrentlyActive = !!userCourses[courseId];
        const updatedStatus = isCurrentlyActive ? "revoked" : "approved";

        const body = {
            userId: selectedUser._id,
            courseId: courseId,
            status: updatedStatus,
        };

        try {
            await getCourseEditAccess({ body });
            toast.success(`User access ${updatedStatus === "approved" ? "approved" : "revoked"} successfully`);

            setUserCourses((prev) => ({
                ...prev,
                [courseId]: !isCurrentlyActive,
            }));
        } catch (error) {
            console.error(error);
            toast.error("Failed to update course access");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-[#464646] pt-2">
            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6 px-3 py-4 cursor-pointer">
                <div className='p-2' onClick={() => setSelectedUser(null)}>
                    <img src={leftBackIcon} alt='Not Found' className='w-5 h-5' />
                </div>

                <div className='flex items-center'>
                    <button onClick={() => setSelectedUser(null)}
                        className="flex items-center text-3xl gap-1 transition"
                    >
                        <span className='hover:text-[#EA7913] cursor-pointer'>User Management</span> <span className="mx-2">{">"}</span>
                    </button>
                    <button className="text-gray-500 text-xl hover:text-[#EA7913] mt-1">Course Access</button>
                </div>
            </div>

            <div className="bg-white border-t border-t-[#EA7913] rounded-3xl px-8 pt-8 pb-12.5 max-w-[863px] mt-8 mx-auto">
                <h2 className="text-[32px] text-[#3D3D3D] mb-5.5">Course Access</h2>

                <div className='flex flex-col gap-8'>
                    {/* User Name */}
                    <div className="flex items-center w-full p-1 rounded-2xl overflow-hidden bg-gradient-to-r from-[#FCEAC9] to-[#EA7913]">
                        <div className="flex items-center gap-2 px-4 py-2 text-lg text-[#464646] font-medium">
                            <img src={UserIcon} alt='Not Found' className='w-5 h-5' /> Name
                        </div>
                        <input
                            type="text"
                            readOnly
                            value={selectedUser.name}
                            className="flex-1 px-4 py-2 bg-[#FFFFFF] rounded-xl outline-none border-0"
                        />
                    </div>

                    {/* Course Toggles */}
                    <div>
                        <h3 className="font-semibold mb-3">Course List</h3>
                        {loading ? (
                            <div className="text-center py-6 text-gray-500">Loading...</div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {coursesData.map((course, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        {/* Toggle */}
                                        <div
                                            id={idx}
                                            onClick={() => toggleCourse(course._id)}
                                            className={`w-10 h-6 flex items-center border border-[#F1F1F1] rounded-full cursor-pointer transition-colors ${userCourses[course._id] ? "bg-gradient-to-r from-[#EA7913] to-[#EA7913]/50" : "bg-[#F8F8F8]"
                                                }`}
                                        >
                                            <div
                                                className={`w-4 h-4 rounded-full shadow-md transform transition-transform ${userCourses[course._id] ? "translate-x-5 bg-white" : "translate-x-1 bg-[#656565]"}`}
                                            />
                                        </div>
                                        <span className="text-gray-700">{course?.title}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Buttons */}
                {/* <div className="mt-14 flex gap-4">
                    <div className="w-full mt-10 md:mt-14 relative inline-block rounded-full px-[5px] py-[3px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:via-[#F39C2C] hover:to-[#F39C2C] active:from-[#EA7913] active:via-[#EA7913] active:to-[#EA7913]">
                        <button
                            type="submit"
                            className="w-full h-full inline-flex justify-center items-center space-x-1.5 py-2 bg-[#EA7913] text-[#F8F8F8] rounded-full font-medium hover:cursor-pointer hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-base"
                        >
                            Save the User Access Changes
                        </button>
                    </div>
                </div> */}
            </div>
        </div>
    );
}

export default EditAccess;
