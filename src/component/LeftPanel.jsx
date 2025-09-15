import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import reikiLogo from "../assets/img/logo.png"
import arrowLeft from "../assets/svg/arrowLeft.svg"
import dashboardIconWhite from "../assets/svg/dashboardIcon.svg"
import userGroupIcon from "../assets/svg/userGroupIcon.svg"
import dashboardIconBlack from "../assets/svg/dashboardIconBlack.svg"
import userGroupIconWhite from "../assets/svg/userGroupIconWhite.png"
import OrderIcon from "../assets/svg/OrderIcon.svg"
import OrderIconWhite from "../assets/svg/OrderIconWhite.svg"
import coursesIcon from "../assets/svg/coursesIcon.svg"
import coursesIconWhite from "../assets/svg/coursesIconWhite.svg"
import productIcon from "../assets/svg/productIcon.svg"
import productIconWhite from "../assets/svg/productIconWhite.svg"
import galleryIcon from "../assets/svg/galleryIcon.svg"
import galleryIconWhite from "../assets/svg/galleryIconWhite.svg"
import userIcon from "../assets/svg/userIcon.svg"
import userIconWhite from "../assets/svg/userIconWhite.svg"
import blogIcon from "../assets/svg/blogIcon.svg"
import blogIconWhite from "../assets/svg/blogIconWhite.svg"
import contactIcon from "../assets/svg/contactIcon.svg"
import contactIconWhite from "../assets/svg/contactIconWhite.svg"
import testimonialsIcon from "../assets/svg/testimonialsIcon.svg"
import testimonialsIconWhite from "../assets/svg/testimonialsIconWhite.svg"
import SmalLogo from "../assets/img/SmalLogo.png"

const menuItems = [
    { name: 'Dashboard', path: '/dashboard', iconBlack: dashboardIconBlack, iconWhite: dashboardIconWhite },
    { name: 'Users', path: '/users', iconBlack: userGroupIcon, iconWhite: userGroupIconWhite },
    { name: 'Orders', path: '/orders', iconBlack: OrderIcon, iconWhite: OrderIconWhite },
    { name: 'Courses', path: '/courses', iconBlack: coursesIcon, iconWhite: coursesIconWhite },
    { name: 'Product', path: '/product', iconBlack: productIcon, iconWhite: productIconWhite },
    { name: 'Gallery', path: '/gallery', iconBlack: galleryIcon, iconWhite: galleryIconWhite },
    { name: 'About Us', path: '/aboutus', iconBlack: userIcon, iconWhite: userIconWhite },
    { name: 'Blog', path: '/blog', iconBlack: blogIcon, iconWhite: blogIconWhite },
    { name: 'Contact Us', path: '/contact', iconBlack: contactIcon, iconWhite: contactIconWhite },
    { name: 'Testimonials', path: '/testimonials', iconBlack: testimonialsIcon, iconWhite: testimonialsIconWhite },
];

function LeftPanel({ isCollapsed, setIsCollapsed }) {
    const toggleSidebar = () => {
        setIsCollapsed(prev => !prev);
    }

    return (
        <div className={`flex flex-col gap-2 relative h-full transition-all duration-300 ${isCollapsed ? 'w-20' : 'md:w-48 lg:w-64'}`}>
            {/* Logo Section */}
            <div
                className='bg-white h-[80px] shadow-md flex justify-center border border-[#F1F1F1] rounded-3xl hover:cursor-pointer'
                onClick={toggleSidebar}
            >
                <img
                    src={isCollapsed ? SmalLogo : reikiLogo}
                    alt="Logo"
                    className={`object-contain transition-all duration-300 ${!isCollapsed && "w-30"}`}
                />
            </div>

            {/* Menu Items */}
            <div className='bg-white border border-[#F1F1F1] shadow-md rounded-3xl flex-1 p-3 space-y-2'>
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex ${isCollapsed ? "justify-center px-3 py-3.5" : "p-3"} items-center gap-3 rounded-full transition-all duration-300 ${isActive
                                ? 'bg-gradient-to-r from-[#EA7913] to-[#EA7913]/50 text-white shadow-sm'
                                : 'text-[#656565] hover:bg-orange-50'}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <img
                                    src={isActive ? item.iconWhite : item.iconBlack}
                                    alt={item.name}
                                    className="w-6 h-6"
                                />
                                {!isCollapsed && <span>{item.name}</span>}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>

            {/* Toggle Button */}
            <button
                className="absolute bottom-4 right-4 bg-gradient-to-r from-[#EA7913] to-[#EA7913]/50 text-white p-4 rounded-full hover:bg-[#EA7913] transition cursor-pointer"
                onClick={toggleSidebar}
            >
                <img
                    src={arrowLeft}
                    className={`w-4 h-4 transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                    alt='Toggle Sidebar'
                />
            </button>
        </div>
    )
}

export default LeftPanel


