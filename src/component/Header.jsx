import React, { useEffect, useState } from 'react'
import notificationsIcon from "../assets/svg/notification.svg"
import userIcon from "../assets/svg/userIcon.svg"
import logoutIcon from "../assets/svg/logoutIcon.svg"
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { userLogout } from '../services/LoginServices';

function Header() {
  const navigate = useNavigate();

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

  return (
    <header className="bg-white border border-[#F1F1F1] shadow-md rounded-3xl px-4 sm:px-6 h-[80px] flex justify-end items-center text-[#656565]">

      {/* Desktop Buttons */}
      <div className="hidden sm:flex space-x-4">
        <button className="flex items-center gap-2 border border-[#FCEAC9] px-4 py-2 rounded-full hover:bg-orange-50 transition cursor-pointer">
          <img src={notificationsIcon} alt="notificationsIcon" className="w-5 h-5" />
          <span>Notifications</span>
        </button>

        <button className="flex items-center gap-2 border border-[#FCEAC9] px-4 py-2 rounded-full hover:bg-orange-50 transition cursor-pointer">
          <img src={userIcon} alt="userIcon" className="w-5 h-5" />
          <span>Profile</span>
        </button>

        <button onClick={handleLogout} className="flex items-center gap-2 border border-[#FCEAC9] px-4 py-2 cursor-pointer rounded-full hover:bg-orange-50 transition">
          <img src={logoutIcon} alt="logoutIcon" className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  )
}

export default Header
