import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import reikiLogo from "../assets/img/logo.png"
import multiArrowBackIcon from "../assets/svg/multiArrowBackIcon.svg"
import dashboardIconBlack from "../assets/svg/dashboardIconBlack.svg"
import dashboardIconOrange from "../assets/svg/dashboardIcon.svg"
import userGroupIcon from "../assets/svg/userGroupIcon.svg"
import userGroupIconOrange from "../assets/svg/userGroupIconOrange.svg"
import OrderIcon from "../assets/svg/OrderIcon.svg"
import OrderIconOrange from "../assets/svg/OrderIconOrange.svg"
import coursesIcon from "../assets/svg/coursesIcon.svg"
import coursesIconOrange from "../assets/svg/coursesIconOrange.svg"
import productIcon from "../assets/svg/productIcon.svg"
import productIconOrange from "../assets/svg/productIconOrange.svg"
import galleryIcon from "../assets/svg/galleryIcon.svg"
import galleryIconOrange1 from "../assets/svg/galleryIconOrange1.svg"
import userIcon from "../assets/svg/userIcon.svg"
import userIconOrange1 from "../assets/svg/userIconOrange1.svg"
import blogIcon from "../assets/svg/blogIcon.svg"
import blogIconOrange from "../assets/svg/blogIconOrange.svg"
import contactIcon from "../assets/svg/contactIcon.svg"
import contactIconOrange from "../assets/svg/contactIconOrange.svg"
import testimonialsIcon from "../assets/svg/testimonialsIcon.svg"
import testimonialsIconOrange from "../assets/svg/testimonialsIconOrange.svg"
import SmalLogo from "../assets/img/SmalLogo.png"

const menuItems = [
    { name: 'Dashboard', path: '/dashboard', iconBlack: dashboardIconBlack, iconWhite: dashboardIconOrange },
    { name: 'Users', path: '/users', iconBlack: userGroupIcon, iconWhite: userGroupIconOrange },
    { name: 'Orders', path: '/orders', iconBlack: OrderIcon, iconWhite: OrderIconOrange },
    { name: 'Courses', path: '/courses', iconBlack: coursesIcon, iconWhite: coursesIconOrange },
    { name: 'Product', path: '/product', iconBlack: productIcon, iconWhite: productIconOrange },
    { name: 'Gallery', path: '/gallery', iconBlack: galleryIcon, iconWhite: galleryIconOrange1 },
    { name: 'About Us', path: '/aboutus', iconBlack: userIcon, iconWhite: userIconOrange1 },
    { name: 'Blog', path: '/blog', iconBlack: blogIcon, iconWhite: blogIconOrange },
    { name: 'Contact Us', path: '/contact', iconBlack: contactIcon, iconWhite: contactIconOrange },
    { name: 'Testimonials', path: '/testimonials', iconBlack: testimonialsIcon, iconWhite: testimonialsIconOrange },
];

function LeftPanel({ isCollapsed, setIsCollapsed }) {
    const toggleSidebar = () => {
        setIsCollapsed(prev => !prev);
    }

    return (
        <div className={`flex flex-col gap-2 relative h-full transition-all duration-300 ${isCollapsed ? 'w-22' : 'md:w-48 lg:w-58'}`}>
            {/* Logo Section */}
            <div
                className='bg-white h-[80px] py-3 shadow-[4px_4px_12px_rgba(0,0,0,0.06)] flex justify-center border border-[#F1F1F1] rounded-2xl hover:cursor-pointer'
                onClick={toggleSidebar}
            >
                <img
                    src={isCollapsed ? SmalLogo : reikiLogo}
                    alt="Logo"
                    className={`object-contain transition-all duration-300 h-14 ${!isCollapsed && "w-35"}`}
                />
            </div>

            {/* Menu Items */}
            <div className='bg-white shadow-[4px_4px_12px_rgba(0,0,0,0.06)] rounded-2xl flex-1 p-5 space-y-3.5'>
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex ${isCollapsed ? "justify-center" : ""} h-12 p-3 items-center gap-2.5 rounded-full transition-all duration-300 ${isActive
                                ? 'bg-[#FEF8EC] text-[#525252] border border-[#EA7913]'
                                : 'text-[#656565] hover:bg-[#FEF8EC] border-white'}`
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
                className="w-12 h-12 absolute bottom-5 right-5 bg-[#FEF8EC] border border-[#EA7913] p-3 rounded-full transition cursor-pointer"
                onClick={toggleSidebar}
            >
                <img
                    src={multiArrowBackIcon}
                    className={`transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                    alt='Toggle Sidebar'
                />
            </button>
        </div>
    )
}

export default LeftPanel


