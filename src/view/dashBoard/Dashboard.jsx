import React, { useEffect, useMemo, useRef, useState } from 'react';
import plusIconGrey from "../../assets/svg/plusIconGrey.svg";
import ArrowDownIcon from "../../assets/svg/ArrowDownIcon.svg";
import Dashboard1 from "../../assets/svg/Dashboard1.svg";
import DashboardOrder2 from "../../assets/svg/DashboardOrder2.svg"
import DashboardCourse3 from "../../assets/svg/DashboardCourse3.svg"
import DashboardProduct4 from "../../assets/svg/DashboardProduct4.svg"
import DashboardTable from './DashboardTable';
import { getAllUser } from '../../services/userServices';
import AddProduct from '../product/AddProduct';
import { getAllOrder } from '../../services/orderServices';
import { getCoursesData } from '../../services/courseServices';
import { useLocation } from 'react-router-dom';
import { getProductData } from '../../services/productServices';
import AddCourse from '../course/AddCourse';
import BlogForm from '../blog/EditBlog';
import TestimonialsEdit from '../testimonails/TestimonialsEdit';

function Dashboard() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [activePopup, setActivePopup] = useState(null);
  const [dashboardData, setDashboardData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coursesData, setCoursesData] = useState([])
  const [productData, setProductData] = useState([]);
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
  const location = useLocation()
  const userId = useMemo(() => location.search.split("?selectedUserId=")?.[1], [location])

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
    fetchUsers();
  }, [pagination.page]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchOrder();
    fetchCourse();
    fetchProduct();
  }, []);

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

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const response = await getCoursesData({ userId });
      setCoursesData(response?.data?.items || []);
    } catch (err) {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await getProductData({
        page: pagination.page,
        pageSize: pagination.pageSize,
      });
      setProductData(response?.data?.items || []);
    } catch (err) {
      setError("Failed to fetch product");
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
            className="h-12 bg-[#FEF8EC] flex items-center space-x-2 text-[#525252] border border-[#F9D38E] px-6 py-3 rounded-full cursor-pointer"
          >
            <img src={plusIconGrey} alt="Add Icon" />
            <span>Add</span>
            <img src={ArrowDownIcon} alt="Dropdown Icon" />
          </button>

          {dropdownOpen && (
            // absolute z-20 p-2 space-y-1 mt-2 bg-white shadow-lg rounded-2xl w-full overflow-hidden border border-[#FCEAC9] cursor-pointer
            <div className="absolute z-20 p-2 mt-2 bg-white shadow-lg rounded-2xl w-full overflow-hidden border border-[#FCEAC9] cursor-pointer">
              <ul className="text-sm text-[#555] space-y-1">
                {["Courses", "Products", "Blog", "Testimonials"].map((item, index) => (
                  <li
                    key={item}
                    onClick={() => handleItemClick(item)}
                    className={`px-3 py-2 cursor-pointer rounded-lg hover:bg-[#FEF8EC] ${activeItem === item ? "text-[#292929] bg-[#FEF8EC] rounded-lg" : "text-[#656565]"}`}
                  // className={`py-3 cursor-pointer text-center transition-colors duration-200 ${index !== 0 ? "border-t border-[#DCDCDC]" : ""
                  //   } ${activeItem === item
                  //     ? "text-[#EA7913] font-medium"
                  //     : "hover:text-[#EA7913]"
                  //   }`}
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 px-3 py-2.5">
        {[
          {
            label: "Total Users",
            value: dashboardData?.pagination?.total || 0,
            icon: Dashboard1,
          },
          {
            label: "Total Orders",
            value: orders?.items?.length || 0,
            icon: DashboardOrder2,
          },
          {
            label: "Total Courses",
            value: coursesData?.length || 0,
            icon: DashboardCourse3,
          },
          {
            label: "Total Products",
            value: productData?.length || 0,
            icon: DashboardProduct4,
          },
        ].map((card, index) => (
          <div
            key={index}
            className="flex gap-6 justify-between items-center bg-white p-6 rounded-3xl hover:shadow-md transition-all duration-300"
          >
            <div>
              <p className="text-sm text-[#464646]">{card.label}</p>
              {loading ? (
                <div >...</div>
                // <div className="flex items-center mt-2">
                //   <div className="w-5 h-5 border-2 border-[#F9D38E] border-t-[#EA7913] rounded-full animate-spin"></div>
                // </div>
              ) : (
                <h2 className="text-[32px] text-[#525252] font-Raleway Raleway-medium">
                  {card.value}
                </h2>
              )}
            </div>
            <img src={card.icon} alt={`${card.label} Icon`} />
          </div>
        ))}
      </div>

      <DashboardTable
        fetchUsers={fetchUsers}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setStatusDropdownOpen={setStatusDropdownOpen}
        statusDropdownOpen={statusDropdownOpen}
        setDateDropdownOpen={setDateDropdownOpen}
        dateDropdownOpen={dateDropdownOpen}
        setDateFilter={setDateFilter}
        dateFilter={dateFilter}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        dashboardData={dashboardData?.users}
        loading={loading} error={error}
        pagination={pagination}
        setPagination={setPagination}
      />

      {activePopup === "Courses" && (
        <AddCourse
          onClose={handleClosePopup}
          fetchCourse={fetchCourse}
          onConfirm={() => handleClosePopup()}
        />
      )}
      {activePopup === "Products" &&
        <AddProduct
          onClose={handleClosePopup}
          onConfirm={() => handleClosePopup()}
          fetchProduct={fetchProduct}
        />
      }
      {activePopup === "Blog" && <BlogForm onClose={handleClosePopup} />}
      {activePopup === "Testimonials" && <TestimonialsEdit onClose={handleClosePopup} />}
    </div>
  );
}

export default Dashboard;
