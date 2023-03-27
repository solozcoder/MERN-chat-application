import { createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
import jwtDecode from "jwt-decode";

export const userAuthSlice = createSlice({
  name: "userAuth",
  initialState: {
    user: JSON.parse(localStorage.getItem("userAuth")),
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setAuthUser } = userAuthSlice.actions;
export default userAuthSlice.reducer;
