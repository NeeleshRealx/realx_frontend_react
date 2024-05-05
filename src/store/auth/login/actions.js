import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  SOCIAL_LOGIN,
  RESET_LOGIN_FLAG
} from "./actionTypes";
import { delete_cookie, add_cookie } from "../../../helpers/get_cookie";
import axios from "axios";

export const loginUser = async (user, history) => {
  let result;
  await axios.post("api/login", user)
    .then((res) => {
      console.log(res);
      if (res.success) {
        var obj = {
          success: res.success,
          data: {
            first_name: res.data.first_name,
            last_name: res.data.last_name, token: res.data.api_token, tenant_id: res.data.tenant_id
          },
          token: res.data.api_token, user_id: res.user_id,
          remember: user.remember, email: res.data.email, company_name: res.data.company_name
        }
        var value = res.data.api_token;
        sessionStorage.setItem("authUser", JSON.stringify(obj));
        add_cookie(obj, user.remember);
        const redirectUrl = localStorage.getItem("expiredSessionRedirectUrl");
        console.log(redirectUrl)
        if (redirectUrl) {
          history("/home");
        }
        else {
          history('/inbox');
        }
      }
      else {
        result = res
      }

    }
    )
  if (result) {
    return (result.success)
  }

};

export const loginSuccess = user => {
  return {
    type: LOGIN_SUCCESS,
    payload: user,
  };
};

export const logoutUser = history => {
  // sessionStorage.removeItem("authUser");
  // localStorage.removeItem("expiredSessionRedirectUrl");
  delete_cookie("authUser");
  return {
    type: LOGOUT_USER,
    payload: { history },
  };
};

export const logoutUserSuccess = () => {
  return {
    type: LOGOUT_USER_SUCCESS,
    payload: {},
  };
};

export const apiError = error => {
  return {
    type: API_ERROR,
    payload: error,
  };
};

export const socialLogin = (data, history, type) => {
  return {
    type: SOCIAL_LOGIN,
    payload: { data, history, type },
  };
};

export const resetLoginFlag = () => {
  return {
    type: RESET_LOGIN_FLAG,
  }
}
