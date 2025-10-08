import React, { useState, useRef, useEffect } from 'react';
import notificationsIcon from "../assets/svg/notification.svg";
import notificationWhite from "../assets/svg/notificationWhite.svg";
import UserIcon1 from "../assets/svg/userIconOrange1.svg";
import userIcon from "../assets/svg/userIcon.svg"
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { userLogout } from '../services/LoginServices';
import { getNotification } from '../services/notificationServices';
import arrowRightOrange from "../assets/svg/arrowRightOrange.svg";
import ArrowleftGrey from "../assets/svg/ArrowleftGrey.svg";
import { getProfileData } from '../services/ProfileServices';

function Header() {
  const navigate = useNavigate();
  const [ProfileData, setProfileData] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const [activeButton, setActiveButton] = useState(null);
  const hasFetched = useRef(false);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [activeDropdownItem, setActiveDropdownItem] = useState(null);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchProfileData();
      hasFetched.current = true;
    }
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await getProfileData({ page: 1, pageSize: 10 });
      setProfileData(response?.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogout = async () => {
    try {
      await userLogout();
      toast.success("Logout Successfully");
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("admin_accessToken");
      localStorage.removeItem("admin_refreshToken");
      navigate("/");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
        setSelectedNotification(null);
        if (activeButton === "notifications") setActiveButton(null);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
        if (activeButton === "profile") setActiveButton(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeButton]);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchNotification();
      hasFetched.current = true;
    }
  }, []);

  const fetchNotification = async () => {
    try {
      const response = await getNotification({ limit: 20, skip: 0 });
      setNotifications(response?.data?.items || []);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  const handleNotificationClick = (notif) => {
    setSelectedNotification(notif);
  };

  const handleBackToList = () => {
    setSelectedNotification(null);
  };

  const getButtonClasses = (name) =>
    `flex items-center gap-2 px-4.5 py-3 rounded-full transition cursor-pointer
    ${activeButton === name ? "bg-[#FEF8EC] border border-[#EA7913]" : "hover:bg-orange-50 border border-[#FCEAC9]"}`;

  return (
    <header className="bg-white rounded-2xl px-4 py-4 h-[80px] shadow-[4px_4px_12px_rgba(0,0,0,0.06)] flex justify-end items-center text-[#656565] relative">
      <div className="hidden sm:flex space-x-4 relative">

        {/* Notifications Button */}
        <div className="relative" ref={notifRef}>
          <button
            className={getButtonClasses("notifications")}
            onClick={() => {
              setActiveButton((prev) => prev === "notifications" ? null : "notifications");
              setShowNotifications((prev) => !prev);
              setSelectedNotification(null);
            }}
          >
            <div className="relative">
              <img src={activeButton === "notifications" ? notificationWhite : notificationsIcon} alt="notificationsIcon" className="w-5 h-5" />
              <span className="absolute top-0 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </div>
            <span>Notifications</span>
          </button>

          {showNotifications && (
            <div className="absolute top-full mt-2 -right-44 lg:right-0 md:w-80 lg:w-103.5 z-50">
              <div className="bg-white rounded-2xl text-[#656565] shadow-xl border border-[#989898] shadow-[0_0_14px_rgba(0,0,0,0.25)] overflow-hidden">
                {!selectedNotification && (
                  <div className="max-h-[272px] overflow-y-auto custom-scrollbar">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="px-4.5 py-3 border-b border-[#989898] last:border-b-0 hover:bg-orange-50 transition cursor-pointer flex justify-between items-center"
                        onClick={() => handleNotificationClick(notif)}
                      >
                        <div>
                          <p>{notif.title}</p>
                          <p className="text-xs mt-1">{notif.message}</p>
                        </div>
                        <img src={arrowRightOrange} alt="Not Found" className='w-6 h-6' />
                      </div>
                    ))}
                  </div>
                )}

                {selectedNotification && (
                  <div>
                    <div className="flex items-center gap-1 border-b border-[#BDBDBD]">
                      <button onClick={handleBackToList} className="py-4 pl-4">
                        <img src={ArrowleftGrey} alt="Not Found" className='w-6 h-6 cursor-pointer' />
                      </button>
                      <h3 className="text-xl font-medium text-[#3D3D3D]">Contact Request</h3>
                    </div>

                    <div className="space-y-4 px-4 pt-4 pb-9">
                      <div>
                        <label className="text-[#656565]">Name</label>
                        <p className="text-lg mt-1 text-[#3D3D3D]">{selectedNotification.userName || selectedNotification.name || 'N/A'}</p>
                      </div>

                      <div>
                        <label className="text-[#656565]">Mobile no.</label>
                        <p className="text-lg mt-1 text-[#3D3D3D]">{selectedNotification.mobile || selectedNotification.phone || 'N/A'}</p>
                      </div>

                      <div>
                        <label className="text-[#656565]">Email</label>
                        <p className="text-lg mt-1 text-[#3D3D3D]">{selectedNotification.email || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Button */}
        <div className="relative" ref={profileRef}>
          <button
            className={getButtonClasses("profile")}
            onClick={() => {
              setActiveButton("profile");
              setShowProfileDropdown((prev) => !prev);
            }}
          >
            <img
              src={activeButton === "profile" ? UserIcon1 : userIcon}
              alt="userIcon"
              className="w-5 h-5"
            />
            <span>Profile</span>
          </button>

          {showProfileDropdown && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-[#FCEAC9] rounded-xl w-45.5 z-50">
              <div className="text-[#3D3D3D] p-2 space-y-1">
                <div className='flex items-center gap-2'>
                  <img src={userIcon} alt="Not Found" />
                  <div>
                    <p className='text-[#656565]'>{ProfileData?.name}</p>
                    <p className="w-32 truncate overflow-hidden text-[#989898]">{ProfileData?.email}</p>
                  </div>
                </div>
                <div className='py-2'>
                  <hr className='text-[#F1F1F1]' />
                </div>
                <div className='w-full space-y-1'>
                  <button
                    className={`w-full text-start py-2 px-3 rounded-lg hover:bg-[#FEF8EC] cursor-pointer ${activeDropdownItem === "editProfile" ? "bg-[#FEF8EC] text-[#292929]" : "text-[#656565]"
                      }`}
                    onClick={() => {
                      setActiveDropdownItem("editProfile");
                      navigate("/profile");
                    }}
                  >
                    Edit Profile
                  </button>

                  <button
                    className={`w-full text-start py-2 px-3 rounded-lg hover:bg-[#FEF8EC] cursor-pointer ${activeDropdownItem === "logout" ? "bg-[#FEF8EC] text-[#292929]" : "text-[#656565]"
                      }`}
                    onClick={() => {
                      setActiveDropdownItem("logout");
                      handleLogout();
                    }}
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
