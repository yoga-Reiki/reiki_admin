import React, { useEffect, useRef, useState } from 'react';
import arrowRightOrange from "../../assets/svg/arrowRightOrange.svg"
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';
import AccountActivity from './AccountActivity';
import toast from 'react-hot-toast';
import { getProfileData } from '../../services/ProfileServices';

function Profile() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('main');
  const hasFetched = useRef(false);
  const [loading, setLoading] = useState(false);
  const [ProfileData, setProfileData] = useState([]);

  const handleToggleNotification = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchTestimonials();
      hasFetched.current = true;
    }
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await getProfileData({ page: 1, pageSize: 10 });
      setProfileData(response);
    } 
    
    finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { label: 'Edit Profile', action: () => setCurrentScreen('edit') },
    { label: 'Change Password', action: () => setCurrentScreen('changePassword') },
    {
      label: 'Notification',
      customComponent: (
        <div className="flex items-center h-12">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={notificationsEnabled}
              onChange={handleToggleNotification}
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-orange-400 transition-all"></div>
            <div className="absolute left-1.5 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full"></div>
          </label>
        </div>
      )
    },
    { label: 'Account Activity', action: () => setCurrentScreen('accountActivity') },
    { label: 'Log Out' },
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
                {item.customComponent ? (
                  item.customComponent
                ) : item.label === 'Log Out' ? (<p className='w-12 h-12'></p>
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
    </div>
  );
}

export default Profile;
