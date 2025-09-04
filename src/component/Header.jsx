import React, { useState, useRef, useEffect } from 'react';
import notificationsIcon from "../assets/svg/notification.svg";
import userIcon from "../assets/svg/userIcon.svg";
import UserIcon1 from "../assets/svg/UserIcon1.svg"
import logoutIcon from "../assets/svg/logoutIcon.svg";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { userLogout } from '../services/LoginServices';

function Header() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);
  const [activeButton, setActiveButton] = useState(null);

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

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sample notifications
  const notifications = [
    { id: 1, message: "John doe is request for a call", time: "2 min ago" },
    { id: 2, message: "John doe is request for a call", time: "16 min ago" },
    { id: 3, message: "John doe is request for a call", time: "35 min ago" },
    { id: 4, message: "John doe is request for a call", time: "1 hour ago" },
  ];

  const getButtonClasses = (name) =>
    `flex items-center gap-2 border border-[#FCEAC9] px-4 py-2 rounded-full transition cursor-pointer
   ${activeButton === name ? "bg-[#EA7913] text-white" : "hover:bg-orange-50"}`;

  return (
    <header className="bg-white border border-[#F1F1F1] shadow-md rounded-3xl px-4 sm:px-6 h-[80px] flex justify-end items-center text-[#656565] relative">
      <div className="hidden sm:flex space-x-4 relative">

        {/* Notifications Button with hover & click */}
        <div
          className="relative"
          ref={notifRef}
        >
          <button
            className={getButtonClasses("notifications")}
            onClick={() => {
              setShowNotifications((prev) => !prev);
              setActiveButton((prev) => (prev === "notifications" ? null : "notifications"));
            }}
          >
            <div className="relative">
              <img src={notificationsIcon} alt="notificationsIcon" className="w-5 h-5" />
              <span className="absolute top-0 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </div>
            <span>Notifications</span>
          </button>

          {showNotifications && (
            <div className="absolute top-full mt-2 right-0 w-103.5 bg-white rounded-2xl text-[#656565] shadow-xl border border-[#989898] z-50 shadow-[0_0_14px_rgba(0,0,0,0.25)]">
              {notifications.map((notif, index) => (
                <div
                  key={notif.id}
                  className={`${index === 0 ? "rounded-t-2xl" : index === notifications.length - 1 && "rounded-b-2xl"} px-4.5 py-3 border-b border-[#989898] last:border-b-0 hover:bg-orange-50 transition cursor-pointer flex justify-between items-center`}
                >
                  <div>
                    <p className="">{notif.message}</p>
                    <p className="text-xs mt-1">{notif.time}</p>
                  </div>
                  <span className="text-[#EA7913] text-xl">›</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <button className={getButtonClasses("profile")}
          onClick={() => {
            setActiveButton("profile")
            navigate("/profile")
          }}>
          <img src={activeButton ? UserIcon1 : userIcon} alt="userIcon" className="w-5 h-5" />
          <span>Profile</span>
        </button>

        {/* Logout */}
        <button onClick={() => {
          setActiveButton("logout");
          handleLogout();
        }}
          className={getButtonClasses("logout")}>
          <img src={logoutIcon} alt="logoutIcon" className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
