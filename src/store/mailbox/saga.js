import { call, put, takeEvery, all, fork } from "redux-saga/effects";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Mailbox Redux States
import { GET_MAIL, DELETE_MAIL } from "./actionType";

import {
  mailApiResponseSuccess,
  mailApiResponseError,
} from "./action";

//Include Both Helper File with needed methods
import {
  getMailDetails as getMailDetailsApi,
  deleteMail as deleteMailApi,
} from "../../helpers/fakebackend_helper";
import axios from "axios";
import { get_cookie } from "../../helpers/get_cookie";

function* getMailDetails({payload}) {
  try {
    const api_token = JSON.parse(get_cookie('authUser'));
        if(api_token.success){
          const headers = {
            Authorization: `Bearer ${api_token.token}` // Assuming the token is stored in the 'token' property
        };
    //const response = yield call(getMailDetailsApi);
    const response = yield call(axios.post,'/api/getActivityData', payload.user, { headers });
    yield put(mailApiResponseSuccess(GET_MAIL, response.activities));
    }
    //const data = response.data.activities || "empty";
  } catch (error) {
    yield put(mailApiResponseError(GET_MAIL, error));
  }
}

function* deleteMail({ payload: forId }) {
  console.log(forId)
  try {
    const response = yield call(axios.post,'/api/updateActivityDataInIds', forId);
    yield put(mailApiResponseSuccess(DELETE_MAIL, response));
    toast.success("Mail Delete Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(mailApiResponseError(DELETE_MAIL, error));
    toast.error("Mail Delete Failed", { autoClose: 3000 });
  }
}

export function* watchGetMailDetails() {
  yield takeEvery(GET_MAIL, getMailDetails);
}

export function* watchDeleteMail() {
  yield takeEvery(DELETE_MAIL, deleteMail);
}

function* mailSaga() {
  yield all([
    fork(watchGetMailDetails),
    fork(watchDeleteMail)
  ]);
}

export default mailSaga;