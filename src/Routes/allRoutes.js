import React,{useState} from "react";
import { Navigate } from "react-router-dom";

//inbox

//login
import Login from "../pages/Authentication/Login";
// import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
// import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";

// User Profile
import { get_cookie } from "../helpers/get_cookie";
import Home from "../pages/Home/Home";



const authProtectedRoutes = [
  //inbox
  
  // {
  //   path: "/",
  //   exact: true,
  //   component: (get_cookie('authUser')) ? <Navigate to="/dashboard" /> : <Navigate to="/login" />,
  // },
  //  { path: "*", component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  // Authentication Page
  // { path: "/logout", component: <Logout /> },
  {
    path: "/home", component: <Home/>
  },
  { path: "/login", component: <Login /> },
  // { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },

];

export { authProtectedRoutes, publicRoutes };
