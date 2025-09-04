import { configureStore } from "@reduxjs/toolkit";
import userDataReducer from "../features/userProfileDataSlice";

const store = configureStore({
  reducer: {
    userData: userDataReducer,
  },
});

export default store;
