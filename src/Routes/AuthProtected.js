import React, { useEffect } from "react";
import { Navigate, Route, useLocation } from "react-router-dom";
import {setAuthorization} from "../helpers/api_helper";
import { useDispatch } from "react-redux";

import { useProfile } from "../Components/Hooks/UserHooks";

import { logoutUser } from "../store/actions";

import { add_cookie, get_cookie } from "../helpers/get_cookie";

const AuthProtected = (props) => {
  const dispatch = useDispatch();
  const { userProfile, loading, token } = useProfile();
  useEffect(() => {
    if (userProfile && !loading && token) {
      setAuthorization(token);
    } 
    // else if ((!userProfile || !token) && loading) {
    //   dispatch(logoutUser());
    // }else{
    //   dispatch(logoutUser());
    // }
  }, [token, userProfile, loading, dispatch]);

  if (userProfile && token ){
    setAuthorization(token);
    const currentPageUrl = window.location.href;
    const url = new URL(currentPageUrl);
    const pathname = url.pathname;
    const getLocalStorageItem=localStorage.getItem("expiredSessionRedirectUrl");
    if(getLocalStorageItem!==null){
      const indexOfHash = getLocalStorageItem.indexOf("#");
      if (indexOfHash === -1) {
        localStorage.setItem("expiredSessionRedirectUrl", pathname);
      }
    }
  }

  /*
    Navigate is un-auth access protected routes via url
    */
  if (!userProfile || !token) {
    sessionStorage.setItem("RedirectURL", JSON.stringify(props.path));
    return (
      <Navigate to={{ pathname: "/login", state: "/dashboard"}} />
    );
  }
  var user = JSON.parse(get_cookie('authUser'));
  (user.remember) ? add_cookie(user, true) : add_cookie(user);
  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        return (<> <Component {...props} /> </>);
      }}
    />
  );
};

export { AuthProtected, AccessRoute };