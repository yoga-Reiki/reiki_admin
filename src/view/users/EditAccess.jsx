import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getCoursesData } from '../../services/courseServices';
import toast from 'react-hot-toast';
import { getCourseEditAccess } from '../../services/userServices';
import { useLocation } from 'react-router-dom';

function EditAccess({ selectedUser, setSelectedUser }) {
    const location = useLocation();
    const userId = useMemo(() => location.search.split("?selectedUserId=")?.[1], [location]);
    const [userCourses, setUserCourses] = useState({});
    const [coursesData, setCoursesData] = useState([]);
    const hasFetched = useRef(false);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);

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
            toast.error("Failed to fetch user courses");
        } finally {
            setLoading(false);
        }
    };

    const toggleCourse = (courseId) => {
        setUserCourses(prev => ({
            ...prev,
            [courseId]: !prev[courseId],
        }));
    };

    const handleUpdateAccess = async () => {
        try {
            setUpdating(true);

            const approvedCourses = Object.keys(userCourses).filter(id => userCourses[id]);
            const revokedCourses = Object.keys(userCourses).filter(id => !userCourses[id]);

            const promises = [];

            for (const courseId of approvedCourses) {
                const body = {
                    userId: selectedUser._id,
                    courseId,
                    status: "approved",
                };
                promises.push(getCourseEditAccess({ body }));
            }

            for (const courseId of revokedCourses) {
                const body = {
                    userId: selectedUser._id,
                    courseId,
                    status: "revoked",
                };
                promises.push(getCourseEditAccess({ body }));
            }

            await Promise.all(promises);

            toast.success("User access updated successfully");
            fetchCourse();

        } catch (error) {
            console.error(error);
            toast.error("Failed to update user access");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="text-[#464646] pt-2">
            <div className="mb-2 p-3">
                <h2 className="text-[32px] font-Raleway Raleway-medium text-[#656565]">
                    <span onClick={() => setSelectedUser(null)} className="cursor-pointer">
                        User Management
                    </span>{" "}
                    &gt;{" "}
                    <span className="text-[#464646]">
                        Course Access
                    </span>
                </h2>
                <p className="pt-1 text-[#656565]">Manage all your users</p>
            </div>

            <div className="bg-white rounded-2xl p-6">
                <h2 className="text-2xl text-[#656565] mb-8 font-Raleway Raleway-medium">Course Access</h2>

                <div className='flex flex-col gap-8'>
                    <div className="flex gap-24">
                        <div className="flex items-start space-x-4">
                            <div className="w-[1px] bg-[#EA7913] h-full"></div>
                            <div className="flex flex-col gap-2">
                                <span className="text-lg text-[#656565]">Name</span>
                                <span className="text-xl text-[#3D3D3D]">{selectedUser.name}</span>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="w-[1px] bg-[#EA7913] h-full"></div>
                            <div className="flex flex-col gap-2">
                                <span className="text-lg text-[#656565]">Mobile Number</span>
                                <span className="text-xl text-[#3D3D3D]">{selectedUser.mobileNumber}</span>
                            </div>
                        </div>
                    </div>

                    {/* Course Toggles */}
                    <div>
                        <h3 className="text-lg text-[#525252] pb-4">Course List</h3>
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
                                            className={`w-10 h-6 flex items-center border border-[#F1F1F1] rounded-full cursor-pointer transition-colors ${userCourses[course._id]
                                                ? "bg-gradient-to-r from-[#EA7913] to-[#EA7913]/50"
                                                : "bg-[#F8F8F8]"
                                                }`}
                                        >
                                            <div
                                                className={`w-4 h-4 rounded-full shadow-md transform transition-transform ${userCourses[course._id]
                                                    ? "translate-x-5 bg-white"
                                                    : "translate-x-1 bg-[#656565]"
                                                    }`}
                                            />
                                        </div>
                                        <span className="text-gray-700">{course?.title}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-end gap-2 h-12 mt-8">
                            <button
                                type="button"
                                className="bg-[#FEF8EC] border border-[#F9D38E] text-[#656565] px-6 py-3 rounded-full hover:bg-[#FCEAC9] cursor-pointer"
                                onClick={() => setSelectedUser(null)}
                            >
                                Cancel
                            </button>

                            <div className="relative inline-block rounded-full p-[1px] bg-gradient-to-r from-[#FF7900] via-[#EAD3BE] to-[#FF7900] hover:from-[#F39C2C] hover:via-[#F39C2C] hover:to-[#F39C2C]">
                                <button
                                    type="button"
                                    disabled={updating}
                                    onClick={handleUpdateAccess}
                                    className="inline-flex justify-center items-center space-x-1.5 px-6 py-3 bg-[#EA7913] text-[#F8F8F8] rounded-full font-medium hover:cursor-pointer hover:bg-[#F39C2C] active:bg-[#EA7913] transition text-base"
                                >
                                    {updating ? "Updating..." : "Update Access"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditAccess;
