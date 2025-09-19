import React, { useEffect, useRef, useState } from 'react';
import arrowRightOrange from "../../assets/svg/arrowRightOrange.svg"
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';
import AccountActivity from './AccountActivity';
import toast from 'react-hot-toast';
import { getProfileData } from '../../services/ProfileServices';
import { userLogout } from '../../services/LoginServices';
import { useNavigate } from 'react-router-dom';
import LogoutModel from './LogoutModel';

function Profile() {
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('main');
  const hasFetched = useRef(false);
  const [loading, setLoading] = useState(false);
  const [ProfileData, setProfileData] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleToggleNotification = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

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
    { label: 'Edit Profile', action: () => setCurrentScreen('edit') },
    { label: 'Change Password', action: () => setCurrentScreen('changePassword') },
    { label: 'Account Activity', action: () => setCurrentScreen('accountActivity') },
    { label: 'Log Out', action: () => setShowLogoutModal(true) }, // <-- show modal instead of direct logout
  ];

  return (
    <div className="text-[#464646] p-3 flex flex-col gap-2">
      {currentScreen === 'main' ? (
        <>
          <div className="mb-6">
            <h1 className="text-[32px] font-Raleway Raleway-medium">Profile</h1>
            <p className="text-[#656565] pt-1">Manage your profile</p>
          </div>

          <div className="flex flex-col gap-3.5">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between bg-white p-6 rounded-lg cursor-pointer`}
                onClick={item.action ? item.action : undefined}
              >
                <span className="text-lg text-[#525252]">{item.label}</span>
                {item.label === 'Log Out' ? (
                  <p className='w-12 h-12'></p>
                ) : (
                  <img src={arrowRightOrange} alt="Not Found" />
                )}
              </div>
            ))}
          </div>
        </>
      ) : currentScreen === 'edit' ? (
        <EditProfile ProfileData={ProfileData} setCurrentScreenMain={() => setCurrentScreen('main')} />
      ) : currentScreen === 'changePassword' ? (
        <ChangePassword ProfileData={ProfileData} setCurrentScreenMain={() => setCurrentScreen('main')} />
      ) : (
        <AccountActivity setCurrentScreenMain={() => setCurrentScreen('main')} />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <LogoutModel handleLogout={handleLogout} setShowLogoutModal={setShowLogoutModal} />
      )}
    </div>
  );
}

export default Profile;
