import React, { useEffect, useRef, useState } from 'react';
import arrowRightOrange from "../../assets/svg/arrowRightOrange.svg";
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';
import LogoutModel from './LogoutModel';
import toast from 'react-hot-toast';
import { getProfileData } from '../../services/ProfileServices';
import { userLogout } from '../../services/LoginServices';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState('edit');
  const hasFetched = useRef(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchProfileData();
      hasFetched.current = true;
    }
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await getProfileData({ page: 1, pageSize: 10 });
      setProfileData(response);
    } finally {
      setLoading(false);
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

  const menuItems = [
    { label: 'Edit Profile', key: 'edit' },
    { label: 'Change Password', key: 'changePassword' },
    // { label: 'Account Activity', key: 'accountActivity' },
    { label: 'Log Out', key: 'logout' },
  ];

  return (
    <div>
      <div className='px-3 pb-3 pt-5'>
        <h1 className="text-3xl font-Raleway Raleway-medium text-[#464646]">Profile</h1>
        <p className="text-[#888] text-sm mt-1">Manage your profile</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 bg-[#FAFAFA] text-[#464646]">
        <div className="w-full xl:w-54 rounded-xl px-4 flex flex-col gap-6">
          <div className="flex flex-row xl:flex-col gap-1">
            {menuItems.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  if (item.key === 'logout') {
                    setCurrentScreen('logout');
                  } else {
                    setCurrentScreen(item.key);
                  }
                }}
                className={`cursor-pointer py-3 px-6 text-[16px] font-medium 
                ${currentScreen === item.key
                    ? 'text-[#EA7913]'
                    : 'text-[#464646]'
                  } hover:text-[#EA7913] transition-all`}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Right Content */}
        <div className="w-[560px] bg-white rounded-3xl p-6 mx-3 xl:mx-0">
          {currentScreen === 'edit' && (
            <EditProfile
              ProfileData={profileData}
              setCurrentScreenMain={() => setCurrentScreen('edit')}
            />
          )}

          {currentScreen === 'changePassword' && (
            <ChangePassword
              ProfileData={profileData}
              setCurrentScreenMain={() => setCurrentScreen('edit')}
            />
          )}

          {currentScreen === 'logout' && (
            <LogoutModel
              handleLogout={handleLogout}
              setCurrentScreenMain={() => setCurrentScreen('edit')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
