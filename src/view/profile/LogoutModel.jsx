import React from 'react'

function LogoutModel({ handleLogout, setShowLogoutModal }) {
    return (
        <div>
            <div className="fixed inset-0 bg-black/40 z-50 text-[#464646] flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg w-[90%] max-w-sm text-center">
                    <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
                    <p className="mb-6">Are you sure you want to log out?</p>
                    <div className="flex justify-between gap-4">
                        <button
                            onClick={() => setShowLogoutModal(false)}
                            className="flex-1 bg-gray-200 py-2 rounded-lg cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex-1 bg-[#EA7913] text-white py-2 rounded-lg cursor-pointer"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LogoutModel