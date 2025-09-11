import React, { useEffect, useMemo, useRef, useState } from 'react'
import leftBackIcon from "../../assets/svg/leftIcon.svg"
import UserIcon from "../../assets/svg/userIcon.svg"
import { getCourseActivity } from '../../services/userServices';
import toast from 'react-hot-toast';
import { getCoursesData } from '../../services/courseServices';
import { useLocation } from 'react-router-dom';

function ViewActivity({ viewUser, setViewUser }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activity, setActivity] = useState([]);
    const hasFetchedCourses = useRef(false);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [coursesData, setCoursesData] = useState([])
    const location = useLocation()
    const userId = useMemo(() => location.search.split("?selectedUserId=")?.[1], [location])

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
            setActivity(response?.data || []);
            setLoading(false);
        } catch (err) {
            toast.error("No access record");
            setError("No access record");
            setLoading(false);
        }
    };

    console.log("viewUser", viewUser);
    console.log("activity", activity);

    return (
        <div className="text-[#464646] pt-2">
            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6 px-3 py-4">
                <div className='p-2'>
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

                            <div className='abcd w-full md:w-[300px]'>
                                <label className="block mb-1">Select Course</label>
                                <select
                                    value={selectedCourseId}
                                    onChange={(e) => {
                                        const selectedId = e.target.value;
                                        setSelectedCourseId(selectedId);
                                        fetchActivity(selectedId);
                                    }}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl outline-none text-[#464646]"
                                >
                                    {coursesData.map((course) => (
                                        <option key={course._id} value={course._id}>
                                            {course.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>


                        <div className="overflow-x-auto w-full">
                            {/* table  */}
                            <table className="w-full table-auto">
                                <thead className="grid grid-cols-4 bg-[#FCEAC9] text-left text-base font-medium text-[#111111] rounded-t-2xl">
                                    <th className='px-4 py-3'>Day</th>
                                    <th className='px-4 py-3'>Date</th>
                                    <th className='px-4 py-3'>Start Time</th>
                                    <th className='px-4 py-3'>End Time</th>
                                </thead >

                                <tbody className="flex flex-col bg-[#FCEAC9] rounded-b-2xl overflow-hidden">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-6">
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-6 text-red-500">
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
                                                    <td className="whitespace-pre-wrap px-4 py-7">{data?.rows?.day}</td>
                                                    <td className="whitespace-pre-wrap px-4 py-7">{data.Date}</td>
                                                    <td className="whitespace-pre-wrap px-4 py-7">{data.Start_Time}</td>
                                                    <td className="whitespace-pre-wrap px-4 py-7">{data.End_Time}</td>
                                                </tr>
                                            )
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-6">
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