import { createSlice } from "@reduxjs/toolkit";

const storedAccessToken = localStorage.getItem("admin_accessToken");
const storedRefreshToken = localStorage.getItem("admin_refreshToken");

const initialState = {
  user: null,
  accessToken: storedAccessToken || null,
  refreshToken: storedRefreshToken || null,
};

const userProfileDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;

      // Save only tokens in localStorage
      localStorage.setItem("admin_accessToken", accessToken);
      localStorage.setItem("admin_refreshToken", refreshToken);
    },
    logoutUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem("admin_accessToken");
      localStorage.removeItem("admin_refreshToken");
    },
  },
});

export const { setUser, logoutUser } = userProfileDataSlice.actions;
export default userProfileDataSlice.reducer;
