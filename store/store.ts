import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/user-slice";

export const store = configureStore({
  reducer: {
    user: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});