import { configureStore } from "@reduxjs/toolkit";
import { usersAuthApi } from "./slice/AuthSlice";
import userAuthSlice from "./slice/userAuth";

export const store = configureStore({
  reducer: {
    userAuth: userAuthSlice,
  },
  // reducer: {
  //   userAuth: userAuthReducer,
  //   [usersAuthApi.reducerPath]: usersAuthApi.reducer,
  // },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(usersAuthApi.middleware),
});
