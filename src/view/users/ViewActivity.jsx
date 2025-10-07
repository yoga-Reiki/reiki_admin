import React, { useEffect, useMemo, useRef, useState } from 'react'
import leftBackIcon from "../../assets/svg/leftIcon.svg"
import UserIcon from "../../assets/svg/userIcon.svg"
import { getCourseActivity } from '../../services/userServices';
import toast from 'react-hot-toast';
import dropdownArrow from "../../assets/svg/dropdownArrow.svg";
import { getCoursesData } from '../../services/courseServices';
import { useLocation } from 'react-router-dom';

function ViewActivity({ viewUser, setViewUser }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activity, setActivity] = useState([]);
    const hasFetchedCourses = useRef(false);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [coursesData, setCoursesData] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const location = useLocation();
    const userId = useMemo(() => location.search.split("?selectedUserId=")?.[1], [location]);

    useEffect(() => {
        if (!hasFetchedCourses.current) {
            fetchCourse();
            hasFetchedCourses.current = true;
        }
    }, []);

    const fetchCourse = async () => {
        try {
            const response = await getCoursesData({ userId });
            const items = response?.data?.items || [];

            setCoursesData(items);

            if (items.length > 0) {
                const firstCourseId = items[0]._id;
                setSelectedCourseId(firstCourseId);
                fetchActivity(firstCourseId);
            }
        } catch (err) {
            toast.error("Failed to fetch users");
        }
    };

    const fetchActivity = async (selectedCourseId) => {
        if (!selectedCourseId) return;

        try {
            setLoading(true);
            const response = await getCourseActivity({
                userId: viewUser._id,
                courseId: selectedCourseId,
            });

            toast.success("Activity fetched successfully!");
            setActivity(response?.data?.rows || []);
            setLoading(false);
        } catch (err) {
            toast.error("No access record");
            setError("No access record");
            setLoading(false);
        }
    };

    const handleItemClick = (course) => {
        setSelectedCourseId(course._id);
        fetchActivity(course._id);
        setIsDropdownOpen(false);
    };

    const selectedCourse = coursesData.find(c => c._id === selectedCourseId);

    return (
        <div className="text-[#464646] pt-2">
            <div className="mb-2 p-3">
                <h2 className="text-[32px] font-Raleway Raleway-medium text-[#656565]">
                    <span onClick={() => setViewUser(null)} className="cursor-pointer">
                        User Management
                    </span>{" "}
                    &gt;{" "}
                    <span className="text-[#464646]">
                        View Activity
                    </span>
                </h2>
                <p className="pt-1 text-[#656565]">Manage all your users</p>
            </div>

            <div className="bg-white rounded-3xl p-6">
                <h2 className="text-[32px] text-[#3D3D3D] mb-8 font-Raleway Raleway-medium">View Activity</h2>

                <div className='flex flex-col gap-8'>
                    <div className="flex gap-24">
                        <div className="flex items-start space-x-4">
                            <div className="w-[1px] bg-[#EA7913] h-full"></div>
                            <div className="flex flex-col gap-2">
                                <span className="text-lg text-[#656565]">Name</span>
                                <span className="text-xl text-[#3D3D3D]">{viewUser.name}</span>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="w-[1px] bg-[#EA7913] h-full"></div>
                            <div className="flex flex-col gap-2">
                                <span className="text-lg text-[#656565]">Mobile Number</span>
                                <span className="text-xl text-[#3D3D3D]">+91 {viewUser.mobileNumber}</span>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col gap-4'>
                        <div className='flex items-center justify-between gap-4'>
                            <p className='text-[#525252] text-lg'>Course List</p>

                            {/* Custom Dropdown */}
                            <div className="relative">
                                <label className="block mb-2 text-lg">Select Course</label>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="bg-[#EA7913] flex items-center space-x-2 hover:bg-[#F39C2C] text-white px-6 py-3 rounded-full cursor-pointer"
                                >
                                    {selectedCourse ? selectedCourse.title : "Select Course"}
                                    <img src={dropdownArrow} alt="Dropdown Icon" className="p-1.5" />
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-55 bg-white rounded-xl border border-[#BDBDBD] z-10 shadow-[0_2px_6px_rgba(234,121,19,0.3)]">
                                        <ul className="py-2 px-4.5 text-sm text-[#555]">
                                            {coursesData.map((course, index) => (
                                                <li
                                                    key={course._id}
                                                    onClick={() => handleItemClick(course)}
                                                    className={`py-3 cursor-pointer text-center transition-colors duration-200 ${index !== 0 ? "border-t border-[#DCDCDC]" : ""
                                                        } ${selectedCourseId === course._id
                                                            ? "text-[#EA7913] font-medium"
                                                            : "hover:text-[#EA7913]"
                                                        }`}
                                                >
                                                    {course.title}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto bg-white border border-[#BDBDBD] rounded-2xl">
                            <table className="w-full border-collapse text-left text-[#464646] table-fixed">
                                <thead className="bg-[#FFF8EE] text-sm text-[#09090B] border-b border-[#D4D4D8]">
                                    <tr>
                                        <th className='px-4 py-3 font-medium'>Day</th>
                                        <th className='px-4 py-3 font-medium'>Date</th>
                                        <th className='px-4 py-3 font-medium'>Start Time</th>
                                        <th className='px-4 py-3 font-medium'>End Time</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-6">Loading...</td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-6 text-red-500">{error}</td>
                                        </tr>
                                    ) : activity.length > 0 ? (
                                        activity.map((Data, index) => (
                                            <tr key={index} className="border-b border-[#D4D4D8] last:border-b-0 transition h-11">
                                                <td className="px-4 whitespace-pre-wrap">{Data?.day}</td>
                                                <td className="px-4 whitespace-pre-wrap">{new Date(Data.date).toLocaleDateString()}</td>
                                                <td className="px-4 whitespace-pre-wrap">{new Date(Data.startTime).toLocaleTimeString()}</td>
                                                <td className="px-4 whitespace-pre-wrap">{new Date(Data.endTime).toLocaleTimeString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-6 text-[#9B9B9B]">
                                                No Course added
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewActivity
