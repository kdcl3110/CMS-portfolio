import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import utilsReducer from "./slices/utils";
import contactReducer from "./slices/contact";
import educationReducer from "./slices/education";
import experienceReducer from "./slices/experience";
import messageReducer from "./slices/message";
import socialReducer from "./slices/social";
import skillReducer from "./slices/skill";

const reducer = {
  auth: authReducer,
  utils: utilsReducer,
  contact: contactReducer,
  education: educationReducer,
  experience: experienceReducer,
  message: messageReducer,
  social: socialReducer,
  skill: skillReducer
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