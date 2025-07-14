import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { replaceCurrentUser, replaceIsLoggedIn } from "./slices/auth";
import { AppDispatch, RootState } from "./store";
import { getCategories, getSocialTypes } from "./slices/utils";
import { getMyContacts } from "./slices/contact";
import { getMySkills, getSkills } from "./slices/skill";
import { getMySocials } from "./slices/social";
import { getMyExperiences } from "./slices/experience";
import { getMyEducations } from "./slices/education";
import { getMyServices } from "./slices/service";
import { getMyProjects } from "./slices/project";

interface InitProps {
  children: React.ReactNode;
}

const Init: React.FC<InitProps> = ({ children }) => {
  const { currentUser, isLoggedIn } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      if (!currentUser.id) {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        console.log("User from localStorage:", user);

        dispatch(replaceCurrentUser(user));
        dispatch(replaceIsLoggedIn(true));
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(getSocialTypes(""));
      dispatch(getCategories(""));
      dispatch(getMyContacts(""));
      dispatch(getMySocials(""));
      dispatch(getMyExperiences(""));
      dispatch(getMyEducations(""));
      dispatch(getMySkills(""));
      dispatch(getMyServices(""));
      dispatch(getMyProjects(""));
    }
  }, [currentUser]);

  useEffect(() => {}, [currentUser]);

  return <React.Fragment>{children}</React.Fragment>;
};
export default Init;
