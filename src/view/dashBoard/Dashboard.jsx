import React, { useEffect, useRef, useState } from 'react';
import AddIcon from "../../assets/svg/AddIcon.svg";
import dropdownArrow from "../../assets/svg/dropdownArrow.svg";
import UserIcon1 from "../../assets/svg/UserIcon1.svg";
import DashboardTable from './DashboardTable';
import fileIcon from "../../assets/svg/fileIcon.svg";
import { getAllUser } from '../../services/userServices';
import AddCourse from '../course/AddCourse';
import AddProduct from '../product/AddProduct';
import AddBlog from '../blog/AddBlog';
import AddTestimonials from '../testimonails/AddTestimonials';
import { getAllOrder } from '../../services/orderServices';

function Dashboard() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [activePopup, setActivePopup] = useState(null);
  const [dashboardData, setDashboardData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);
  const dropdownRef = useRef(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalUsers: 0,
  });
  const [activeTab, setActiveTab] = useState("Pending");
  const [dateFilter, setDateFilter] = useState("Today");
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
    setDropdownOpen(false);
    setActivePopup(item);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchUsers();
      fetchOrder()
      hasFetched.current = true;
    }
  }, [pagination.page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUser({ page: pagination.page, pageSize: pagination.pageSize });
      setDashboardData(response?.data || []);
      setPagination((prev) => ({
        ...prev,
        totalUsers: response?.data?.pagination?.total || 0,
      }));
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await getAllOrder({
        page: pagination.page,
        pageSize: pagination.pageSize,
      });

      setOrders(response?.data);
    } catch (err) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setActivePopup(null);
    setActiveItem("");
  };

  return (
    <div className='flex flex-col gap-2 relative'>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-3 text-[#464646] relative">
        <div>
          <h1 className="text-[32px] font-Raleway Raleway-medium">Dashboard</h1>
          <p className="text-[#656565] pt-1">Overview of your Website</p>
        </div>

        {/* Add Button with Dropdown */}
        <div className="relative" ref={dropdownRef}>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 px-3 py-2.5">
        {/* Card 1 */}
        <div className="flex justify-between items-center bg-white rounded-3xl border-l border-l-[#EA7913] shadow-[0_4px_6px_rgba(0,0,0,0.08)]">
          <div className='py-[17px] px-8 w-full flex flex-col gap-1.5'>
            <h2 className="text-[40px] text-[#525252] font-Raleway Raleway-medium">{dashboardData?.pagination?.total}</h2>
            <p className="text-sm text-[#464646]">Total Users</p>
          </div>
          <div className="bg-gradient-to-br w-37.5 h-full flex justify-center items-center from-[#FFB979] to-[#EA7913] rounded-3xl p-3 shadow-[-4px_0_6px_rgba(234,121,19,0.3)]">
            <img src={UserIcon1} alt="User Icon" className="w-8 h-10" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex justify-between items-center bg-white rounded-3xl border-l border-l-[#EA7913] shadow-[0_4px_6px_rgba(0,0,0,0.08)]">
          <div className='py-[17px] px-8 w-full flex flex-col gap-1.5'>
            <h2 className="text-[40px] text-[#525252] font-Raleway Raleway-medium">{orders?.items?.length}</h2>
            <p className="text-sm text-[#464646]">Total Orders</p>
          </div>
          <div className="bg-gradient-to-br w-37.5 h-full flex justify-center items-center from-[#FFB979] to-[#EA7913] rounded-3xl p-3 shadow-[-4px_0_6px_rgba(234,121,19,0.3)]">
            <img src={fileIcon} alt="User Icon" className="w-8 h-10" />
          </div>
        </div>
      </div>

      <DashboardTable fetchUsers={fetchUsers} searchTerm={searchTerm} setSearchTerm={setSearchTerm} setStatusDropdownOpen={setStatusDropdownOpen} statusDropdownOpen={statusDropdownOpen} setDateDropdownOpen={setDateDropdownOpen} dateDropdownOpen={dateDropdownOpen} setDateFilter={setDateFilter} dateFilter={dateFilter} setActiveTab={setActiveTab} activeTab={activeTab} dashboardData={dashboardData?.users} loading={loading} error={error} pagination={pagination} setPagination={setPagination} />

      {activePopup === "Courses" && <AddCourse onClose={handleClosePopup} />}
      {activePopup === "Products" && <AddProduct onClose={handleClosePopup} />}
      {activePopup === "Blog" && <AddBlog onClose={handleClosePopup} />}
      {activePopup === "Testimonials" && <AddTestimonials onClose={handleClosePopup} />}
    </div>
  );
}

export default Dashboard;
