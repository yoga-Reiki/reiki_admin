import React, { useState, useRef, useEffect } from 'react';
import notificationsIcon from "../assets/svg/notification.svg";
import notificationWhite from "../assets/svg/notificationWhite.svg";
import userIcon from "../assets/svg/userIcon.svg";
import UserIcon1 from "../assets/svg/userIconOrange1.svg"
import logoutIcon from "../assets/svg/logoutIcon.svg";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { userLogout } from '../services/LoginServices';
import { getNotification } from '../services/notificationServices';
import arrowRightOrange from "../assets/svg/arrowRightOrange.svg"
import ArrowleftGrey from "../assets/svg/ArrowleftGrey.svg"

function Header() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);
  const [activeButton, setActiveButton] = useState(null);
  const hasFetched = useRef(false);
  const [notifications, setNotifications] = useState([])
  const [selectedNotification, setSelectedNotification] = useState(null);

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
        setSelectedNotification(null); // Add this line
        if (activeButton === "notifications") setActiveButton(null);
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
    <header className="bg-white rounded-2xl px-4 py-4 h-[80px] shadow-[4px_4px_12px_rgba(0,0,0,0.06)]  flex justify-end items-center text-[#656565] relative">
      <div className="hidden sm:flex space-x-4 relative">

        {/* Notifications Button with hover & click */}
        <div
          className="relative"
          ref={notifRef}
        >
          <button
            className={getButtonClasses("notifications")}
            onClick={() => {
              setActiveButton((prev) =>
                prev === "notifications" ? null : "notifications"
              );
              setShowNotifications((prev) => !prev);
              setSelectedNotification(null); // Add this line
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

                {/* Notification List View */}
                {!selectedNotification && (
                  <div className="max-h-[272px] overflow-y-auto custom-scrollbar">
                    {notifications.map((notif, index) => (
                      <div
                        key={notif.id}
                        className="px-4.5 py-3 border-b border-[#989898] last:border-b-0 hover:bg-orange-50 transition cursor-pointer flex justify-between items-center"
                        onClick={() => handleNotificationClick(notif)}
                      >
                        <div>
                          <p className="">{notif.title}</p>
                          <p className="text-xs mt-1">{notif.message}</p>
                        </div>
                        <img src={arrowRightOrange} alt="Not Found" className='w-6 h-6' />
                      </div>
                    ))}
                  </div>
                )}

                {/* Notification Detail View */}
                {selectedNotification && (
                  <div>
                    <div className="flex items-center gap-1 border-b border-[#BDBDBD]">
                      <button
                        onClick={handleBackToList}
                        className="py-4 pl-4"
                      >
                        <img src={ArrowleftGrey} alt="Not Found" className='w-6 h-6 cursor-pointer' />
                      </button>
                      <h3 className="text-xl font-medium text-[#3D3D3D]">Contact Request</h3>
                    </div>

                    {/* User Details */}
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

        {/* Profile */}
        <button
          className={getButtonClasses("profile")}
          onClick={() => {
            setActiveButton("profile");
            navigate("/profile");
          }}
        >
          <img
            src={activeButton === "profile" ? UserIcon1 : userIcon}
            alt="userIcon"
            className="w-5 h-5"
          />
          <span>Profile</span>
        </button>


        {/* Logout */}
        <button
          onClick={() => {
            setActiveButton("logout");
            handleLogout();
          }}
          className={getButtonClasses("logout")}
        >
          <img src={logoutIcon} alt="logoutIcon" className="w-5 h-5" />
          <span>Logout</span>
        </button>

      </div>
    </header>
  );
}

export default Header;
