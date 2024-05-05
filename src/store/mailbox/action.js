import {
  GET_MAIL,
  DELETE_MAIL,
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
} from "./actionType";
import { get_cookie } from "../../helpers/get_cookie";
import axios from "axios";

// common success
export const mailApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const mailApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getMailDetails = (user) => ({
  type:GET_MAIL,
  payload: {user},
});

export const deleteMail = (forId) => ({
  type: DELETE_MAIL,
  payload: forId,
});