import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { MessageApi } from "./../api-slice/message-slice";
import { UserApi } from "./../api-slice/user-slice";

export const store = configureStore({
  reducer: {
    [MessageApi.reducerPath]: MessageApi.reducer,
    [UserApi.reducerPath]: UserApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(MessageApi.middleware)
      .concat(UserApi.middleware),
});
setupListeners(store.dispatch);
