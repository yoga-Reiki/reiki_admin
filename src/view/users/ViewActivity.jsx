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
            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6 px-3 py-4 cursor-pointer">
                <div className='p-2' onClick={() => setViewUser(null)}>
                    <img src={leftBackIcon} alt='Not Found' className='w-5 h-5' />
                </div>

                <div className='flex items-center'>
                    <button
                        onClick={() => setViewUser(null)}
                        className="flex items-center text-3xl gap-1 transition"
                    >
                        <span className='hover:text-[#EA7913] cursor-pointer'>User Management</span> <span className="mx-2">{">"}</span>
                    </button>
                    <button className="text-gray-500 text-xl hover:text-[#EA7913] mt-1">View Activity</button>
                </div>
            </div>

            <div className="bg-white border-t border-t-[#EA7913] rounded-3xl px-8 pt-8 pb-12.5 max-w-[863px] mt-8 mx-auto">
                <h2 className="text-[32px] text-[#3D3D3D] mb-5.5">View Activity</h2>

                <div className='flex flex-col gap-8'>
                    {/* User Name */}
                    <div className="flex items-center w-full p-1 rounded-2xl overflow-hidden bg-gradient-to-r from-[#FCEAC9] to-[#EA7913]">
                        <div className="flex items-center gap-2 px-4 py-2 text-lg text-[#464646] font-medium">
                            <img src={UserIcon} alt='Not Found' className='w-5 h-5' /> Name
                        </div>
                        <input
                            type="text"
                            readOnly
                            value={viewUser.name}
                            className="flex-1 px-4 py-2 bg-[#FFFFFF] rounded-xl outline-none border-0"
                        />
                    </div>

                    <div className='flex flex-col gap-7'>
                        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                            <p className='text-[#525252] text-lg'>Activities</p>

                            {/* Custom Dropdown */}
                            <div className="relative">
                                <label className="block mb-1">Select Course</label>
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
                        <div className="overflow-x-auto w-full">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="grid grid-cols-4 bg-[#FCEAC9] text-left text-base font-medium text-[#111111] rounded-t-2xl">
                                        <th className='px-4 py-3'>Day</th>
                                        <th className='px-4 py-3'>Date</th>
                                        <th className='px-4 py-3'>Start Time</th>
                                        <th className='px-4 py-3'>End Time</th>
                                    </tr>
                                </thead >

                                <tbody className="flex flex-col bg-[#FCEAC9] rounded-b-2xl overflow-hidden">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="flex justify-center py-6">
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan="6" className="flex justify-center py-6 text-red-500">
                                                {error}
                                            </td>
                                        </tr>
                                    ) : activity.length > 0 ? (
                                        activity.map((data, index) => {
                                            const isFirst = index === 0;
                                            const isLast = index === activity.length - 1;
                                            return (
                                                <tr
                                                    key={index}
                                                    className={`grid grid-cols-4 items-center text-[#656565] bg-white border-b border-[#DCDCDC] mt-[1px] text-sm ${isFirst ? 'rounded-t-xl border-y border-[#DCDCDC] shadow-[0_-2px_4px_rgba(0,0,0,0.05)]' : ''} ${isLast ? 'rounded-b-xl border-b-0' : ''}`}
                                                >
                                                    <td className="whitespace-pre-wrap px-4 py-7">{data?.day}</td>
                                                    <td className="whitespace-pre-wrap px-4 py-7">{new Date(data.date).toLocaleDateString()}</td>
                                                    <td className="whitespace-pre-wrap px-4 py-7">{new Date(data.startTime).toLocaleTimeString()}</td>
                                                    <td className="whitespace-pre-wrap px-4 py-7">{new Date(data.endTime).toLocaleTimeString()}</td>
                                                </tr>
                                            )
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="flex justify-center py-6">
                                                No users found
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
