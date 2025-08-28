import React, { useState } from 'react'
import notificationsIcon from "../assets/svg/notification.svg"
import userIcon from "../assets/svg/userIcon.svg"
import logoutIcon from "../assets/svg/logoutIcon.svg"
import { RiMenu3Fill } from "react-icons/ri";

function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu)
  }

  return (
    <header className="bg-white border border-[#F1F1F1] rounded-3xl px-4 sm:px-6 h-[80px] flex justify-end items-center text-[#656565]">

      {/* Desktop Buttons */}
      <div className="hidden sm:flex space-x-4">
        <button className="flex items-center gap-2 border border-[#FCEAC9] px-4 py-2 rounded-full hover:bg-orange-50 transition">
          <img src={notificationsIcon} alt="notificationsIcon" className="w-5 h-5" />
          <span>Notifications</span>
        </button>

        <button className="flex items-center gap-2 border border-[#FCEAC9] px-4 py-2 rounded-full hover:bg-orange-50 transition">
          <img src={userIcon} alt="userIcon" className="w-5 h-5" />
          <span>Profile</span>
        </button>

        <button className="flex items-center gap-2 border border-[#FCEAC9] px-4 py-2 rounded-full hover:bg-orange-50 transition">
          <img src={logoutIcon} alt="logoutIcon" className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Mobile Menu Icon */}
      <div className="sm:hidden">
        <button onClick={toggleMobileMenu} className="p-2 rounded-md hover:bg-orange-50 transition">
          <RiMenu3Fill size={25} />
        </button>

        {/* Dropdown Mobile Menu */}
        {showMobileMenu && (
          <div className="absolute top-20 right-4 bg-white border border-[#F1F1F1] shadow-lg rounded-lg w-48 z-50 py-2">
            <button className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-orange-50 transition">
              <img src={notificationsIcon} alt="notificationsIcon" className="w-5 h-5" />
              <span>Notifications</span>
            </button>

            <button className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-orange-50 transition">
              <img src={userIcon} alt="userIcon" className="w-5 h-5" />
              <span>Profile</span>
            </button>

            <button className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-orange-50 transition">
              <img src={logoutIcon} alt="logoutIcon" className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
