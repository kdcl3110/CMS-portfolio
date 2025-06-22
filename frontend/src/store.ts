import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";

const reducer = {
  auth: authReducer,
};

const store = configureStore({
  reducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;