import React, { useState } from 'react';
import AddIcon from "../../assets/svg/AddIcon.svg";
import dropdownArrow from "../../assets/svg/dropdownArrow.svg";
import UserIcon1 from "../../assets/svg/UserIcon1.svg";
import DashboardTable from './DashboardTable';
import fileIcon from "../../assets/svg/fileIcon.svg";

function Dashboard() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Courses");

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
    // setDropdownOpen(false);
  };

  return (
    <div className='flex flex-col gap-2 relative'>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-3 text-[#464646] relative">
        <div>
          <h1 className="text-[32px] font-Raleway">Dashboard</h1>
          <p className="text-[#656565] pt-1">Overview of your Website</p>
        </div>

        {/* Add Button with Dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="bg-[#EA7913] flex items-center space-x-2 hover:bg-[#F39C2C] text-white px-6 py-3 rounded-full cursor-pointer"
          >
            <img src={AddIcon} alt="Add Icon" className="p-1.5" />
            <span>Add</span>
            <img src={dropdownArrow} alt="Dropdown Icon" className="p-1.5" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl border border-[#BDBDBD] z-10 shadow-[0_2px_6px_rgba(234,121,19,0.3)]">
              <ul className="py-2 px-4.5 text-sm text-[#555]">
                {["Courses", "Products", "Blog", "Testimonials"].map((item, index) => (
                  <li
                    key={item}
                    onClick={() => handleItemClick(item)}
                    className={`py-3 cursor-pointer text-center transition-colors duration-200 ${index !== 0 ? "border-t border-[#DCDCDC]" : ""
                      } ${activeItem === item
                        ? "text-[#EA7913] font-medium"
                        : "hover:text-[#EA7913]"
                      }`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-3 py-2.5">
        {/* Card 1 */}
        <div className="flex justify-between items-center bg-white rounded-3xl border-l border-l-[#EA7913] shadow-[0_4px_6px_rgba(0,0,0,0.08)]">
          <div className='py-[17px] px-8 w-full flex flex-col gap-1.5'>
            <h2 className="text-4xl text-[#525252] font-Raleway">1,247</h2>
            <p className="text-[#757575] text-sm">Total Users</p>
          </div>
          <div className="bg-gradient-to-br w-27 h-full flex justify-center items-center from-[#FFB979] to-[#EA7913] rounded-3xl p-3 shadow-[-4px_0_6px_rgba(234,121,19,0.3)]">
            <img src={UserIcon1} alt="User Icon" className="w-8 h-10" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex justify-between items-center bg-white rounded-3xl border-l border-l-[#EA7913] shadow-[0_4px_6px_rgba(0,0,0,0.08)]">
          <div className='py-[17px] px-8 w-full flex flex-col gap-1.5'>
            <h2 className="text-4xl text-[#525252] font-Raleway">1,247</h2>
            <p className="text-[#757575] text-sm">Total Users</p>
          </div>
          <div className="bg-gradient-to-br w-27 h-full flex justify-center items-center from-[#FFB979] to-[#EA7913] rounded-3xl p-3 shadow-[-4px_0_6px_rgba(234,121,19,0.3)]">
            <img src={fileIcon} alt="User Icon" className="w-8 h-10" />
          </div>
        </div>
      </div>

      <DashboardTable />
    </div>
  );
}

export default Dashboard;
