import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { replaceCurrentUser, replaceIsLoggedIn } from "./slices/auth";
import { AppDispatch, RootState } from "./store";
import { getCategories, getSocialTypes } from "./slices/utils";

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
      if (JSON.stringify(currentUser)?.id == null) {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        console.log("User from localStorage:", user);
        
        dispatch(replaceCurrentUser(user));
        dispatch(replaceIsLoggedIn(true));
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(getSocialTypes(currentUser));
      dispatch(getCategories(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {}, [currentUser]);

  return <React.Fragment>{children}</React.Fragment>;
};
export default Init;
